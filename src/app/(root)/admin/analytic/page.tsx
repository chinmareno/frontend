"use client";

import { useEffect, useState } from "react";
import { PlatformAnalytic } from "@/types/Analytic";
import PlatformDashboard from "./_components/PlatformDashboard";
import { getPlatformAnalytic } from "@/app/actions/analytic/getPlatformAnalytic";

const AnalyticPage = () => {
  // Filtering state
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [analytic, setAnalytic] = useState<PlatformAnalytic | null>(null);

  useEffect(() => {
    const fetchAnalytic = async () => {
      const analyticData = await getPlatformAnalytic({ month, year });
      setAnalytic(analyticData);
    };
    fetchAnalytic();
  }, [year, month]);

  if (!analytic) return <p>Analytic not found</p>;
  return (
    <PlatformDashboard
      month={month}
      setMonth={setMonth}
      year={year}
      setYear={setYear}
      analytic={analytic}
    />
  );
};

export default AnalyticPage;
