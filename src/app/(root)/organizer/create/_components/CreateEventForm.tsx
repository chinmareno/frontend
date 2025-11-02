"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Plus, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/actions/event/createEvent";

type Props = {
  locations: string[];
  categories: string[];
};

const CreateEventSchema = z
  .object({
    name: z
      .string()
      .min(3, "Event name must be at least 3 characters long")
      .max(100, "Event name must be less than 100 characters"),

    price: z.coerce.number().int("Price must be an integer"),

    start_date: z.coerce
      .date({ message: "Start date must be a valid date" })
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      }, "Start date cannot be in the past"),
    end_date: z.coerce
      .date({ message: "End date must be a valid date" })
      .refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      }, "End date cannot be in the past"),

    capacity_seat: z.coerce
      .number()
      .int("Capacity must be an integer")
      .min(1, "Capacity must be at least 1")
      .max(32767, "Capacity too large"),

    description: z.string().max(2000, "Description is too long").optional(),

    location: z.string().min(1, "Location is required"),

    category: z.array(z.string()).min(1, "Must select at least one item"),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

type CreateEventInput = z.infer<typeof CreateEventSchema>;

export default function CreateEventForm({ locations, categories }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(CreateEventSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      start_date: new Date(),
      end_date: new Date(),
      capacity_seat: 1,
      description: "",
      location: "",
      category: [],
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const onSubmit = async (data: CreateEventInput) => {
    try {
      setIsLoading(true);
      const resWithData = await createEvent(data);
      if (resWithData) return router.push("/organizer");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue("category", selectedCategories);
  }, [selectedCategories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Create New Event
          </h1>
          <p className="text-muted-foreground">
            Fill in the details to create an amazing event
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* 🧾 Event Details */}
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Basic information about your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Name */}
              <Field label="Event Name" error={errors.name?.message}>
                <Input placeholder="Enter event name" {...register("name")} />
              </Field>

              {/* Location + Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Location" error={errors.location?.message}>
                  <Select onValueChange={(val) => setValue("location", val)}>
                    <SelectTrigger>
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
                </Field>

                <Field label="Price (IDR)" error={errors.price?.message}>
                  <div className="space-y-1">
                    <Input type="number" {...register("price")} />
                    <p className="text-xs text-muted-foreground">
                      Leave it <span className="font-semibold">0</span> if the
                      event is free.
                    </p>
                  </div>
                </Field>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DatePicker
                  label="Start Date"
                  date={startDate}
                  onSelect={(date) => setValue("start_date", date!)}
                  error={errors.start_date?.message}
                />
                <DatePicker
                  label="End Date"
                  date={endDate}
                  onSelect={(date) => setValue("end_date", date!)}
                  error={errors.end_date?.message}
                />
              </div>

              {/* Capacity */}
              <Field label="Total Seats" error={errors.capacity_seat?.message}>
                <Input type="number" {...register("capacity_seat")} />
              </Field>

              {/* Description */}
              <Field
                label="Description (optional)"
                error={errors.description?.message}
              >
                <Textarea
                  rows={4}
                  placeholder="Tell people about your event..."
                  {...register("description")}
                />
              </Field>
            </CardContent>
          </Card>

          {/* 🏷️ Categories */}
          <Card className="shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Select at least one category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const isChecked = selectedCategories.includes(category);
                  return (
                    <Label
                      htmlFor={category}
                      key={category}
                      className={cn(
                        "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer",
                        isChecked
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Checkbox
                        id={category}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedCategories((prev) =>
                              prev.filter((c) => c !== category)
                            );
                          } else {
                            setSelectedCategories((prev) => [
                              ...prev,
                              category,
                            ]);
                          }
                        }}
                        checked={isChecked}
                        className="cursor-pointer"
                      />
                      {category}
                    </Label>
                  );
                })}
              </div>
              {errors.category && (
                <p className="text-sm text-destructive mt-2">
                  {errors.category.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            disabled={isLoading}
            type="submit"
            size="lg"
            className="w-full cursor-pointer"
          >
            <Plus className="mr-2 h-5 w-5" /> Create Event
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Small Components ---------- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function DatePicker({
  label,
  date,
  onSelect,
  error,
  disabled,
}: {
  label: string;
  date?: Date;
  onSelect: (date?: Date) => void;
  error?: string;
  disabled?: (date: Date) => boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
