"use server";

import { registerUser, loginUser } from "../auth";
import { loginSchema, registerSchema } from "../validations/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) {
        return { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors };
    }

    try {
        const {token} = await loginUser(parsed.data.email, parsed.data.password);
        cookies().set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        });

    } catch (error: unknown) {
        if (error instanceof Error && error.message === "User not found") {
            return { fieldErrors: { email: ["No account found with this email"] } };
        }
        return { fieldErrors: { password: ["Invalid password"] } }
    }

    redirect("/dashboard");
}

export async function register(formData: FormData) {
    const parsed = registerSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        clubName: formData.get("clubName"),
        iban:  formData.get("iban") || null,
    });
    if (!parsed.success) {
        return { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors };
    }
    const formattedIban = parsed.data.iban 
        ? parsed.data.iban.replace(/\s+/g, "").toUpperCase() 
        : null;

    try {
        const { token } = await registerUser(parsed.data.email, parsed.data.password, parsed.data.clubName, formattedIban);
        
        cookies().set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "User already exists") {
            return { fieldErrors: { email: ["An account with this email already exists"] } };
        }
        return { fieldErrors: { email: ["Registration failed. Please try again."] } };
    }

    redirect("/dashboard");
}