import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我们',
  description: 'Climate Seal 团队与愿景：专注环保技术与气候合规的数字化解决方案。',
  alternates: { canonical: '/about' },
  openGraph: {
    title: '关于我们 | Climate Seal',
    description: 'Climate Seal 团队与愿景：专注环保技术与气候合规的数字化解决方案。',
    images: [{ url: '/about-logo.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '关于我们 | Climate Seal',
    description: 'Climate Seal 团队与愿景：专注环保技术与气候合规的数字化解决方案。',
    images: ['/about-logo.png']
  }
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          关于我们
        </h1>
        <div className="text-center text-gray-600">
          <p className="text-lg">关于我们页面正在建设中...</p>
        </div>
      </div>
    </div>
  );
}