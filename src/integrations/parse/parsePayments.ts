import Parse, { isParseConfigured } from "@/integrations/parse/parseConfig";
import { hasPremiumPreferences, isAdminPreferences, setPremiumAccess } from "@/lib/authRoles";

const PaymentSubmissionClass = "PaymentSubmission";
const UserProfileClass = "UserProfile";

export type ParsePaymentSubmissionStatus = "pending" | "verified" | "rejected";
export type ParsePaymentMethod = "cbe" | "telebirr";

export type ParsePaymentSubmission = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_phone: string | null;
  amount: number;
  bank_name: string;
  account_number: string;
  transaction_ref: string;
  payment_method: ParsePaymentMethod;
  status: ParsePaymentSubmissionStatus;
  receiptUrl: string | null;
  submitted_at: string;
  verified_at: string | null;
  reviewer_notes: string | null;
  submitter_notes: string | null;
};

type SubmitPaymentInput = {
  amount: number;
  bankName: string;
  accountNumber: string;
  paymentMethod: ParsePaymentMethod;
  transactionRef: string;
  receiptFile: File;
  submitterNotes?: string;
};

const isParseReady = () => Boolean(isParseConfigured && Parse?.User && Parse?.Query && Parse?.Object && Parse?.File);

const assertParseReady = () => {
  if (!isParseReady()) {
    throw new Error("Back4App is not configured. Add the Parse environment keys first.");
  }
};

const getCurrentParseUser = () => {
  assertParseReady();
  const currentUser = Parse.User.current();

  if (!currentUser) {
    throw new Error("You must sign in before using payments.");
  }

  return currentUser;
};

const getUserProfileObject = async (parseUser: Parse.User) => {
  const query = new Parse.Query(UserProfileClass);
  query.equalTo("user", parseUser);

  let profile = await query.first();

  if (!profile) {
    const Profile = Parse.Object.extend(UserProfileClass);
    profile = new Profile();
    profile.set("user", parseUser);
    profile.set("name", parseUser.get("name") || parseUser.get("username") || "");
    profile.set("phone", parseUser.get("username") || parseUser.get("phone") || "");
    profile.set("mobile", parseUser.get("username") || parseUser.get("phone") || "");
    profile.set("email", parseUser.get("email") || "");
    profile.set("preferences", {});
    profile.set("isActive", true);
    await profile.save();
  }

  return profile;
};

const ensureAdminUser = async () => {
  const currentUser = getCurrentParseUser();
  const profile = await getUserProfileObject(currentUser);

  if (!isAdminPreferences(profile.get("preferences") || {})) {
    throw new Error("Admin access required.");
  }

  return { currentUser, profile };
};

const mapSubmission = (submission: Parse.Object): ParsePaymentSubmission => {
  const user = submission.get("user") as Parse.User | undefined;
  const receiptFile = submission.get("receiptFile") as Parse.File | undefined;

  return {
    id: submission.id || "",
    user_id: user?.id || "",
    user_name: submission.get("userName") || user?.get("name") || null,
    user_phone: submission.get("userPhone") || user?.get("username") || user?.get("phone") || null,
    amount: Number(submission.get("amount") || 0),
    bank_name: submission.get("bankName") || "",
    account_number: submission.get("accountNumber") || "",
    transaction_ref: submission.get("transactionRef") || "",
    payment_method: (submission.get("paymentMethod") || "cbe") as ParsePaymentMethod,
    status: (submission.get("status") || "pending") as ParsePaymentSubmissionStatus,
    receiptUrl: receiptFile?.url() || submission.get("receiptUrl") || null,
    submitted_at:
      submission.get("submittedAt")?.toISOString?.() ||
      submission.createdAt?.toISOString() ||
      new Date().toISOString(),
    verified_at: submission.get("verifiedAt")?.toISOString?.() || null,
    reviewer_notes: submission.get("reviewerNotes") || null,
    submitter_notes: submission.get("submitterNotes") || null,
  };
};

const syncPendingPaymentToProfile = async (
  profile: Parse.Object,
  submissionId: string,
) => {
  const currentPreferences = profile.get("preferences") || {};

  if (hasPremiumPreferences(currentPreferences)) {
    return;
  }

  profile.set(
    "preferences",
    setPremiumAccess(currentPreferences, {
      premium: false,
      paymentStatus: "pending",
      paymentSubmissionId: submissionId,
    }),
  );
  await profile.save();
};

const syncReviewedPaymentToProfile = async (
  profile: Parse.Object,
  submissionId: string,
  status: ParsePaymentSubmissionStatus,
) => {
  const currentPreferences = profile.get("preferences") || {};

  if (status === "verified") {
    profile.set(
      "preferences",
      setPremiumAccess(currentPreferences, {
        premium: true,
        paymentStatus: "verified",
        paidAt: new Date().toISOString(),
        paymentSubmissionId: submissionId,
      }),
    );
    await profile.save();
    return;
  }

  if (!hasPremiumPreferences(currentPreferences)) {
    profile.set(
      "preferences",
      setPremiumAccess(currentPreferences, {
        premium: false,
        paymentStatus: "rejected",
        paymentSubmissionId: submissionId,
      }),
    );
    await profile.save();
  }
};

export const parsePaymentService = {
  async submitPayment(input: SubmitPaymentInput): Promise<ParsePaymentSubmission> {
    const currentUser = getCurrentParseUser();
    const profile = await getUserProfileObject(currentUser);

    const receiptFile = new Parse.File(input.receiptFile.name, input.receiptFile);
    await receiptFile.save();

    const PaymentSubmission = Parse.Object.extend(PaymentSubmissionClass);
    const submission = new PaymentSubmission();

    submission.set("user", currentUser);
    submission.set("amount", input.amount);
    submission.set("bankName", input.bankName.trim());
    submission.set("accountNumber", input.accountNumber.trim());
    submission.set("paymentMethod", input.paymentMethod);
    submission.set("transactionRef", input.transactionRef.trim());
    submission.set("receiptFile", receiptFile);
    submission.set("receiptUrl", receiptFile.url());
    submission.set("status", "pending");
    submission.set("submittedAt", new Date());
    submission.set("submitterNotes", input.submitterNotes?.trim() || "");
    submission.set("userName", profile.get("name") || currentUser.get("name") || currentUser.get("username") || "");
    submission.set("userPhone", profile.get("phone") || currentUser.get("username") || currentUser.get("phone") || "");

    await submission.save();
    await syncPendingPaymentToProfile(profile, submission.id);

    return mapSubmission(submission);
  },

  async listOwnSubmissions(): Promise<ParsePaymentSubmission[]> {
    const currentUser = getCurrentParseUser();
    const query = new Parse.Query(PaymentSubmissionClass);
    query.equalTo("user", currentUser);
    query.include("user");
    query.descending("submittedAt");

    const submissions = await query.find();
    return submissions.map(mapSubmission);
  },

  async listAllSubmissions(): Promise<ParsePaymentSubmission[]> {
    await ensureAdminUser();
    const query = new Parse.Query(PaymentSubmissionClass);
    query.include("user");
    query.descending("submittedAt");

    const submissions = await query.find();
    return submissions.map(mapSubmission);
  },

  async reviewSubmission(input: {
    submissionId: string;
    status: ParsePaymentSubmissionStatus;
    reviewerNotes?: string;
  }): Promise<ParsePaymentSubmission> {
    const { currentUser } = await ensureAdminUser();
    const query = new Parse.Query(PaymentSubmissionClass);
    query.include("user");

    const submission = await query.get(input.submissionId);
    const targetUser = submission.get("user") as Parse.User | undefined;

    if (!targetUser) {
      throw new Error("This payment submission is missing its student account.");
    }

    submission.set("status", input.status);
    submission.set("reviewerNotes", input.reviewerNotes?.trim() || "");
    submission.set("reviewedBy", currentUser);
    submission.set("verifiedAt", input.status === "verified" ? new Date() : null);
    await submission.save();

    const targetProfile = await getUserProfileObject(targetUser);
    await syncReviewedPaymentToProfile(targetProfile, submission.id, input.status);

    return mapSubmission(submission);
  },
};
