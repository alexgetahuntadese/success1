import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  RefreshCcw, 
  Search,
  Filter,
  Loader2,
  ImageIcon,
  User,
  Phone,
  CreditCard,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import TopBar from "@/components/TopBar";
import StarField from "@/components/StarField";
import { localPaymentService, type PaymentSubmission } from "@/lib/localPayments";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SubmissionWithUser extends PaymentSubmission {
  user_phone?: string;
  user_name?: string;
}

const AdminPaymentsPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionWithUser[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await localPaymentService.listAllSubmissions();
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load payment submissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.transaction_ref?.toLowerCase().includes(term) ||
        s.user_phone?.toLowerCase().includes(term) ||
        s.user_name?.toLowerCase().includes(term) ||
        s.bank_name?.toLowerCase().includes(term)
      );
    }
    
    setFilteredSubmissions(filtered);
  }, [submissions, statusFilter, searchTerm]);

  const handleVerify = async (id: string, status: "verified" | "rejected") => {
    setProcessingId(id);
    try {
      await localPaymentService.verifyPayment(id, status, reviewNotes[id]);
      toast.success(`Payment ${status === "verified" ? "verified" : "rejected"} successfully`);
      await loadSubmissions();
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to update payment status");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
      case "rejected":
        return <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const verifiedCount = submissions.filter(s => s.status === "verified").length;
  const totalAmount = submissions
    .filter(s => s.status === "verified")
    .reduce((sum, s) => sum + (s.amount || 0), 0);

  // if (!isAdmin) {
  //   return (
  //     <div className="app-shell pt-14 px-4">
  //       <TopBar />
  //       <div className="max-w-2xl mx-auto mt-20 text-center">
  //         <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
  //         <p className="text-white/70">You don't have permission to view this page.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="app-shell pt-14 px-4 pb-4 md:p-8 md:pt-14">
      <TopBar />
      <StarField starCount={60} shootingCount={4} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white/85 hover:bg-white/12 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Payment Admin</h1>
              <p className="text-sm text-white/60">Review and verify payment submissions</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => void loadSubmissions()}
            className="border-white/15 bg-white/6 text-white hover:bg-white/10"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/[0.08] border-white/[0.14] text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.08] border-white/[0.14] text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Verified</p>
                  <p className="text-2xl font-bold">{verifiedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.08] border-white/[0.14] text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <CreditCard className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Total Verified</p>
                  <p className="text-2xl font-bold">{totalAmount.toFixed(2)} ETB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/[0.08] border-white/[0.14] text-white mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search by ref, phone, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "pending", "verified", "rejected"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status 
                      ? "bg-white text-slate-950" 
                      : "border-white/15 text-white hover:bg-white/10"
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20 text-white/50">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No submissions found</p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="bg-white/[0.08] border-white/[0.14] text-white">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Receipt Image */}
                    <div 
                      className="w-full lg:w-48 h-48 rounded-lg bg-white/[0.05] border border-white/[0.14] flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => submission.receiptUrl && setSelectedImage(submission.receiptUrl)}
                    >
                      {submission.receiptUrl ? (
                        <img 
                          src={submission.receiptUrl} 
                          alt="Receipt" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-white/30" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold">{submission.amount} ETB</span>
                            {getStatusBadge(submission.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(submission.submitted_at).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {submission.payment_method?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-white/70">
                            <User className="h-3 w-3" />
                            {submission.user_name || "Unknown"}
                          </div>
                          <div className="flex items-center gap-1 text-white/50">
                            <Phone className="h-3 w-3" />
                            {submission.user_phone || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="bg-white/[0.04] rounded-lg p-2">
                          <span className="text-white/50">Bank:</span> {submission.bank_name}
                        </div>
                        <div className="bg-white/[0.04] rounded-lg p-2">
                          <span className="text-white/50">Account:</span> {submission.account_number}
                        </div>
                        <div className="bg-white/[0.04] rounded-lg p-2 md:col-span-2">
                          <span className="text-white/50">Reference:</span> {submission.transaction_ref}
                        </div>
                      </div>

                      {submission.reviewer_notes && (
                        <div className="bg-white/[0.04] rounded-lg p-2 text-sm">
                          <span className="text-white/50">Notes:</span> {submission.reviewer_notes}
                        </div>
                      )}

                      {/* Actions */}
                      {submission.status === "pending" && (
                        <div className="flex flex-col md:flex-row gap-2 pt-2">
                          <Textarea
                            placeholder="Add review notes (optional)..."
                            value={reviewNotes[submission.id] || ""}
                            onChange={(e) => setReviewNotes({ ...reviewNotes, [submission.id]: e.target.value })}
                            className="bg-white/[0.08] border-white/[0.14] text-white placeholder:text-white/50 text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2 md:w-auto">
                            <Button
                              size="sm"
                              onClick={() => handleVerify(submission.id, "verified")}
                              disabled={processingId === submission.id}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              {processingId === submission.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                              )}
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerify(submission.id, "rejected")}
                              disabled={processingId === submission.id}
                              className="border-rose-500/50 text-rose-300 hover:bg-rose-500/20"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Receipt full view" 
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white"
          >
            <XCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
