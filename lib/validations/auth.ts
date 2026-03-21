import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    clubName: z.string().min(1, "Club name is required"),
    iban: z.string().min(15, "IBAN must be valid").max(34, "IBAN is too long").regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/i, "Invalid IBAN format").or(z.literal("")).nullable().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
