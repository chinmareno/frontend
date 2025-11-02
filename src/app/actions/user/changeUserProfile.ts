import { User } from "@/types/User";
import { fetcher } from "../../../lib/fetcher";

export const changeUserProfile = async (profilePictureUrl: string) => {
  const user = await fetcher<User>("users/profile/", {
    method: "PATCH",
    body: { profile_picture_url: profilePictureUrl },
  });
  return user;
};
