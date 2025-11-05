"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Event } from "@/types/Event";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { formatIdr } from "@/lib/formatIdr";
import { toast } from "sonner";
import { Transaction } from "@/types/Transaction";
import { PaymentButton } from "./PaymentButton";
import { CancelPaymentButton } from "./CancelPaymentButton";

type Props = {
  event: Event;
  transaction: Transaction;
};

export default function PaymentForm({ event, transaction }: Props) {
  const [isPaid, setIsPaid] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(transaction.secondsLeft ?? 0);
  const [files, setFiles] = useState<FileList | null>(null);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      if (secondsLeft <= 0) {
        setSecondsLeft(0);
        toast.error("Payment time has expired.");
      } else {
        setSecondsLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 space-y-10">
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h1 className="text-3xl font-semibold text-gray-800">{event.name}</h1>

        {event.description && (
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        )}

        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Start:</span>{" "}
            {format(new Date(event.start_date), "dd MMMM yyyy")}
          </p>
          <p>
            <span className="font-medium text-gray-700">End:</span>{" "}
            {format(new Date(event.end_date), "dd MMMM yyyy")}
          </p>
          <p>
            <span className="font-medium text-gray-700">Location:</span>{" "}
            {event.location}
          </p>
          <p>
            <span className="font-medium text-gray-700">Category:</span>{" "}
            {event.category.join(", ")}
          </p>
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <span className="text-lg font-medium text-gray-700">
            Ticket Price{" "}
          </span>
          <p className="text-2xl font-bold text-green-600">
            {formatIdr(transaction.amount_paid)}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Seats available:{" "}
          <span className="font-medium">
            {isPaid ? event.available_seat : event.available_seat + 1} /{" "}
            {event.capacity_seat}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center space-y-6 shadow-sm">
        {!isPaid ? (
          <>
            <div className="font-semibold">
              <h2>
                Time left: {pad(hours)}:{pad(minutes)}:{pad(seconds)}
              </h2>
              <p>Please upload payment proof within 2 hours.</p>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              Upload Your Payment Proof
            </h2>

            <Input type="file" onChange={(e) => setFiles(e.target.files)} />

            <p className="text-sm text-gray-500">
              You are about to pay <b>{formatIdr(transaction.amount_paid)}</b>{" "}
              for this event.
            </p>

            <PaymentButton
              files={files}
              transactionId={transaction.id}
              onSuccess={() => setIsPaid(true)}
            />
            <CancelPaymentButton transactionId={transaction.id} />

            <p className="text-xs text-gray-400">
              Tips: If you see the time almost run out, just cancel and make a
              new payment to avoid invalid transaction
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="text-2xl font-semibold text-green-600">
              Payment Successful
            </h2>
            <p className="text-gray-500">
              Your payment for <b>{event.name}</b> has been recorded.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm"
            >
              Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
