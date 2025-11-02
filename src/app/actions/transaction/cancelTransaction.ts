import { Transaction } from "@/types/Transaction";
import { fetcher } from "../../../lib/fetcher";

export const cancelTransaction = async (transactionId: string) => {
  const transaction = await fetcher<Transaction>(
    "transactions/cancel/" + transactionId,
    { body: {}, method: "PATCH" }
  );

  return transaction;
};
