"use server";

import { createSupabase } from "../../../../supabase/server";

export const sendResetPasswordLink = async (email: string) => {
  const supabase = await createSupabase();

  const res = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  return res;
};
