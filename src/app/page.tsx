'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必需字段
    if (!formData.name || !formData.email || !formData.phone || !formData.company || !formData.message) {
      setSubmitMessage(t.contact.messages.validation);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage(t.contact.messages.success);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
      } else {
        setSubmitMessage(t.contact.messages.error);
      }
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      setSubmitMessage(t.contact.messages.error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <style jsx global>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .top-55 {
          top: 13.75rem; /* 55 * 0.25rem = 13.75rem = 220px */
        }
        
        .text-cyan-custom {
          color: #c2f5f7 !important;
        }
      `}</style>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="min-h-screen bg-[rgb(0,52,50)] relative overflow-hidden">
        {/* Background overlay - removed for unified color */}
        
        <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left text-white px-4 lg:px-16 order-2 lg:order-1 -mt-4 lg:mt-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4">
              {t.hero.title}
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              {t.hero.subtitle}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 font-light opacity-90">
              {t.hero.description}
            </p>
            <a 
              href="#contact"
              className="bg-yellow-400 hover:bg-yellow-500 text-[rgb(0,52,50)] px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition duration-300 inline-block"
            >
              {t.hero.getStarted}
            </a>
          </div>
          
          {/* Polar Bears Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-full lg:min-h-screen order-1 lg:order-2">
            <Image
              src="/polar-bears.png"
              alt="Polar Bears Swimming"
              fill
              className="object-contain object-center filter drop-shadow-lg"
              priority
              quality={100}
              unoptimized={true}
              style={{
                imageRendering: 'crisp-edges',
                filter: 'contrast(1.0) brightness(1.0) saturate(1.0) hue-rotate(0deg)'
              }}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70">
          <div className="animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Products Section - Stacked Cards */}
      <section id="products" className="relative bg-[rgb(0,52,50)]">
        {/* Scrolling Text Section */}
        <div className="relative overflow-hidden py-16 bg-[rgb(0,52,50)]">
          <div className="whitespace-nowrap">
            {/* First Row - Moving Right */}
            <div className="flex animate-scroll-right text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-cyan-custom opacity-80 mb-4">
              <span className="mx-4 sm:mx-6 md:mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Gain Credibility At Low Cost</span>
            </div>
            {/* Second Row - Moving Left */}
            <div className="flex animate-scroll-left text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-[#9ef894] opacity-80">
              <span className="mx-4 sm:mx-6 md:mx-8">Use Credit At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Use Credit At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Use Credit At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Use Credit At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Use Credit At Low Cost</span>
              <span className="mx-4 sm:mx-6 md:mx-8">Use Credit At Low Cost</span>
            </div>
          </div>
          
          {/* Separator Line */}
          <div className="mt-12 mx-auto w-4/5 h-px bg-white opacity-30"></div>
        </div>

        {/* Fixed Header - What We Do */}
        <div className="sticky top-2 z-50 px-4 sm:pl-8 md:pl-16 lg:pl-28 pb-1 sm:pb-2 lg:pb-4">
          <div className="bg-[rgb(0,52,50)] bg-opacity-90 p-2 sm:p-4 lg:p-6 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-1 sm:mb-2 lg:mb-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-0 sm:mr-6">What We Do</h2>
              <svg className="w-8 h-4 sm:w-10 h-5 md:w-12 h-6 text-yellow-400" viewBox="0 0 100 50" fill="currentColor">
                <path d="M10,25 Q50,5 90,25" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M80,20 L90,25 L80,30" fill="currentColor"/>
              </svg>
            </div>
            <p className="text-xs sm:text-base lg:text-lg text-white opacity-90 max-w-lg">
              Get a credible carbon footprint at 1% of the cost and time
            </p>
          </div>
        </div>

        {/* Stacked Product Cards */}
        <div className="relative container mx-auto px-4 -mt-4 sm:mt-0">
          {/* Card 1 - Blue */}
          <div className="sticky top-28 sm:top-55 z-10 mb-16">
            <div className="bg-gradient-to-r from-[#6195fe] to-[#6195fe] rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl min-h-[420px] lg:min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1 w-full">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover h-[200px] lg:h-[430px]"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                    >
                      <source src="/videos/video1.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-white text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-30 rounded-full mb-2 sm:mb-3 lg:mb-6">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">01</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">{t.features.card1.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-95">
                    {t.features.card1.description}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base opacity-90">
                    {t.features.card1.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Green */}
          <div className="sticky top-28 sm:top-55 z-20 mb-16">
            <div className="bg-gradient-to-r from-[#9ef894] to-[#9ef894] rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl min-h-[420px] lg:min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1 w-full">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover h-[200px] lg:h-[430px]"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                    >
                      <source src="/videos/video2.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-black text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-30 rounded-full mb-2 sm:mb-3 lg:mb-6">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">02</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">{t.features.card2.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-95">
                    {t.features.card2.description}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base opacity-90">
                    {t.features.card2.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Purple/Lavender */}
          <div className="sticky top-28 sm:top-55 z-30 mb-16">
            <div className="bg-gradient-to-r from-[#98a2f8] to-[#98a2f8] rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl min-h-[420px] lg:min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1 w-full">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover h-[200px] lg:h-[430px]"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                    >
                      <source src="/videos/video3.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-white text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-30 rounded-full mb-2 sm:mb-3 lg:mb-6">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">03</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">{t.features.card3.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-95">
                    {t.features.card3.description}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base opacity-90">
                    {t.features.card3.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Peach/Salmon */}
          <div className="sticky top-28 sm:top-55 z-40 mb-16">
            <div className="bg-gradient-to-r from-[#ffe0d0] to-[#ffe0d0] rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl min-h-[420px] lg:min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1 w-full">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover h-[200px] lg:h-[430px]"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                    >
                      <source src="/videos/video4.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-gray-800 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-50 rounded-full mb-2 sm:mb-3 lg:mb-6">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">04</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">{t.features.card4.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-90">
                    {t.features.card4.description}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base opacity-80">
                    {t.features.card4.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 - Light Teal/Cyan */}
          <div className="sticky top-28 sm:top-55 z-50 mb-16">
            <div className="bg-gradient-to-r from-[#c2f5f7] to-[#c2f5f7] rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1 w-full">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover h-[200px] lg:h-[430px]"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                    >
                      <source src="/videos/video5.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-gray-800 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-50 rounded-full mb-2 sm:mb-3 lg:mb-6">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">05</span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">{t.features.card5.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-90">
                    {t.features.card5.description}
                  </p>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base opacity-80">
                    {t.features.card5.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </section>

      {/* Section Divider */}
      <div className="bg-[rgb(0,52,50)] py-8">
        <div className="flex justify-center">
          <svg width="300" height="12" viewBox="0 0 300 12" className="text-[#9ef894]">
            <path 
              d="M3 8 Q75 2 150 6 Q225 10 297 4" 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M8 10 Q82 4 157 8 Q232 12 292 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Comparison Section */}
      <section className="py-4 sm:py-8 lg:py-20 bg-[rgb(0,52,50)]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-3 sm:mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-4 lg:mb-6">Compare With Traditional Way</h2>
          </div>

          {/* Mobile Layout - Complete Steps Display */}
          <div className="block sm:hidden space-y-2">
            {/* Climate Seal AI - 4 Steps */}
            <div className="bg-[#9ef894] rounded-xl p-3 shadow-xl">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center space-y-1 w-16">
                    <div className="bg-white p-1.5 rounded-lg">
                      <span className="text-sm font-bold text-[rgb(0,52,50)]">🤖</span>
                    </div>
                    <span className="text-xs font-bold text-[rgb(0,52,50)]">AI Agent</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[rgb(0,52,50)]">4 STEPS</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  <div className="bg-white bg-opacity-80 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs font-semibold text-[rgb(0,52,50)]">① Minimal Data</span>
                  </div>
                  <span className="text-[rgb(0,52,50)] self-center text-xs">→</span>
                  <div className="bg-white bg-opacity-80 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs font-semibold text-[rgb(0,52,50)]">② Confirm</span>
                  </div>
                  <span className="text-[rgb(0,52,50)] self-center text-xs">→</span>
                  <div className="bg-white bg-opacity-80 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs font-semibold text-[rgb(0,52,50)]">③ Send to Verifier</span>
                  </div>
                  <span className="text-[rgb(0,52,50)] self-center text-xs">→</span>
                  <div className="bg-white bg-opacity-80 px-1.5 py-0.5 rounded-full">
                    <span className="text-xs font-semibold text-[rgb(0,52,50)]">④ Certification</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Expert + Software - 11 Steps */}
            <div className="bg-[#c2f5f7] rounded-xl p-2.5 shadow-xl">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center space-y-0.5 w-16">
                    <div className="flex items-center space-x-0.5">
                      <div className="bg-white p-1 rounded-lg">
                        <span className="text-xs font-bold text-[rgb(0,52,50)]">👨‍💼</span>
                      </div>
                      <span className="text-xs text-[rgb(0,52,50)]">+</span>
                      <div className="bg-white p-1 rounded-lg">
                        <span className="text-xs font-bold text-[rgb(0,52,50)]">💻</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[rgb(0,52,50)] text-center">Expert + Software</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[rgb(0,52,50)]">11 STEPS</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {[
                    "① Training", "② Doc + Reg Map", "③ Data Checklist", "④ Data Clean",
                    "⑤ Gap Fill", "⑥ Build Model", "⑦ Factor Match", "⑧ Submit",
                    "⑨ Issue List", "⑩ Corrections", "⑪ Certification"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-white bg-opacity-80 px-1 py-0.5 rounded-full">
                        <span className="text-xs font-medium text-[rgb(0,52,50)]">{step}</span>
                      </div>
                      {index < 10 && <span className="text-[rgb(0,52,50)] mx-0.5 text-xs">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carbon Consultant - 12 Steps */}
            <div className="bg-[#98a2f8] rounded-xl p-2.5 shadow-xl">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center space-y-0.5 w-16">
                    <div className="bg-white p-1 rounded-lg">
                      <span className="text-xs font-bold text-[rgb(0,52,50)]">👨‍💼</span>
                    </div>
                    <span className="text-xs font-bold text-[rgb(0,52,50)]">Expert</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[rgb(0,52,50)]">12 STEPS</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {[
                    "① Kick-Off", "② Info Search", "③ Data Prep", "④ Clean + Interview",
                    "⑤ Calc Model", "⑥ Factor Calc", "⑦ Draft Report", "⑧ Review",
                    "⑨ Submit to Verifier", "⑩ Issue Feedback", "⑪ Info Correction", "⑫ Certification"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-white bg-opacity-80 px-1 py-0.5 rounded-full">
                        <span className="text-xs font-medium text-[rgb(0,52,50)]">{step}</span>
                      </div>
                      {index < 11 && <span className="text-[rgb(0,52,50)] mx-0.5 text-xs">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Perfect Alignment */}
          <div className="hidden sm:block space-y-3 sm:space-y-4 lg:space-y-8">
            {/* Climate Seal AI - 4 Steps */}
            <div className="bg-[#9ef894] rounded-2xl sm:rounded-3xl p-2 sm:p-4 lg:p-8 shadow-2xl min-h-[80px] sm:min-h-[120px] lg:min-h-[200px] flex items-center">
              <div className="grid items-center w-full gap-2 sm:gap-4 lg:gap-6" style={{gridTemplateColumns: '280px 100px 1fr'}}>
                <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 lg:space-y-4 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <div className="bg-white p-1 sm:p-2 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                    <div className="text-sm sm:text-lg lg:text-2xl font-bold text-[rgb(0,52,50)]">🤖</div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-[rgb(0,52,50)] text-center leading-tight">AI Agent</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <p className="text-sm sm:text-xl lg:text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight">4<br/>STEPS</p>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-1 lg:gap-2 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <div className="flex flex-wrap items-center gap-1 lg:gap-2">
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">① Minimal Data</span>
                    </div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-6 lg:h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs">→</span>
                    </div>
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse delay-300">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">② Confirm</span>
                    </div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-6 lg:h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce delay-300">
                      <span className="text-white text-xs">→</span>
                    </div>
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse delay-500">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">③ Send to Verifier</span>
                    </div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-6 lg:h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce delay-500">
                      <span className="text-white text-xs">→</span>
                    </div>
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse delay-700">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">④ Certification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Expert + Software - 11 Steps */}
            <div className="bg-[#c2f5f7] rounded-2xl sm:rounded-3xl p-2 sm:p-4 lg:p-8 shadow-2xl min-h-[80px] sm:min-h-[120px] lg:min-h-[200px] flex items-center">
              <div className="grid items-center w-full gap-2 sm:gap-4 lg:gap-6" style={{gridTemplateColumns: '280px 100px 1fr'}}>
                <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 lg:space-y-4 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="bg-white p-1 sm:p-2 lg:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-[rgb(0,52,50)]">👨‍💼</div>
                    </div>
                    <div className="text-xs sm:text-sm lg:text-2xl font-bold text-[rgb(0,52,50)]">+</div>
                    <div className="bg-white p-1 sm:p-2 lg:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                      <div className="text-sm sm:text-lg lg:text-xl font-bold text-[rgb(0,52,50)]">💻</div>
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-[rgb(0,52,50)] text-center leading-tight px-2">Third Party Carbon Consultant + Carbon Accounting Software</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <p className="text-sm sm:text-xl lg:text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight">11<br/>STEPS</p>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-1 lg:gap-2 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  {[
                    "① Training", "② Doc + Reg Map", "③ Data Checklist", "④ Data Clean",
                    "⑤ Gap Fill", "⑥ Build Model", "⑦ Factor Match", "⑧ Submit",
                    "⑨ Issue List", "⑩ Corrections", "⑪ Certification"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-0.5 sm:space-x-1">
                      <div className={`bg-white bg-opacity-80 px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full shadow-md text-xs lg:text-xs font-semibold text-[rgb(0,52,50)] animate-pulse`} 
                           style={{animationDelay: `${index * 200}ms`}}>
                        {step}
                      </div>
                      {index < 10 && (
                        <div className={`w-1 h-1 sm:w-2 sm:h-2 lg:w-4 lg:h-4 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce`}
                             style={{animationDelay: `${index * 200}ms`}}>
                          <span className="text-white text-xs">→</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carbon Consultant - 12 Steps */}
            <div className="bg-[#98a2f8] rounded-2xl sm:rounded-3xl p-2 sm:p-4 lg:p-8 shadow-2xl min-h-[80px] sm:min-h-[120px] lg:min-h-[200px] flex items-center">
              <div className="grid items-center w-full gap-2 sm:gap-4 lg:gap-6" style={{gridTemplateColumns: '280px 100px 1fr'}}>
                <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 lg:space-y-4 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <div className="bg-white p-1 sm:p-2 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                    <div className="text-sm sm:text-lg lg:text-2xl font-bold text-[rgb(0,52,50)]">👨‍💼</div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-[rgb(0,52,50)] text-center leading-tight">Third Party Carbon Consultant</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <p className="text-sm sm:text-xl lg:text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight">12<br/>STEPS</p>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-1 lg:gap-2 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  {[
                    "① Kick-Off", "② Info Search", "③ Data Prep", "④ Clean + Interview",
                    "⑤ Calc Model", "⑥ Factor Calc", "⑦ Draft Report", "⑧ Review",
                    "⑨ Submit to Verifier", "⑩ Issue Feedback", "⑪ Info Correction", "⑫ Certification"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-0.5 sm:space-x-1">
                      <div className={`bg-white bg-opacity-80 px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full shadow-md text-xs lg:text-xs font-semibold text-[rgb(0,52,50)] animate-pulse`}
                           style={{animationDelay: `${index * 150}ms`}}>
                        {step}
                      </div>
                      {index < 11 && (
                        <div className={`w-1 h-1 sm:w-2 sm:h-2 lg:w-4 lg:h-4 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce`}
                             style={{animationDelay: `${index * 150}ms`}}>
                          <span className="text-white text-xs">→</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bg-[rgb(0,52,50)] py-8">
        <div className="flex justify-center">
          <svg width="300" height="12" viewBox="0 0 300 12" className="text-[#9ef894]">
            <path 
              d="M3 8 Q75 2 150 6 Q225 10 297 4" 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M8 10 Q82 4 157 8 Q232 12 292 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Value Section */}
      <section className="py-20 bg-[rgb(0,52,50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Value For User And Enterprise</h2>
          </div>

          {/* Mobile Layout - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto sm:hidden">
            {/* 1% Cost */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">1% Cost</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">Cost Reduce</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">Less Than $70 Per Report</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Hours</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">Time Saving</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">From Months To Hours</p>
                </div>
              </div>
            </div>

            {/* Zero Barrier */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Zero Barrier</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">Zero Experience</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">Any Role Can Create</p>
                </div>
              </div>
            </div>

            {/* Trusted */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Trusted</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">Verification Level</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">Virtual Consultant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original 1x4 Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto items-end">
            {/* 1% Cost - Card #1 - 15% Increased */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[216px] sm:min-h-[259px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">1% Cost</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Cost Reduce</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">Less Than $70 Per Credible Report</p>
                </div>
              </div>
            </div>

            {/* Hours - Card #2 - 15% Increased */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[216px] sm:min-h-[259px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">Hours</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Time Saving</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">From Months To Hours</p>
                </div>
              </div>
            </div>

            {/* Zero Barrier - Card #3 - 20% Increased from 25% reduced base */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[252px] sm:min-h-[288px] lg:min-h-[350px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">Zero Barrier</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Zero Experience Requirement</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">Any Role Can Create Credible Result</p>
                </div>
              </div>
            </div>

            {/* Trusted - Card #4 - 15% Increased */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[216px] sm:min-h-[259px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">Trusted</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Verification Level Credibility</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">Virtual Certification Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bg-[rgb(0,52,50)] py-8">
        <div className="flex justify-center">
          <svg width="300" height="12" viewBox="0 0 300 12" className="text-[#9ef894]">
            <path 
              d="M3 8 Q75 2 150 6 Q225 10 297 4" 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M8 10 Q82 4 157 8 Q232 12 292 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen py-12 sm:py-20 bg-[rgb(0,52,50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-6">Pricing Plans</h2>
            <p className="text-base sm:text-xl text-white opacity-90 max-w-3xl mx-auto">
              Choose the right plan to start your carbon footprint journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-[#6195fe] backdrop-blur-sm p-3 sm:p-8 rounded-2xl shadow-lg border border-blue-300 flex flex-col justify-between min-h-[170px] sm:min-h-[400px]">
              <div>
                <div className="h-2 sm:h-8 mb-1 sm:mb-4"></div>
                <h3 className="text-base sm:text-2xl font-semibold mb-1 sm:mb-4 text-gray-800 text-center">Free Version</h3>
                <div className="mb-2 sm:mb-6 text-center">
                  <span className="text-xl sm:text-4xl font-bold text-gray-800">$0</span>
                  <span className="text-gray-600 text-xs sm:text-base">/month</span>
                </div>
                <div className="min-h-[35px] sm:min-h-[120px]">
                  <ul className="space-y-0.5 sm:space-y-3 text-gray-700 text-xs sm:text-base">
                    <li>✓ 50 free matching/month</li>
                    <li>✓ Registration required</li>
                  </ul>
                </div>
              </div>
              <a 
                href="#contact"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1 sm:py-3 rounded-lg font-semibold transition duration-300 text-xs sm:text-base text-center block"
              >
                Get Started
              </a>
            </div>

            <div className="bg-[#9ef894] backdrop-blur-sm p-3 sm:p-8 rounded-2xl shadow-xl transform lg:scale-105 border border-[#8ee884] flex flex-col justify-between min-h-[170px] sm:min-h-[400px]">
              <div>
                <div className="h-3 sm:h-8 mb-1 sm:mb-4 flex justify-center items-start">
                  <span className="bg-gray-800 text-white px-1.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold -mt-1">Popular</span>
                </div>
                <h3 className="text-base sm:text-2xl font-semibold mb-1 sm:mb-4 text-gray-800 text-center">Standard Version</h3>
                <div className="mb-2 sm:mb-6 text-center">
                  <span className="text-xl sm:text-4xl font-bold text-gray-800">$98</span>
                  <span className="text-gray-600 text-xs sm:text-base">/month</span>
                </div>
                <div className="min-h-[35px] sm:min-h-[120px]">
                  <ul className="space-y-0.5 sm:space-y-3 text-gray-700 text-xs sm:text-base">
                    <li>✓ 200 matching/month</li>
                    <li>✓ 3-5 reports equivalent</li>
                  </ul>
                </div>
              </div>
              <a 
                href="/payment"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1 sm:py-3 rounded-lg font-semibold transition duration-300 text-xs sm:text-base text-center block"
              >
                Upgrade Now
              </a>
            </div>

            <div className="bg-[#98a2f8] backdrop-blur-sm p-3 sm:p-8 rounded-2xl shadow-lg border border-purple-300 flex flex-col justify-between min-h-[170px] sm:min-h-[400px] md:col-span-2 lg:col-span-1">
              <div>
                <div className="h-2 sm:h-8 mb-1 sm:mb-4"></div>
                <h3 className="text-base sm:text-2xl font-semibold mb-1 sm:mb-4 text-gray-800 text-center">Enterprise</h3>
                <div className="mb-2 sm:mb-6 text-center">
                  <span className="text-xl sm:text-4xl font-bold text-gray-800">Custom</span>
                </div>
                <div className="min-h-[35px] sm:min-h-[120px]">
                  <ul className="space-y-0.5 sm:space-y-3 text-gray-700 text-xs sm:text-base">
                    <li>✓ ERP/CRM integration</li>
                    <li>✓ Supply chain mgmt</li>
                  </ul>
                </div>
              </div>
              <a 
                href="#contact"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1 sm:py-3 rounded-lg font-semibold transition duration-300 text-xs sm:text-base text-center block"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bg-[rgb(0,52,50)] py-8">
        <div className="flex justify-center">
          <svg width="300" height="12" viewBox="0 0 300 12" className="text-[#9ef894]">
            <path 
              d="M3 8 Q75 2 150 6 Q225 10 297 4" 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M8 10 Q82 4 157 8 Q232 12 292 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="min-h-screen py-20 bg-[rgb(0,52,50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
            {/* Left side - Polar Bear Image */}
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden lg:pl-40 order-2 lg:order-1">
              <Image
                src="/polar-bears.png"
                alt="Polar Bears on Ice"
                fill
                className="object-cover object-center"
                quality={100}
                unoptimized={true}
              />
            </div>
            
            {/* Right side - Content */}
            <div className="text-white flex flex-col justify-center h-full order-1 lg:order-2">
              {/* Centered content */}
              <div className="text-center space-y-8 sm:space-y-10 md:space-y-12">
                {/* About Us title - centered */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">About Us</h2>
                </div>
                
                {/* First section - centered */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                    Gain Credibility At Low Cost
                  </h3>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                    Use Credit At Low Cost
                  </h3>
                </div>
                
                {/* Second section - centered with green highlight */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                    Leave More Time And<br />
                    Budget To
                  </h3>
                  <div className="relative inline-block">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#9ef894] leading-tight">
                      Decarbonization
                    </h3>
                    {/* Hand-drawn style underline */}
                    <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 right-0 flex justify-center">
                      <svg width="150" height="8" viewBox="0 0 200 12" className="text-[#9ef894] sm:w-[180px] sm:h-[10px] md:w-[200px] md:h-[12px]">
                        <path 
                          d="M2 8 Q50 2 100 6 Q150 10 198 4" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path 
                          d="M5 10 Q55 4 105 8 Q155 12 195 6" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          fill="none"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bg-[rgb(0,52,50)] py-8">
        <div className="flex justify-center">
          <svg width="300" height="12" viewBox="0 0 300 12" className="text-[#9ef894]">
            <path 
              d="M3 8 Q75 2 150 6 Q225 10 297 4" 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M8 10 Q82 4 157 8 Q232 12 292 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 bg-[rgb(0,52,50)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{t.contact.title}</h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-6xl mx-auto">
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">Get More Information</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-3 sm:mr-4">📧</span>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Email</h4>
                    <p className="opacity-80 text-sm sm:text-base">xuguang.ma@climateseal.net</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-3 sm:mr-4">📞</span>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Phone</h4>
                    <p className="opacity-80 text-sm sm:text-base">+86 15652618365</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-3 sm:mr-4">🏢</span>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Location</h4>
                    <p className="opacity-80 text-sm sm:text-base">Beijing, Germany, Dubai, Singapore</p>
                  </div>
                </div>
                
                {/* New About Logo */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6">
                  <div className="flex justify-start">
                    <Image
                      src="/about-logo.png"
                      alt="Climate Seal About Logo"
                      width={400}
                      height={120}
                      className="object-contain w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
                      unoptimized={true}
                      style={{
                        clipPath: 'inset(0 0 15% 0)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#98a2f8] bg-opacity-90 p-6 sm:p-8 rounded-2xl backdrop-blur-sm self-start order-1 lg:order-2">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-black">{t.contact.form.submit}</h3>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-black">{t.contact.form.name}*</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                    placeholder={t.contact.form.placeholder.name}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-black">{t.contact.form.email}*</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                    placeholder={t.contact.form.placeholder.email}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-black">{t.contact.form.phone}*</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                    placeholder={t.contact.form.placeholder.phone}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-black">{t.contact.form.company}*</label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                    placeholder={t.contact.form.placeholder.company}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-black">{t.contact.form.message}*</label>
                  <textarea 
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none text-sm sm:text-base"
                    placeholder={t.contact.form.placeholder.message}
                    required
                  ></textarea>
                </div>
                
                {submitMessage && (
                  <div className={`text-sm p-3 rounded-lg ${
                    submitMessage.includes('成功') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {submitMessage}
                  </div>
                )}
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition duration-300 text-center text-sm sm:text-base ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                      : 'bg-yellow-400 hover:bg-yellow-500 text-[rgb(0,52,50)]'
                  }`}
                >
                  {isSubmitting ? t.contact.form.submitting : t.contact.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}