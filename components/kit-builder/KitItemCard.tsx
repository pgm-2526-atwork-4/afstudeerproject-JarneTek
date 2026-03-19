import { getMemberFormItemsFromToken } from "@/lib/actions/members";
import { useState } from "react";

type FormWithItems = Awaited<ReturnType<typeof getMemberFormItemsFromToken>>;
type KitItem = NonNullable<FormWithItems>["items"][number];
type CartItem = {
  id: string;
  formItemId: string;
  productName: string;
  type: string;
  price: number;
  size: string;
  quantity: number;
};

export default function   KitItemCard({ item, onAdd }: { item: KitItem, onAdd: (item: CartItem) => void }) {
  const [selectedSize, setSelectedSize] = useState(item.product.sizes[0] || "");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const itemPrice = Number(item.customPrice ?? item.product.defaultPrice) || 0;

  const handleAddToCart = () => {
    onAdd({
      id: item.product.id,
      formItemId: item.id,
      productName: item.product.name,
      type: item.type,
      price: itemPrice,
      size: selectedSize,
      quantity: selectedQuantity,
    });
    setSelectedSize(item.product.sizes[0] || "");
    setSelectedQuantity(1);
  };

  return (
    <div>
      <p>{item.product.name}</p>
      <p>{item.product.description}</p>
      <p>{item.product.sku}</p>
      <p>€{itemPrice}</p>
      <select required onChange={(e) => setSelectedSize(e.target.value)}>
        {item.product.sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        defaultValue={1}
        required
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
      />
<button type="button" onClick={handleAddToCart}>
  Voeg toe aan overzicht
</button>

    </div>
  
  );
}
