import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  setCart: (cart) => set({ cart: Array.isArray(cart) ? cart : [] }),
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ),
    })),
  decreaseQuantity: (id) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === id);

      if (existingItem && existingItem.quantity > 1) {
        return {
          cart: state.cart.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }

      return {
        cart: state.cart.filter((item) => item.id !== id),
      };
    }),
  increaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const state = get();
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  getCartCount: () => {
    const state = get();
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  },
}));