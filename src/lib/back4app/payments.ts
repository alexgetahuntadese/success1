import { userProfileService } from "@/lib/firebase/auth";
import { setPremiumAccess, hasPremiumPreferences } from "@/lib/authRoles";
import type { PaymentSubmission } from "@/lib/firebase/types";

const apiJson = async <T,>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || "Request failed.");
  }

  return payload as T;
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read receipt file."));
    reader.readAsDataURL(file);
  });

export type PaymentSubmissionStatus = "pending" | "verified" | "rejected" | "approved";
export type PaymentMethod = "cbe" | "telebirr";

export type PaymentSubmissionWithReceiptUrl = PaymentSubmission & {
  receiptUrl: string | null;
};

export type CreatePaymentSubmissionInput = {
  userId: string;
  userName: string | null;
  userPhone: string | null;
  amount: number;
  bankName: string;
  accountNumber: string;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  receiptFile?: File | null;
  submitterNotes?: string;
};

type ApiSubmission = PaymentSubmissionWithReceiptUrl;

export const paymentService = {
  async listOwnSubmissions(userId: string): Promise<PaymentSubmissionWithReceiptUrl[]> {
    return apiJson<PaymentSubmissionWithReceiptUrl[]>(
      `/api/payments/submissions?userId=${encodeURIComponent(userId)}`
    );
  },

  async submitPayment(input: CreatePaymentSubmissionInput): Promise<PaymentSubmissionWithReceiptUrl> {
    const receiptBase64 = input.receiptFile ? await fileToDataUrl(input.receiptFile) : null;
    const submission = await apiJson<ApiSubmission>("/api/payments/submit", {
      method: "POST",
      body: JSON.stringify({
        userId: input.userId,
        userName: input.userName,
        userPhone: input.userPhone,
        amount: input.amount,
        bankName: input.bankName,
        accountNumber: input.accountNumber,
        transactionRef: input.transactionRef,
        paymentMethod: input.paymentMethod,
        submitterNotes: input.submitterNotes || null,
        receiptBase64,
        receiptFileName: input.receiptFile?.name || null,
        receiptContentType: input.receiptFile?.type || null,
      }),
    });

    const currentProfile = await userProfileService.getUserProfile(input.userId);
    if (currentProfile && !hasPremiumPreferences(currentProfile.preferences)) {
      const nextPreferences = setPremiumAccess(currentProfile.preferences, {
        premium: false,
        paymentStatus: "pending",
        paymentSubmissionId: submission.id,
      });

      await userProfileService.upsertProfile({
        ...currentProfile,
        preferences: nextPreferences,
      });
    }

    return submission;
  },
};

export const paymentAdminService = {
  async listAllSubmissions(): Promise<PaymentSubmissionWithReceiptUrl[]> {
    return apiJson<PaymentSubmissionWithReceiptUrl[]>("/api/payments/admin/submissions");
  },

  async reviewSubmission(input: {
    submission: PaymentSubmission;
    status: PaymentSubmissionStatus;
    reviewerNotes?: string;
  }): Promise<PaymentSubmissionWithReceiptUrl> {
    const nextSubmission = await apiJson<ApiSubmission>(
      `/api/payments/admin/review/${encodeURIComponent(input.submission.id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: input.status,
          reviewerNotes: input.reviewerNotes || null,
        }),
      }
    );

    if (input.submission.user_id) {
      const profile = await userProfileService.getUserProfile(input.submission.user_id);
      if (profile) {
        const verifiedAt =
          input.status === "verified" || input.status === "approved"
            ? new Date().toISOString()
            : null;
        const nextPreferences = setPremiumAccess(profile.preferences, {
          premium: input.status === "verified" || input.status === "approved",
          paymentStatus: input.status,
          paidAt: verifiedAt,
          paymentSubmissionId: input.submission.id,
        });

        await userProfileService.upsertProfile({
          ...profile,
          preferences: nextPreferences,
        });
      }
    }

    return nextSubmission;
  },
};
