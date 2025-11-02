import { fetcher } from "../../../lib/fetcher";
import { Voucher } from "@/types/Voucher";

export const toggleActiveVoucher = async (
  eventId: string,
  isActive: boolean
) => {
  const voucher = await fetcher<Voucher>(`vouchers/${eventId}`, {
    method: "PATCH",
    body: { is_active: isActive },
  });

  return voucher;
};
