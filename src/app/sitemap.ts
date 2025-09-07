import type { MetadataRoute } from 'next';

/**
 * 生成 sitemap.xml（仅影响SEO抓取，不影响视觉）
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com';
  const now = new Date().toISOString();
  const urls = [
    '/',
    '/about',
    '/products',
    '/pricing',
    '/contact',
    '/solution-resources',
  ];
  return urls.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}


