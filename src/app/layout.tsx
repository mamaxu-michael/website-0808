import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Climate Seal",
  description: "专注于环保技术和气候解决方案，为地球的可持续发展贡献力量",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BM7079RZZH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BM7079RZZH', {
              page_title: document.title,
              page_location: window.location.href,
            });
            
            // 简单的关键事件追踪
            document.addEventListener('DOMContentLoaded', function() {
              // 联系按钮点击追踪
              document.addEventListener('click', function(e) {
                const target = e.target.closest('a, button');
                if (!target) return;
                
                // 联系相关按钮
                if (target.getAttribute('href') === '#contact' || 
                    target.textContent.includes('Contact') || 
                    target.textContent.includes('联系') ||
                    target.textContent.includes('Get Started')) {
                  gtag('event', 'contact_click', {
                    event_category: 'conversion',
                    event_label: target.textContent.trim()
                  });
                }
              });
              
              // 表单提交追踪
              document.addEventListener('submit', function(e) {
                gtag('event', 'form_submit', {
                  event_category: 'conversion',
                  event_label: 'contact_form'
                });
              });
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
