"use server";

import { createSupabase } from "../../../../supabase/server";

export const changePassword = async (password: string) => {
  const supabase = await createSupabase();
  const res = await supabase.auth.updateUser({ password });

  return res;
};
