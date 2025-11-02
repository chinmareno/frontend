"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { exchangeCode } from "../actions/auth/exchangeCode";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

export const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      if (!code) return setIsLoading(false);
      const { session } = await exchangeCode(code);
      console.log(session);
      if (!session) return setIsLoading(false);
      setIsResetPassword(true);
      setIsLoading(false);
    };

    getSession();
  }, []);

  if (isLoading) return <p>is loading...</p>;
  if (!isResetPassword)
    return (
      <>
        <p>Link invalid or expired. Please send a new link</p>
        <Link className="text-blue-600" href="/login">
          Back to login
        </Link>
      </>
    );

  return <UpdatePasswordForm />;
};

export default ResetPasswordPage;
