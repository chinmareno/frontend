"use client";

import { logout } from "@/app/actions/auth/logout";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <button className="cursor-pointer" onClick={handleLogout}>
      Logout
    </button>
  );
}
