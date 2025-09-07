"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import articlesData from '@/data/articles.json';

type Article = {
  id: string;
  title: string;
  titleZh: string;
  coverImage: string;
  excerpt: string;
  excerptZh: string;
  content: string;
  contentZh: string;
  publishDate: string;
  category: string;
  categoryZh: string;
  featured: boolean;
};

export default function ArticleDetail() {
  const { language } = useLanguage();
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  const articles: Article[] = articlesData.articles;

  useEffect(() => {
    const foundArticle = articles.find(a => a.id === params.id);
    setArticle(foundArticle || null);

    if (foundArticle) {
      // Get related articles from the same category
      const related = articles
        .filter(a => a.id !== foundArticle.id && a.category === foundArticle.category)
        .slice(0, 3);
      setRelatedArticles(related);
    }
  }, [params.id, articles]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[rgb(0,52,50)] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'zh' ? '文章未找到' : 'Article Not Found'}
          </h1>
          <Link href="/solution-resources" className="text-[#9ef894] hover:underline">
            {language === 'zh' ? '← 返回资源中心' : '← Back to Resources'}
          </Link>
        </div>
      </div>
    );
  }

  const getArticleTitle = (article: Article) => {
    return language === 'zh' ? article.titleZh : article.title;
  };

  const getArticleContent = (article: Article) => {
    return language === 'zh' ? article.contentZh : article.content;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'zh' 
      ? date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[rgb(0,52,50)]">
      {/* JSON-LD: Breadcrumb（仅元信息，不渲染 UI）*/}
      <Script id="jsonld-breadcrumb-article" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: language === 'zh' ? '首页' : 'Home', item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com'}/` },
            { "@type": "ListItem", position: 2, name: language === 'zh' ? '解决方案资源中心' : 'Solution Resources', item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com'}/solution-resources` },
            { "@type": "ListItem", position: 3, name: getArticleTitle(article), item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com'}/solution-resources/${article.id}` }
          ]
        })}
      </Script>
      {/* Article Header */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/solution-resources" 
              className="text-[#9ef894] hover:underline text-sm"
            >
              {language === 'zh' ? '← 返回资源中心' : '← Back to Resources'}
            </Link>
          </nav>

          {/* Article Meta */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <span className="bg-[#9ef894] text-black px-3 py-1 rounded-full text-sm font-medium">
                {language === 'zh' ? article.categoryZh : article.category}
              </span>
              <span className="text-white/60 text-sm">
                {formatDate(article.publishDate)}
              </span>
              {article.featured && (
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                  {language === 'zh' ? '推荐' : 'Featured'}
                </span>
              )}
            </div>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {getArticleTitle(article)}
          </h1>

          {/* Article Cover */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={getArticleTitle(article)}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-white/60">
                  {language === 'zh' ? '封面图片' : 'Cover Image'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-white/90 leading-relaxed whitespace-pre-line">
                {getArticleContent(article)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {language === 'zh' ? '相关文章' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/solution-resources/${relatedArticle.id}`}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    {relatedArticle.coverImage && (
                      <Image
                        src={relatedArticle.coverImage}
                        alt={getArticleTitle(relatedArticle)}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[#9ef894] transition-colors">
                      {getArticleTitle(relatedArticle)}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {formatDate(relatedArticle.publishDate)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}