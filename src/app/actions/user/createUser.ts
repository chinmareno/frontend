import { User } from "@/types/User";
import { fetcher } from "../../../lib/fetcher";

type Body = {
  user_id: string;
  username: string;
  email: string;
};

export const createUser = async (body: Body) => {
  const user = await fetcher<User>("users/", { method: "POST", body });

  return user;
};
