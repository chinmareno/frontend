import { fetcher } from "@/lib/fetcher";
import { Event } from "@/types/Event";

export const getOrganizerEvents = async () => {
  const events = await fetcher<Event[]>("events/organizer/");

  return events;
};
