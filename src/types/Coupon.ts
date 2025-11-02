export type Coupon = {
  id: string;
  created_at: Date;
  user_id: string;
  discount: number;
  is_used: boolean;
  used_at: Date | null;
  user_coupon_role: "REFERRER" | "CLAIMER";
  transaction_id: string | null;
  other_user_id: string;
  expired_at: Date;
};
