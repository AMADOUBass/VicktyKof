import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vicktykof.com'
  
  const routes = [
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
 
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
