import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";

import StarField from "@/components/StarField";
import TopBar from "@/components/TopBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  parsePaymentService,
  type ParsePaymentSubmission,
} from "@/integrations/parse/parsePayments";
import { toast } from "sonner";

const PAYMENT_AMOUNT_BIRR = "200";

const bankOptions = {
  cbe: {
    label: "Commercial Bank of Ethiopia",
    accountName: "Simple Road",
    accountNumber: "1000000000000",
  },
  telebirr: {
    label: "Telebirr",
    accountName: "Simple Road",
    accountNumber: "0912345678",
  },
} as const;

const statusMeta = {
  verified: {
    label: "Verified",
    className: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  pending: {
    label: "Pending Review",
    className: "bg-amber-500/15 text-amber-100 border-amber-400/30",
    icon: <Clock3 className="h-4 w-4" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-500/15 text-rose-100 border-rose-400/30",
    icon: <XCircle className="h-4 w-4" />,
  },
} as const;

const PaymentPage = () => {
  const navigate = useNavigate();
  const { displayName, hasPremiumAccess, isAdmin, paymentStatus, profile, refreshProfile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"cbe" | "telebirr">("cbe");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submissions, setSubmissions] = useState<ParsePaymentSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentChannel = bankOptions[paymentMethod];

  const accessState = useMemo(() => {
    if (hasPremiumAccess) {
      return {
        label: "Premium Active",
        description: "Your account is already unlocked for paid content.",
        className: "bg-emerald-500/15 text-emerald-100 border-emerald-400/30",
      };
    }

    if (paymentStatus === "pending") {
      return {
        label: "Payment Pending",
        description: "Your receipt was submitted and is waiting for review.",
        className: "bg-amber-500/15 text-amber-100 border-amber-400/30",
      };
    }

    if (paymentStatus === "rejected") {
      return {
        label: "Payment Rejected",
        description: "Please review the rejection note and submit a new receipt.",
        className: "bg-rose-500/15 text-rose-100 border-rose-400/30",
      };
    }

    return {
      label: "Payment Required",
      description: "Matric premium subjects and locked chapters require a verified 200 ETB payment.",
      className: "bg-sky-500/15 text-sky-100 border-sky-400/30",
    };
  }, [hasPremiumAccess, paymentStatus]);

  const refreshSubmissions = async () => {
    try {
      const items = await parsePaymentService.listOwnSubmissions();
      setSubmissions(items);
    } catch (error) {
      console.error("Failed to refresh submissions:", error);
    }
  };

  useEffect(() => {
    let active = true;

    const loadSubmissions = async () => {
      setIsLoadingSubmissions(true);

      try {
        const items = await parsePaymentService.listOwnSubmissions();
        if (active) {
          setSubmissions(items);
        }
      } catch (error) {
        if (active) {
          console.error("Failed to load payment submissions:", error);
        }
      } finally {
        if (active) {
          setIsLoadingSubmissions(false);
        }
      }
    };

    void loadSubmissions();

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!transactionRef.trim()) {
      toast.error("Enter the transaction reference from your payment receipt.");
      return;
    }

    if (!receiptFile) {
      toast.error("Upload your receipt screenshot or photo.");
      return;
    }

    setIsSubmitting(true);

    try {
      await parsePaymentService.submitPayment({
        amount: Number(PAYMENT_AMOUNT_BIRR),
        bankName: currentChannel.label,
        accountNumber: currentChannel.accountNumber,
        paymentMethod,
        transactionRef: transactionRef.trim(),
        receiptFile,
        submitterNotes: notes.trim(),
      });

      toast.success("Payment receipt submitted. It is now stored in Back4App for admin review.");
      setTransactionRef("");
      setReceiptFile(null);
      setNotes("");
      await Promise.all([refreshSubmissions(), refreshProfile()]);
    } catch (error: any) {
      toast.error(error?.message || "Could not submit the payment right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-slate-950 pt-14 px-4 pb-4 md:p-8 md:pt-14 overflow-hidden relative">
      <StarField starCount={36} shootingCount={2} />
      <TopBar />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Payment Access</h1>
            <p className="text-white/55 text-sm">
              Unlock premium matric subjects and other paid content for {displayName}.
            </p>
          </div>
          <Badge className={accessState.className}>{accessState.label}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-white/[0.05] border-white/[0.10] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pay 200 ETB
              </CardTitle>
              <CardDescription className="text-white/60">
                Submit one verified payment to unlock paid matric subjects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white/65 text-sm">Required amount</p>
                      <p className="text-3xl font-bold text-white">200 ETB</p>
                    </div>
                    <ShieldCheck className="h-8 w-8 text-emerald-300" />
                  </div>
                  <p className="mt-3 text-sm text-white/55">{accessState.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-white">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value as "cbe" | "telebirr")}
                    className="flex h-10 w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white"
                  >
                    <option value="cbe" className="text-black">CBE</option>
                    <option value="telebirr" className="text-black">Telebirr</option>
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-white">Receiver Name</Label>
                    <Input value={currentChannel.accountName} readOnly className="bg-white/[0.03] border-white/10 text-white/70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Account / Number</Label>
                    <Input value={currentChannel.accountNumber} readOnly className="bg-white/[0.03] border-white/10 text-white/70" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionRef" className="text-white">Transaction Reference</Label>
                  <Input
                    id="transactionRef"
                    value={transactionRef}
                    onChange={(event) => setTransactionRef(event.target.value)}
                    placeholder="Enter the transaction ID from your receipt"
                    className="bg-white/[0.04] border-white/15 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt" className="text-white">Receipt Screenshot</Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => setReceiptFile(event.target.files?.[0] ?? null)}
                    className="bg-white/[0.04] border-white/15 text-white file:text-white"
                  />
                  <p className="text-xs text-white/45">PNG, JPG, or WEBP. Max 5MB.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Notes for Review</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Optional: include the payer name or anything the reviewer should know"
                    className="bg-white/[0.04] border-white/15 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-4 text-sm text-sky-100">
                  Payment receipts and review notes are now stored in Back4App. Admin approval updates premium access on your user profile.
                </div>

                {isAdmin && (
                  <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                    This account is an admin. Review submissions from{" "}
                    <Link to="/admin/payments" className="font-semibold text-cyan-200 underline underline-offset-4">
                      the admin payment approvals page
                    </Link>
                    .
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || hasPremiumAccess}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-semibold"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {hasPremiumAccess ? "Premium Already Active" : isSubmitting ? "Submitting..." : "Submit Payment Receipt"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white/[0.05] border-white/[0.10] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Access Summary</CardTitle>
                <CardDescription className="text-white/60">
                  Your current payment and account access state.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45 mb-2">Student</p>
                  <p className="text-white font-semibold">{profile?.name || displayName}</p>
                  <p className="text-white/55 text-sm">{profile?.phone || "No phone number available"}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45 mb-2">Status</p>
                  <Badge className={accessState.className}>{accessState.label}</Badge>
                  <p className="text-white/60 text-sm mt-3">{accessState.description}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45 mb-2">What Happens Next</p>
                  <div className="space-y-2 text-sm text-white/65">
                    <p>1. Transfer 200 ETB using the selected payment channel.</p>
                    <p>2. Upload your receipt and transaction reference here.</p>
                    <p>3. Admin reviews the submission in Back4App and your app access updates.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.05] border-white/[0.10] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Submission History</CardTitle>
                <CardDescription className="text-white/60">
                  Your recent payment submissions and review status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSubmissions ? (
                  <div className="text-sm text-white/55">Loading submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/55">
                    No payment submissions yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => {
                      const meta = statusMeta[submission.status as keyof typeof statusMeta] || {
                        label: "Unknown",
                        className: "bg-gray-500/15 text-gray-200 border-gray-400/30",
                        icon: <Clock3 className="h-4 w-4" />,
                      };

                      return (
                        <div key={submission.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-white">{submission.payment_method.toUpperCase()} payment</p>
                              <p className="text-sm text-white/55">
                                {submission.amount} ETB • Ref {submission.transaction_ref}
                              </p>
                            </div>
                            <Badge className={meta.className}>
                              {meta.icon}
                              <span className="ml-1">{meta.label}</span>
                            </Badge>
                          </div>
                          <p className="mt-3 text-xs text-white/45">
                            Submitted {new Date(submission.submitted_at).toLocaleString()}
                          </p>
                          {submission.submitter_notes && (
                            <p className="mt-2 text-sm text-white/60">{submission.submitter_notes}</p>
                          )}
                          {submission.reviewer_notes && (
                            <p className="mt-2 text-sm text-white/60">{submission.reviewer_notes}</p>
                          )}
                        </div>
                      );
                    })}
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
