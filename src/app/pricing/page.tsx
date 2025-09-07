import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '价格方案',
  description: '灵活透明的订阅与企业方案，满足不同阶段的碳管理需求。',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: '价格方案 | Climate Seal',
    description: '灵活透明的订阅与企业方案，满足不同阶段的碳管理需求。',
    images: [{ url: '/goal-manager.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '价格方案 | Climate Seal',
    description: '灵活透明的订阅与企业方案，满足不同阶段的碳管理需求。',
    images: ['/goal-manager.png']
  }
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          价格方案
        </h1>
        <div className="text-center text-gray-600">
          <p className="text-lg">价格页面正在建设中...</p>
        </div>
      </div>
    </div>
  );
}