"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="
        flex items-center gap-2 
        px-4 py-2 rounded-xl 
        bg-red-50 text-red-600 
        hover:bg-red-100 
        active:scale-95 
        transition-all duration-200
        text-sm font-medium
        disabled:opacity-60
      "
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
