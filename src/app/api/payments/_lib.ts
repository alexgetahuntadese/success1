import type { PaymentSubmission } from "@/lib/firebase/types";

const APP_ID = process.env.BACK4APP_APP_ID || process.env.VITE_BACK4APP_APP_ID;
const JS_KEY = process.env.BACK4APP_JS_KEY || process.env.VITE_BACK4APP_JS_KEY;
const MASTER_KEY = process.env.BACK4APP_MASTER_KEY || process.env.VITE_BACK4APP_MASTER_KEY;
const SERVER_URL = process.env.BACK4APP_SERVER_URL || process.env.VITE_BACK4APP_SERVER_URL || "https://parseapi.back4app.com/";
const CLASS_NAME = "PaymentSubmission";

const ensureConfig = () => {
  if (!APP_ID || !JS_KEY || !SERVER_URL) {
    throw new Error("Back4App configuration is missing.");
  }
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
  paymentMethod: string;
  transactionRef: string;
  submitterNotes?: string | null;
  accountNumber: string;
  userPhone?: string | null;
  userName?: string | null;
};

const getHeaders = (useMasterKey = false): Record<string, string> => {
  ensureConfig();
  const headers: Record<string, string> = {
    "X-Parse-Application-Id": APP_ID!,
  };

  if (useMasterKey && MASTER_KEY) {
    headers["X-Parse-Master-Key"] = MASTER_KEY;
  } else {
    // Use JavaScript Key for REST API
    headers["X-Parse-JavaScript-Key"] = JS_KEY!;
  }

  return headers;
};

export const uploadReceiptToBack4App = async (
  fileName: string,
  contentType: string,
  base64DataUrl: string
) => {
  ensureConfig();
  const base64 = base64DataUrl.replace(/^data:[^;]+;base64,/, "");
  const bytes = Buffer.from(base64, "base64");

  const headers = getHeaders(true); // Use Master Key for file upload
  headers["Content-Type"] = contentType || "application/octet-stream";

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

const parseFetch = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const headers = getHeaders(true); // Use Master Key for all operations
  headers["Content-Type"] = "application/json";

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
  receipt_url: item.receiptUrl || null,
  receipt_content_type: null,
  receipt_size_bytes: null,
  submitted_at: item.submittedAt || item.createdAt || new Date().toISOString(),
  verified_at: null,
  reviewer_notes: null,
  submitter_notes: item.submitterNotes || null,
  verified_by: null,
  created_at: item.createdAt || new Date().toISOString(),
  updated_at: item.updatedAt || item.createdAt || new Date().toISOString(),
  receiptUrl: item.receiptUrl || null,
});
