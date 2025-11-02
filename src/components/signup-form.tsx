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
import { signup } from "@/app/actions/auth/signup";
import { createUser } from "@/app/actions/user/createUser";

const signUpSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { email, password, username } = data;
    const { error: signupError, data: signupData } = await signup({
      email: email,
      password: password,
      username: username,
    });

    if (signupError || !signupData.user) {
      if (signupError?.message === "User already registered")
        return toast.error("Email already used");
      return toast.error(signupError?.message);
    }
    const user = await createUser({
      email,
      user_id: signupData.user.id,
      username,
    });
    if (!user) {
      toast.info("Please log in to continue");
      return router.push("/login");
    }

    if (user.role === "CUSTOMER") {
      router.replace("/referral");
    } else {
      router.replace("/");
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)} {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Username</FieldLabel>
            <FieldGroup>
              <Input
                placeholder="Enter your username"
                {...register("username")}
              />
            </FieldGroup>
            {errors.username && (
              <FieldDescription className="text-red-500">
                {errors.username.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldGroup>
              <Input
                placeholder="Enter your email"
                type="email"
                {...register("email")}
              />
            </FieldGroup>
            <FieldDescription className="text-gray-500 text-sm">
              Use a real email for password recovery.
            </FieldDescription>
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
          </Field>

          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <FieldGroup>
              <Input
                placeholder="Re-enter your password"
                type="password"
                {...register("confirmPassword")}
              />
            </FieldGroup>
            {errors.confirmPassword && (
              <FieldDescription className="text-red-500">
                {errors.confirmPassword.message}
              </FieldDescription>
            )}
          </Field>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
