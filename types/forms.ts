import type { Form, FormItem, Product } from "@prisma/client";

export type FormItemWithProduct = Omit<FormItem, "customPrice"> & {
  customPrice: number | null;
  product: Product;
};

export type FormWithItems = Form & {
  items: FormItemWithProduct[];
};
