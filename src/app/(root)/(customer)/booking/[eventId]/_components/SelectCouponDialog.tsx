"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { formatIdr } from "@/lib/formatIdr";
import { Coupon } from "@/types/Coupon";
import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";

type Props = {
  coupons: Coupon[];
  selectedCouponIds: string[];
  setSelectedCouponIds: Dispatch<SetStateAction<string[]>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isFree: boolean;
};

const SelectCouponDialog = ({
  coupons,
  selectedCouponIds,
  setSelectedCouponIds,
  open,
  setOpen,
  isFree,
}: Props) => {
  const toggleSelect = (id: string) => {
    setSelectedCouponIds((prev) => {
      return prev.includes(id)
        ? prev.filter((v) => v !== id)
        : isFree
        ? [...prev]
        : [...prev, id];
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Choose Coupons
          </DialogTitle>
        </DialogHeader>

        {coupons.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No available coupons 😔
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">
                {selectedCouponIds.length} selected
              </span>
            </div>

            <ScrollArea className="max-h-80 pr-2">
              <div className="space-y-2">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`flex items-center justify-between border rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition ${
                      selectedCouponIds.includes(coupon.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => toggleSelect(coupon.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedCouponIds.includes(coupon.id)}
                        onCheckedChange={() => toggleSelect(coupon.id)}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Referral coupon
                        </h3>
                        <p className="text-sm text-gray-500">
                          Discount: {formatIdr(coupon.discount)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Expires:{" "}
                          {format(new Date(coupon.expired_at), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DialogFooter className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setOpen(false)}
                disabled={selectedCouponIds.length === 0}
              >
                Confirm ({selectedCouponIds.length})
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SelectCouponDialog;
