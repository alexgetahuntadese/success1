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
  getPreferenceRole,
  isAdminPreferences,
  setPreferenceRole,
} from "@/lib/authRoles";
import {
  type UserProfile,
  userAdminService,
} from "@/services/supabaseServiceFixed";
import { toast } from "sonner";

type UserFilter = "all" | "active" | "inactive";

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
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState<UserFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await userAdminService.listUsers();
      const nextUsers = data ?? [];
      setUsers(nextUsers);
      setSelectedUserId((current) => current || nextUsers[0]?.id || "");
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Could not load users from Supabase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

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

  const activeUsersCount = users.filter((user) => user.is_active).length;
  const inactiveUsersCount = users.filter((user) => !user.is_active).length;
  const usersWithEmailCount = users.filter((user) => Boolean(user.email)).length;

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
              onClick={loadUsers}
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
            <h1 className="mb-2 text-3xl font-bold text-white md:text-5xl">User management</h1>
            <p className="max-w-2xl text-sm text-white/72 md:text-base">
              Review student profiles from Supabase, search by identity details, and control whether an account stays active in the app.
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
              <div className="text-sm text-white/70">Inactive / Missing Access</div>
              <div className="mt-2 text-3xl font-black text-white">{inactiveUsersCount}</div>
              <div className="mt-2 text-xs text-white/50">{usersWithEmailCount} profiles include email</div>
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
                Review profile details and manage account access.
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
      </div>
    </div>
  );
};

export default AdminDashboardPage;
