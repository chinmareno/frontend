import { Transaction } from "@/types/Transaction";
import { fetcher } from "../../../lib/fetcher";

type Body = {
  event_id: string;
  voucher_id?: string;
  coupon_ids: string[];
};

export const createTransaction = async (body: Body) => {
  const transaction = await fetcher<Transaction & { isFree: boolean }>(
    "transactions/",
    {
      method: "POST",
      body,
    }
  );

  return transaction;
};
