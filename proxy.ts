// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";

// export async function middleware(req: any) {
//   const token = req.cookies.get("token")?.value;
//   const pathname = req.nextUrl.pathname;

//   // सार्वजनिक routes (skip)
//   if (
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/login") ||
//     pathname.startsWith("/register") ||
//     pathname.startsWith("/_next") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   // Protected routes
//   if (
//     pathname.startsWith("/dashboard") ||
//     pathname.startsWith("/admin") ||
//     pathname.startsWith("/manager")
//   ) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     try {
//       const { payload } = await jwtVerify(
//         token,
//         new TextEncoder().encode(process.env.JWT_SECRET)
//       );

//       // ✅ ROLE CHECK STARTS HERE
//       if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
//         return NextResponse.redirect(new URL("/dashboard", req.url));
//       }

//       if (pathname.startsWith("/manager") && payload.role !== "MANAGER") {
//         return NextResponse.redirect(new URL("/dashboard", req.url));
//       }
//       // ✅ ROLE CHECK ENDS HERE

//       return NextResponse.next();
//     } catch {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/manager") && payload.role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/manager/:path*",
  ],
};
