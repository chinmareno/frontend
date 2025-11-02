import { fetcher } from "@/lib/fetcher";
import { Event } from "@/types/Event";

type Body = {
  name: string;
  price: number;
  start_date: Date;
  end_date: Date;
  capacity_seat: number;
  location: string;
  category: string[];
  description?: string;
};
export const createEvent = async (body: Body) => {
  const events = await fetcher<Event[]>("events/organizer/", {
    method: "POST",
    body,
  });

  return events;
};
