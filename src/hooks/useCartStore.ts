import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, max?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, max?: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

  addItem: (item, max) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        if (max !== undefined && newQty > max) {
          toast.error("Limite de stock atteinte");
          return state;
        }
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: newQty, stock: max ?? i.stock } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1, stock: max ?? 999 }] };
    });
  },

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity, max) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    if (max !== undefined && quantity > max) {
      toast.error(`Seulement ${max} en stock`);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  setItems: (items: CartItem[]) => set({ items }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { 
      name: "vicktykof-cart",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
