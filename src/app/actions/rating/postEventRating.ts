import { EventRating } from "@/types/EventRating";
import { fetcher } from "../../../lib/fetcher";

type Body = {
  event_id: string;
  rating: number;
  description?: string;
};

export const postEventRating = async (body: Body) => {
  const eventRating = await fetcher<EventRating>("ratings/", {
    method: "POST",
    body,
  });

  return eventRating;
};
