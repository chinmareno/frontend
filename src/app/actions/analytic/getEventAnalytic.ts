import { fetcher } from "../../../lib/fetcher";
import { EventAnalytic } from "@/types/Analytic";

export const getEventAnalytic = async (eventId: string) => {
  const analytic = await fetcher<EventAnalytic>(
    `analytics/organizer/event/${eventId}`
  );

  return analytic;
};
