import { EventRating } from "@/types/EventRating";
import { fetcher } from "../../../lib/fetcher";
import { User } from "@/types/User";

export const getOrganizerEventRatings = async (eventId: string) => {
  const eventRatings = await fetcher<(EventRating & { user: User })[]>(
    "ratings/organizer/event/" + eventId
  );

  return eventRatings;
};
