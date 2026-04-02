import { supabase } from "@/lib/supabase/client";
import { authService } from "@/lib/supabase/account";
import type { PaymentSubmission, UserProfile } from "@/lib/supabase/types";
import { setPremiumAccess } from "@/lib/authRoles";

const PAYMENT_RECEIPT_BUCKET = "payment-receipts";

export type PaymentSubmissionStatus = "pending" | "verified" | "rejected";
export type PaymentMethod = "cbe" | "telebirr";

export type PaymentSubmissionWithReceiptUrl = PaymentSubmission & {
  receiptUrl: string | null,
};

export type CreatePaymentSubmissionInput = {
  amount: number,
  bankName: string,
  accountNumber: string,
  paymentMethod: PaymentMethod,
  transactionRef: string,
  receiptFile?: File | null,
};

type ReviewPaymentSubmissionInput = {
  submission: PaymentSubmission,
  status: PaymentSubmissionStatus,
  reviewerNotes?: string,
  targetProfile: UserProfile | null,
};

const sanitizeFileName = (value: string) =>
  value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const createReceiptUrl = async (receiptPath: string | null) => {
  if (!receiptPath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(PAYMENT_RECEIPT_BUCKET)
    .createSignedUrl(receiptPath, 60 * 60);

  if (error) {
    console.error("Error creating signed receipt URL:", error);
    return null;
  }

  return data.signedUrl;
};

const withReceiptUrls = async (submissions: PaymentSubmission[]) =>
  Promise.all(
    submissions.map(async (submission) => ({
      ...submission,
      receiptUrl: await createReceiptUrl(submission.receipt_path),
    })),
  );

const uploadReceipt = async (file: File) => {
  const user = await authService.getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "jpg";
  const normalizedExtension = extension || "jpg";
  const fileBase = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || "receipt";
  const filePath = `${user.id}/${Date.now()}-${fileBase}.${normalizedExtension}`;

  const { error } = await supabase.storage
    .from(PAYMENT_RECEIPT_BUCKET)
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading receipt:", error);
    throw new Error("Could not upload this receipt to Supabase Storage.");
  }

  return {
    receiptPath: filePath,
    receiptContentType: file.type || null,
    receiptSizeBytes: file.size || null,
  };
};

export const paymentService = {
  async listOwnSubmissions(): Promise<PaymentSubmissionWithReceiptUrl[]> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("payment_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error loading payment submissions:", error);
      throw new Error("Could not load your payment submissions.");
    }

    return withReceiptUrls(data ?? []);
  },

  async submitPayment(input: CreatePaymentSubmissionInput): Promise<PaymentSubmissionWithReceiptUrl> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const uploadedReceipt = input.receiptFile
      ? await uploadReceipt(input.receiptFile)
      : {
          receiptPath: null,
          receiptContentType: null,
          receiptSizeBytes: null,
        };

    const { data, error } = await supabase
      .from("payment_submissions")
      .insert({
        user_id: user.id,
        amount: input.amount,
        bank_name: input.bankName.trim(),
        account_number: input.accountNumber.trim(),
        payment_method: input.paymentMethod,
        transaction_ref: input.transactionRef.trim(),
        receipt_path: uploadedReceipt.receiptPath,
        receipt_content_type: uploadedReceipt.receiptContentType,
        receipt_size_bytes: uploadedReceipt.receiptSizeBytes,
        status: "pending",
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error submitting payment:", error);
      throw new Error("Could not save this payment submission.");
    }

    return {
      ...data,
      receiptUrl: await createReceiptUrl(data.receipt_path),
    };
  },
};

export const paymentAdminService = {
  async listAllSubmissions(): Promise<PaymentSubmissionWithReceiptUrl[]> {
    const { data, error } = await supabase
      .from("payment_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error loading payment submissions:", error);
      throw new Error("Could not load payment submissions from Supabase.");
    }

    return withReceiptUrls(data ?? []);
  },

  async reviewSubmission({
    submission,
    status,
    reviewerNotes,
    targetProfile,
  }: ReviewPaymentSubmissionInput): Promise<PaymentSubmissionWithReceiptUrl> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const verifiedAt = status === "verified" ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("payment_submissions")
      .update({
        status,
        reviewer_notes: reviewerNotes?.trim() || null,
        verified_at: verifiedAt,
        verified_by: status === "verified" ? user.id : null,
      })
      .eq("id", submission.id)
      .select("*")
      .single();

    if (error) {
      console.error("Error reviewing payment submission:", error);
      throw new Error("Could not update this payment submission.");
    }

    if (status === "verified" && targetProfile) {
      const nextPreferences = setPremiumAccess(targetProfile.preferences, {
        premium: true,
        paymentStatus: "verified",
        paidAt: verifiedAt,
        paymentSubmissionId: submission.id,
      });

      const { error: profileError } = await supabase
        .from("users")
        .update({
          preferences: nextPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", targetProfile.id);

      if (profileError) {
        console.error("Error updating verified premium access:", profileError);
        throw new Error("Payment marked as verified, but premium access could not be granted.");
      }
    }

    return {
      ...data,
      receiptUrl: await createReceiptUrl(data.receipt_path),
    };
  },
};
