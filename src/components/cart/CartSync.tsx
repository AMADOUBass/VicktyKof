"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/hooks/useCartStore";

export function CartSync() {
  const { data: session, status } = useSession();
  const { items, setItems } = useCartStore();
  const isInitialMount = useRef(true);
  const lastSyncedItems = useRef(JSON.stringify(items));

  // 1. Fetch from DB on mount/login
  useEffect(() => {
    if (status === "authenticated" && isInitialMount.current) {
      const fetchCart = async () => {
        try {
          const res = await fetch("/api/cart/sync");
          if (res.ok) {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
              const localItems = [...items];
              const serverItems = data.items;
              
              // Merge Logic: Start with server items, then add local items that aren't in server or update qty
              let merged = [...serverItems];
              
              localItems.forEach(localItem => {
                const existingIndex = merged.findIndex(i => i.id === localItem.id);
                if (existingIndex > -1) {
                  // If exists in both, sum quantity but cap at stock
                  const maxStock = merged[existingIndex].stock || 999;
                  merged[existingIndex].quantity = Math.min(
                    merged[existingIndex].quantity + localItem.quantity, 
                    maxStock
                  );
                } else {
                  // If only in local, add to merged
                  merged.push(localItem);
                }
              });

              setItems(merged);
              lastSyncedItems.current = JSON.stringify(merged);
            }
          }
        } catch (error) {
          console.error("Failed to fetch cart from DB", error);
        } finally {
          isInitialMount.current = false;
        }
      };
      fetchCart();
    } else {
      isInitialMount.current = false;
    }
  }, [status, setItems]);

  // 2. Sync to DB on changes
  useEffect(() => {
    if (status !== "authenticated" || isInitialMount.current) return;

    const currentItemsStr = JSON.stringify(items);
    if (currentItemsStr === lastSyncedItems.current) return;

    const syncTimeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/cart/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (res.ok) {
          lastSyncedItems.current = currentItemsStr;
        }
      } catch (error) {
        console.error("Failed to sync cart to DB", error);
      }
    }, 1000); // Debounce sync

    return () => clearTimeout(syncTimeout);
  }, [items, status]);

  return null;
}
