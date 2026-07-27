import { useEffect, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useCartStore } from "../store/useAddtoCart";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? "http://localhost:3000" : "");
const CART_API = `${BASE_URL}/api/cart`;

function CartSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const saveTimerRef = useRef(null);
  const lastSyncedSignatureRef = useRef("");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      lastSyncedSignatureRef.current = "";
      clearCart();
      return;
    }

    let isCancelled = false;

    const hydrateCart = async () => {
      try {
        const response = await axios.get(`${CART_API}/${user.id}`);
        if (isCancelled) {
          return;
        }

        const remoteItems = response.data?.data?.items;
        const cartItems = Array.isArray(remoteItems) ? remoteItems : [];

        lastSyncedSignatureRef.current = JSON.stringify(cartItems);
        setCart(cartItems);
      } catch (error) {
        console.error("Error loading saved cart", error);
        if (!isCancelled) {
          lastSyncedSignatureRef.current = "";
          setCart([]);
        }
      }
    };

    hydrateCart();

    return () => {
      isCancelled = true;
    };
  }, [clearCart, isLoaded, isSignedIn, setCart, user]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const signature = JSON.stringify(cart);

    if (signature === lastSyncedSignatureRef.current) {
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      try {
        const response = await axios.put(CART_API, {
          clerkUserId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          items: cart,
        });

        const savedItems = Array.isArray(response.data?.data?.items)
          ? response.data.data.items
          : cart;

        lastSyncedSignatureRef.current = JSON.stringify(savedItems);
      } catch (error) {
        console.error("Error saving cart", error);
      }
    }, 400);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [cart, isLoaded, isSignedIn, user]);

  return null;
}

export default CartSync;