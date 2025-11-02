"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth/login";
import { useState } from "react";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

const signInSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { error, data: loginData } = await login({
      email: data.email,
      password: data.password,
    });
    console.log(loginData);
    if (error) return toast.error(error.message);

    router.replace("/");
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldGroup>
              <Input
                placeholder="Enter your email"
                type="email"
                {...register("email")}
              />
            </FieldGroup>
            {errors.email && (
              <FieldDescription className="text-red-500">
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <FieldGroup>
              <Input
                placeholder="Enter your password"
                type="password"
                {...register("password")}
              />
            </FieldGroup>
            {errors.password && (
              <FieldDescription className="text-red-500">
                {errors.password.message}
              </FieldDescription>
            )}
            <FieldDescription>
              <button
                onClick={() => setOpenDialog(true)}
                type="button"
                className="hover:underline hover:text-gray-600 cursor-pointer text-blue-600"
              >
                Forgot password?
              </button>
            </FieldDescription>
          </Field>

          <ResetPasswordDialog open={openDialog} onOpenChange={setOpenDialog} />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
