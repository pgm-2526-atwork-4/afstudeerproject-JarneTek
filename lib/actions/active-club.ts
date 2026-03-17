"use server";

import { cookies } from "next/headers";

export async function setActiveClubCookie(clubId: string) {
    const cookieStore = await cookies();
    cookieStore.set("activeClub", clubId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
    return { success: true };
}

export async function getActiveClubCookie() {
    const cookieStore = await cookies();
    return cookieStore.get("activeClub")?.value || null;
}