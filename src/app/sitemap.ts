import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vicktykof.beauty'
  
  // Static routes
  const staticRoutes = [
    '',
    '/services',
    '/gallery',
    '/team',
    '/shop',
    '/faq',
    '/contact',
    '/booking',
    '/privacy',
    '/refunds',
    '/returns',
    '/terms',
  ]
 
  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  })) as MetadataRoute.Sitemap

  // Dynamic products
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const productSitemap = products.map((p) => ({
    url: `${baseUrl}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  })) as MetadataRoute.Sitemap

  return [...staticSitemap, ...productSitemap]
}
