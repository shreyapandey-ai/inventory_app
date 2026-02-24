"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      if (data.role === "ADMIN")
        router.push("/dashboard");
      else
        router.push("/manager");

      router.refresh();
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-slate-50 to-slate-100">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-teal-600 to-cyan-500 text-white relative overflow-hidden">
        <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 left-10" />

        <h1 className="text-4xl font-bold mb-4 relative z-10">
          InventoryOS
        </h1>

        <p className="text-lg text-teal-100 relative z-10">
          Smart inventory management with real-time insights and automation.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border"
        >
          <h2 className="text-2xl font-semibold mb-1">
            Welcome back
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <div className="relative mb-4">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-3 border rounded-xl"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-4">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 p-3 border rounded-xl"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-teal-600 text-white p-3 rounded-xl"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-5">
            No account?{" "}
            <span
              className="text-teal-600 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}