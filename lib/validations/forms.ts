import {z} from "zod";

export const createFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    targetGroup: z.string().min(1, "Target group is required"),
});

export type CreateFormSchema = z.infer<typeof createFormSchema>;

export const addArticleToFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().nullish(),
    imageUrl: z.string().nullish(),
    sku: z.string().nullish(),
    defaultPrice: z.coerce.number().min(0, "Price must be 0 or higher"),
    sizes: z.string().min(1, "At least one size is required"),
    type: z.enum(["BASIC", "EXTRA"]).default("BASIC"),
    includedInBasicCount: z.coerce.number().min(0, "Count must be 0 or higher").default(1),
});

export type AddArticleToFormSchema = z.infer<typeof addArticleToFormSchema>;