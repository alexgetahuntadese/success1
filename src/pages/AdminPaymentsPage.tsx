import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import StarField from "@/components/StarField";
import TopBar from "@/components/TopBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  parsePaymentService,
  type ParsePaymentSubmission,
  type ParsePaymentSubmissionStatus,
} from "@/integrations/parse/parsePayments";
import { toast } from "sonner";

const statusMeta = {
  verified: {
    label: "Verified",
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

const AdminPaymentsPage = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [submissions, setSubmissions] = useState<ParsePaymentSubmission[]>([]);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);

  const refreshSubmissions = async () => {
    try {
      const items = await parsePaymentService.listAllSubmissions();
      setSubmissions(items);
    } catch (error) {
      console.error("Failed to refresh admin payment submissions:", error);
      throw error;
    }
  };

  useEffect(() => {
    let active = true;

    const loadSubmissions = async () => {
      setIsLoading(true);

      try {
        const items = await parsePaymentService.listAllSubmissions();
        if (active) {
          setSubmissions(items);
        }
      } catch (error) {
        if (active) {
          console.error("Failed to load admin payment submissions:", error);
          toast.error("Could not load payment submissions from Back4App.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadSubmissions();

    return () => {
      active = false;
    };
  }, []);

  const handleReview = async (
    submissionId: string,
    status: ParsePaymentSubmissionStatus,
  ) => {
    setReviewingSubmissionId(submissionId);

    try {
      await parsePaymentService.reviewSubmission({
        submissionId,
        status,
        reviewerNotes: reviewNotes[submissionId] || "",
      });

      toast.success(
        status === "verified"
          ? "Payment verified and premium access activated."
          : "Payment rejected. The student can submit a new receipt.",
      );

      await Promise.all([refreshSubmissions(), refreshProfile()]);
    } catch (error: any) {
      toast.error(error?.message || "Could not review this submission.");
    } finally {
      setReviewingSubmissionId(null);
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
            <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Payment Approvals</h1>
            <p className="text-white/55 text-sm">
              Review payment receipts stored on Back4App and unlock student access.
            </p>
          </div>
          <Badge className="bg-cyan-500/15 text-cyan-100 border-cyan-400/30">
            <ShieldCheck className="mr-1 h-4 w-4" />
            Admin
          </Badge>
        </div>

        <Card className="mb-6 bg-white/[0.05] border-white/[0.10] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Review Guide</CardTitle>
            <CardDescription className="text-white/60">
              Each approval updates the student profile used for premium access checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
              1. Open the receipt and compare the transaction reference and amount.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
              2. Add a note if the student needs clarification or you want an audit trail.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
              3. Approve to activate premium, or reject to keep the student locked.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.05] border-white/[0.10] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Approval Queue</CardTitle>
            <CardDescription className="text-white/60">
              All payment submissions stored in Back4App.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-sm text-white/55">Loading admin submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/55">
                No payment submissions found.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => {
                  const meta = statusMeta[submission.status];
                  const isReviewing = reviewingSubmissionId === submission.id;

                  return (
                    <div
                      key={submission.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">
                              {submission.user_name || "Unknown student"}
                            </p>
                            <Badge className={meta.className}>
                              {meta.icon}
                              <span className="ml-1">{meta.label}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-white/60">
                            {submission.user_phone || "No phone"} • {submission.payment_method.toUpperCase()} • {submission.amount} ETB
                          </p>
                          <p className="text-sm text-white/55">
                            Ref {submission.transaction_ref} • Submitted {new Date(submission.submitted_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-white/55">
                            Receiver: {submission.bank_name} ({submission.account_number})
                          </p>
                          {submission.submitter_notes && (
                            <p className="text-sm text-white/65">
                              Student note: {submission.submitter_notes}
                            </p>
                          )}
                          {submission.reviewer_notes && (
                            <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm text-white/65">
                              Latest review note: {submission.reviewer_notes}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 md:w-80">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              if (submission.receiptUrl) {
                                window.open(submission.receiptUrl, "_blank", "noopener,noreferrer");
                              }
                            }}
                            disabled={!submission.receiptUrl}
                            className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Receipt
                          </Button>

                          <Textarea
                            value={reviewNotes[submission.id] || ""}
                            onChange={(event) =>
                              setReviewNotes((current) => ({
                                ...current,
                                [submission.id]: event.target.value,
                              }))
                            }
                            placeholder="Optional review note for the student"
                            className="min-h-24 bg-white/[0.04] border-white/15 text-white placeholder:text-white/30"
                          />

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => void handleReview(submission.id, "verified")}
                              disabled={isReviewing}
                              className="flex-1 bg-emerald-500 text-white hover:bg-emerald-400"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              type="button"
                              onClick={() => void handleReview(submission.id, "rejected")}
                              disabled={isReviewing}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>

                          {submission.status === "pending" && (
                            <div className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                              Approval here updates the student's Back4App profile and unlocks premium access.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-white/55">
          Students still submit receipts from{" "}
          <Link to="/payment" className="text-cyan-300 hover:text-cyan-200">
            the payment page
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
