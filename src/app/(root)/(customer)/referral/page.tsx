"use client";

import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/user/getUser";
import ReferralForm from "./_components/ReferralForm";
import { useEffect, useState } from "react";

const ReferralPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      const user = await getUser();
      console.log(user);
      if (!user) redirect("/login");
      if (user.role !== "CUSTOMER") redirect("/");
      setIsLoading(false);
    };
    initialFetch();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center">
      <ReferralForm />
    </div>
  );
};

export default ReferralPage;
