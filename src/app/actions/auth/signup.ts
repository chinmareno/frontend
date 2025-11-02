"use server";

import { createSupabase } from "../../../../supabase/server";

export async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
  username: string;
}) {
  const supabase = await createSupabase();

  const { error: signupError, data: authData } = await supabase.auth.signUp({
    email,
    password,
  });
  if (!authData.user || signupError) {
    return { error: signupError, data: authData };
  }

  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return res;
}
