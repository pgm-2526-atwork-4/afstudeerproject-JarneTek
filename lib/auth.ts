import { prisma } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function registerUser(email: string, password: string, clubName: string, iban: string | null) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
        data: { email, password: hashedPassword },
    });

    const club = await prisma.club.create({
        data: {
            name: clubName,
            slug: clubName.toLowerCase().replace(/\s+/g, "-"),
            iban: iban,
        },
    });

    await prisma.clubUser.create({
        data: {
            userId: user.id,
            clubId: club.id,
            role: "OWNER",
        },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return { user, token, clubId: club.id };
}

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return { user, token };
}

export async function getSession() {
    const token = cookies().get("token")?.value;
    if (!token) return null;

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: string };
        return payload; 
    } catch {
        return null;
    }
}