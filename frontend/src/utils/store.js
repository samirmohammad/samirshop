import { create } from 'zustand';

export const useStore = create((set) => ({
  // Cart
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((p) => p._id === product._id);
      if (existing) {
        return {
          cart: state.cart.map((p) =>
            p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((p) => p._id !== productId),
    })),
  clearCart: () => set({ cart: [] }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // Products
  products: [],
  setProducts: (products) => set({ products }),

  // Loading
  loading: false,
  setLoading: (loading) => set({ loading }),

  // Error
  error: null,
  setError: (error) => set({ error }),
}));