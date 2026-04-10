"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Star, ChevronLeft, Minus, Plus, Crown, Tag, Package } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  displayPrice: number;
  isMemberDiscount: boolean;
  memberPrice: number | null;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isMemberOnly: boolean;
  category: { name: string; slug: string };
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-brand-gold text-brand-gold" : "text-brand-muted"}`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  function handleAddToCart() {
    if (product.stock === 0) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(product.displayPrice.toString()),
        image: product.images[0] ?? "",
        slug: product.slug,
      });
    }
    toast.success(`${product.name} ajouté au panier`);
  }

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
          <Link href="/shop" className="hover:text-brand-gold transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Boutique
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-gold transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-brand-beige truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-charcoal">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-4xl text-brand-gold opacity-30">VK</span>
                </div>
              )}
              {product.isMemberOnly && (
                <div className="absolute top-4 left-4 bg-brand-gold text-brand-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Membres
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center">
                  <span className="text-brand-beige font-semibold text-lg">Épuisé</span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? "border-brand-gold" : "border-brand-charcoal hover:border-brand-gold/50"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-brand-gold">
                  {product.category.name}
                </span>
                {product.isFeatured && (
                  <span className="text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded-full">
                    Coup de cœur
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-beige leading-tight">
                {product.name}
              </h1>
              {avgRating !== null && (
                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-sm text-brand-muted">
                    {avgRating.toFixed(1)} ({product.reviews.length} avis)
                  </span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-brand-gold">
                  {formatPrice(parseFloat(product.displayPrice.toString()))}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-brand-muted line-through">
                    {formatPrice(parseFloat(product.comparePrice.toString()))}
                  </span>
                )}
              </div>
              {product.isMemberDiscount && (
                <div className="flex items-center gap-1 text-sm text-brand-gold">
                  <Crown className="w-3.5 h-3.5" />
                  Prix membre appliqué — économisez{" "}
                  {formatPrice(
                    parseFloat(product.price.toString()) -
                      parseFloat(product.displayPrice.toString())
                  )}
                </div>
              )}
              {!product.isMemberDiscount && product.memberPrice && (
                <div className="flex items-center gap-1 text-sm text-brand-muted">
                  <Crown className="w-3.5 h-3.5 text-brand-gold" />
                  <span>
                    Prix membre :{" "}
                    <span className="text-brand-gold font-medium">
                      {formatPrice(parseFloat(product.memberPrice.toString()))}
                    </span>
                  </span>
                  <Link href="/contact" className="text-brand-gold underline ml-1">
                    Devenir membre
                  </Link>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-brand-muted" />
              {product.stock > 0 ? (
                <span className={product.stock <= 5 ? "text-yellow-400" : "text-green-400"}>
                  {product.stock <= 5
                    ? `Plus que ${product.stock} en stock`
                    : "En stock"}
                </span>
              ) : (
                <span className="text-red-400">Épuisé</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-brand-muted leading-relaxed">{product.description}</p>
            )}

            <div className="divider-gold" />

            {/* Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm text-brand-muted">Quantité</label>
                <div className="flex items-center gap-3 bg-brand-charcoal rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-brand-muted hover:text-brand-beige transition-colors"
                    disabled={qty <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-brand-beige font-medium w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="text-brand-muted hover:text-brand-beige transition-colors"
                    disabled={qty >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock === 0 ? "Épuisé" : "Ajouter au panier"}
              </button>

              <Link href="/shop/cart" className="btn-outline w-full flex items-center justify-center gap-2">
                Voir le panier
              </Link>
            </div>

            <div className="flex items-center gap-3 text-xs text-brand-muted border border-brand-charcoal rounded-xl p-3">
              <Tag className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Livraison gratuite au Canada pour toute commande de 75 $ et plus</span>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="section-title mb-8">
              Avis clients <span className="text-brand-gold">({product.reviews.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="card space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-sm shrink-0">
                      {review.user.image ? (
                        <Image src={review.user.image} alt="" width={36} height={36} className="rounded-full" />
                      ) : (
                        getInitials(review.user.name)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-beige">{review.user.name ?? "Cliente"}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  {review.body && <p className="text-sm text-brand-muted leading-relaxed">{review.body}</p>}
                  <p className="text-xs text-brand-muted">
                    {new Date(review.createdAt).toLocaleDateString("fr-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
