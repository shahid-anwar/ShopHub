import { create } from "zustand";
import { persist } from "zustand/middleware";

// types
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find((i) => i._id === product._id);

        if (existing) {
          // already in cart — just increment quantity
          set({
            items: get().items.map((i) =>
              i._id === product._id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i,
            ),
          });
        } else {
          // new item — add with quantity 1
          set({ items: [...get().items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i._id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      // derived values as functions — always computed fresh
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage", // key in localStorage — persists on refresh
    },
  ),
);
