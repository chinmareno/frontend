import { Coupon } from "@/types/Coupon";
import { fetcher } from "../../../lib/fetcher";

export const claimReferral = async ({
  referral_code,
}: {
  referral_code: string;
}) => {
  const coupon = await fetcher<Coupon>("coupons/", {
    method: "POST",
    body: { referral_code },
  });

  return coupon;
};
