"use client";

import EventCardOrganizer from "@/components/EventCardOrganizer";
import { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import { getOrganizerEvents } from "@/app/actions/event/getOrganizerEvents";

const Page = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const events = await getOrganizerEvents();
      if (events) {
        setEvents(events);
      }
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  if (isLoading) return <p>is loading...</p>;

  return (
    <div className="ml-10 mt-10 flex flex-col gap-10 mb-9">
      {events.map((e) => (
        <EventCardOrganizer key={e.id} {...e} />
      ))}
    </div>
  );
};

export default Page;
