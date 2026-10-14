import { create } from "zustand";
import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";

interface CartStore {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    cartItems: [],

    addToCart: (product) => {
        set((state) => {
            const existingItem = state.cartItems.find(
                (item) => item.product.productId === product.productId
            );

            if (existingItem) {
                return {
                    cartItems: state.cartItems.map((item) =>
                        item.product.productId === product.productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            return {
                cartItems: [
                    ...state.cartItems,
                    { product: product, quantity: 1 },
                ],
            };
        });
    },

    increaseQuantity: (productId) => {
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.product.productId === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ),
        }));
    },

    decreaseQuantity: (productId) => {
        set((state) => ({
            cartItems: state.cartItems
                .map((item) =>
                    item.product.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0),
        }));
    },

    clearCart: () => {
        set({ cartItems: [] });
    },

    getTotal: () => {
        const cartItems = get().cartItems;
        return cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
    },
}));