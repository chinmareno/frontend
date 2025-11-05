"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toggleActiveVoucher } from "@/app/actions/voucher/toggleActiveVoucher";
import { useState } from "react";
import { formatIdr } from "../../../../../lib/formatIdr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export type Voucher = {
  id: string;
  code: string;
  discount: number;
  valid_from: Date;
  valid_until: Date;
  event_id: string | null;
  is_active: boolean;
  created_at: Date;
  current_uses: number;
};

interface Props {
  vouchers: Voucher[];
}

export default function VoucherList({ vouchers }: Props) {
  const [vouchersState, setVouchersState] = useState(vouchers);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const handleActiveClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setConfirmOpen(true); // open confirmation dialog
  };

  const confirmToggle = async () => {
    if (!selectedVoucher) return;
    setIsLoading(true);
    const voucher = await toggleActiveVoucher(
      selectedVoucher.id,
      !selectedVoucher.is_active
    );
    if (voucher) {
      setVouchersState((prev) =>
        prev.map((v) =>
          v.id === voucher.id ? { ...v, is_active: voucher.is_active } : v
        )
      );
    }
    setIsLoading(false);
    setConfirmOpen(false);
    setSelectedVoucher(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <Card className={isLoading ? "opacity-55" : ""}>
        <CardHeader>
          <CardTitle>Event Vouchers</CardTitle>
          <p>Click the button to activate/inactivate voucher</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {vouchersState.length > 0 ? (
            vouchersState.map((v) => (
              <div
                key={v.id}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-muted/40 transition"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{v.code}</p>
                  <p className="text-xs text-gray-500">
                    Discount: {formatIdr(v.discount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Valid: {format(v.valid_from, "dd MMMM yyyy")} –{" "}
                    {format(v.valid_until, "dd MMMM yyyy")}
                  </p>
                </div>
                <Button
                  className={`p-2 hover:opacity-65 hover:bg-slate-300 bg-slate-200 ${
                    v.is_active ? "text-green-600" : "text-red-600"
                  }`}
                  onClick={() => handleActiveClick(v)}
                  disabled={isLoading}
                >
                  {v.is_active ? "Active" : "Inactive"}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No vouchers.</p>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedVoucher?.is_active
                ? "Deactivate Voucher"
                : "Activate Voucher"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              Are you sure you want to{" "}
              {selectedVoucher?.is_active ? "deactivate" : "activate"} voucher{" "}
              <strong>{selectedVoucher?.code}</strong>?
            </p>
            <p>
              Discount: {selectedVoucher && formatIdr(selectedVoucher.discount)}{" "}
              <br />
              Valid:{" "}
              {selectedVoucher &&
                `${format(
                  selectedVoucher.valid_from,
                  "dd MMM yyyy"
                )} – ${format(selectedVoucher.valid_until, "dd MMM yyyy")}`}
            </p>
          </div>
          <DialogFooter className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={confirmToggle} disabled={isLoading}>
              {selectedVoucher?.is_active ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
