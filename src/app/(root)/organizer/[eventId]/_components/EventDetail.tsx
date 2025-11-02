"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/Event";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CreateVoucherDialog from "./CreateVoucherDialog";
import { formatIdr } from "../../../../../lib/formatIdr";
import { format } from "date-fns";
import { User } from "@/types/User";

type Props = {
  event: Event & {
    organizer: User;
    eventRating: number;
  };
};

export default function EventDetail({ event }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {event.name}{" "}
            {event.eventRating !== null && <span>({event.eventRating}⭐)</span>}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Created At:{" "}
            {event.created_at.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-y-3">
            <p>
              <strong>Event ID:</strong> {event.id}
            </p>
            <p>
              <strong>Price:</strong> {formatIdr(event.price)}
            </p>
            <p>
              <strong>Category:</strong> {event.category.join(", ")}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {event.start_date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {format(event.end_date, "dd MMMM yyyy")}
            </p>
            <p>
              <strong>Capacity:</strong> {event.capacity_seat}
            </p>
            <p>
              <strong>Available Seats:</strong> {event.available_seat}
            </p>
            <p className="col-span-2">
              <strong>Location:</strong> {event.location}
            </p>
          </div>

          <div className="pt-4 border-t">
            <p className="font-semibold mb-1">Description</p>
            <p className="text-gray-700 whitespace-pre-line">
              {event.description || "No description provided."}
            </p>
          </div>

          <Button
            className="fixed bottom-6 cursor-pointer right-6 flex items-center gap-2 shadow-md"
            onClick={() => setDialogOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Add Voucher
          </Button>
        </CardContent>
      </Card>
      <CreateVoucherDialog
        event={event}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </div>
  );
}
