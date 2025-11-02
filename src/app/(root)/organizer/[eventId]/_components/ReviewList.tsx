"use client";

import { EventRating } from "@/types/EventRating";
import { User } from "@/types/User";
import { format } from "date-fns";

type Props = {
  ratings: (EventRating & {
    user: User;
  })[];
};

export default function ReviewList({ ratings }: Props) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-3">Ratings</h2>
      {ratings.length === 0 ? (
        <p className="text-sm text-gray-500">No ratings yet.</p>
      ) : (
        <ul className="space-y-3">
          {ratings.map((rating) => (
            <li
              key={rating.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
            >
              {/* Profile */}
              <div className="flex items-center gap-3">
                {rating.user.profile_picture_url ? (
                  <img
                    src={rating.user.profile_picture_url}
                    alt={rating.user.username}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-200 text-gray-700 font-medium">
                    {rating.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="font-medium">{rating.user.username}</span>
                    <span className="text-sm font-light">
                      {format(new Date(rating.created_at), "dd MMMM yyyy")}
                    </span>
                  </div>
                  <p>{"⭐".repeat(rating.rating)}</p>
                  <p>{rating.description || "No Review"}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
