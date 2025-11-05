"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "@/types/Event";
import { useOptionsStore } from "@/app/hooks/useOptionsStore";
import EventCardCustomer from "@/components/EventCardCustomer";
import { useRouter } from "next/navigation";
import {
  EventStatus,
  getCustomerEvents,
} from "@/app/actions/event/getCustomerEvents";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ConfirmPurchaseDialog from "./_components/ConfirmPurchaseDialog";
import RateEventDialog from "./_components/RateEventDialog";
import { getUserTransactions } from "@/app/actions/transaction/getUserTransactions";

export default function Page() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [search, setSearch] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isFree, setIsFree] = useState(false);
  const { categories, locations } = useOptionsStore();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [eventId, setEventId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [eventStatus, setEventStatus] = useState<EventStatus>("AVAILABLE");
  const [eventTotal, setEventTotal] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const eventsData = await getCustomerEvents({
        category: selectedCategories.length ? selectedCategories : undefined,
        location: selectedLocation ? selectedLocation : undefined,
        search: searchDebounce,
        isFree: isFree ? true : undefined,
        status: eventStatus,
      });
      if (!eventsData || eventsData?.events.length === 0) {
        setEventTotal(0);
        setIsLoading(false);
        setEvents([]);
        return;
      }
      setEventTotal(eventsData.total);
      setEvents(eventsData.events);
      setIsLoading(false);
    };
    fetchEvents();
  }, [
    selectedCategories,
    selectedLocation,
    searchDebounce,
    isFree,
    eventStatus,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchDebounce(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const handleLoadMore = async () => {
    setIsLoadMore(true);
    const eventsData = await getCustomerEvents({
      category: selectedCategories.length ? selectedCategories : undefined,
      location: selectedLocation ? selectedLocation : undefined,
      search,
      lastEventId: events[events.length - 1]?.id,
      isFree: isFree ? true : undefined,
      status: eventStatus,
    });
    if (!eventsData || eventsData.events.length === 0) {
      setIsLoadMore(false);
      return toast.info("No more events to load.");
    }

    setEvents((prev) => [...prev, ...eventsData.events]);
    setIsLoadMore(false);
  };

  const onClear = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedLocation("");
  };

  const handleClickBuyTicket = (eventId: string) => {
    setEventId(eventId);
    setOpenConfirmationDialog(true);
  };

  const handleClickRateEvent = (eventId: string) => {
    setEventId(eventId);
    setOpenRateDialog(true);
  };

  return (
    <>
      <Input
        id="search"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-3/5 flex mx-auto mt-3 mb-7"
      />
      <Label htmlFor="categories" className="sr-only">
        Category
      </Label>

      <div className="flex justify-center gap-14">
        <div className="grid grid-cols-4 space-y-2.5 max-w-4/5">
          {categories.map((category) => {
            const isChecked = selectedCategories.includes(category);
            return (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={isChecked}
                  onCheckedChange={() =>
                    setSelectedCategories((prev) =>
                      isChecked
                        ? prev.filter((sc) => sc !== category)
                        : [...prev, category]
                    )
                  }
                />
                <Label htmlFor={category}>{category}</Label>
              </div>
            );
          })}
        </div>

        <Label htmlFor="location" className="sr-only">
          Location
        </Label>
        <Select
          value={selectedLocation}
          onValueChange={(value) => setSelectedLocation(value)}
        >
          <SelectTrigger className="font-semibold">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <Switch
            id="isFree"
            checked={isFree}
            onCheckedChange={(val) => setIsFree(val)}
          />
          <Label htmlFor="isFree">Free</Label>
        </div>
        <div>
          <RadioGroup
            onValueChange={(val: EventStatus) => setEventStatus(val)}
            value={eventStatus}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="AVAILABLE" id="AVAILABLE" />
              <Label htmlFor="AVAILABLE">AVAILABLE</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="UNPAID" id="UNPAID" />
              <Label htmlFor="UNPAID">UNPAID</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="ORDERED" id="ORDERED" />
              <Label htmlFor="ORDERED">ORDERED</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="ACCEPTED" id="ACCEPTED" />
              <Label htmlFor="ACCEPTED">ACCEPTED</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="REJECTED" id="REJECTED" />
              <Label htmlFor="REJECTED">REJECTED</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="CANCELLED" id="CANCELLED" />
              <Label htmlFor="CANCELLED">CANCELLED</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="EXPIRED" id="EXPIRED" />
              <Label htmlFor="EXPIRED">EXPIRED</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
        <Button
          type="button"
          variant="secondary"
          onClick={onClear}
          className="w-full mx-auto max-w-1/2 mt-7 border"
        >
          Clear
        </Button>
      </div>

      <div className="flex flex-col w-full items-center mt-8 gap-8 mb-10">
        {isLoading ? (
          <p>Is loading...</p>
        ) : events.length === 0 ? (
          <p>No event found</p>
        ) : (
          <>
            {events.map((e) => (
              <EventCardCustomer
                onClickRateEvent={() => handleClickRateEvent(e.id)}
                onClickBuyTicket={() => handleClickBuyTicket(e.id)}
                key={e.id}
                status={eventStatus}
                {...e}
              />
            ))}
            {eventTotal === events.length ? (
              <p>No more events to load</p>
            ) : (
              <Button disabled={isLoadMore} onClick={handleLoadMore}>
                Load More
              </Button>
            )}
          </>
        )}
        <ConfirmPurchaseDialog
          open={openConfirmationDialog}
          setOpen={setOpenConfirmationDialog}
          onConfirm={async () => {
            const uniqueTransactions = await getUserTransactions({
              eventId,
              status: ["WAITING_FOR_PAYMENT", "WAITING_FOR_ADMIN", "DONE"],
            });
            const uniqueTransactionId = uniqueTransactions?.[0]?.id;
            if (uniqueTransactionId) {
              const uniqueTransactionStatus = uniqueTransactions?.[0]?.status;
              if (uniqueTransactionStatus === "WAITING_FOR_PAYMENT") {
                return router.push("/payment/" + uniqueTransactionId);
              }
              if (uniqueTransactionStatus === "WAITING_FOR_ADMIN") {
                return toast.info(
                  "Your payment is received. Waiting for admin approval."
                );
              }
              if (uniqueTransactionStatus === "DONE") {
                return toast.info(
                  "Payment already completed. You’re confirmed for the event!"
                );
              }
            }

            router.push("/booking/" + eventId);
          }}
        />
        <RateEventDialog
          eventId={eventId}
          open={openRateDialog}
          setOpen={setOpenRateDialog}
        />
      </div>
    </>
  );
}
