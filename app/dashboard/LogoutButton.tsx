"use client";

export default function LogoutButton() {
  return (
    <button
      className="text-sm text-red-500 hover:underline"
      onClick={async () => {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
        window.location.href = "/login";
      }}
    >
      Logout
    </button>
  );
}
