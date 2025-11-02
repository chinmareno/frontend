"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../actions/user/getUser";
import { getSession } from "../actions/auth/getSession";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialCheck = async () => {
      const session = await getSession();
      if (!session) return setIsLoading(false);
      const user = await getUser();
      if (user) return router.replace("/");
      setIsLoading(false);
    };
    initialCheck();
  }, []);
  if (isLoading) return <p>Loading...</p>;

  return children;
};

export default Layout;
