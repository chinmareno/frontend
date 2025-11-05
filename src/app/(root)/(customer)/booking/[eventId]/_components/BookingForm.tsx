"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIdr } from "@/lib/formatIdr";
import { Event } from "@/types/Event";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { validateVoucher } from "@/app/actions/voucher/validateVoucher";
import { Button } from "@/components/ui/button";
import SelectCouponDialog from "./SelectCouponDialog";
import { Coupon } from "@/types/Coupon";
import { User } from "@/types/User";
import CreatePaymentButton from "./CreatePaymentButton";

type Props = {
  event: Event & {
    organizer: User;
    eventRating: number;
  };
  coupons: Coupon[];
};

const BookingForm = ({ event, coupons }: Props) => {
  const [code, setCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherId, setVoucherId] = useState("");
  const [selectedCouponIds, setSelectedCouponIds] = useState<string[]>([]);
  const [openCouponDialog, setOpenCouponDialog] = useState(false);

  const handleValidate = async () => {
    const voucher = await validateVoucher({
      code,
      event_id: event.id,
    });

    if (voucher) {
      setIsValid(true);
      setVoucherDiscount(voucher.discount);
      setVoucherId(voucher.id);
    }
  };

  const couponsDiscount = coupons.reduce((total, coupon) => {
    if (selectedCouponIds.includes(coupon.id)) {
      return total + coupon.discount;
    }
    return total;
  }, 0);
  const finalPrice = Math.max(
    event.price - (voucherDiscount + couponsDiscount),
    0
  );

  const isFree = finalPrice === 0;

  return (
    <Card className="shadow-sm border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {event.name}{" "}
              {event.eventRating !== null && (
                <span>({event.eventRating}⭐)</span>
              )}
            </h1>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Start Date:</span>
              {format(new Date(event.start_date), " dd MMMM yyyy")}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">End Date:</span>
              {format(new Date(event.end_date), " dd MMMM yyyy")}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Location:</span> {event.location}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Category:</span>{" "}
              {event.category.join(", ")}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Seats:</span> {event.available_seat}
              /{event.capacity_seat} available
            </p>
            {event.description && (
              <p className="text-gray-700 mt-3 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
          <div className="mt-4">
            <span
              className={`text-lg font-medium ${
                event.price === 0 ? "text-green-600" : "text-gray-900"
              }`}
            >
              {event.price === 0 ? "Free" : formatIdr(event.price)}
            </span>
          </div>
        </div>
      </CardContent>

      <div className="border mt-1" />

      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Organizer
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {event.organizer.profile_picture_url ? (
          <img
            src={event.organizer.profile_picture_url}
            alt={event.organizer.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
            {event.organizer.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold">{event.organizer.username}</p>
        </div>
      </CardContent>

      <div className="border mt-1" />

      {/* Coupon Section */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Coupon Code
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-3">
        <div className="flex items-center gap-2">
          <p>{selectedCouponIds.length} coupons applied</p>
          <Button
            onClick={() => setOpenCouponDialog(true)}
            variant="secondary"
            className="cursor-pointer"
          >
            Select coupon
          </Button>
        </div>
      </CardContent>
      <SelectCouponDialog
        isFree={isFree}
        open={openCouponDialog}
        setOpen={setOpenCouponDialog}
        coupons={coupons}
        selectedCouponIds={selectedCouponIds}
        setSelectedCouponIds={setSelectedCouponIds}
      />
      <div className="mt-1" />
      {/* Voucher Section */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Voucher Code
        </CardTitle>
      </CardHeader>
      <CardContent className=" gap-3">
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
            placeholder="Enter voucher code"
            className="flex-1"
          />
          <Button
            onClick={handleValidate}
            variant="secondary"
            className="cursor-pointer"
            disabled={isFree}
          >
            Apply
          </Button>
        </div>
        {isValid && (
          <p className="text-green-600 text-sm mt-2">
            ✅ Voucher applied successfully!
          </p>
        )}
      </CardContent>

      <div className="mt-1" />

      {/* Payment Summary */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Payment Summary{" "}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700">
        <div className="flex justify-between">
          <span>Event Price</span>
          <span>{formatIdr(event.price)}</span>
        </div>
        <div className="flex justify-between">
          <span>Coupons Discount</span>
          <span> {formatIdr(couponsDiscount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Voucher Discount</span>
          <span> {formatIdr(voucherDiscount)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatIdr(finalPrice)}</span>
        </div>
        <p className="font-semibold text-red-600">
          {event.price - (voucherDiscount + couponsDiscount) < 0 &&
            "Warning: Your coupons exceed this event's price. Excess discount will be permanently burned and cannot be refunded."}
        </p>
        <CreatePaymentButton
          couponIds={selectedCouponIds}
          eventId={event.id}
          voucherId={voucherId || undefined}
        />
      </CardContent>
    </Card>
  );
};

export default BookingForm;
