"use server";

import { redirect } from "next/navigation";
import { createSupabase } from "../../../../supabase/server";

export const logout = async () => {
  const supabase = await createSupabase();
  await supabase.auth.signOut();

  redirect("/login");
};
