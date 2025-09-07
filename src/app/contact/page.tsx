import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '联系我们',
  description: '获取产品演示与咨询，了解如何快速启动碳足迹与合规管理。',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: '联系我们 | Climate Seal',
    description: '获取产品演示与咨询，了解如何快速启动碳足迹与合规管理。',
    images: [{ url: '/new-contact-logo.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '联系我们 | Climate Seal',
    description: '获取产品演示与咨询，了解如何快速启动碳足迹与合规管理。',
    images: ['/new-contact-logo.png']
  }
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          联系我们
        </h1>
        <div className="text-center text-gray-600">
          <p className="text-lg">联系我们页面正在建设中...</p>
        </div>
      </div>
    </div>
  );
}