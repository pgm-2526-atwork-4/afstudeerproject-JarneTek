"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/logout";
import ClubSelector from "../clubs/clubSelector";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/dashboard/form-builder",
    label: "Kit Builder",
  },
  {
    href: "/dashboard/club-info",
    label: "Club Settings",
  },
  {
    href: "/dashboard/order-overview",
    label: "Orders",
  },
  {
    href: "/dashboard/members",
    label: "Members",
  },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-brand-navy text-white flex-shrink-0 hidden md:block">
      <div className="p-4 flex items-center gap-2 border-b border-brand-navy-light">
        <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center font-bold">
          K
        </div>
        <span className="font-bold text-lg">KitStack</span>
      </div>
      <div className="p-4">
        <ClubSelector />

        <nav className="space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-2 rounded text-sm transition-colors ${
                (
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                )
                  ? "bg-brand-green text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-brand-navy-light pt-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full p-2 rounded transition-colors"
            >
              <span>←</span> Logout
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
