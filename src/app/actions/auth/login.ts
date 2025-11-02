"use server";

import { createSupabase } from "../../../../supabase/server";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = await createSupabase();

  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return res;
}
