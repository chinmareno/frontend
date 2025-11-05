"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserEventRating } from "@/app/actions/rating/getUserEventRating";
import { editEventRating } from "@/app/actions/rating/editEventRating";
import { postEventRating } from "@/app/actions/rating/postEventRating";
import { toast } from "sonner";

type RateEventDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  eventId: string;
};

export default function RateEventDialog({
  open,
  setOpen,
  eventId,
}: RateEventDialogProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prevRatingId, setPrevRatingId] = useState<string | null>(null);

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      setIsLoading(true);
      const eventRating = await getUserEventRating({ event_id: eventId });
      if (eventRating && eventRating.length > 0) {
        setRating(eventRating[0].rating);
        setReview(eventRating[0].description || "");
        setPrevRatingId(eventRating[0].id);
      } else {
        setRating(0);
        setReview("");
        setPrevRatingId(null);
      }
      setIsLoading(false);
    };
    if (eventId) fetchRating();
  }, [eventId]);

  const handleSubmit = async () => {
    if (rating <= 0) return toast.error("Rating atleast 1 star");
    setIsLoading(true);
    if (prevRatingId) {
      const res = await editEventRating(prevRatingId, {
        rating,
        description: review,
      });
      if (res) {
        toast.success("Rating edited successfully");
        setIsLoading(false);
        setOpenConfirm(false);
        setOpen(false);
      } else {
        setIsLoading(false);
        toast.error("Failed to edit rating");
      }
    } else {
      const res = await postEventRating({
        event_id: eventId,
        rating,
        description: review,
      });
      if (res) {
        toast.success("Rating submitted successfully");
        setIsLoading(false);
        setOpenConfirm(false);
        setOpen(false);
      } else {
        setIsLoading(false);
        toast.error("Failed to submit rating");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {/* Main rating dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rate this event</DialogTitle>
            <DialogDescription>
              Select a star rating and optionally leave written feedback.
            </DialogDescription>
          </DialogHeader>

          {/* Stars */}
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                className="cursor-pointer"
                onClick={() => setRating(i)}
              >
                <Star fill={i <= rating ? "yellow" : "white"} color="black" />
              </button>
            ))}
          </div>

          {/* Review */}
          <div className="mt-4">
            <Textarea
              placeholder="Optional feedback..."
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setOpenConfirm(true)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              {prevRatingId
                ? "Are you sure you want to edit your rating?"
                : "Are you sure you want to submit your rating?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
