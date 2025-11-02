"use client";

import { getTransactionById } from "@/app/actions/transaction/getTransactionById";
import PaymentForm from "./_components/PaymentForm";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/Transaction";
import { Event } from "@/types/Event";

const PaymentPage = ({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<
    | (Transaction & {
        event: Event;
      })
    | null
  >(null);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      const { transactionId } = await params;
      const transaction = await getTransactionById(transactionId);
      if (transaction) setTransaction(transaction);
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  if (isLoading) return <p>is loading...</p>;

  if (!transaction) {
    return (
      <div className="text-center py-20 text-gray-500">
        Transaction not found.
      </div>
    );
  }
  const { status: txStatus } = transaction;
  if (txStatus === "EXPIRED")
    return <p>Transaction is already expired. please create a new one</p>;
  if (txStatus === "DONE" || txStatus === "WAITING_FOR_ADMIN")
    return <p>Transaction is already paid</p>;
  if (txStatus === "CANCELLED") return <p>Transaction is already cancelled</p>;
  if (txStatus === "REJECTED")
    return <p>Transaction is already rejected by admin</p>;

  return (
    <div>
      <PaymentForm transaction={transaction} event={transaction.event} />
    </div>
  );
};

export default PaymentPage;
