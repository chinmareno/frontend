"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { createTransaction } from "@/app/actions/transaction/createTransaction";

type Props = {
  eventId: string;
  voucherId?: string;
  couponIds: string[];
};

const CreatePaymentButton = ({ eventId, voucherId, couponIds }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleClick = async () => {
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
    <Button
      onClick={handleClick}
      className="w-full cursor-pointer mt-4 text-base font-semibold"
      disabled={isLoading}
    >
      Confirm order
    </Button>
  );
};

export default CreatePaymentButton;
