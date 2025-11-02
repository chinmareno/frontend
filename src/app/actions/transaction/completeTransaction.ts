import { Transaction } from "@/types/Transaction";
import { fetcher } from "../../../lib/fetcher";

export const completeTransaction = async (
  transactionId: string,
  body: { payment_proof_url: string }
) => {
  const transaction = await fetcher<Transaction>(
    "transactions/payment/" + transactionId,
    {
      method: "PATCH",
      body,
    }
  );

  return transaction;
};
