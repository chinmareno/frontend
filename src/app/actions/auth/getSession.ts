"use server";

import { createSupabase } from "../../../../supabase/server";

export const getSession = async () => {
  const supabase = await createSupabase();
  const { error, data } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.log(error);
    return null;
  }
  return data;
};
