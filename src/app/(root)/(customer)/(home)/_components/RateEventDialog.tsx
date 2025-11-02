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
import { toast } from "sonner";
import { postEventRating } from "@/app/actions/rating/postEventRating";

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

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      const eventRating = await getUserEventRating({
        event_id: eventId,
      });
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
    if (eventId) {
      initialFetch();
    }
  }, [eventId]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (prevRatingId) {
      const res = await editEventRating(prevRatingId, {
        rating,
        description: review,
      });
      if (res) {
        toast.success("Rating edited successfully");
        setIsLoading(false);
        return setOpen(false);
      }
      toast.error("Failed to edit rating");
      return setIsLoading(false);
    } else {
      const res = await postEventRating({
        event_id: eventId,
        rating,
        description: review,
      });
      if (res) {
        toast.success("Rating submitted successfully");
        setIsLoading(false);
        return setOpen(false);
      }
      toast.error("Failed to submit rating");
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rate this event</DialogTitle>
          <DialogDescription>
            Select a star rating and optionally leave written feedback.
          </DialogDescription>
        </DialogHeader>

        {/* Stars */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => {
              const filled = i <= rating;
              return (
                <button
                  className="cursor-pointer"
                  key={i}
                  onClick={() => setRating(i)}
                >
                  <Star fill={filled ? "yellow" : "white"} color="black" />
                </button>
              );
            })}
          </div>
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
          <Button disabled={isLoading} onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
