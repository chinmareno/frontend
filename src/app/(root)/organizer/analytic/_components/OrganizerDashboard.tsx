import { months } from "@/app/constants/months";
import { MonthYearSelector } from "@/components/MonthYearSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatIdr } from "@/lib/formatIdr";
import { OrganizerAnalytic } from "@/types/Analytic";
import { Dispatch, SetStateAction } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
} from "recharts";

type Props = {
  analytic: OrganizerAnalytic;
  year: number | null;
  setYear: Dispatch<SetStateAction<number | null>>;
  month: number | null;
  setMonth: Dispatch<SetStateAction<number | null>>;
};

const OrganizerDashboard = ({
  analytic,
  month,
  setMonth,
  year,
  setYear,
}: Props) => {
  const totals = {
    grossRevenue: analytic.reduce((a, b) => a + b.grossRevenue, 0),
    netRevenue: analytic.reduce((a, b) => a + b.netRevenue, 0),
    marketingExpense: analytic.reduce((a, b) => a + b.marketingExpense, 0),
    administrativeExpense: analytic.reduce(
      (a, b) => a + b.administrativeExpense,
      0
    ),
    ticketsSold: analytic.reduce((a, b) => a + b.totalTicketsSold, 0),
    eventsHeld: analytic.reduce((a, b) => a + b.totalEventsHeld, 0),
  };

  const renderCard = (
    title: string,
    value: number | null | undefined,
    colorClass: string,
    tooltipContent?: string
  ) => (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-col items-start">
        {tooltipContent ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle>{title}</CardTitle>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <CardTitle>{title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${colorClass}`}>
          {value ? formatIdr(value) : formatIdr(0)}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-6">
        {/* Header */}
        <div className="grid grid-cols-3 items-center justify-between">
          <div />
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold">
              Organizer Analytic (Accrual)
            </h2>
            <p className="text-sm text-muted-foreground">
              View revenue, marketing, and administrative expenses over time.
            </p>
          </div>
          <MonthYearSelector
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
          />
        </div>

        <Separator />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-4">
          {renderCard(
            "Marketing Expense",
            totals.marketingExpense,
            "text-amber-600",
            "Total voucher discount"
          )}
          {renderCard(
            "Administrative Expense",
            totals.administrativeExpense,
            "text-red-600",
            "Total platform/admin fees"
          )}
          {renderCard(
            "Gross Revenue",
            totals.grossRevenue,
            "text-blue-600",
            "Total revenue before expenses"
          )}
          {renderCard(
            "Net Revenue",
            totals.netRevenue,
            "text-green-600",
            "Total revenue after expenses"
          )}
        </div>

        <Separator />

        {/* Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Revenue & Expenses Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pl-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytic} margin={{ right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="periodValue"
                  tickFormatter={(value) =>
                    analytic[0]?.periodType === "month"
                      ? months[Number(value) - 1]
                      : value
                  }
                />
                <YAxis
                  width={110}
                  tickFormatter={(value) =>
                    value === 0 ? "" : formatIdr(Number(value))
                  }
                />
                <RechartTooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="p-2 bg-white border rounded text-xs space-y-1">
                        <p className="font-medium">
                          {analytic[0]?.periodType === "month"
                            ? `Month: ${months[Number(label) - 1]}`
                            : `Period: ${label}`}
                        </p>
                        <p>Gross Revenue: {formatIdr(d.grossRevenue)}</p>
                        <p>Net Revenue: {formatIdr(d.netRevenue)}</p>
                        <p>
                          Marketing Expense: {formatIdr(d.marketingExpense)}
                        </p>
                        <p>
                          Administrative Expense:{" "}
                          {formatIdr(d.administrativeExpense)}
                        </p>
                        <p>Tickets Sold: {d.totalTicketsSold}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="grossRevenue"
                  stroke="#2563eb"
                  name="Gross Revenue"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="netRevenue"
                  stroke="#16a34a"
                  name="Net Revenue"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="marketingExpense"
                  stroke="#f59e0b"
                  name="Marketing Expense"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="administrativeExpense"
                  stroke="#ef4444"
                  name="Admin Expense"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Transaction Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="p-2">Period</th>
                    <th className="p-2">Gross Revenue</th>
                    <th className="p-2">Net Revenue</th>
                    <th className="p-2">Marketing Expense</th>
                    <th className="p-2">Administrative Expense</th>
                    <th className="p-2">Tickets Sold</th>
                    <th className="p-2">Events Held</th>
                  </tr>
                </thead>
                <tbody>
                  {analytic.length > 0 ? (
                    analytic.map((row, i) => (
                      <tr
                        key={i}
                        className="border-t hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-2 font-medium text-muted-foreground">
                          {row.periodType === "month"
                            ? months[Number(row.periodValue) - 1]
                            : `${row.periodType} ${row.periodValue}`}
                        </td>
                        <td className="p-2">{formatIdr(row.grossRevenue)}</td>
                        <td className="p-2">{formatIdr(row.netRevenue)}</td>
                        <td className="p-2">
                          {formatIdr(row.marketingExpense)}
                        </td>
                        <td className="p-2">
                          {formatIdr(row.administrativeExpense)}
                        </td>
                        <td className="p-2">{row.totalTicketsSold}</td>
                        <td className="p-2">{row.totalEventsHeld}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-muted-foreground"
                      >
                        No data available for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-muted/30 font-semibold">
                  <tr>
                    <td className="p-2">Total</td>
                    <td className="p-2">{formatIdr(totals.grossRevenue)}</td>
                    <td className="p-2">{formatIdr(totals.netRevenue)}</td>
                    <td className="p-2">
                      {formatIdr(totals.marketingExpense)}
                    </td>
                    <td className="p-2">
                      {formatIdr(totals.administrativeExpense)}
                    </td>
                    <td className="p-2">{totals.ticketsSold}</td>
                    <td className="p-2">{totals.eventsHeld}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default OrganizerDashboard;
