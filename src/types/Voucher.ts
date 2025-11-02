export type Voucher = {
  code: string;
  discount: number;
  max_uses: number;
  valid_from: Date;
  valid_until: Date;
  event_id: string | null;
  is_active: boolean;
  id: string;
  created_at: Date;
  current_uses: number;
};
