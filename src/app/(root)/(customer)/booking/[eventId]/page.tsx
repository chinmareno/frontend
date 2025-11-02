"use client";

import { getEventById } from "@/app/actions/event/getEventById";
import { getUser } from "@/app/actions/user/getUser";
import BookingForm from "./_components/BookingForm";
import { getUserTransactions } from "../../../../actions/transaction/getUserTransactions";
import { useRouter } from "next/navigation";
import { getUserCoupons } from "@/app/actions/coupon/getUserCoupons";
import { use, useEffect, useState } from "react";
import { Coupon } from "@/types/Coupon";
import { Event } from "@/types/Event";
import { toast } from "sonner";
import { User } from "@/types/User";

export default function PaymentEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [event, setEvent] = useState<
    | (Event & {
        organizer: User;
        eventRating: number;
      })
    | null
  >(null);
  const { eventId } = use(params);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      const eventData = await getEventById(eventId);
      if (eventData) setEvent(eventData);
      const user = await getUser();
      if (!user) {
        return router.push("/login");
      }
      const transactions = await getUserTransactions();
      const couponsData = await getUserCoupons();
      if (couponsData) setCoupons(couponsData);

      const isPaidOrBought = transactions?.some(
        (t) =>
          t.event_id === event?.id &&
          t.user_id === user?.id &&
          (t.status === "DONE" || t.status === "WAITING_FOR_ADMIN")
      );

      if (isPaidOrBought) {
        toast.info("You already ordered this event");
        return router.push("/");
      }
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  if (isLoading) return <p>Is loading...</p>;

  if (!event) {
    return (
      <div className="text-center py-20 text-gray-500">Event not found.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <BookingForm coupons={coupons} event={event} />
    </div>
  );
}
