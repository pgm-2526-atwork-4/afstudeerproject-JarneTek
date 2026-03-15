import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type FormWithItems = {
    items: {
        id: string;
        type: "BASIC" | "EXTRA";
        includedInBasicCount: number;
        customPrice: Prisma.Decimal | number | string | null;
        product: {
            defaultPrice: Prisma.Decimal | number | string;
        };
    }[];
};

type CartItem = {
    id: string;
    formItemId: string;
    quantity: number;
    type: string;
    price: number;
};

export function calculateCartTotal(cart: CartItem[], form: FormWithItems): number {
    let total = 0;

    const counts: Record<string, number> = {};
    cart.forEach((item) => {
        counts[item.formItemId] = (counts[item.formItemId] || 0) + item.quantity;
    });

    form.items.forEach((formItem) => {
        const quantityInCart = counts[formItem.id] || 0;
        const price = Number(formItem.customPrice ?? formItem.product.defaultPrice);

        if (formItem.type === "EXTRA") {
            total += quantityInCart * price;
        } else {
            const extraStuks = Math.max(0, quantityInCart - formItem.includedInBasicCount);
            total += extraStuks * price;
        }
    });

    return total;
}

export function createQrCode(clubName: string, iban: string, amount: Decimal, reference: string) {
    const ibanNoSpace = iban.replace(/\s/g, "");
    const formattedAmount = amount.toFixed(2);
       
    const epcData = [
    "BCD",                     
    "002",                    
    "1",                       
    "SCT",                    
    "",                        
    clubName,                 
    ibanNoSpace,               
    `EUR${formattedAmount}`,   
    "",                        
    reference                  
  ];

  return epcData.join("\n");
    
}