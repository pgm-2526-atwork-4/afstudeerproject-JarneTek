"use client";
import { usePathname } from "next/navigation";
import { useClub } from "@/providers/clubprovider";

export default function DashboardHeader() {
    const pathname = usePathname();
    const { selectedClub } = useClub();
    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
        <div className="text-sm text-gray-500">
          {selectedClub?.club.name} Dashboard <span className="mx-2">›</span>{" "}
          <span className="text-gray-900 font-medium">{pathname}</span>
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
          🔔
        </div>
      </header>
    )
}