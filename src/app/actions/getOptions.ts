import { fetcher } from "../../lib/fetcher";

export const getOptions = async () => {
  const categories = await fetcher<Record<string, string>>("categories");
  const locations = await fetcher<Record<string, string>>("locations");

  return { categories, locations };
};
