export type OrganizerAnalytic = {
  periodType: "year" | "month" | "day";
  periodValue: number;
  grossRevenue: number;
  administrativeExpense: number;
  marketingExpense: number;
  netRevenue: number;
  totalTicketsSold: number;
  totalEventsHeld: number;
}[];

export type PlatformAnalytic = {
  periodType: "year" | "month" | "day";
  periodValue: number;
  grossRevenue: number;
  marketingExpense: number;
  netRevenue: number;
  totalTicketsSold: number;
  totalEventsHeld: number;
}[];
