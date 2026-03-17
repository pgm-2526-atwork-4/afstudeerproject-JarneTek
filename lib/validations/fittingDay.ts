import { z } from "zod";

export const startFittingDaySchema = z.object({
    date: z.string().min(1, "Date is required"),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    location: z.string().min(1, "Location is required"),
}).refine((data) => {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}, {
    message: "Date cannot be in the past",
    path: ["date"],
}).refine((data) => {
    return data.endTime > data.startTime;
}, {
    message: "End time must be after start time",
    path: ["endTime"],
});

export type StartFittingDaySchema = z.infer<typeof startFittingDaySchema>;
