"use server";

import {prisma} from "../db";
import {getSession} from "../auth";
import {createFormSchema, addArticleToFormSchema} from "../validations/forms";
import {revalidatePath} from "next/cache";

export async function getFormsByClubId(clubId: string) {
    const session = await getSession();
    const userId = session?.id;
    if (!userId) {
        return null;
    }
    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId,
            },
        },
    });
    if (!clubUser) {
        return null;
    }
    return prisma.form.findMany({
        where: {
            clubId,
        },
    });
}

export async function getFormById(formId: string) {
    const session = await getSession();
    const userId = session?.id;
    if (!userId) return null;

    const form = await prisma.form.findUnique({
        where: { id: formId },
    });
    if (!form) return null;

    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: form.clubId,
            },
        },
    });
    if (!clubUser) return null;

    return form;
}

export async function createForm(formData: FormData, clubId: string) {
    const session = await getSession();
    const userId = session?.id;
    if (!userId) {
        return null;
    }
    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId,
            },
        },
    });
    if (!clubUser) {
        return null;
    }
    const validatedData = createFormSchema.safeParse({
        name: formData.get("name"),
        targetGroup: formData.get("targetGroup"),
    });
    if (!validatedData.success) {
        return { error: validatedData.error.issues[0].message };
    }

    const form = await prisma.form.create({
        data: {
            name: validatedData.data.name,
            targetGroup: validatedData.data.targetGroup,
            clubId,
        },
    });
    revalidatePath(`/dashboard/form-builder`);
    return form;
}

export async function getFormWithItems(formId: string) {
    const session = await getSession();
    const userId = session?.id;
    if (!userId) return null;

    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!form) return null;

    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: form.clubId,
            },
        },
    });
    if (!clubUser) return null;

    return form;
}

export async function createProductForForm(formId: string, formData: FormData) {
    const session = await getSession();
    const userId = session?.id;
    if (!userId) return null;

    const form = await prisma.form.findUnique({
        where: { id: formId },
    });
    if (!form) return null;

    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: form.clubId,
            },
        },
    });
    if (!clubUser) return null;


    const validated = addArticleToFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        sku: formData.get("sku"),
        defaultPrice: formData.get("defaultPrice"),
        sizes: formData.get("sizes"),
        type: formData.get("type"),
        includedInBasicCount: formData.get("includedInBasicCount"),
    });
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    const product = await prisma.product.create({
        data: {
            name: validated.data.name,
            description: validated.data.description,
            imageUrl: validated.data.imageUrl,
            sku: validated.data.sku,
            defaultPrice: validated.data.defaultPrice,
            sizes: validated.data.sizes.split(",").map(s => s.trim()),
            clubId: form.clubId,
        },
    });

    const formItem = await prisma.formItem.create({
        data: {
            formId,
            productId: product.id,
            type: validated.data.type,
            includedInBasicCount: validated.data.type === "EXTRA" ? 0 : validated.data.includedInBasicCount,
        },
    });
    revalidatePath(`/dashboard/form-builder/${formId}`);
    return formItem;
}

export async function updateFormItem(formItemId: string, formData: FormData) {
    const session = await getSession();
    const userId = session?.id;
    if (!userId) return null;

    const formItem = await prisma.formItem.findUnique({
        where: { id: formItemId },
        include: {
            form: true,
        },
    });
    if (!formItem) return null;

    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: formItem.form.clubId,
            },
        },
    });
    if (!clubUser) return null;

    const validated = addArticleToFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        imageUrl: formData.get("imageUrl"),
        sku: formData.get("sku"),
        defaultPrice: formData.get("defaultPrice"),
        sizes: formData.get("sizes"),
        type: formData.get("type"),
        includedInBasicCount: formData.get("includedInBasicCount"),
    });
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

await prisma.product.update({
        where: { id: formItem.productId },
        data: {
            name: validated.data.name,
            description: validated.data.description,
            imageUrl: validated.data.imageUrl,
            sku: validated.data.sku,
            defaultPrice: validated.data.defaultPrice,
            sizes: validated.data.sizes.split(",").map(s => s.trim()),
        },
    });

    const updatedFormItem = await prisma.formItem.update({
        where: { id: formItemId },
        data: {
            type: validated.data.type,
            includedInBasicCount: validated.data.type === "EXTRA" ? 0 : validated.data.includedInBasicCount,
        },
    });
    revalidatePath(`/dashboard/form-builder/${formItem.formId}`);
    return updatedFormItem;
}