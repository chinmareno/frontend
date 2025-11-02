import { create } from "zustand";
import { getOptions } from "../actions/getOptions";

interface OptionsStore {
  locations: string[];
  categories: string[];
  setLocations: (locations: string[]) => void;
  setCategories: (categories: string[]) => void;
}

export const useOptionsStore = create<OptionsStore>((set) => {
  (async () => {
    try {
      const { locations, categories } = await getOptions();
      set({
        locations: locations ? Object.values(locations) : [],
        categories: categories ? Object.values(categories) : [],
      });
    } catch (err) {
      console.error("❌ Failed to fetch options:", err);
    }
  })();

  return {
    locations: [],
    categories: [],
    setLocations: (locations) => set({ locations }),
    setCategories: (categories) => set({ categories }),
  };
});
