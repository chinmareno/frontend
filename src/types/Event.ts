export type Event = {
  id: string;
  created_at: Date;
  name: string;
  price: number;
  start_date: Date;
  end_date: Date;
  capacity_seat: number;
  available_seat: number;
  description: string | null;
  category: string[];
  location: string;
};
