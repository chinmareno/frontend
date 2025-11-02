import { fetcher } from "../../../lib/fetcher";
import { Transaction, TransactionStatus } from "@/types/Transaction";

type Query = {
  status?: TransactionStatus;
  eventId?: string;
};

export const getUserTransactions = async (
  query: Query | undefined = undefined
) => {
  let queryString = "";
  if (query) {
    const { status, eventId } = query;
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (eventId) params.append("event_id", eventId);
    queryString = params.toString();
  }
  const transactions = await fetcher<Transaction[]>(
    `transactions/user/?${queryString}`
  );
  return transactions;
};
