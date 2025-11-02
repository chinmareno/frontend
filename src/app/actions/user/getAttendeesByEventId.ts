import { fetcher } from "../../../lib/fetcher";
import { Attendee } from "@/types/Attendee";

export const getAttendeesByEventId = async (eventId: string) => {
  const attendees = await fetcher<Attendee[]>(
    "events/" + eventId + "/attendees"
  );
  return attendees;
};
