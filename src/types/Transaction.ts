export type TransactionStatus =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_ADMIN"
  | "DONE"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

export type Transaction = {
  id: string;
  created_at: Date;
  updated_at: Date;
  username: string;
  status: TransactionStatus;
  payment_proof_url: string | null;
  coupon_discount: number;
  voucher_discount: number;
  voucher_code: string | null;
  amount_paid: number;
  expired_at: Date | null;
  completed_at: Date | null;
  event_id: string;
  user_id: string;
  voucher_id_used: string | null;
  secondsLeft?: number;
};
