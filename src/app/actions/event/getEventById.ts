import { Event } from "@/types/Event";
import { fetcher } from "../../../lib/fetcher";
import { User } from "@/types/User";

export const getEventById = async (eventId: string) => {
  const event = await fetcher<
    Event & {
      organizer: User;
      eventRating: number;
    }
  >("events/" + eventId);
  if (!event) return null;
  const { created_at, start_date, end_date, ...rest } = event;
  const eventWithDate = {
    ...rest,
    created_at: new Date(created_at),
    start_date: new Date(start_date),
    end_date: new Date(end_date),
  };

  return eventWithDate;
};
