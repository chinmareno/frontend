import { fetcher } from "../../../lib/fetcher";
import { Voucher } from "@/types/Voucher";

type Query = {
  code: string;
  event_id: string;
};
export const validateVoucher = async ({ code, event_id }: Query) => {
  const voucher = await fetcher<Voucher>(
    `vouchers/validate?code=${code}&event_id=${event_id}`
  );

  return voucher;
};
