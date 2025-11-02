"use client";

import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/app/actions/auth/changePassword";
import { useRouter } from "next/navigation";

const UpdatePasswordForm = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (password.length < 8) return toast.error("Password min 8 characters");
    if (!password || !confirmPassword)
      return toast.error("Please fill in both fields.");

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsUpdating(true);

    const { error } = await changePassword(password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      router.push("/");
    }

    setIsUpdating(false);
  };

  return (
    <Card className="w-full max-w-sm mx-auto mt-16">
      <CardHeader>
        <CardTitle>Set a New Password</CardTitle>
        <CardDescription>
          Enter your new password below to reset your account access.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Password"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordForm;
