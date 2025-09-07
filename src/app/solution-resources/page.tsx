"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
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

type Category = {
  id: string;
  name: string;
  nameZh: string;
};

export default function SolutionResources() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const articles: Article[] = articlesData.articles;
  const categories: Category[] = articlesData.categories;

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === selectedCategory));
    }
  }, [selectedCategory, articles]);

  const getArticleTitle = (article: Article) => {
    return language === 'zh' ? article.titleZh : article.title;
  };

  const getArticleExcerpt = (article: Article) => {
    return language === 'zh' ? article.excerptZh : article.excerpt;
  };

  const getCategoryName = (category: Category) => {
    return language === 'zh' ? category.nameZh : category.name;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'zh' 
      ? date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[rgb(0,52,50)]">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {language === 'zh' ? '解决方案资源中心' : 'Solution Resources'}
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {language === 'zh' 
              ? '探索最新的碳足迹解决方案、行业见解和最佳实践，帮助您的企业实现可持续发展目标。'
              : 'Explore the latest carbon footprint solutions, industry insights, and best practices to help your business achieve sustainability goals.'
            }
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#9ef894] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {language === 'zh' ? '全部' : 'All'}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#9ef894] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                {/* Article Cover */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  {article.coverImage && (
                    <Image
                      src={article.coverImage}
                      alt={getArticleTitle(article)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to gradient background if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      onLoad={(e) => {
                        // Show image if it loads successfully
                        (e.target as HTMLImageElement).style.display = 'block';
                      }}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#9ef894] text-black px-3 py-1 rounded-full text-sm font-medium">
                      {language === 'zh' ? article.categoryZh : article.category}
                    </span>
                  </div>
                  {/* Featured Badge */}
                  {article.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {language === 'zh' ? '推荐' : 'Featured'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-white/60 text-sm">
                      {formatDate(article.publishDate)}
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-3 line-clamp-2 group-hover:text-[#9ef894] transition-colors">
                    {getArticleTitle(article)}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-3 mb-4">
                    {getArticleExcerpt(article)}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/solution-resources/${article.id}`}
                      className="text-[#9ef894] font-medium hover:underline text-sm"
                    >
                      {language === 'zh' ? '阅读更多 →' : 'Read More →'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State - Placeholder Cards for Market Team */}
            {filteredArticles.length < 6 && (
              <>
                {Array.from({ length: 6 - filteredArticles.length }).map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 border-dashed"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center">
                      <div className="text-center text-white/40">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                        </svg>
                        <p className="text-sm">
                          {language === 'zh' ? '添加新文章' : 'Add New Article'}
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="text-white/40 text-sm">
                          {language === 'zh' ? '发布日期' : 'Publish Date'}
                        </span>
                      </div>
                      <h3 className="text-white/40 text-xl font-semibold mb-3">
                        {language === 'zh' ? '文章标题' : 'Article Title'}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed mb-4">
                        {language === 'zh' 
                          ? '文章摘要将显示在这里...'
                          : 'Article excerpt will be displayed here...'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Instructions for Market Team */}
          <div className="mt-16 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {language === 'zh' ? '📝 市场团队使用指南' : '📝 Marketing Team Guide'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
              <div>
                <h3 className="font-semibold mb-2">
                  {language === 'zh' ? '添加新文章：' : 'Adding New Articles:'}
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>1. {language === 'zh' ? '编辑 /src/data/articles.json 文件' : 'Edit /src/data/articles.json file'}</li>
                  <li>2. {language === 'zh' ? '在 articles 数组中添加新对象' : 'Add new object to articles array'}</li>
                  <li>3. {language === 'zh' ? '上传封面图到 /public/images/articles/' : 'Upload cover image to /public/images/articles/'}</li>
                  <li>4. {language === 'zh' ? '重新部署网站' : 'Redeploy website'}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {language === 'zh' ? '必需字段：' : 'Required Fields:'}
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• title & titleZh</li>
                  <li>• excerpt & excerptZh</li>
                  <li>• content & contentZh</li>
                  <li>• coverImage (path)</li>
                  <li>• publishDate (YYYY-MM-DD)</li>
                  <li>• category</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#9ef894] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#8ee884] transition-colors"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {language === 'zh' ? '返回首页' : 'Back to Home'}
          </Link>
        </div>
      </section>
    </div>
  );
}