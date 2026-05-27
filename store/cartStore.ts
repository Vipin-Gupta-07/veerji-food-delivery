'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
  selectedOptions?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getSubtotal: () => number;
  getItemCount: () => number;
  getItemQuantity: (id: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { quantity = 1, ...rest } = item;
        set((state) => {
          const existing = state.items.find((i) => i.id === rest.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === rest.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...rest, quantity }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getItemQuantity: (id: string) => {
        const item = get().items.find((i) => i.id === id);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'veerji-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
