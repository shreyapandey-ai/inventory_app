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

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Categories", href: "/dashboard/categories" },
    { name: "Suppliers", href: "/dashboard/suppliers" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "AI Assistant", href: "/dashboard/chat" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white/80 backdrop-blur border-r px-6 py-8 flex flex-col shadow-sm">

        {/* BRAND */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            InventoryOS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Admin control panel
          </p>
        </div>

        {/* NAV */}
        <nav className="space-y-2 text-sm">

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                group flex items-center px-4 py-2 rounded-xl 
                text-slate-600 
                hover:bg-teal-50 hover:text-teal-600 
                transition-all duration-200
              "
            >
              <span className="flex-1">{item.name}</span>

              {/* subtle hover indicator */}
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}

        </nav>

        {/* FOOTER */}
        <div className="mt-auto text-xs text-slate-400 pt-6">
          © InventoryOS
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-16 bg-white/70 backdrop-blur border-b px-6 flex items-center justify-between shadow-sm">

          <div>
            <h2 className="text-lg font-semibold text-slate-700">
              Admin Panel
            </h2>
            <p className="text-xs text-slate-400">
              Manage your inventory system
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-slate-500">
              Welcome back
            </div>

            <LogoutButton />
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
