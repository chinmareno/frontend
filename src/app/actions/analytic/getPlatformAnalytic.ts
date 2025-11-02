import { fetcher } from "../../../lib/fetcher";
import { PlatformAnalytic } from "@/types/Analytic";

type Query = {
  year?: number | null;
  month?: number | null;
};

export const getPlatformAnalytic = async (
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
  const analytic = await fetcher<PlatformAnalytic>(
    `analytics/admin?${queryString}`
  );

  return analytic;
};
