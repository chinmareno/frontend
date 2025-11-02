"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface ConfirmPurchaseDialogProps {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmPurchaseDialog({
  title = "Confirm Purchase",
  description = "Are you sure you want to proceed with this purchase?",
  onConfirm,
  open,
  setOpen,
}: ConfirmPurchaseDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={handleConfirm}
          >
            Proceed to Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
