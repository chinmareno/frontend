"use server";

import { createSupabase } from "../../../../supabase/server";

export async function exchangeCode(code: string) {
  const supabase = await createSupabase();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) console.log(error);

  return data;
}
