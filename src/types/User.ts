export type User = {
  id: string;
  referral_code: string;
  role: "CUSTOMER" | "ORGANIZER" | "ADMIN";
  profile_picture_url: string | null;
  username: string;
  email: string;
};
