"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { createVoucher } from "@/app/actions/voucher/createVoucher";
import { Event } from "@/types/Event";

export type Voucher = {
  id: string;
  code: string;
  discount: number;
  max_uses: number;
  valid_from: Date;
  valid_until: Date;
  event_id: string | null;
  is_active: boolean;
  created_at: Date;
  current_uses: number;
};

interface AddVoucherModalProps {
  event: Event;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateVoucherDialog({
  event,
  open,
  setOpen,
}: AddVoucherModalProps) {
  const [form, setForm] = useState({
    code: "",
    discount: 1,
    valid_from: new Date(),
    valid_until: new Date(event.end_date),
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    if (form.code.length < 3) return toast.error("Min 3 Characters");
    const validFrom = form.valid_from.setHours(0, 0, 0, 0);
    const validUntil = form.valid_until.setHours(0, 0, 0, 0);
    const eventEndDate = new Date(event.end_date).setHours(0, 0, 0, 0);
    const isValidRange = validFrom <= validUntil;
    if (!isValidRange)
      return toast.error("Valid Until must be after Valid From");

    const isValidUntil = validUntil <= eventEndDate;
    if (!isValidUntil)
      return toast.error("Voucher cannot be still valid after event ends");

    setIsLoading(true);

    const res = await createVoucher({ ...form, event_id: event.id });
    if (res) {
      toast.success("Voucher added");
      console.log(res);
      setOpen(false);
      window.location.reload();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!open) {
      setForm({
        code: "",
        discount: 1,
        valid_from: new Date(),
        valid_until: new Date(event.end_date),
        is_active: true,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Voucher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div>
            <Label>Code</Label>
            <Input
              required
              value={form.code}
              onChange={(e) => {
                const raw = e.target.value;
                const formatted = raw
                  .toUpperCase() // force uppercase
                  .replace(/[^A-Z0-9]/g, "") // allow only letters & numbers
                  .trim(); // remove leading/trailing spaces
                setForm({ ...form, code: formatted });
              }}
            />
          </div>

          {/* Discount */}
          <div>
            <Label>Discount (IDR)</Label>
            <Input
              type="number"
              min={1}
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: Number(e.target.value) })
              }
            />
          </div>

          {/* Valid From / Until */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Valid From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {format(form.valid_from, "d MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.valid_from}
                    defaultMonth={form.valid_from}
                    onSelect={(date) =>
                      date && setForm({ ...form, valid_from: date })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Valid Until</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {format(form.valid_until, "d MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.valid_until}
                    defaultMonth={form.valid_until}
                    onSelect={(date) =>
                      date && setForm({ ...form, valid_until: date })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setForm({
                  ...form,
                  valid_from: new Date(),
                  valid_until: new Date(event.end_date),
                });
              }}
            >
              Valid from Now
            </Button>
            <Button
              type="button"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setForm({
                  ...form,
                  valid_from: new Date(event.start_date),
                  valid_until: new Date(event.end_date),
                });
              }}
            >
              Reset to Event Dates
            </Button>
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              className="cursor-pointer"
              checked={form.is_active}
              onCheckedChange={(checked) =>
                setForm({ ...form, is_active: checked })
              }
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full cursor-pointer"
            >
              Create Voucher
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
