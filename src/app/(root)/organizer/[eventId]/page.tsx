"use client";

import { getEventById } from "@/app/actions/event/getEventById";
import EventDetail from "./_components/EventDetail";
import VoucherList from "./_components/VoucherList";
import { getVouchersByEventId } from "@/app/actions/voucher/getVouchersByEventId";
import { getAttendeesByEventId } from "@/app/actions/user/getAttendeesByEventId";
import AttendeesList from "./_components/AttendeesList";
import { use, useEffect, useState } from "react";
import { User } from "@/types/User";
import { Event } from "@/types/Event";
import { Voucher } from "@/types/Voucher";
import { Attendee } from "@/types/Attendee";
import { getOrganizerEventRatings } from "@/app/actions/rating/getOrganizerEventRatings";
import { EventRating } from "@/types/EventRating";
import ReviewList from "./_components/ReviewList";
import Analytic from "./_components/Analytic";
import { EventAnalytic } from "@/types/Analytic";
import { getEventAnalytic } from "@/app/actions/analytic/getEventAnalytic";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [event, setEvent] = useState<
    | (Event & {
        organizer: User;
        eventRating: number;
      })
    | null
  >(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [analytic, setAnalytic] = useState<EventAnalytic | null>(null);
  const [eventRatings, setEventRatings] = useState<
    (EventRating & { user: User })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      const eventData = await getEventById(eventId);
      const vouchersData = await getVouchersByEventId(eventId);
      const eventRatingsData = await getOrganizerEventRatings(eventId);
      const analyticData = await getEventAnalytic(eventId);
      if (eventRatingsData) setEventRatings(eventRatingsData);
      if (eventData) {
        setEvent(eventData);
        const attendeesData = await getAttendeesByEventId(eventData.id);
        if (attendeesData) setAttendees(attendeesData);
      }
      if (vouchersData) setVouchers(vouchersData);
      if (analyticData) setAnalytic(analyticData);
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  if (isLoading) return <p>Is loading...</p>;

  if (!event) return <p>Event not found</p>;

  if (!attendees) return <p>Attendees not found</p>;

  return (
    <div className="p-6">
      <EventDetail event={event} />

      <div className="flex">
        {vouchers && <VoucherList vouchers={vouchers} />}
        <div className="w-full max-w-3xl mx-auto p-6">
          <AttendeesList attendees={attendees} />
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto p-6">
        <ReviewList ratings={eventRatings} />
      </div>
      {analytic && <Analytic analytics={analytic} />}
    </div>
  );
}
