import { Event as EventType } from "@/types/Event";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = EventType;

const EventCardOrganizer = (e: Props) => {
  return (
    <div>
      <Card className="w-full max-w-4xl hover:shadow-lg transition-shadow">
        <CardContent className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold">
              {e.name}{" "}
              <span className="text-sm text-muted-foreground">
                ({e.location})
              </span>
            </h2>
            <span
              className={`text-lg font-medium ${
                e.price === 0 ? "text-green-600" : "text-gray-900"
              }`}
            >
              {e.price === 0
                ? "Free"
                : new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(e.price)}
            </span>
          </div>

          {/* Dates */}
          <p className="text-sm text-muted-foreground">
            {new Date(e.start_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            -{" "}
            {new Date(e.end_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Description */}
          {e.description && <p className="text-gray-700">{e.description}</p>}

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-2">
            {e.category.map((cat) => (
              <Badge key={cat} variant="outline">
                {cat}
              </Badge>
            ))}
          </div>

          {/* Seats Info */}
          <p className="text-sm text-muted-foreground mt-2">
            Seats: {e.available_seat}/{e.capacity_seat} available
          </p>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
          >
            <Link href={`/organizer/${e.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventCardOrganizer;
