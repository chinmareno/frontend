import { User } from "@/types/User";
import { fetcher } from "../../../lib/fetcher";

export const getUser = async () => {
  const user = await fetcher<User>("users/profile");
  return user;
};
