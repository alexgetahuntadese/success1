import { supabase } from "@/lib/supabase/client";
import { authService, userProfileService } from "@/lib/supabase/account";
import type { PaymentSubmission } from "@/lib/supabase/types";
import { hasPremiumPreferences, setPremiumAccess } from "@/lib/authRoles";

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
  receiptFile: File,
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

    const uploadedReceipt = await uploadReceipt(input.receiptFile);

    let data: PaymentSubmission | null = null;

    try {
      const { data: createdSubmission, error } = await supabase.rpc("create_payment_submission", {
        p_amount: input.amount,
        p_bank_name: input.bankName.trim(),
        p_account_number: input.accountNumber.trim(),
        p_payment_method: input.paymentMethod,
        p_transaction_ref: input.transactionRef.trim(),
        p_receipt_path: uploadedReceipt.receiptPath,
        p_receipt_content_type: uploadedReceipt.receiptContentType,
        p_receipt_size_bytes: uploadedReceipt.receiptSizeBytes,
      });

      if (error) {
        console.error("Error submitting payment:", error);
        throw new Error("Could not save this payment submission.");
      }

      data = createdSubmission;
    } catch (error) {
      const { error: cleanupError } = await supabase.storage
        .from(PAYMENT_RECEIPT_BUCKET)
        .remove([uploadedReceipt.receiptPath]);

      if (cleanupError) {
        console.error("Error cleaning up uploaded receipt after payment failure:", cleanupError);
      }

      throw error;
    }

    if (!data) {
      throw new Error("Payment submission was created, but the response could not be loaded.");
    }

    const currentProfile = await userProfileService.getUserProfile();
    if (currentProfile && !hasPremiumPreferences(currentProfile.preferences)) {
      const nextPreferences = setPremiumAccess(currentProfile.preferences, {
        premium: false,
        paymentStatus: "pending",
        paymentSubmissionId: data.id,
      });

      const { error: profileError } = await supabase
        .from("users")
        .update({
          preferences: nextPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentProfile.id);

      if (profileError) {
        console.error("Error syncing pending payment status to profile:", profileError);
      }
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

  async reviewSubmission(input: {
    submission: PaymentSubmission,
    status: PaymentSubmissionStatus,
    reviewerNotes?: string,
  }): Promise<PaymentSubmissionWithReceiptUrl> {
    const { data, error } = await supabase.rpc("review_payment_submission", {
      p_submission_id: input.submission.id,
      p_status: input.status,
      p_reviewer_notes: input.reviewerNotes?.trim() || null,
    });

    if (error) {
      console.error("Error reviewing payment submission:", error);
      throw new Error("Could not update this payment submission.");
    }

    if (!data) {
      throw new Error("Payment review was saved, but the updated submission could not be loaded.");
    }

    return {
      ...data,
      receiptUrl: await createReceiptUrl(data.receipt_path),
    };
  },
};
