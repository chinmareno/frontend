import { EventRating } from "@/types/EventRating";
import { fetcher } from "../../../lib/fetcher";

type Query = {
  event_id: string;
};

export const getUserEventRating = async (query: Query | undefined) => {
  const params = new URLSearchParams();
  let queryString = "";
  if (query) {
    const { event_id } = query;
    if (event_id) params.append("event_id", event_id);
    queryString = params.toString();
  }
  const eventRatings = await fetcher<EventRating[]>(
    "ratings/user/?" + queryString
  );

  return eventRatings;
};
