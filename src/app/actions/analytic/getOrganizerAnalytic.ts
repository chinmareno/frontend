import { fetcher } from "../../../lib/fetcher";
import { OrganizerAnalytic } from "@/types/Analytic";

type Query = {
  year?: number | null;
  month?: number | null;
};

export const getOrganizerAnalytic = async (
  query: Query | undefined = undefined
) => {
  let queryString = "";
  if (query) {
    const { year, month } = query;
    const params = new URLSearchParams();
    if (year) params.append("year", String(year));
    if (month) params.append("month", String(month));
    queryString = params.toString();
  }
  const analytic = await fetcher<OrganizerAnalytic>(
    `analytics/organizer?${queryString}`
  );

  return analytic;
};
