"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isStrongPassword = (password: string) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setError("");

        if (!isStrongPassword(password)) {
            setError("Weak password. Follow requirements.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
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
                    Get Started
                </h1>

                <p className="text-lg text-teal-100 relative z-10">
                    Build smarter inventory workflows with automation and insights.
                </p>
            </div>

            {/* FORM */}
            <div className="flex items-center justify-center px-6">
                <form
                    onSubmit={handleRegister}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition"
                >
                    <h2 className="text-2xl font-semibold text-slate-800 mb-1">
                        Create account
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Start managing inventory smarter
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm mb-4">
                            {error}
                        </p>
                    )}

                    <div className="relative mb-4">
                        <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative mb-2">
                        <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <p className="text-xs text-slate-500 mb-4">
                        8+ chars, uppercase, lowercase, number & symbol
                    </p>

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white p-3 rounded-xl font-medium shadow-md"
                    >
                        {loading ? "Creating..." : "Register"}
                    </button>

                    <p className="text-sm text-center mt-5 text-slate-500">
                        Already have an account?{" "}
                        <span
                            className="text-teal-600 font-medium cursor-pointer hover:underline"
                            onClick={() => router.push("/login")}
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
