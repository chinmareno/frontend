import { Transaction } from "@/types/Transaction";
import { fetcher } from "../../../lib/fetcher";

export const rejectTransaction = async (transactionId: string) => {
  const transaction = await fetcher<Transaction>(
    "transactions/reject/" + transactionId,
    { body: {}, method: "PATCH" }
  );

  return transaction;
};
