import { Event } from "@/types/Event";
import { fetcher } from "../../../lib/fetcher";
import { Transaction } from "@/types/Transaction";

export const getTransactionById = async (transactionId: string) => {
  const transaction = await fetcher<Transaction & { event: Event }>(
    "transactions/" + transactionId
  );

  return transaction;
};
