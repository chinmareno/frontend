import { fetcher } from "../../../lib/fetcher";
import { Voucher } from "@/types/Voucher";

type Body = {
  code: string;
  discount: number;
  valid_from: Date;
  valid_until: Date;
  event_id: string;
  is_active: boolean;
};
export const createVoucher = async (body: Body) => {
  const voucher = (await fetcher("vouchers/", {
    method: "POST",
    body,
  })) as Voucher;

  return voucher;
};
