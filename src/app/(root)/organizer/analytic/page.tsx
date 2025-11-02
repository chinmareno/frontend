"use client";

import { useEffect, useState } from "react";
import OrganizerDashboard from "./_components/OrganizerDashboard";
import { getOrganizerAnalytic } from "@/app/actions/analytic/getOrganizerAnalytic";
import { OrganizerAnalytic } from "@/types/Analytic";

const AnalyticPage = () => {
  // Filtering state
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [analytic, setAnalytic] = useState<OrganizerAnalytic | null>(null);

  useEffect(() => {
    const fetchAnalytic = async () => {
      const analyticData = await getOrganizerAnalytic({ month, year });
      setAnalytic(analyticData);
    };
    fetchAnalytic();
  }, [year, month]);

  if (!analytic) return <p>Analytic not found</p>;
  return (
    <OrganizerDashboard
      month={month}
      setMonth={setMonth}
      year={year}
      setYear={setYear}
      analytic={analytic}
    />
  );
};

export default AnalyticPage;
