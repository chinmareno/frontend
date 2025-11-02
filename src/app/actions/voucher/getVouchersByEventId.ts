import { fetcher } from "../../../lib/fetcher";
import { Voucher } from "@/types/Voucher";

export const getVouchersByEventId = async (eventId: string) => {
  const vouchers = await fetcher<Voucher[]>(`vouchers/${eventId}`);

  return vouchers;
};
