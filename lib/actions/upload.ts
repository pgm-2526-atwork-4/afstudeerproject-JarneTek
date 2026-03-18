"use server";

import supabase from "@/lib/supabase";

export async function uploadImage(formData: FormData): Promise<string | null> {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return null;

    const fileName = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
        .from("FormItemImages")
        .upload(fileName, buffer, { contentType: file.type });

    if (error) {
        console.error("Upload error:", error);
        return null;
    }

    const { data } = supabase.storage
        .from("FormItemImages")
        .getPublicUrl(fileName);

    return data.publicUrl;
}
