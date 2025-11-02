import { User } from "./User";

export type Attendee = User & {
  eventName: string;
  eventPrice: number;
  transactionId: string;
  couponDiscount: number;
  voucherDiscount: number;
  voucherCode: string | null;
  amountPaid: number;
  payment_proof_url: string | null;
  id: string;
  is_accepted: boolean;
  user_id: string;
  event_id: string;
  transaction_id: string;
};
