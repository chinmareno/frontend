"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelTransaction } from "@/app/actions/transaction/cancelTransaction";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type CancelPaymentButtonProps = {
  transactionId: string;
};

export function CancelPaymentButton({
  transactionId,
}: CancelPaymentButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsCancelling(true);
    await cancelTransaction(transactionId);
    setIsCancelling(false);
    setOpen(false);
    router.push("/");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isCancelling}
          className="w-full mt-1 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          {isCancelling ? "Cancelling..." : "Cancel this payment"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Payment?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this payment? Your transaction will
            be voided, and you’ll need to start again if you still want to join
            this event.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelling}>Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isCancelling}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isCancelling ? "Cancelling..." : "Yes, Cancel Payment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
