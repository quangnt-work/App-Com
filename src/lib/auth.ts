import { createClient } from "@/lib/supabase/server";

/**
 * Ensures the currently authenticated user is an admin.
 * Throws an error if the user is not authenticated or not an admin.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Optimize by checking user metadata first if the role is stored there
  if (user.user_metadata?.role === "admin" || user.user_metadata?.role === "ADMIN") {
    return user;
  }

  // Fallback to checking profiles table if metadata doesn't have the role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}
