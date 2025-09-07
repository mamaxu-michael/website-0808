import type { Metadata } from 'next';
import articlesData from '@/data/articles.json';

interface ArticleItem {
  id: string;
  title?: string;
  titleZh?: string;
  excerpt?: string;
  excerptZh?: string;
  coverImage?: string;
}

type Props = {
  children: React.ReactNode;
  params: { id: string };
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = (articlesData as { articles: ArticleItem[] }).articles.find((a) => a.id === params.id);
  const title = article ? (article.titleZh || article.title) : '文章详情';
  const description = article ? (article.excerptZh || article.excerpt) : '文章内容与行业洞察';
  const cover = article?.coverImage || '/logo.jpg';
  return {
    title,
    description,
    alternates: { canonical: `/solution-resources/${params.id}` },
    openGraph: {
      title,
      description,
      images: [{ url: cover, width: 1200, height: 630 }],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [cover]
    }
  };
}

export default function ArticleLayout({ children }: Props) {
  return children;
}


