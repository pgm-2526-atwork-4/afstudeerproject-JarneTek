"use client";
import { useClub } from "@/providers/clubprovider";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setActiveClubCookie } from "@/lib/actions/active-club";

export default function ClubSelector() {
  const { clubs, selectedClub, setSelectedClub } = useClub();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (clubs.length === 0) {
    return (
      <Link
        href="/dashboard/clubs/new"
        className="block w-full bg-brand-navy-light p-3 rounded text-sm text-brand-green hover:text-white transition-colors text-center font-medium"
      >
        + Create Club
      </Link>
    );
  }

  if (!selectedClub) return null;

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-brand-navy-light rounded p-3 text-sm flex items-center gap-3 text-white hover:bg-white/5 transition-colors"
      >
        <div className="w-8 h-8 rounded bg-brand-green overflow-hidden flex items-center justify-center text-xs font-bold shrink-0">
          {selectedClub.club.logoUrl ? (
            <img src={selectedClub.club.logoUrl} alt={selectedClub.club.name} className="w-full h-full object-cover" />
          ) : (
            selectedClub.club.name.substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="flex-1 text-left font-semibold truncate">
          {selectedClub.club.name}
        </div>
        <span className="text-xs opacity-50 shrink-0">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 w-full mt-2 bg-brand-navy-light rounded-lg shadow-xl z-20 overflow-hidden border border-white/5">
            <div className="max-h-60 overflow-y-auto py-1">
              {clubs.map((c) => (
                <button
                  key={c.id}
                  onClick={async () => {
                    setSelectedClub(c);
                    setIsOpen(false);
                    await setActiveClubCookie(c.clubId);
                    router.refresh();
                  }}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 text-sm transition-colors ${selectedClub.id === c.id ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                >
                  <div className="w-6 h-6 rounded overflow-hidden bg-brand-green/20 flex items-center justify-center text-[10px] font-bold shrink-0 text-brand-green">
                    {c.club.logoUrl ? (
                      <img src={c.club.logoUrl} alt={c.club.name} className="w-full h-full object-cover" />
                    ) : (
                      c.club.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="truncate">{c.club.name}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 bg-black/20 p-2">
              <Link
                href="/dashboard/clubs/new"
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-brand-green hover:bg-white/5 hover:text-white rounded transition-colors"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded border border-dashed border-current">
                  +
                </span>
                Create New Club
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
