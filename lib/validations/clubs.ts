import { z } from "zod";

export const createClubSchema = z.object({
    name: z.string().min(1, "Club name is required").max(100, "Club name is too long"),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
});

export type CreateClubSchema = z.infer<typeof createClubSchema>;

export type ClubEntry = {
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    userId: string;
    clubId: string;
    club: {
        id: string;
        name: string;
        slug: string;
        primaryColor: string;
        secondaryColor: string | null;
    };
};
