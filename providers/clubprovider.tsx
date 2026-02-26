"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getUserClubs } from "@/lib/actions/clubs";
import type { ClubEntry } from "@/lib/validations/clubs";

type ClubContextType = {
  clubs: ClubEntry[];
  selectedClub: ClubEntry | null;
  setSelectedClub: (club: ClubEntry) => void;
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
      if (data.length > 0 && !selectedClub)
        setSelectedClub(data[0] as ClubEntry);
    });
  }, [pathname]);

  return (
    <ClubContext.Provider value={{ clubs, selectedClub, setSelectedClub }}>
      {children}
    </ClubContext.Provider>
  );
}
