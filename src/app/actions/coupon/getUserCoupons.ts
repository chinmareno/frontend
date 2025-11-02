import { Coupon } from "@/types/Coupon";
import { fetcher } from "../../../lib/fetcher";

export const getUserCoupons = async () => {
  const coupons = await fetcher<Coupon[]>("coupons/user/");

  return coupons;
};
