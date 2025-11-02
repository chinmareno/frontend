"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toggleActiveVoucher } from "@/app/actions/voucher/toggleActiveVoucher";
import { useState } from "react";
import { formatIdr } from "../../../../../lib/formatIdr";

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

  const handleActiveClick = async (
    voucherId: string,
    currentStatus: boolean
  ) => {
    setIsLoading(true);
    const voucher = await toggleActiveVoucher(voucherId, !currentStatus);
    if (voucher) {
      setVouchersState((prev) =>
        prev.map((v) => {
          if (v.id === voucher.id) {
            const { is_active, ...rest } = v;
            return { ...rest, is_active: voucher.is_active };
          }
          return { ...v };
        })
      );
    }
    setIsLoading(false);
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
                  onClick={() => handleActiveClick(v.id, v.is_active)}
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
    </div>
  );
}
