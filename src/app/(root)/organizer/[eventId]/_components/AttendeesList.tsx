"use client";

import { acceptTransaction } from "@/app/actions/transaction/acceptTransaction";
import { rejectTransaction } from "@/app/actions/transaction/rejectTransaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatIdr } from "@/lib/formatIdr";
import { Attendee } from "@/types/Attendee";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  attendees: Attendee[];
}

export default function AttendeesList({ attendees: initialAttendees }: Props) {
  const [attendees, setAttendees] = useState(initialAttendees);
  const [isLoading, setIsLoading] = useState(false);

  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null
  );
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const displayedAttendees = attendees.filter((attendee) =>
    isAccepted ? attendee.is_accepted : !attendee.is_accepted
  );

  const handleReject = async (transactionId: string) => {
    setIsLoading(true);
    const res = await rejectTransaction(transactionId);
    if (res) {
      setAttendees((prev) =>
        prev.filter((attendee) => attendee.transactionId !== transactionId)
      );
      toast.success("Attendee rejected successfully");
      setSelectedAttendee(null);
    }
    setIsLoading(false);
  };

  const handleAccept = async (transactionId: string) => {
    setIsLoading(true);
    const res = await acceptTransaction(transactionId);
    if (res) {
      setAttendees((prev) =>
        prev.map((attendee) => {
          if (attendee.transactionId === transactionId) {
            return { ...attendee, isAccepted: true };
          }
          return attendee;
        })
      );
      toast.success("Attendee accepted successfully");
      setSelectedAttendee(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="border rounded-lg p-4">
      {/* Toggle Accepted / Unaccepted */}
      <div className="flex gap-1.5">
        <Label
          className={`flex items-center gap-2 mb-4 ${
            !isAccepted ? "font-bold" : "font-light"
          }`}
        >
          Unaccepted
        </Label>
        <Switch checked={isAccepted} onCheckedChange={setIsAccepted} />
        <Label
          className={`flex items-center gap-2 mb-4 ${
            isAccepted ? "font-bold" : "font-light"
          }`}
        >
          Accepted
        </Label>
      </div>

      <h2 className="font-semibold text-lg mb-3">Attendees</h2>
      {displayedAttendees.length === 0 ? (
        <p className="text-sm text-gray-500">No attendees yet.</p>
      ) : (
        <ul className="space-y-3">
          {displayedAttendees.map((attendee) => (
            <li
              key={attendee.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
            >
              {/* Profile */}
              <div className="flex items-center gap-3">
                {attendee.profile_picture_url ? (
                  <img
                    src={attendee.profile_picture_url}
                    alt={attendee.username}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-200 text-gray-700 font-medium">
                    {attendee.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{attendee.username}</span>
              </div>

              {/* View Details Button */}
              <button
                onClick={() => setSelectedAttendee(attendee)}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Attendee Modal */}
      {selectedAttendee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedAttendee(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Payment Details - {selectedAttendee.username}
            </h3>

            <div className="space-y-2 text-sm">
              {selectedAttendee.eventName && (
                <div>
                  <span className="font-medium">Event: </span>
                  {selectedAttendee.eventName}
                </div>
              )}
              {selectedAttendee.eventPrice > 0 && (
                <div>
                  <span className="font-medium">Price: </span>
                  {formatIdr(selectedAttendee.eventPrice)}
                </div>
              )}
              {selectedAttendee.couponDiscount > 0 && (
                <div>
                  <span className="font-medium">Coupon Discount: </span>
                  {formatIdr(selectedAttendee.couponDiscount)}
                </div>
              )}
              {selectedAttendee.voucherDiscount > 0 && (
                <div>
                  <span className="font-medium">Voucher Discount: </span>
                  {formatIdr(selectedAttendee.voucherDiscount)}{" "}
                  <span className="font-medium">Voucher Code: </span>
                  {selectedAttendee.voucherCode}
                </div>
              )}
              {selectedAttendee.amountPaid > 0 && (
                <div>
                  <span className="font-medium">Amount Paid: </span>
                  {formatIdr(selectedAttendee.amountPaid)}
                </div>
              )}

              <div className="mt-2">
                <span className="font-medium">Payment Proof: </span>
                {selectedAttendee.payment_proof_url ? (
                  <img
                    src={selectedAttendee.payment_proof_url}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                ) : (
                  <p>No payment proof because amount to paid is 0 (free)</p>
                )}
              </div>

              {!isAccepted && (
                <div className="flex gap-3 mt-3">
                  <Button
                    variant="destructive"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={isLoading}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAccept(selectedAttendee.transactionId)}
                    disabled={isLoading}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Reject Confirmation Dialog */}
          {isRejectDialogOpen && (
            <Dialog
              open={isRejectDialogOpen}
              onOpenChange={setIsRejectDialogOpen}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Reject Attendee</DialogTitle>
                </DialogHeader>
                <p className="mt-2">
                  Are you sure you want to reject {selectedAttendee.username}?
                </p>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsRejectDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedAttendee.transactionId);
                      setIsRejectDialogOpen(false);
                    }}
                    disabled={isLoading}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
