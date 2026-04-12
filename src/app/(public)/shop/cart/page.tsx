"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Tag, ChevronLeft, CreditCard, Mail } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "INTERAC">("CARD");

  async function handleCheckout() {
    if (!session) {
      router.push("/login?callbackUrl=/shop/cart");
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          paymentMethod,
        }),
      });

      const data = await res.json() as { url?: string; error?: string; success?: boolean; orderId?: string };

      if (!res.ok) {
        toast.error(data.error ?? "Une erreur est survenue");
        return;
      }

      clearCart();
      if (data.success || !data.url) {
        router.push(`/shop/cart/success?orderId=${data.orderId}`);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Impossible de créer la session de paiement");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 space-y-6"
          >
            <div className="w-20 h-20 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-brand-muted" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-brand-beige mb-2">Votre panier est vide</h1>
              <p className="text-brand-muted">Découvrez nos produits pour prendre soin de vos locs.</p>
            </div>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
              Voir la boutique
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
          <Link href="/shop" className="hover:text-brand-gold transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Boutique
          </Link>
          <span>/</span>
          <span className="text-brand-beige">Panier ({totalItems()} article{totalItems() > 1 ? "s" : ""})</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-brand-beige mb-8">Mon panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="card flex gap-4"
                >
                  {/* Image */}
                  <Link href={`/shop/${item.slug}`} className="shrink-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-charcoal">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-brand-gold opacity-30 text-sm">VK</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.slug}`} className="font-medium text-brand-beige hover:text-brand-gold transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-brand-gold font-semibold mt-1">{formatPrice(item.price)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-brand-black border border-brand-charcoal rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-brand-muted hover:text-brand-beige transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-brand-beige text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                          className="text-brand-muted hover:text-brand-beige transition-colors"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-brand-muted hover:text-red-400 transition-colors p-1"
                        aria-label="Retirer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.stock <= 5 && (
                      <p className="text-[10px] text-yellow-400 mt-2">
                        Seulement {item.stock} restants en stock
                      </p>
                    )}
                  </div>

                  {/* Line total */}
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-brand-beige">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="card space-y-4">
              <h2 className="font-display text-lg font-bold text-brand-beige">Résumé</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-brand-muted">
                  <span>Sous-total</span>
                  <span className="text-brand-beige">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-brand-beige"}>
                    {shipping === 0 ? "Gratuite" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="divider-gold" />
                <div className="flex justify-between font-semibold">
                  <span className="text-brand-beige">Total</span>
                  <span className="text-brand-gold font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="flex items-center gap-2 text-xs text-brand-muted bg-brand-gold/5 border border-brand-gold/10 rounded-lg p-3">
                  <Tag className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>
                    Ajoutez{" "}
                    <span className="text-brand-gold font-medium">{formatPrice(75 - subtotal)}</span>{" "}
                    de plus pour la livraison gratuite
                  </span>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-medium text-brand-muted uppercase tracking-wider">Mode de paiement</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod("CARD")}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center ${
                      paymentMethod === "CARD"
                        ? "border-brand-gold bg-brand-gold/10"
                        : "border-white/5 bg-brand-black/40 hover:border-brand-gold/20"
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === "CARD" ? "text-brand-gold" : "text-brand-muted"}`} />
                    <span className="text-xs font-medium text-brand-beige">Carte</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("INTERAC")}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center ${
                      paymentMethod === "INTERAC"
                        ? "border-brand-gold bg-brand-gold/10"
                        : "border-white/5 bg-brand-black/40 hover:border-brand-gold/20"
                    }`}
                  >
                    <Mail className={`w-5 h-5 ${paymentMethod === "INTERAC" ? "text-brand-gold" : "text-brand-muted"}`} />
                    <span className="text-xs font-medium text-brand-beige">Interac</span>
                  </button>
                </div>

                {paymentMethod === "INTERAC" && (
                  <div className="p-3 bg-brand-gold/5 border border-brand-gold/20 rounded-lg">
                    <p className="text-[10px] text-brand-muted leading-relaxed">
                      Envoyez le total à <strong className="text-brand-gold">VictyKof@yahoo.fr</strong>. Votre commande sera expédiée après réception.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
                    Redirection...
                  </span>
                ) : (
                  <>
                    Passer au paiement
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!session && (
                <p className="text-xs text-center text-brand-muted">
                  Vous devrez vous{" "}
                  <Link href="/login?callbackUrl=/shop/cart" className="text-brand-gold underline">
                    connecter
                  </Link>{" "}
                  pour finaliser votre commande
                </p>
              )}
            </div>

            <Link href="/shop" className="btn-outline w-full flex items-center justify-center gap-2 text-sm">
              <ChevronLeft className="w-4 h-4" />
              Continuer les achats
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
