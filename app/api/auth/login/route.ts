import { login } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user, token } = await login(
      body.email,
      body.password
    );

    const res = NextResponse.json(user);

    res.cookies.set("token", token, {
  httpOnly: true,
  secure:false,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});


    return res;
  } catch (err: any) {
  console.error("LOGIN ERROR:", err);

  return NextResponse.json(
    { error: err.message || "Login failed" },
    { status: 400 }
  );
}

}
