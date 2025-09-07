import React from 'react';
import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '产品与解决方案',
  description: '产品碳足迹、供应链碳管理、气候合规与报告工具。',
  alternates: { canonical: '/products' },
  openGraph: {
    title: '产品与解决方案 | Climate Seal',
    description: '产品碳足迹、供应链碳管理、气候合规与报告工具。',
    images: [{ url: '/pcf-modeler.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: '产品与解决方案 | Climate Seal',
    description: '产品碳足迹、供应链碳管理、气候合规与报告工具。',
    images: ['/pcf-modeler.png']
  }
};

export default function Products() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD: Breadcrumb（仅元信息，不渲染 UI） */}
      <Script id="jsonld-breadcrumb-products" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: '首页', item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com'}/` },
            { "@type": "ListItem", position: 2, name: '产品与解决方案', item: `${process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com'}/products` }
          ]
        })}
      </Script>
      {/* JSON-LD: SoftwareApplication（仅元信息，不渲染 UI） */}
      <Script id="jsonld-software" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Climate Seal Platform",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: 0,
            priceCurrency: "USD",
            url: (process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com') + '/pricing'
          },
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://climate-seal.com',
          description: '产品碳足迹、供应链碳管理、气候合规与报告工具'
        })}
      </Script>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          我们的产品
        </h1>
        <div className="text-center text-gray-600">
          <p className="text-lg">产品页面正在建设中...</p>
        </div>
      </div>
    </div>
  );
}