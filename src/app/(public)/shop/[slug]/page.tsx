import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductDetail } from "@/components/shop/ProductDetail";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    select: { name: true, description: true, images: true },
  });
  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.name} — VicktyKof`,
    description: product.description ?? undefined,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  const isMember = session?.user.isMember ?? false;

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      reviews: {
        where: { isPublic: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const serialized = {
    ...product,
    price: parseFloat(product.price.toString()),
    comparePrice: product.comparePrice ? parseFloat(product.comparePrice.toString()) : null,
    memberPrice: product.memberPrice ? parseFloat(product.memberPrice.toString()) : null,
    displayPrice: isMember && product.memberPrice
      ? parseFloat(product.memberPrice.toString())
      : parseFloat(product.price.toString()),
    isMemberDiscount: isMember && !!product.memberPrice,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    reviews: product.reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return <ProductDetail product={serialized} />;
}
