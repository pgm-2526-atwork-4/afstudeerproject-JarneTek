"use server";

import {prisma} from "../db";
import {getSession} from "../auth";
import {createFormSchema, addArticleToFormSchema} from "../validations/forms";
import {revalidatePath} from "next/cache";
import { defaultProductsData } from "../data/defaultProducts";

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
        targetGroups: formData.getAll("targetGroups"),
    });
    if (!validatedData.success) {
        return { error: validatedData.error.issues[0].message };
    }

    const form = await prisma.form.create({
        data: {
            name: validatedData.data.name,
            targetGroups: validatedData.data.targetGroups,
            clubId,
        },
    });
const createdProducts = [];

    for (const prodData of defaultProductsData){
        const newProducts = await prisma.product.create({
            data:{
                name: prodData.name,
                description: prodData.description,
                imageUrl: prodData.imageUrl,
                defaultPrice: prodData.defaultPrice,
                sku: prodData.sku,
                sizes: prodData.sizes,
                clubId: clubId
                
            }
        })
        createdProducts.push(newProducts)
    }
    const formItems = createdProducts.map((product)=>{
        return {
            type: "BASIC" as const,
            includedInBasicCount: 1,
            customPrice: product.defaultPrice,
            isRequired: true,
            formId: form.id,
            productId: product.id,
        }
    })

    await prisma.formItem.createMany({
        data: formItems
    })
    
        revalidatePath(`/dashboard/form-builder`);
    return form
}

export async function updateForm(formId: string, formData: FormData) {
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

    const validatedData = createFormSchema.safeParse({
        name: formData.get("name"),
        targetGroups: formData.getAll("targetGroups"),
    });
    if (!validatedData.success) {
        return { error: validatedData.error.issues[0].message };
    }

    const updatedForm = await prisma.form.update({
        where: { id: formId },
        data: {
            name: validatedData.data.name,
            targetGroups: validatedData.data.targetGroups,
        },
    });
    revalidatePath(`/dashboard/form-builder`);
    return updatedForm;
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
    if (!validated.data.imageUrl?.trim() && !validated.data.sku?.trim()) {
        return { error: "You must provide an image URL or a SKU for the product" };
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

    if (!validated.data.imageUrl?.trim() && !validated.data.sku?.trim()) {
        return { error: "You must provide an image URL or a SKU for the product" };
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

export async function deleteFormItem(formItemId: string) {
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

    const product = await prisma.product.findUnique({
        where: { id: formItem.productId },
    });
    if (!product) return null;

    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: formItem.form.clubId,
            },
        },
    });
    if (!clubUser) return null;

    await prisma.formItem.delete({
        where: { id: formItemId },
    });
    await prisma.product.delete({
        where: { id: formItem.productId },
    });
    revalidatePath(`/dashboard/form-builder/${formItem.formId}`);
    return true;
}

export async function getFormItemsForMember(memberId: string) {
    const session = await getSession();
    const userId = session?.id;
    if (!userId) return null;

    const member = await prisma.member.findUnique({
        where: { id: memberId },
    });
    if (!member) return null;

    const clubUser = await prisma.clubUser.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: member.clubId,
            },
        },
    });
    if (!clubUser) return null;

    const form = await prisma.form.findFirst({
        where: {
            clubId: member.clubId,
            targetGroups: {
                has: member.group,
            }, isActive: true
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    })
    return form;
}




