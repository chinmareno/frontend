export type EventRating = {
  id: string;
  created_at: Date;
  rating: number;
  description: string | null;
  user_id: string;
  event_id: string;
};
