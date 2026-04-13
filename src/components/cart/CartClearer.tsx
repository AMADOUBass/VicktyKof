"use client";

import { useEffect } from "react";
import { useCartStore } from "@/hooks/useCartStore";

export function CartClearer() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    // We clear the cart when the user reaches the success page
    clearCart();
  }, [clearCart]);

  return null;
}
