"use client";

import { useRouter } from "next/navigation";
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
import { useState } from "react";
import { createTransaction } from "@/app/actions/transaction/createTransaction";
import { Button } from "@/components/ui/button";

type Props = {
  eventId: string;
  voucherId?: string;
  couponIds: string[];
};

const CreatePaymentButton = ({ eventId, voucherId, couponIds }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsLoading(true);
    const res = await createTransaction({
      event_id: eventId,
      voucher_id: voucherId,
      coupon_ids: couponIds,
    });

    if (res) {
      if (res.isFree) return router.push("/");
      return router.push("/payment/" + res.id);
    }

    setIsLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full cursor-pointer mt-4 text-base font-semibold"
          disabled={isLoading}
        >
          Confirm order
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm your order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to proceed with this order? Once confirmed,
            the transaction will be created and you’ll be redirected to payment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : "Yes, confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreatePaymentButton;
