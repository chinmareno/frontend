import { Transaction } from "@/types/Transaction";
import { fetcher } from "../../../lib/fetcher";

export const acceptTransaction = async (transactionId: string) => {
  const transaction = await fetcher<Transaction>(
    "transactions/accept/" + transactionId,
    { body: {}, method: "PATCH" }
  );

  return transaction;
};
