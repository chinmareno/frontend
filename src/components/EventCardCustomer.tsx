import { Event as EventType } from "@/types/Event";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { EventStatus } from "@/app/actions/event/getCustomerEvents";

type Props = EventType & {
  onClickBuyTicket: () => void;
  onClickRateEvent: () => void;
  status: EventStatus;
};

const EventCardCustomer = ({
  name,
  location,
  price,
  start_date,
  end_date,
  description,
  capacity_seat,
  available_seat,
  category,
  status,
  onClickBuyTicket,
  onClickRateEvent,
}: Props) => {
  const notPayment = status === "AVAILABLE";
  const isUncompletedPayment = status === "UNPAID";
  const isOrderedPayment = status === "ORDERED";
  const isAcceptedPayment = status === "ACCEPTED";
  const rejectedPayment = status === "REJECTED";
  const cancelledPayment = status === "CANCELLED";
  const expiredPayment = status === "EXPIRED";

  return (
    <div>
      <Card className="w-full max-w-4xl hover:shadow-lg transition-shadow">
        <CardContent className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold">
              {name}{" "}
              <span className="text-sm text-muted-foreground">
                ({location})
              </span>
            </h2>
            <span
              className={`text-lg font-medium ${
                price === 0 ? "text-green-600" : "text-gray-900"
              }`}
            >
              {price === 0
                ? "Free"
                : new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(price)}
            </span>
          </div>

          {/* Dates */}
          <p className="text-sm text-muted-foreground">
            {new Date(start_date).getTime() === new Date(end_date).getTime()
              ? format(new Date(start_date), "dd MMMM yyyy")
              : `${format(new Date(start_date), "dd MMMM yyyy")} -
                ${format(new Date(end_date), "dd MMMM yyyy")}`}
          </p>

          {/* Description */}
          {description && <p className="text-gray-700 ">{description}</p>}

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-2">
            {category.map((cat) => (
              <Badge key={cat} variant="outline">
                {cat}
              </Badge>
            ))}
          </div>

          {/* Seats Info */}
          <p className="text-sm text-muted-foreground mt-2">
            Seats: {available_seat}/{capacity_seat} available
          </p>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
            onClick={isAcceptedPayment ? onClickRateEvent : onClickBuyTicket}
            disabled={isOrderedPayment}
          >
            {notPayment && "Order Ticket"}
            {isUncompletedPayment && "Continue Payment"}
            {isOrderedPayment && "Payment Under Review"}
            {isAcceptedPayment && "Rate Event"}
            {(rejectedPayment || cancelledPayment || expiredPayment) &&
              "Retry Payment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventCardCustomer;
