import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserRoundCheck,
  Users,
  XCircle,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import StarField from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  getPaymentStatus,
  getPreferenceRole,
  hasPremiumPreferences,
  isAdminPreferences,
  setPreferenceRole,
} from "@/lib/authRoles";
import {
  paymentAdminService,
  type UserProfile,
  userAdminService,
} from "@/services/supabaseServiceFixed";
import type { PaymentSubmissionWithReceiptUrl } from "@/lib/supabase/payments";
import { toast } from "sonner";

type UserFilter = "all" | "active" | "inactive";
type PaymentFilter = "all" | "pending" | "verified" | "rejected";

const formatDate = (value?: string | null) => {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { displayName, profile, user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [payments, setPayments] = useState<PaymentSubmissionWithReceiptUrl[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [paymentQuery, setPaymentQuery] = useState("");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [userFilter, setUserFilter] = useState<UserFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [isReviewingPaymentId, setIsReviewingPaymentId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await userAdminService.listUsers();
      const nextUsers = data ?? [];
      setUsers(nextUsers);
      setSelectedUserId((current) =>
        nextUsers.some((entry) => entry.id === current) ? current : nextUsers[0]?.id || "",
      );
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Could not load users from Supabase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setIsPaymentsLoading(true);

    try {
      const data = await paymentAdminService.listAllSubmissions();
      const nextPayments = data ?? [];
      setPayments(nextPayments);
      setSelectedPaymentId((current) => {
        if (nextPayments.some((entry) => entry.id === current)) {
          return current;
        }

        return nextPayments.find((entry) => entry.status === "pending")?.id || nextPayments[0]?.id || "";
      });
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("Could not load payment submissions from Supabase.");
    } finally {
      setIsPaymentsLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(() => {
    void Promise.all([loadUsers(), loadPayments()]);
  }, [loadPayments, loadUsers]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const filteredUsers = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesFilter =
        userFilter === "all" ||
        (userFilter === "active" && user.is_active) ||
        (userFilter === "inactive" && !user.is_active);

      const matchesQuery =
        lowerQuery.length === 0 ||
        [
          user.name ?? "",
          user.email ?? "",
          user.mobile ?? "",
          user.grade ?? "",
          user.school ?? "",
          user.auth_id ?? "",
          user.id ?? "",
        ].some((value) => value.toLowerCase().includes(lowerQuery));

      return matchesFilter && matchesQuery;
    });
  }, [query, userFilter, users]);

  useEffect(() => {
    if (!filteredUsers.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(filteredUsers[0]?.id ?? "");
    }
  }, [filteredUsers, selectedUserId]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? filteredUsers[0] ?? null,
    [filteredUsers, selectedUserId, users],
  );

  const usersByAuthId = useMemo(
    () =>
      new Map(
        users
          .filter((entry) => Boolean(entry.auth_id))
          .map((entry) => [entry.auth_id as string, entry]),
      ),
    [users],
  );

  const filteredPayments = useMemo(() => {
    const lowerQuery = paymentQuery.trim().toLowerCase();

    return payments.filter((payment) => {
      const owner = usersByAuthId.get(payment.user_id);
      const matchesFilter = paymentFilter === "all" || payment.status === paymentFilter;
      const matchesQuery =
        lowerQuery.length === 0 ||
        [
          owner?.name ?? "",
          owner?.email ?? "",
          owner?.mobile ?? "",
          payment.transaction_ref ?? "",
          payment.bank_name ?? "",
          payment.account_number ?? "",
          payment.payment_method ?? "",
          payment.id ?? "",
        ].some((value) => value.toLowerCase().includes(lowerQuery));

      return matchesFilter && matchesQuery;
    });
  }, [paymentFilter, paymentQuery, payments, usersByAuthId]);

  useEffect(() => {
    if (!filteredPayments.some((payment) => payment.id === selectedPaymentId)) {
      setSelectedPaymentId(filteredPayments[0]?.id ?? "");
    }
  }, [filteredPayments, selectedPaymentId]);

  const selectedPayment = useMemo(
    () => payments.find((payment) => payment.id === selectedPaymentId) ?? filteredPayments[0] ?? null,
    [filteredPayments, payments, selectedPaymentId],
  );

  useEffect(() => {
    setReviewerNotes(selectedPayment?.reviewer_notes ?? "");
  }, [selectedPayment?.id, selectedPayment?.reviewer_notes]);

  const selectedPaymentOwner = selectedPayment ? usersByAuthId.get(selectedPayment.user_id) ?? null : null;
  const selectedUserPayments = useMemo(
    () => (selectedUser?.auth_id ? payments.filter((payment) => payment.user_id === selectedUser.auth_id) : []),
    [payments, selectedUser?.auth_id],
  );
  const selectedUserLatestPayment = selectedUserPayments[0] ?? null;

  const activeUsersCount = users.filter((user) => user.is_active).length;
  const inactiveUsersCount = users.filter((user) => !user.is_active).length;
  const usersWithEmailCount = users.filter((user) => Boolean(user.email)).length;
  const pendingPaymentsCount = payments.filter((payment) => payment.status === "pending").length;

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    setIsUpdatingId(userId);

    try {
      await userAdminService.updateUserProfile(userId, {
        is_active: isActive,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Could not update this user.");
      return;
    } finally {
      setIsUpdatingId(null);
    }

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              is_active: isActive,
              updated_at: new Date().toISOString(),
            }
          : user,
      ),
    );

    toast.success(isActive ? "User activated." : "User suspended.");
  };

  const deleteUserProfile = async (userId: string) => {
    setIsUpdatingId(userId);

    try {
      await userAdminService.deleteUserProfile(userId);
    } catch (error) {
      console.error("Error deleting user profile:", error);
      toast.error("Could not remove this user profile.");
      return;
    } finally {
      setIsUpdatingId(null);
    }

    setUsers((current) => current.filter((user) => user.id !== userId));
    toast.success("User profile removed.");
  };

  const updateUserRole = async (userId: string, role: "admin" | null) => {
    const targetUser = users.find((user) => user.id === userId);
    if (!targetUser) {
      return;
    }

    setIsUpdatingId(userId);

    const nextPreferences = setPreferenceRole(targetUser.preferences, role);

    try {
      await userAdminService.updateUserProfile(userId, {
        preferences: nextPreferences,
      });
    } catch (error) {
      console.error("Error updating admin role:", error);
      toast.error("Could not update admin access for this user.");
      return;
    } finally {
      setIsUpdatingId(null);
    }

    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? {
              ...user,
              preferences: nextPreferences,
              updated_at: new Date().toISOString(),
            }
          : user,
      ),
    );

    toast.success(role === "admin" ? "Admin access granted." : "Admin access removed.");
  };

  const reviewPayment = async (
    submission: PaymentSubmissionWithReceiptUrl,
    status: "verified" | "rejected",
  ) => {
    setIsReviewingPaymentId(submission.id);

    try {
      await paymentAdminService.reviewSubmission({
        submission,
        status,
        reviewerNotes,
      });
      toast.success(
        status === "verified"
          ? "Payment verified and premium access granted."
          : "Payment marked as rejected.",
      );
      refreshDashboard();
    } catch (error) {
      console.error("Error reviewing payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not update this payment submission.",
      );
    } finally {
      setIsReviewingPaymentId(null);
    }
  };

  return (
    <div className="app-shell pt-14 px-4 pb-4 md:p-8 md:pt-14">
      <TopBar />
      <StarField starCount={50} shootingCount={3} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white/85 hover:bg-white/12 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={refreshDashboard}
              className="border-white/15 bg-white/6 text-white hover:bg-white/10"
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="app-kicker mb-4">
              <ShieldCheck className="h-4 w-4" />
              Simple Road Admin
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl">User and payment management</h1>
            <p className="max-w-2xl text-sm text-white/72 md:text-base">
              Review student profiles from Supabase, search by identity details, control account access, and verify payment receipts before premium access is granted.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/72">
              Signed in as {displayName}
              <span className="text-white/35">•</span>
              Role: {getPreferenceRole(profile?.preferences) || (user?.email ? "authenticated" : "unknown")}
            </div>
          </div>

          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/14 bg-white/8 px-4 py-3 backdrop-blur-xl">
            <Search className="h-4 w-4 text-white/60" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, phone, grade, school"
              className="border-0 bg-transparent px-0 text-white placeholder:text-white/45 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-white/14 bg-white/8 text-white backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-white/70">Total Profiles</div>
              <div className="mt-2 text-3xl font-black text-white">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="border-white/14 bg-white/8 text-white backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500">
                <UserRoundCheck className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-white/70">Active Users</div>
              <div className="mt-2 text-3xl font-black text-white">{activeUsersCount}</div>
            </CardContent>
          </Card>

          <Card className="border-white/14 bg-white/8 text-white backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500">
                <UserMinus className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm text-white/70">Inactive / Payment Queue</div>
              <div className="mt-2 text-3xl font-black text-white">{inactiveUsersCount}</div>
              <div className="mt-2 text-xs text-white/50">
                {usersWithEmailCount} profiles include email • {pendingPaymentsCount} payments pending review
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-white/14 bg-white/8 text-white backdrop-blur-xl">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Profiles</CardTitle>
                <CardDescription className="text-white/60">
                  Search and filter real users from Supabase.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "active", "inactive"] as const).map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    variant="outline"
                    onClick={() => setUserFilter(filter)}
                    className={
                      userFilter === filter
                        ? "border-white/40 bg-white/16 text-white"
                        : "border-white/15 bg-transparent text-white/70 hover:bg-white/10"
                    }
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-4 py-10 text-white/65">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-white/55">
                  No users match the current search and filter.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      selectedUser?.id === user.id
                        ? "border-cyan-300/40 bg-cyan-400/10"
                        : "border-white/10 bg-white/6 hover:bg-white/10"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-white">{user.name || "Unnamed user"}</div>
                        <div className="text-sm text-white/55">{user.email || user.mobile || "No email or phone"}</div>
                      </div>
                      <Badge
                        className={
                          user.is_active
                            ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                            : "border-rose-400/30 bg-rose-500/15 text-rose-300"
                        }
                        variant="outline"
                      >
                        {user.is_active ? "active" : "inactive"}
                      </Badge>
                    </div>
                    {isAdminPreferences(user.preferences) && (
                      <div className="mb-3">
                        <Badge
                          variant="outline"
                          className="border-cyan-400/30 bg-cyan-500/10 text-cyan-200"
                        >
                          admin
                        </Badge>
                      </div>
                    )}
                    <div className="grid gap-2 text-sm text-white/65 md:grid-cols-3">
                      <span>{user.grade || "No grade"}</span>
                      <span>{user.school || "No school"}</span>
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/14 bg-white/8 text-white backdrop-blur-xl">
            <CardHeader>
              <CardTitle>{selectedUser ? selectedUser.name || "Unnamed user" : "No user selected"}</CardTitle>
              <CardDescription className="text-white/60">
                Review profile details, manage account access, and inspect the latest payment state.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedUser ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Email</div>
                      <div className="mt-2 font-medium">{selectedUser.email || "Not provided"}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Mobile</div>
                      <div className="mt-2 font-medium">{selectedUser.mobile || "Not provided"}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Grade</div>
                      <div className="mt-2 font-medium">{selectedUser.grade || "Not set"}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">School</div>
                      <div className="mt-2 font-medium">{selectedUser.school || "Not set"}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Joined</div>
                      <div className="mt-2 font-medium">{formatDate(selectedUser.created_at)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Last Login</div>
                      <div className="mt-2 font-medium">{formatDate(selectedUser.last_login)}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4 sm:col-span-2">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Role</div>
                      <div className="mt-2 font-medium">
                        {getPreferenceRole(selectedUser.preferences) || "student"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">Identifiers</div>
                    <div className="mt-3 space-y-2 text-sm text-white/75">
                      <div>Profile ID: {selectedUser.id}</div>
                      <div>Auth ID: {selectedUser.auth_id}</div>
                      <div>Updated: {formatDate(selectedUser.updated_at)}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">Access State</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={
                          hasPremiumPreferences(selectedUser.preferences)
                            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                            : "border-white/15 bg-white/8 text-white/75"
                        }
                      >
                        {hasPremiumPreferences(selectedUser.preferences) ? "premium active" : "premium locked"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-white/15 bg-white/8 text-white/75"
                      >
                        payment state: {getPaymentStatus(selectedUser.preferences) || "not set"}
                      </Badge>
                    </div>
                    {selectedUserLatestPayment ? (
                      <div className="mt-3 space-y-1 text-sm text-white/75">
                        <div>Latest payment: {selectedUserLatestPayment.amount} ETB</div>
                        <div>Submitted: {formatDate(selectedUserLatestPayment.submitted_at)}</div>
                        <div>Status: {selectedUserLatestPayment.status}</div>
                      </div>
                    ) : (
                      <div className="mt-3 text-sm text-white/60">No payment submissions for this user yet.</div>
                    )}
                  </div>

                  <div>
                    <div className="mb-3 text-sm font-semibold text-white">Account actions</div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateUserStatus(selectedUser.id, true)}
                        disabled={isUpdatingId === selectedUser.id || selectedUser.is_active}
                        className="bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Activate
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUserStatus(selectedUser.id, false)}
                        disabled={isUpdatingId === selectedUser.id || !selectedUser.is_active}
                        className="border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Suspend
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateUserRole(
                            selectedUser.id,
                            isAdminPreferences(selectedUser.preferences) ? null : "admin",
                          )
                        }
                        disabled={isUpdatingId === selectedUser.id}
                        className="border-cyan-400/30 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-50"
                      >
                        {isAdminPreferences(selectedUser.preferences) ? "Remove Admin" : "Grant Admin"}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdatingId === selectedUser.id}
                            className="border-white/15 bg-transparent text-white/80 hover:bg-white/10 disabled:opacity-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Profile
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-white/15 bg-slate-950 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove this user profile?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              This deletes the row from the `users` table only. It does not delete the person from Supabase Auth.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/15 bg-transparent text-white hover:bg-white/10">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUserProfile(selectedUser.id)}
                              className="bg-rose-600 text-white hover:bg-rose-700"
                            >
                              Remove Profile
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-white/55">
                  Pick a user from the left to start managing their account.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-white/14 bg-white/8 text-white backdrop-blur-xl">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Payment Submissions</CardTitle>
                  <CardDescription className="text-white/60">
                    Review uploaded receipts and decide whether premium access should be granted.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "verified", "rejected", "all"] as const).map((filter) => (
                    <Button
                      key={filter}
                      size="sm"
                      variant="outline"
                      onClick={() => setPaymentFilter(filter)}
                      className={
                        paymentFilter === filter
                          ? "border-white/40 bg-white/16 text-white"
                          : "border-white/15 bg-transparent text-white/70 hover:bg-white/10"
                      }
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/14 bg-white/8 px-4 py-3">
                <Search className="h-4 w-4 text-white/60" />
                <Input
                  value={paymentQuery}
                  onChange={(event) => setPaymentQuery(event.target.value)}
                  placeholder="Search by student, bank, account, or reference"
                  className="border-0 bg-transparent px-0 text-white placeholder:text-white/45 focus-visible:ring-0"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPaymentsLoading ? (
                <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-4 py-10 text-white/65">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading payment submissions...
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-white/55">
                  No payment submissions match the current search and filter.
                </div>
              ) : (
                filteredPayments.map((payment) => {
                  const owner = usersByAuthId.get(payment.user_id);

                  return (
                    <button
                      key={payment.id}
                      type="button"
                      onClick={() => setSelectedPaymentId(payment.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        selectedPayment?.id === payment.id
                          ? "border-emerald-300/40 bg-emerald-400/10"
                          : "border-white/10 bg-white/6 hover:bg-white/10"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-base font-semibold text-white">
                            {owner?.name || owner?.email || payment.user_id}
                          </div>
                          <div className="text-sm text-white/55">
                            {payment.bank_name} - {payment.payment_method.toUpperCase()}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            payment.status === "verified"
                              ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                              : payment.status === "pending"
                                ? "border-amber-300/30 bg-amber-500/15 text-amber-100"
                                : "border-rose-400/30 bg-rose-500/15 text-rose-200"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-white/65 md:grid-cols-3">
                        <span>{payment.amount} ETB</span>
                        <span>{payment.transaction_ref}</span>
                        <span>{formatDate(payment.submitted_at)}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="border-white/14 bg-white/8 text-white backdrop-blur-xl">
            <CardHeader>
              <CardTitle>{selectedPayment ? "Review Selected Payment" : "No Payment Selected"}</CardTitle>
              <CardDescription className="text-white/60">
                Compare the receipt, transfer details, and current profile state before verifying access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedPayment ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Student</div>
                      <div className="mt-2 font-medium">
                        {selectedPaymentOwner?.name || selectedPaymentOwner?.email || selectedPayment.user_id}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Amount</div>
                      <div className="mt-2 font-medium">{selectedPayment.amount} ETB</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Bank</div>
                      <div className="mt-2 font-medium">{selectedPayment.bank_name}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Sender Number</div>
                      <div className="mt-2 font-medium">{selectedPayment.account_number}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Reference</div>
                      <div className="mt-2 font-medium">{selectedPayment.transaction_ref}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">Profile State</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPaymentOwner ? (
                          <>
                            <Badge
                              variant="outline"
                              className={
                                hasPremiumPreferences(selectedPaymentOwner.preferences)
                                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                                  : "border-white/15 bg-white/8 text-white/75"
                              }
                            >
                              {hasPremiumPreferences(selectedPaymentOwner.preferences) ? "premium active" : "premium locked"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-white/15 bg-white/8 text-white/75"
                            >
                              {getPaymentStatus(selectedPaymentOwner.preferences) || "not set"}
                            </Badge>
                          </>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-amber-300/30 bg-amber-500/10 text-amber-100"
                          >
                            profile missing
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <div className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">Timeline</div>
                    <div className="space-y-2 text-sm text-white/75">
                      <div>Submitted: {formatDate(selectedPayment.submitted_at)}</div>
                      <div>Reviewed: {formatDate(selectedPayment.verified_at)}</div>
                      <div>Status: {selectedPayment.status}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-white">Reviewer Notes</div>
                    <textarea
                      value={reviewerNotes}
                      onChange={(event) => setReviewerNotes(event.target.value)}
                      placeholder="Explain why you verified or rejected this payment."
                      className="min-h-[120px] w-full rounded-xl border border-white/15 bg-white/6 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-white">Receipt</div>
                    {selectedPayment.receiptUrl ? (
                      <>
                        <img
                          src={selectedPayment.receiptUrl}
                          alt="Payment receipt"
                          className="max-h-[28rem] w-full rounded-2xl border border-white/10 bg-white object-contain p-2"
                        />
                        <Button
                          variant="outline"
                          onClick={() => window.open(selectedPayment.receiptUrl || "", "_blank", "noopener,noreferrer")}
                          className="border-white/15 bg-transparent text-white hover:bg-white/10"
                        >
                          Open Receipt
                        </Button>
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-white/55">
                        No receipt image was attached to this submission.
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-3 text-sm font-semibold text-white">Review Actions</div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => void reviewPayment(selectedPayment, "verified")}
                        disabled={
                          isReviewingPaymentId === selectedPayment.id || selectedPayment.status === "verified"
                        }
                        className="bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                      >
                        {isReviewingPaymentId === selectedPayment.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        Verify Payment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => void reviewPayment(selectedPayment, "rejected")}
                        disabled={
                          isReviewingPaymentId === selectedPayment.id || selectedPayment.status === "rejected"
                        }
                        className="border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 disabled:opacity-50"
                      >
                        {isReviewingPaymentId === selectedPayment.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Reject Payment
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-white/55">
                  Select a payment submission from the left to start reviewing it.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
