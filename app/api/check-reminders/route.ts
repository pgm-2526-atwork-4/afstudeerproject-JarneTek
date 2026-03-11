import { reminderCheck } from "@/lib/actions/reminderCheck";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const isDev = process.env.NODE_ENV === "development";
    const authHeader = request.headers.get("authorization");

    if (!isDev && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await reminderCheck();
    return NextResponse.json({ message: "Reminder check uitgevoerd" });
}
