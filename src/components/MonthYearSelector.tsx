"use client";

import { months } from "@/app/constants/months";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetStateAction, Dispatch } from "react";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - i); // last 5 years

type Props = {
  year: number | null;
  setYear: Dispatch<SetStateAction<number | null>>;
  month: number | null;
  setMonth: Dispatch<SetStateAction<number | null>>;
};

export const MonthYearSelector = ({
  year,
  setYear,
  month,
  setMonth,
}: Props) => {
  const handleClear = () => {
    setYear(null);
    setMonth(null);
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Year Select */}
      <Select
        value={year ? String(year) : ""}
        onValueChange={(v) => {
          setYear(Number(v));
          setMonth(null);
        }}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month Select */}
      <Select
        value={month ? String(month) : ""}
        onValueChange={(v) => setMonth(Number(v))}
        disabled={!year}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
};
