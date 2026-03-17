"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUserClubs } from "@/lib/actions/clubs";
import type { ClubEntry } from "@/lib/validations/clubs";
import { setActiveClubCookie, getActiveClubCookie } from "@/lib/actions/active-club";

type ClubContextType = {
  clubs: ClubEntry[];
  selectedClub: ClubEntry | null;
  setSelectedClub: (club: ClubEntry) => void;
  refreshClubs: () => Promise<void>;
};

const ClubContext = createContext<ClubContextType | null>(null);

export function useClub() {
  const context = useContext(ClubContext);
  if (!context) throw new Error("useClub must be used within a ClubProvider");
  return context;
}

export default function ClubProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clubs, setClubs] = useState<ClubEntry[]>([]);
  const [selectedClub, setSelectedClub] = useState<ClubEntry | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    getUserClubs().then((data) => {
      setClubs(data as ClubEntry[]);
      if (data.length > 0 && !selectedClub) {
        const firstClub = data[0] as ClubEntry;
        setSelectedClub(firstClub);
        setActiveClubCookie(firstClub.clubId);
      }
    });
  }, [pathname]);

  const refreshClubs = async () => {
    const data = await getUserClubs();
    setClubs(data as ClubEntry[]);
    if (selectedClub) {
      const updated = data.find((c) => c.clubId === selectedClub.clubId);
      if (updated) {
        setSelectedClub(updated as ClubEntry);
        setActiveClubCookie(updated.clubId);
      }
    } else if (data.length > 0) {
      const firstClub = data[0] as ClubEntry;
      setSelectedClub(firstClub);
      setActiveClubCookie(firstClub.clubId);
    }
  };

  return (
    <ClubContext.Provider
      value={{ clubs, selectedClub, setSelectedClub, refreshClubs }}
    >
      {children}
    </ClubContext.Provider>
  );
}
