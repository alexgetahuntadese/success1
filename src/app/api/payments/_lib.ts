import type { PaymentSubmission } from "@/lib/firebase/types";

const APP_ID = process.env.VITE_BACK4APP_APP_ID;
const JS_KEY = process.env.VITE_BACK4APP_JS_KEY;
const SERVER_URL = process.env.VITE_BACK4APP_SERVER_URL || "https://parseapi.back4app.com/";
const CLASS_NAME = "PaymentSubmission";

const ensureConfig = () => {
  if (!APP_ID || !JS_KEY || !SERVER_URL) {
    throw new Error("Back4App configuration is missing.");
  }
};

const parseFetch = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  ensureConfig();

  const response = await fetch(new URL(path, SERVER_URL).toString(), {
    ...init,
    headers: {
      "X-Parse-Application-Id": APP_ID!,
      "X-Parse-JavaScript-Key": JS_KEY!,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Back4App request failed.");
  }

  return payload as T;
};

type ParseFileUpload = {
  name: string;
  url: string;
};

type ParseObject = {
  objectId: string;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
  userName?: string | null;
  userPhone?: string | null;
  amount: number;
  bankName: string;
  accountNumber: string;
  transactionRef: string;
  paymentMethod: "cbe" | "telebirr";
  status: "pending" | "verified" | "rejected" | "approved";
  receiptPath?: string | null;
  receiptUrl?: string | null;
  receiptContentType?: string | null;
  receiptSizeBytes?: number | null;
  submittedAt?: string;
  verifiedAt?: string | null;
  reviewerNotes?: string | null;
  submitterNotes?: string | null;
  verifiedBy?: string | null;
};

export const uploadReceiptToBack4App = async (
  fileName: string,
  contentType: string,
  base64DataUrl: string
) => {
  ensureConfig();
  const base64 = base64DataUrl.replace(/^data:[^;]+;base64,/, "");
  const bytes = Buffer.from(base64, "base64");

  const response = await fetch(new URL(`/files/${encodeURIComponent(fileName)}`, SERVER_URL).toString(), {
    method: "POST",
    headers: {
      "X-Parse-Application-Id": APP_ID!,
      "X-Parse-JavaScript-Key": JS_KEY!,
      "Content-Type": contentType || "application/octet-stream",
    },
    body: bytes,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || "Receipt upload failed.");
  }

  return payload as ParseFileUpload;
};

export const createSubmission = async (data: Record<string, unknown>) =>
  parseFetch<{ objectId: string; createdAt: string }>(`/classes/${CLASS_NAME}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const listSubmissions = async (where?: Record<string, unknown>) => {
  const query = where ? `?where=${encodeURIComponent(JSON.stringify(where))}&order=-submittedAt` : "?order=-submittedAt";
  return parseFetch<{ results: ParseObject[] }>(`/classes/${CLASS_NAME}${query}`);
};

export const updateSubmission = async (submissionId: string, data: Record<string, unknown>) =>
  parseFetch<{ updatedAt: string }>(`/classes/${CLASS_NAME}/${encodeURIComponent(submissionId)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const getSubmission = async (submissionId: string) =>
  parseFetch<ParseObject>(`/classes/${CLASS_NAME}/${encodeURIComponent(submissionId)}`);

export const mapParseSubmission = (item: ParseObject): PaymentSubmission & { receiptUrl: string | null } => ({
  id: item.objectId,
  user_id: item.userId,
  user_name: item.userName || null,
  user_phone: item.userPhone || null,
  amount: item.amount,
  bank_name: item.bankName,
  account_number: item.accountNumber,
  transaction_ref: item.transactionRef,
  payment_method: item.paymentMethod,
  status: item.status,
  receipt_path: item.receiptPath || null,
  receipt_url: item.receiptUrl || null,
  receipt_content_type: item.receiptContentType || null,
  receipt_size_bytes: item.receiptSizeBytes || null,
  submitted_at: item.submittedAt || item.createdAt || new Date().toISOString(),
  verified_at: item.verifiedAt || null,
  reviewer_notes: item.reviewerNotes || null,
  submitter_notes: item.submitterNotes || null,
  verified_by: item.verifiedBy || null,
  created_at: item.createdAt || new Date().toISOString(),
  updated_at: item.updatedAt || item.createdAt || new Date().toISOString(),
  receiptUrl: item.receiptUrl || null,
});
