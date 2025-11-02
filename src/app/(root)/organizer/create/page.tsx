"use client";

import { useOptionsStore } from "@/app/hooks/useOptionsStore";
import CreateEventForm from "./_components/CreateEventForm";

const Page = () => {
  const { categories, locations } = useOptionsStore();

  return (
    <div>
      <CreateEventForm categories={categories} locations={locations} />
    </div>
  );
};

export default Page;
