import { EventRating } from "@/types/EventRating";
import { fetcher } from "../../../lib/fetcher";

type Body = {
  rating: number;
  description?: string;
};

export const editEventRating = async (eventRatingId: string, body: Body) => {
  const eventRating = await fetcher<EventRating>("ratings/" + eventRatingId, {
    method: "PATCH",
    body,
  });

  return eventRating;
};
