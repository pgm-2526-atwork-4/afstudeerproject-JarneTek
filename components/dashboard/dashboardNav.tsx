"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/logout";
import ClubSelector from "../clubs/clubSelector";
import { useState, useEffect } from "react";
import LoadingButton from "../ui/LoadingButton";

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
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 bg-brand-navy text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center font-bold">
            K
          </div>
          <span className="font-bold text-lg">KitStack</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 -mr-2 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={closeMenu} 
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 bg-brand-navy text-white flex-shrink-0 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 items-center gap-2 border-b border-brand-navy-light hidden md:flex">
          <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center font-bold">
            K
          </div>
          <span className="font-bold text-lg">KitStack</span>
        </div>

        <div className="p-4 flex items-center justify-between gap-2 border-b border-brand-navy-light md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center font-bold">
              K
            </div>
            <span className="font-bold text-lg">KitStack</span>
          </div>
          <button onClick={closeMenu} className="p-2 -mr-2 text-gray-400 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <ClubSelector />

          <nav className="space-y-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
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
              <LoadingButton
                type="submit"
                loadingText="Logging out..."
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full p-2 rounded transition-colors focus:outline-none"
              >
                <span>←</span> Logout
              </LoadingButton>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
