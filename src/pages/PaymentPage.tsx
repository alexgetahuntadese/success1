import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Gift,
  Landmark,
  Loader2,
  RefreshCcw,
  Smartphone,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopBar from "@/components/TopBar";
import StarField from "@/components/StarField";
import { useAuth } from "@/hooks/useAuth";
import {
  TRIAL_STORAGE_KEY,
  getTrialAccess,
  getTrialDaysRemaining,
  isTrialExpired,
  type TrialAccess,
} from "@/lib/paymentAccess";
import {
  paymentService,
} from "@/services/supabaseServiceFixed";
import type {
  PaymentMethod,
  PaymentSubmissionWithReceiptUrl,
} from "@/lib/supabase/payments";
import { toast } from "sonner";

const TRIAL_LENGTH_DAYS = 7;
const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024;

const addTrialWindow = (startAt: string) => {
  const endDate = new Date(startAt);
  endDate.setDate(endDate.getDate() + TRIAL_LENGTH_DAYS);
  return endDate.toISOString();
};

const getStatusIcon = (status: PaymentSubmissionWithReceiptUrl["status"]) => {
  switch (status) {
    case "verified":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "pending":
      return <Clock className="h-4 w-4 text-amber-300" />;
    default:
      return <AlertCircle className="h-4 w-4 text-rose-300" />;
  }
};

const getStatusLabel = (status: PaymentSubmissionWithReceiptUrl["status"]) => {
  switch (status) {
    case "verified":
      return "Verified";
    case "pending":
      return "Pending review";
    default:
      return "Rejected";
  }
};

const paymentMethods: Array<{ id: PaymentMethod, label: string, icon: typeof Landmark }> = [
  { id: "cbe", label: "CBE", icon: Landmark },
  { id: "telebirr", label: "Telebirr", icon: Smartphone },
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const { displayName, hasPremiumAccess, paymentStatus, refreshProfile } = useAuth();

  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cbe");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<PaymentSubmissionWithReceiptUrl[]>([]);
  const [trialAccess, setTrialAccess] = useState<TrialAccess | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmissions = async () => {
    setIsLoading(true);

    try {
      const [submissionResult, profileRefreshResult] = await Promise.allSettled([
        paymentService.listOwnSubmissions(),
        refreshProfile(),
      ]);

      if (profileRefreshResult.status === "rejected") {
        console.error("Error refreshing profile payment status:", profileRefreshResult.reason);
      }

      if (submissionResult.status === "rejected") {
        throw submissionResult.reason;
      }

      setSubmissions(submissionResult.value);
    } catch (error) {
      console.error("Error loading payment submissions:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load your payment submissions.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTrialAccess(getTrialAccess());
    void loadSubmissions();
  }, []);

  useEffect(() => {
    return () => {
      if (receiptPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(receiptPreviewUrl);
      }
    };
  }, [receiptPreviewUrl]);

  const resetForm = () => {
    setAmount("");
    setBankName("");
    setAccountNumber("");
    setTransactionRef("");
    setPaymentMethod("cbe");
    setReceiptFile(null);
    if (receiptPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(receiptPreviewUrl);
    }
    setReceiptPreviewUrl(null);
  };

  const handleReceiptSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file for the receipt.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_RECEIPT_SIZE_BYTES) {
      toast.error("Receipt image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    if (receiptPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(receiptPreviewUrl);
    }

    setReceiptFile(file);
    setReceiptPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }

    if (!bankName.trim() || !accountNumber.trim() || !transactionRef.trim()) {
      toast.error("Complete the bank name, account number, and transaction reference.");
      return;
    }

    if (!receiptFile) {
      toast.error("Upload your payment receipt image before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await paymentService.submitPayment({
        amount: parsedAmount,
        bankName,
        accountNumber,
        paymentMethod,
        transactionRef,
        receiptFile,
      });

      setSubmissions((current) => [created, ...current]);
      await refreshProfile();
      resetForm();
      toast.success("Payment submitted. Your receipt is now waiting for admin review.");
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not submit this payment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartTrial = () => {
    if (trialAccess?.used) {
      toast.error("This 7-day free trial has already been used on this device.");
      return;
    }

    const startedAt = new Date().toISOString();
    const nextTrial: TrialAccess = {
      studentName: displayName || "Student",
      startedAt,
      endsAt: addTrialWindow(startedAt),
      used: true,
    };

    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(nextTrial));
    setTrialAccess(nextTrial);
    toast.success("Your 7-day free trial is now active on this device.");
  };

  const trialActive = Boolean(trialAccess) && !isTrialExpired(trialAccess);
  const trialExpired = Boolean(trialAccess) && isTrialExpired(trialAccess);
  const trialDaysRemaining = getTrialDaysRemaining(trialAccess);
  const verifiedCount = submissions.filter((submission) => submission.status === "verified").length;
  const pendingCount = submissions.filter((submission) => submission.status === "pending").length;

  const statusMessage = useMemo(() => {
    if (hasPremiumAccess) {
      return "Premium access is active on this account. Your locked subjects and chapters should now be open.";
    }

    if (paymentStatus === "pending" || pendingCount > 0) {
      return "Your latest payment submission is waiting for admin review. Access will unlock after verification.";
    }

    if (paymentStatus === "rejected") {
      return "A payment submission was rejected. Review the admin note below, then submit a clearer receipt or corrected transaction details.";
    }

    if (trialActive && trialAccess) {
      return `Your free trial is active for ${trialDaysRemaining} more day${trialDaysRemaining === 1 ? "" : "s"}.`;
    }

    if (trialExpired && trialAccess) {
      return `Your free trial ended on ${new Date(trialAccess.endsAt).toLocaleDateString()}. Submit payment to continue with full access.`;
    }

    return "Use the free trial or submit a payment receipt to unlock premium access after admin verification.";
  }, [
    hasPremiumAccess,
    paymentStatus,
    pendingCount,
    trialAccess,
    trialActive,
    trialDaysRemaining,
    trialExpired,
  ]);

  return (
    <div className="app-shell pt-14 px-4 pb-4 md:p-8 md:pt-14">
      <TopBar />
      <StarField starCount={60} shootingCount={4} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white/85 hover:bg-white/12 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => void loadSubmissions()}
            className="border-white/15 bg-white/6 text-white hover:bg-white/10"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Payment Verification</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Receipts are uploaded to Supabase Storage, reviewed by an admin, and then linked to your account for real premium access across devices.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                <Gift className="h-3.5 w-3.5" />
                Access Status
              </div>
              <h2 className="text-xl font-bold text-white">
                {hasPremiumAccess ? "Premium access active" : "Premium access not active yet"}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-white/75">{statusMessage}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1">
                  Verified payments: {verifiedCount}
                </span>
                <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1">
                  Pending reviews: {pendingCount}
                </span>
              </div>
            </div>
            <Button
              onClick={handleStartTrial}
              disabled={Boolean(trialAccess?.used) || hasPremiumAccess}
              className="bg-white text-slate-950 hover:bg-white/90 disabled:bg-white/30 disabled:text-white/60"
            >
              {hasPremiumAccess
                ? "Premium Active"
                : trialActive
                  ? "Trial Active"
                  : trialExpired
                    ? "Trial Used"
                    : "Start Free Trial"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="bg-white/[0.08] border-white/[0.14] text-white">
            <CardHeader>
              <CardTitle className="text-xl">Submit Payment</CardTitle>
              <CardDescription className="text-white/70">
                Fill in the transfer details and upload your receipt for admin review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount (ETB)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank" className="text-white">Bank Name</Label>
                  <Input
                    id="bank"
                    placeholder="Your bank name"
                    value={bankName}
                    onChange={(event) => setBankName(event.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account" className="text-white">Sender Account / Wallet Number</Label>
                  <Input
                    id="account"
                    placeholder="The number used to send payment"
                    value={accountNumber}
                    onChange={(event) => setAccountNumber(event.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference" className="text-white">Transaction Reference</Label>
                  <Input
                    id="reference"
                    placeholder="Transaction ID or reference number"
                    value={transactionRef}
                    onChange={(event) => setTransactionRef(event.target.value)}
                    className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Payment Method Used</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-lg border text-xs flex flex-col items-center gap-1 transition-colors ${
                          paymentMethod === method.id
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                            : "bg-white/[0.08] border-white/[0.14] text-white/70 hover:bg-white/[0.12]"
                        }`}
                      >
                        <method.icon className="h-4 w-4" />
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Receipt Screenshot</Label>
                  <label
                    htmlFor="receipt"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/30 p-6 text-center transition-colors hover:bg-white/[0.04]"
                  >
                    {receiptPreviewUrl ? (
                      <img
                        src={receiptPreviewUrl}
                        alt="Receipt preview"
                        className="max-h-56 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="h-10 w-10 text-white/50 mb-2" />
                        <p className="text-sm text-white/75">Click to upload receipt</p>
                        <p className="text-xs text-white/50 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                      </div>
                    )}
                    <input
                      id="receipt"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleReceiptSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Payment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white/[0.08] border-white/[0.14] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Payment Methods</CardTitle>
                <CardDescription className="text-white/70">
                  Send payment first, then upload the receipt using the form.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} className="w-full">
                  <TabsList className="grid grid-cols-2 bg-white/[0.08] mb-4">
                    <TabsTrigger value="cbe" className="text-white data-[state=active]:bg-white/20">
                      <Landmark className="h-4 w-4 mr-1" />
                      CBE
                    </TabsTrigger>
                    <TabsTrigger value="telebirr" className="text-white data-[state=active]:bg-white/20">
                      <Smartphone className="h-4 w-4 mr-1" />
                      Telebirr
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cbe" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Bank</p>
                      <p className="font-semibold">Commercial Bank of Ethiopia</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Account</p>
                      <p className="font-semibold">1000282751279</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Holder</p>
                      <p className="font-semibold">Alexander Getahun Tadese</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="telebirr" className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Merchant Name</p>
                      <p className="font-semibold">Alexander Getahun Tadese</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.14]">
                      <p className="text-xs text-white/70">Telebirr Number</p>
                      <p className="font-semibold">0992010092</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-xs text-emerald-300">Telebirr</p>
                      <p className="font-semibold text-emerald-200">Send payment to 0992010092</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.08] border-white/[0.14] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Your Payment History</CardTitle>
                <CardDescription className="text-white/70">
                  Stored in Supabase and synced to your signed-in account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/6 px-4 py-10 text-white/65">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading submissions...
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-white/60">
                    No payment submissions yet.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="rounded-xl border border-white/[0.14] bg-white/[0.06] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-white">{submission.amount} ETB</div>
                            <div className="text-xs text-white/60">
                              {submission.bank_name} • {submission.payment_method.toUpperCase()}
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-xs text-white/75">
                            {getStatusIcon(submission.status)}
                            {getStatusLabel(submission.status)}
                          </div>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs text-white/65">
                          <div>Reference: {submission.transaction_ref}</div>
                          <div>Sender Number: {submission.account_number}</div>
                          <div>Submitted: {new Date(submission.submitted_at).toLocaleString()}</div>
                          {submission.verified_at ? (
                            <div>Reviewed: {new Date(submission.verified_at).toLocaleString()}</div>
                          ) : null}
                          {submission.reviewer_notes ? (
                            <div className="rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-white/75">
                              Admin note: {submission.reviewer_notes}
                            </div>
                          ) : null}
                        </div>

                        {submission.receiptUrl ? (
                          <img
                            src={submission.receiptUrl}
                            alt="Receipt"
                            className="mt-3 max-h-40 rounded-lg border border-white/10 object-contain"
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
