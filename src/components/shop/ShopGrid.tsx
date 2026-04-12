"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Crown } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/hooks/useCartStore";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: string;
  comparePrice: string | null;
  displayPrice: string;
  stock: number;
  isMemberOnly: boolean;
  isMemberDiscount: boolean;
  category: { name: string; slug: string };
}

export function ShopGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading } = useQuery<{ products: Product[]; total: number }>({
    queryKey: ["products", category],
    queryFn: () =>
      fetch(`/api/products${category ? `?category=${category}` : ""}`).then((r) => r.json()),
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.displayPrice),
      image: product.images[0] ?? "",
      slug: product.slug,
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl bg-brand-charcoal animate-pulse">
            <div className="aspect-square" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-white/5 rounded" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {data?.products.map((product) => (
        <div key={product.id} className="card-hover group">
          {/* Image */}
          <Link href={`/shop/${product.slug}`}>
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-brand-black">
              {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    quality={100}
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-brand-gold/20 font-display text-lg italic">VicktyKof</span>
                </div>
              )}
              {product.isMemberOnly && (
                <div className="absolute top-2 left-2 bg-brand-gold/90 text-brand-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Membres
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center">
                  <span className="text-brand-beige font-semibold text-sm">Épuisé</span>
                </div>
              )}
            </div>
          </Link>

          <p className="text-xs text-brand-muted mb-1 truncate">{product.category.name}</p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-semibold text-brand-beige hover:text-brand-gold transition-colors text-sm sm:text-base line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
            <div className="min-w-0">
              <p className={`font-semibold text-sm sm:text-base ${product.isMemberDiscount ? "text-brand-gold" : "text-brand-beige"}`}>
                {formatPrice(parseFloat(product.displayPrice))}
              </p>
              {(product.comparePrice && !product.isMemberDiscount) && (
                <p className="text-xs text-brand-muted line-through">
                  {formatPrice(parseFloat(product.comparePrice))}
                </p>
              )}
              {product.isMemberDiscount && (
                <p className="text-xs text-brand-muted line-through">
                  {formatPrice(parseFloat(product.price))}
                </p>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-lg flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
