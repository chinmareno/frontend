"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../../../../../../supabase/client";
import { completeTransaction } from "@/app/actions/transaction/completeTransaction";
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

type PaymentButtonProps = {
  transactionId: string;
  files: FileList | null;
  onSuccess?: () => void;
};

export function PaymentButton({
  transactionId,
  files,
  onSuccess,
}: PaymentButtonProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [open, setOpen] = useState(false);

  const handlePayment = async () => {
    const imageFile = files?.[0];
    if (!imageFile) return toast.error("Please upload a payment proof image.");

    setIsPaying(true);
    const { error, data: imageData } = await supabase.storage
      .from("payment_proof")
      .upload(transactionId + new Date(), imageFile, { upsert: true });

    if (error || !imageData) {
      setIsPaying(false);
      return toast.error("Please upload a valid image file.");
    }

    const { data: urlData } = supabase.storage
      .from("payment_proof")
      .getPublicUrl(imageData.path);

    const res = await completeTransaction(transactionId, {
      payment_proof_url: urlData.publicUrl,
    });

    if (res) {
      toast.success("Payment successful!");
      onSuccess?.();
      setOpen(false);
    }

    setIsPaying(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isPaying}
          className="w-full py-3 rounded-xl text-white font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          {isPaying ? "Processing..." : "Pay Now"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Your Payment</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to confirm your payment proof and complete this
            transaction. Please ensure your uploaded file is correct. Continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPaying}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePayment} disabled={isPaying}>
            {isPaying ? "Processing..." : "Yes, Confirm Payment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
