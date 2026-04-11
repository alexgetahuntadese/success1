import type { PaymentSubmission } from "@/lib/firebase/types";

const APP_ID = process.env.BACK4APP_APP_ID || process.env.VITE_BACK4APP_APP_ID;
const JS_KEY = process.env.BACK4APP_JS_KEY || process.env.VITE_BACK4APP_JS_KEY;
const REST_API_KEY = process.env.BACK4APP_REST_API_KEY || process.env.VITE_BACK4APP_REST_API_KEY || process.env.BACK4APP_JS_KEY || process.env.VITE_BACK4APP_JS_KEY;
const MASTER_KEY = process.env.BACK4APP_MASTER_KEY || process.env.VITE_BACK4APP_MASTER_KEY;
const SERVER_URL = process.env.BACK4APP_SERVER_URL || process.env.VITE_BACK4APP_SERVER_URL || "https://parseapi.back4app.com/";
const CLASS_NAME = "PaymentSubmission";

const ensureConfig = () => {
  if (!APP_ID || !JS_KEY || !SERVER_URL) {
    throw new Error("Back4App configuration is missing.");
  }
};

const parseFetch = async <T,>(path: string, init?: RequestInit, useMasterKey = false): Promise<T> => {
  ensureConfig();

  const headers: Record<string, string> = {
    "X-Parse-Application-Id": APP_ID!,
    "Content-Type": "application/json",
  };

  if (useMasterKey && MASTER_KEY) {
    headers["X-Parse-Master-Key"] = MASTER_KEY;
  } else {
    headers["X-Parse-REST-API-Key"] = REST_API_KEY!;
  }

  const response = await fetch(new URL(path, SERVER_URL).toString(), {
    ...init,
    headers: {
      ...headers,
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
  user?: {
    __type: "Pointer";
    className: "_User";
    objectId: string;
  } | null;
  submittedAt?: string;
  amount: number;
  bankName: string;
  status: string;
  receiptUrl?: string | null;
  receiptFile?: {
    __type: "File";
    name: string;
    url?: string;
  } | null;
  paymentMethod: string;
  transactionRef: string;
  submitterNotes?: string | null;
  accountNumber: string;
  userPhone?: string | null;
  userName?: string | null;
};

export const uploadReceiptToBack4App = async (
  fileName: string,
  contentType: string,
  base64DataUrl: string
) => {
  ensureConfig();
  const base64 = base64DataUrl.replace(/^data:[^;]+;base64,/, "");
  const bytes = Buffer.from(base64, "base64");

  const headers: Record<string, string> = {
    "X-Parse-Application-Id": APP_ID!,
    "Content-Type": contentType || "application/octet-stream",
  };

  if (MASTER_KEY) {
    headers["X-Parse-Master-Key"] = MASTER_KEY;
  } else {
    headers["X-Parse-REST-API-Key"] = REST_API_KEY!;
  }

  const response = await fetch(new URL(`/files/${encodeURIComponent(fileName)}`, SERVER_URL).toString(), {
    method: "POST",
    headers,
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
  }, true);

export const listSubmissions = async (where?: Record<string, unknown>) => {
  const query = where ? `?where=${encodeURIComponent(JSON.stringify(where))}&order=-submittedAt` : "?order=-submittedAt";
  return parseFetch<{ results: ParseObject[] }>(`/classes/${CLASS_NAME}${query}`, undefined, true);
};

export const updateSubmission = async (submissionId: string, data: Record<string, unknown>) =>
  parseFetch<{ updatedAt: string }>(`/classes/${CLASS_NAME}/${encodeURIComponent(submissionId)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, true);

export const getSubmission = async (submissionId: string) =>
  parseFetch<ParseObject>(`/classes/${CLASS_NAME}/${encodeURIComponent(submissionId)}`, undefined, true);

export const mapParseSubmission = (item: ParseObject): PaymentSubmission & { receiptUrl: string | null } => ({
  id: item.objectId,
  user_id: item.user?.objectId || "",
  user_name: item.userName || null,
  user_phone: item.userPhone || null,
  amount: item.amount,
  bank_name: item.bankName,
  account_number: item.accountNumber,
  transaction_ref: item.transactionRef,
  payment_method: item.paymentMethod as "cbe" | "telebirr",
  status: item.status as "pending" | "verified" | "rejected" | "approved",
  receipt_path: null,
  receipt_url: item.receiptUrl || item.receiptFile?.url || null,
  receipt_content_type: null,
  receipt_size_bytes: null,
  submitted_at: item.submittedAt || item.createdAt || new Date().toISOString(),
  verified_at: null,
  reviewer_notes: null,
  submitter_notes: item.submitterNotes || null,
  verified_by: null,
  created_at: item.createdAt || new Date().toISOString(),
  updated_at: item.updatedAt || item.createdAt || new Date().toISOString(),
  receiptUrl: item.receiptUrl || item.receiptFile?.url || null,
});
