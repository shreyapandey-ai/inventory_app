import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "@/lib/init";
import jwt from "jsonwebtoken";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    if (decoded.role !== "ADMIN") {
      redirect("/manager");
    }
  } catch {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r px-6 py-8 flex flex-col">

        <h1 className="text-2xl font-semibold text-teal-600 mb-10">
          InventoryOS
        </h1>

        <nav className="space-y-2 text-sm">

          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/products"
            className="block px-4 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition"
          >
            Products
          </Link>

          <Link
            href="/dashboard/categories"
            className="block px-4 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition"
          >
            Categories
          </Link>

          <Link
            href="/dashboard/suppliers"
            className="block px-4 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition"
          >
            Suppliers
          </Link>
          <Link
            href="/dashboard/analytics"
            className="block px-4 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition"
          >
            Analytics
          </Link>
          <Link
  href="/dashboard/chat"
  className="block px-4 py-2 rounded-xl hover:bg-teal-50 hover:text-teal-600 transition"
>
  AI Assistant
</Link>

        </nav>

        <div className="mt-auto text-xs text-slate-400">
          © InventoryOS
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="h-16 bg-white border-b px-6 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-slate-700">
            Admin Panel
          </h2>

          <LogoutButton />

        </div>

        {/* CONTENT */}
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
