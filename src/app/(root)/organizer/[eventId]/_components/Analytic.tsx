"use client";

import { EventAnalytic } from "@/types/Analytic";
import { formatIdr } from "../../../../../lib/formatIdr";

interface Props {
  analytics: EventAnalytic;
}

export default function Analytic({ analytics }: Props) {
  return (
    <div className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Event Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Total Tickets Sold</p>
          <p className="text-lg font-semibold">{analytics.totalTicketsSold}</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Gross Revenue</p>
          <p className="text-lg font-semibold">
            {formatIdr(analytics.grossRevenue)}
          </p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Marketing Expense</p>
          <p className="text-lg font-semibold">
            {formatIdr(analytics.marketingExpense)}
          </p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Administrative Expense</p>
          <p className="text-lg font-semibold">
            {formatIdr(analytics.administrativeExpense)}
          </p>
        </div>
        <div className="p-4 border rounded col-span-1 sm:col-span-2">
          <p className="text-sm text-gray-500">Net Revenue</p>
          <p className="text-lg font-semibold">
            {formatIdr(analytics.netRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
