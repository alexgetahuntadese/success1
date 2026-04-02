import { supabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/supabase/types";

export const userAdminService = {
  async listUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading users:", error);
      throw new Error("Could not load users from Supabase.");
    }

    return data ?? [];
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Could not update this user in Supabase.");
    }

    return data;
  },

  async deleteUserProfile(userId: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error("Error deleting user profile:", error);
      throw new Error("Could not remove this user profile from Supabase.");
    }
  },
};
