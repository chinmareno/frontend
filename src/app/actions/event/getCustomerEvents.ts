import { Event } from "@/types/Event";
import { fetcher } from "../../../lib/fetcher";

export type EventStatus =
  | "AVAILABLE"
  | "UNPAID"
  | "ORDERED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

type Query = {
  category?: string[];
  location?: string;
  isFree?: true;
  search?: string;
  lastEventId?: string;
  status?: EventStatus;
};

export const getCustomerEvents = async (
  query: Query | undefined = undefined
) => {
  let queryString = "";
  if (query) {
    const { category, location, isFree, search, lastEventId, status } = query;
    const params = new URLSearchParams();
    if (category?.length) params.append("category", category.join(","));
    if (location) params.append("location", location);
    if (isFree) params.append("is_free", "true");
    if (search) params.append("search", search);
    if (lastEventId) params.append("last_event_Id", lastEventId);
    if (status) params.append("status", status);
    queryString = params.toString();
  }
  const events = await fetcher<{ events: Event[]; total: number }>(
    `events/user?${queryString}`
  );

  return events;
};
