import type { MetadataRoute } from 'next';
import articlesData from '@/data/articles.json';

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
  const staticEntries = urls.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const articles: any[] = (articlesData as any).articles || [];
  const articleEntries = articles.map((a) => ({
    url: `${base}/solution-resources/${a.id}`,
    lastModified: new Date(a.publishDate).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}


