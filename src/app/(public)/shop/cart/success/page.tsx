import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) notFound();

  const session = await auth();
  if (!session?.user.id) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const isInterac = order.paymentMethod === "INTERAC";

  const statusLabel: Record<string, string> = {
    PENDING: "En attente de paiement",
    PROCESSING: "Paiement confirmé — en préparation",
    SHIPPED: "Expédié",
    DELIVERED: "Livré",
    CANCELLED: "Annulé",
    REFUNDED: "Remboursé",
  };

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-beige">
              {isInterac ? "Commande enregistrée !" : "Commande confirmée !"}
            </h1>
            <p className="text-brand-muted mt-2">
              {isInterac 
                ? "Veuillez envoyer votre virement Interac pour finaliser votre commande."
                : "Merci pour votre achat. Vous recevrez un email de confirmation sous peu."
              }
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-brand-charcoal px-4 py-2 rounded-lg text-sm">
            <Package className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-muted">Commande</span>
            <span className="text-brand-beige font-mono font-medium">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
        </div>

        {/* Interac Instructions */}
        {isInterac && (
          <div className="card bg-brand-gold/5 border-brand-gold/30 text-left">
            <h3 className="flex items-center gap-2 text-brand-gold font-bold mb-4 uppercase tracking-widest text-xs">
              Instructions Virement Interac
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-brand-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-brand-muted uppercase">Montant total</span>
                <span className="text-brand-gold font-bold">{formatPrice(parseFloat(order.total.toString()))}</span>
              </div>
              <div className="flex justify-between items-center bg-brand-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs text-brand-muted uppercase">Virement par Courriel</span>
                <span className="text-brand-gold font-bold">vicktykoff@gmail.com</span>
              </div>
              <div className="p-3 bg-brand-gold/5 border border-brand-gold/10 rounded-lg text-xs text-brand-muted leading-relaxed">
                Le dépôt automatique est activé. Votre commande sera traitée dès réception du virement.
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">Statut</span>
            <span className="text-sm font-medium text-green-400">
              {statusLabel[order.status] ?? order.status}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-brand-muted">Date</span>
            <span className="text-sm text-brand-beige">
              {order.createdAt.toLocaleDateString("fr-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Order items */}
        <div className="card space-y-4">
          <h2 className="font-display text-lg font-bold text-brand-beige">Articles commandés</h2>
          <div className="space-y-3">
            {order.items.map((item) => {
              const img = item.product.images[0];
              return (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-charcoal shrink-0">
                    {img ? (
                      <Image
                        src={img}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized={img.endsWith(".svg")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-brand-gold opacity-30 text-xs">VK</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-beige line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-brand-muted">Qté : {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-beige shrink-0">
                    {formatPrice(parseFloat(item.total.toString()))}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="divider-gold" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>Sous-total</span>
              <span className="text-brand-beige">{formatPrice(parseFloat(order.subtotal.toString()))}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>Livraison</span>
              <span className={parseFloat(order.shipping.toString()) === 0 ? "text-green-400" : "text-brand-beige"}>
                {parseFloat(order.shipping.toString()) === 0
                  ? "Gratuite"
                  : formatPrice(parseFloat(order.shipping.toString()))}
              </span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>Taxes (TPS+TVQ)</span>
              <span className="text-brand-beige">{formatPrice(parseFloat(order.tax.toString()))}</span>
            </div>
            <div className="divider-gold" />
            <div className="flex justify-between font-semibold">
              <span className="text-brand-beige">Total payé</span>
              <span className="text-brand-gold font-bold text-base">
                {formatPrice(parseFloat(order.total.toString()))}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account"
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            Mon compte
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="btn-outline flex items-center justify-center gap-2 flex-1"
          >
            <ShoppingBag className="w-4 h-4" />
            Continuer les achats
          </Link>
        </div>

      </div>
    </div>
  );
}
