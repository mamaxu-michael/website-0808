'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import ExpandableCards from '@/components/ExpandableCards';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [visibleCards, setVisibleCards] = useState({ card2: false, card3: false });
  const [solutionBarVisible, setSolutionBarVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [painSectionTop, setPainSectionTop] = useState(0);
  const [painSectionBottom, setPainSectionBottom] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activePersona, setActivePersona] = useState<'carbonExpert' | 'brandOwner' | 'supplyChain'>('carbonExpert');
  const [activeAIRole, setActiveAIRole] = useState<'carbonExpert' | 'brandOwner' | 'supplyChain'>('carbonExpert');

  // Generate cards data for current role
  const getCardsForRole = (role: 'carbonExpert' | 'brandOwner' | 'supplyChain') => {
    const assistants = t.sections.aiAssistants.assistants[role];
    
    if (role === 'carbonExpert') {
      return [
        {
          title: assistants.carbonCalculator.title,
          summary: assistants.carbonCalculator.description,
          gradient: "from-purple-500/25 to-violet-500/25",
          background: "bg-gradient-to-b from-purple-600/70 to-purple-800/70",
          staticMediaSrc: "/reg-advisor.png",
          dynamicMediaSrc: "/videos/video1-card.mp4"
        },
        {
          title: assistants.complianceTracker.title,
          summary: assistants.complianceTracker.description,
          gradient: "from-emerald-500/25 to-green-600/25",
          background: "bg-gradient-to-b from-green-600/70 to-green-800/70",
          staticMediaSrc: "/data-intake-steward.png",
          dynamicMediaSrc: "/videos/video2-card.mp4"
        },
        {
          title: assistants.climateSeal.title,
          summary: assistants.climateSeal.description,
          gradient: "from-sky-500/25 to-blue-600/25",
          background: "bg-gradient-to-b from-blue-600/70 to-blue-800/70",
          staticMediaSrc: "/pcf-modeler.png",
          dynamicMediaSrc: "/videos/video3-card.mp4"
        },
        {
          title: assistants.supplyChainAnalyzer.title,
          summary: assistants.supplyChainAnalyzer.description,
          gradient: "from-orange-500/25 to-amber-600/25",
          background: "bg-gradient-to-b from-orange-600/70 to-orange-800/70",
          staticMediaSrc: "/qa-anomaly-detector.png",
          dynamicMediaSrc: "/videos/video4-card.mp4"
        }
      ];
    } else if (role === 'brandOwner') {
      return [
        {
          title: assistants.brandAnalyzer.title,
          summary: assistants.brandAnalyzer.description,
          gradient: "from-pink-500/25 to-rose-500/25",
          background: "bg-gradient-to-b from-pink-600/70 to-pink-800/70",
          staticMediaSrc: "/brand-analyzer.png",
          dynamicMediaSrc: "/videos/brand-video1.mp4"
        },
        {
          title: assistants.scopeTracker.title,
          summary: assistants.scopeTracker.description,
          gradient: "from-indigo-500/25 to-purple-500/25",
          background: "bg-gradient-to-b from-indigo-600/70 to-indigo-800/70",
          staticMediaSrc: "/scope-tracker.png",
          dynamicMediaSrc: "/videos/brand-video2.mp4"
        },
        {
          title: assistants.sustainabilityReporter.title,
          summary: assistants.sustainabilityReporter.description,
          gradient: "from-emerald-500/25 to-teal-500/25",
          background: "bg-gradient-to-b from-emerald-600/70 to-emerald-800/70",
          staticMediaSrc: "/sustainability-reporter.png",
          dynamicMediaSrc: "/videos/brand-video3.mp4"
        },
        {
          title: assistants.goalManager.title,
          summary: assistants.goalManager.description,
          gradient: "from-violet-500/25 to-purple-500/25",
          background: "bg-gradient-to-b from-violet-600/70 to-violet-800/70",
          staticMediaSrc: "/goal-manager.png",
          dynamicMediaSrc: "/videos/brand-video4.mp4"
        }
      ];
    } else {
      return [
        {
          title: assistants.supplierAssessment.title,
          summary: assistants.supplierAssessment.description,
          gradient: "from-rose-500/25 to-pink-500/25",
          background: "bg-gradient-to-b from-rose-600/70 to-rose-800/70",
          staticMediaSrc: "/supply-chain-assessment.png",
          dynamicMediaSrc: "/videos/supplier-video1.mp4"
        },
        {
          title: assistants.exportCompliance.title,
          summary: assistants.exportCompliance.description,
          gradient: "from-slate-500/25 to-gray-500/25",
          background: "bg-gradient-to-b from-slate-600/70 to-slate-800/70",
          staticMediaSrc: "/export-compliance.png",
          dynamicMediaSrc: "/videos/supplier-video2.mp4"
        },
        {
          title: assistants.costOptimizer.title,
          summary: assistants.costOptimizer.description,
          gradient: "from-lime-500/25 to-green-500/25",
          background: "bg-gradient-to-b from-lime-600/70 to-lime-800/70",
          staticMediaSrc: "/cost-optimizer.png",
          dynamicMediaSrc: "/videos/supplier-video3.mp4"
        }
      ];
    }
  };

  useEffect(() => {
    // 检测是否为移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // 滚动控制和横幅显示逻辑
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      setIsScrolling(true);
      
      // 清除之前的滚动停止计时器
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // 设置新的滚动停止计时器
      const newTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // 150ms后认为滚动停止
      setScrollTimeout(newTimeout);
      
      // 精确的位置触发 - 基于Pain Section标题位置和滚动方向，移动端和桌面端不同触发时机
      const painSectionTitle = document.querySelector('[data-section-id="pain-section-title"]');
      if (painSectionTitle) {
        const rect = painSectionTitle.getBoundingClientRect();
        const isMobile = window.innerWidth < 1024;
        
        // 不同设备的触发阈值
        const triggerThreshold = isMobile ? 50 : 200; // 移动端50px，桌面端200px
        
        // 触发显示：当标题距离顶端达到阈值时显示横幅
        if (rect.top <= triggerThreshold && rect.bottom > 0) {
          setSolutionBarVisible(true);
        } 
        // 只有在向下滑动且标题已经远离时才隐藏
        else if (direction === 'down' && rect.top > triggerThreshold) {
          setSolutionBarVisible(false);
        }
        // 向上滑动时，无论位置如何都保持当前状态（不改变）
        
      } else {
        // 如果找不到标题元素，使用临时的始终显示
        setSolutionBarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // 延迟一点确保DOM已经渲染
    const timer = setTimeout(() => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 0px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-card-id');
          
          if (cardId === 'card2' && entry.isIntersecting) {
            setVisibleCards(prev => ({ ...prev, card2: true }));
          } else if (cardId === 'card3' && entry.isIntersecting) {
            setVisibleCards(prev => ({ ...prev, card3: true }));
          } else if (cardId === 'pain-cards') {
            // 记录痛点区域的位置
            const rect = entry.target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setPainSectionTop(scrollTop + rect.top);
            setPainSectionBottom(scrollTop + rect.bottom);
          }
        });
      }, observerOptions);
      
      const card2 = document.querySelector('[data-card-id="card2"]');
      const card3 = document.querySelector('[data-card-id="card3"]');
      const painCards = document.querySelector('[data-card-id="pain-cards"]');
      
      if (card2) observer.observe(card2);
      if (card3) observer.observe(card3);
      if (painCards) {
        observer.observe(painCards);
      }

      // 添加滚动监听器
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        if (card2) observer.unobserve(card2);
        if (card3) observer.unobserve(card3);
        if (painCards) observer.unobserve(painCards);
        window.removeEventListener('scroll', handleScroll);
      };
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, painSectionTop, painSectionBottom, scrollTimeout]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必需字段
    if (!formData.name || !formData.email || !formData.phone || !formData.company || !formData.industry || !formData.message) {
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

      const data = await response.json();

      if (response.ok) {
        // 使用服务器返回的消息，如果没有则使用默认成功消息
        setSubmitMessage(data.message || t.contact.messages.success);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          industry: '',
          message: ''
        });
      } else {
        // 使用服务器返回的错误消息，如果没有则使用默认错误消息
        setSubmitMessage(data.message || t.contact.messages.error);
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
      <section id="home" className="min-h-screen bg-[rgb(0,52,50)] relative overflow-hidden" data-theme="home" data-section="home-hero" data-category="landing">
        {/* Background overlay - removed for unified color */}
        
        <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left text-white px-4 lg:px-16 order-2 lg:order-1 mt-6 lg:mt-0 lg:translate-x-8 lg:translate-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-4">
              {t.hero.title}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light mb-6 whitespace-pre-line">
              {t.hero.subtitle}
            </h2>
            <p className="text-base sm:text-lg md:text-2xl mb-8 font-light opacity-90">
              {t.hero.description}
            </p>
            <a 
              href="#ai-assistants"
              className="bg-yellow-400 hover:bg-yellow-500 text-[rgb(0,52,50)] px-6 sm:px-8 py-1.5 sm:py-2.5 rounded-full font-semibold text-base sm:text-lg transition duration-300 inline-flex items-center gap-2 mt-2"
              data-cta="hero-get-started"
              data-section="home-hero"
            >
              {t.hero.getStarted}
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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

      {/* Personas Section */}
      <section className="relative bg-[rgb(0,52,50)] py-16 overflow-hidden">
        <div className="relative w-full max-w-[1376px] h-auto mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-[56px] font-normal text-white leading-[67.2px] tracking-[-1.12px] mb-4">
              {t.sections.personas?.title || 'Solutions for every role.'}
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="bg-white/5 rounded-[1600px] p-1 shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)]">
              <div className="relative flex">
                {(['carbonExpert', 'brandOwner', 'supplyChain'] as const).map((persona, index) => (
                  <button
                    key={persona}
                    onClick={() => setActivePersona(persona)}
                    className={`relative px-6 py-3 text-lg font-normal tracking-[-0.18px] leading-[23.4px] transition-all duration-300 ${
                      activePersona === persona
                        ? 'bg-[#6161ff] text-white rounded-[1600px]'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {t.sections.personas[persona].title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Layout */}
          <div className="relative w-full flex justify-center">
            <div className="relative w-[1618px] transform translate-x-[-4cm]">
              {/* Left Large Card */}
              <div className={`w-full lg:w-[1114px] h-[580px] rounded-3xl relative mb-6 lg:mb-0 animate-fade-in ${
                activePersona === 'carbonExpert' ? 'bg-[#6161ff]' :
                activePersona === 'brandOwner' ? 'bg-[#8b5cf6]' :
                'bg-[#3b82f6]'
              }`}>
              {/* Logo/Brand Area */}
              <div className="absolute top-[108px] left-10 w-[309px] h-7">
              </div>

              {/* Main Title */}
              <div className="absolute top-[130px] left-10 w-[400px]">
                <h3 className="text-white text-[40px] font-normal tracking-[-0.80px] leading-[52px]">
                  {activePersona === 'carbonExpert' && 'Carbon Professionals'}
                  {activePersona === 'brandOwner' && 'Drive supply chain\ntransparency'}
                  {activePersona === 'supplyChain' && 'Achieve compliance\neffortlessly'}
                </h3>
              </div>

              {/* Description */}
              <div className="absolute top-[304px] left-10 w-[362px]">
                <p className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">
                  {t.sections.personas[activePersona].needs}
                </p>
              </div>

              {/* CTA Button */}
              <div className="absolute top-[442px] left-10">
                <button 
                  onClick={() => document.getElementById('ai-assistants')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white rounded-[160px] border border-solid px-8 py-2 flex items-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <span className="text-black text-base font-normal tracking-[-0.16px] leading-[20.8px]">
                    Get More Detail
                  </span>
                  <svg className="w-3 h-2.5" viewBox="0 0 12 10" fill="none">
                    <path d="M7 1L11 5L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 5H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Product Interface Mock */}
              <div className="absolute top-0 right-0 w-[588px] h-[580px] rounded-r-3xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="space-y-5 flex-1 pt-16">
                      {activePersona === 'carbonExpert' ? (
                        <>
                          <div className="h-12 bg-white/20 rounded w-3/4 animate-shimmer flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Rules and factors don't line up—results swing±10–20%</span>
                          </div>
                          <div className="h-16 bg-white/15 rounded w-full flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Most data comes back late or wrong—under 50 % on time and hours lost cleaning.</span>
                          </div>
                          <div className="h-14 bg-white/25 rounded w-5/6 flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Each SKU eats days; most time spend on factor matching</span>
                          </div>
                          <div className="h-12 bg-white/15 rounded w-4/5 flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">No assessing the process or data—risks stay invisible.</span>
                          </div>
                          <div className="h-18 bg-white/20 rounded w-full flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Evidence is scattered; external checks are slow and costly, and rework keeps delaying delivery.</span>
                          </div>
                        </>
                      ) : activePersona === 'brandOwner' ? (
                        <div className="space-y-8 flex-1 pt-4">
                          <div className="h-16 bg-white/20 rounded w-5/6 flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Supply-chain companies lack specialized expertise, making compliance costly and burdensome</span>
                          </div>
                          <div className="h-14 bg-white/15 rounded w-3/5 flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Endless chasing supply chain data; on-time deliveries only 40-70 %.</span>
                          </div>
                          <div className="h-12 bg-white/25 rounded w-4/5 flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Poor data quality skews decarbonisation priorities.</span>
                          </div>
                          <div className="h-18 bg-white/15 rounded w-2/3 flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">No ROI or MACC, projects can't get green-lit and stalls SBTi / CSRD milestones.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-8 flex-1 pt-12">
                          <div className="h-14 bg-white/20 rounded w-4/5 animate-shimmer flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">PCF reports take 4-8 weeks, missing RFQ / tender deadlines</span>
                          </div>
                          <div className="h-16 bg-white/15 rounded w-3/4 flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">Rework cycles delay shipments and risk customs holds.</span>
                          </div>
                          <div className="h-20 bg-white/25 rounded w-full flex items-center px-4">
                            <span className="text-white text-lg font-normal tracking-[-0.18px] leading-[28.8px]">No in-house carbon expertise, third-party consulting is expensive, and mainstream carbon tools are pricey and hard to use.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* Right Side Cards */}
              <div className="lg:absolute lg:top-0 lg:left-[1138px] lg:w-[480px] flex flex-col gap-6">
              {/* Stats Card */}
              <div className="w-full h-[205px] bg-[#f0f3ff] rounded-3xl p-6 animate-fade-up" style={{"--animation-delay": "0.2s"}}>
                {activePersona === 'carbonExpert' ? (
                  <div className="flex justify-between items-center h-full pt-8">
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        90%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        faster<br/>End-to-end<br/>reporting
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        99%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        faster<br/>factor & rule<br/>matching
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        95%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        first-pass<br/>Verification
                      </p>
                    </div>
                  </div>
                ) : activePersona === 'brandOwner' ? (
                  <div className="flex justify-between items-center h-full pt-8">
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        90%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        On-time<br/>submissions
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        60%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        less follow-up<br/>& cleaning work
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        90%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        Data quality<br/>Improvement
                      </p>
                    </div>
                  </div>
                ) : activePersona === 'supplyChain' ? (
                  <div className="flex justify-between items-center h-full pt-8">
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        90%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        Faster Report<br/>Turnaround
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        95%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        first-pass<br/>approval
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        90%
                      </div>
                      <p className="text-[#333333] text-sm font-normal leading-tight mt-1">
                        lower<br/>compliance cost
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="text-[#333333] text-[28px] font-semibold leading-[36.4px] tracking-[-0.12px]">
                        {t.sections.personas[activePersona].stat}
                      </div>
                    </div>
                    <p className="text-[#333333] text-[28px] font-normal leading-[36.4px] tracking-[-0.08px]">
                      {t.sections.personas[activePersona].statDescription}
                    </p>
                  </>
                )}
              </div>

              {/* Testimonial Card */}
              <div className="w-full h-[352px] bg-[#f0f3ff] rounded-3xl p-8 animate-fade-up" style={{"--animation-delay": "0.4s"}}>
                <div className="pt-8">
                  <p className="text-[#333333] text-xl font-normal tracking-[-0.20px] leading-[30px] mb-8">
                    "{t.sections.personas[activePersona].testimonial}"
                  </p>
                </div>
                
                <div className="border-t border-[#d0d4e4] pt-8">
                  <div className="flex items-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold mr-4">
                      {t.sections.personas[activePersona].author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[#333333] text-sm font-normal tracking-[-0.14px] leading-[18.2px]">
                        {t.sections.personas[activePersona].author}
                      </div>
                      <div className="text-[#333333] text-sm font-normal tracking-[-0.14px] leading-[18.2px] mt-1">
                        {t.sections.personas[activePersona].position}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistants Section */}
      <section id="ai-assistants" className="relative bg-[rgb(0,52,50)] py-16 overflow-hidden">
        <div className="relative w-full max-w-[2548px] mx-auto px-4">
          {/* Coming Soon Badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium">
              {t.sections.aiAssistants.comingSoon}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-[56px] font-normal text-white leading-[67.2px] tracking-[-1.12px] mb-4">
              {t.sections.aiAssistants.title}
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              {t.sections.aiAssistants.subtitle}
            </p>
          </div>


          {/* AI Role Navigation */}
          <div className="flex justify-center mb-16">
            <div className="bg-white/5 rounded-[1600px] p-1 shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)]">
              <div className="relative flex">
                {(['carbonExpert', 'brandOwner', 'supplyChain'] as const).map((role, index) => (
                  <button
                    key={role}
                    onClick={() => setActiveAIRole(role)}
                    className={`relative px-8 py-3 text-lg font-normal tracking-[-0.18px] leading-[23.4px] transition-all duration-300 ${
                      activeAIRole === role
                        ? 'bg-[#6161ff] text-white rounded-[1600px]'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {t.sections.personas[role].title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Assistant Cards - ExpandableCards */}
          <ExpandableCards 
            items={getCardsForRole(activeAIRole)} 
            className="mt-8"
          />

          {/* Bottom Action Buttons */}
          <div className="flex justify-center gap-6 mt-16">
            <button className="bg-white rounded-[160px] px-8 py-4 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-lg">
              <span className="text-black text-lg font-medium">{t.sections.aiAssistants.getStarted}</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </button>
            <button className="border-2 border-white text-white rounded-[160px] px-8 py-4 hover:bg-white hover:text-[rgb(0,52,50)] transition-all">
              <span className="text-lg font-medium">{t.sections.aiAssistants.trustCenter}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Monday.com Difference Section */}
      <section className="relative bg-[rgb(0,52,50)] py-16 overflow-hidden">
        <div className="relative w-full max-w-[1376px] mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-[56px] font-normal text-white leading-[67.2px] tracking-[-1.12px]"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {t.sections.difference.title}
            </motion.h2>
          </div>

          {/* Cards Layout */}
          <div className="relative w-full h-[1023px]">
            {/* Flexible yet standardized - Green Card (Top Left) */}
            {/* 灰色背景块 */}
            <motion.div 
              className="absolute w-[400px] h-[272px] top-[127px] left-[-104px] rounded-[32px] group cursor-pointer overflow-hidden border-2 border-white/20 ring-1 ring-white/20"
              style={{
                backgroundImage: 'url(/faster-beaver.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))"
              }}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              animate={{
                y: [0, -8, 0],
                rotate: [0, 1, 0, -1, 0]
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* 光带效果 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-[32px]">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out"
                  style={{ transform: "skewX(-45deg)", width: "200%" }}
                />
              </div>
            </motion.div>
            {/* 绿色卡片 */}
            <motion.div 
              className="absolute w-[1080px] h-[272px] top-[127px] left-[376px] rounded-[32px] group cursor-pointer"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              animate={{
                y: [0, -6, 0],
                rotate: [0, -0.5, 0, 0.8, 0]
              }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                rotate: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
              }}
              style={{ 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.2))"
              }}
            >
              <div className="w-[1080px] bg-[#f0f3ff] overflow-hidden absolute h-[272px] top-0 left-0 rounded-[32px]">
                <div className="relative w-[1088px] h-[266px] top-[3px] -left-1 bg-gradient-to-br from-green-400 to-green-600" />
              </div>
              <div className="absolute inset-0 p-8 flex items-center">
                <div className="w-1/2">
                  <h3 className="text-4xl font-normal text-white mb-4">{t.sections.difference.cards.flexible.title}</h3>
                </div>
                <div className="w-1/2 pl-4">
                  <p className="text-white text-xl leading-relaxed">{t.sections.difference.cards.flexible.description}</p>
                </div>
              </div>
              {/* Green Icon */}
              <div className="absolute top-6 left-6 w-20 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2"></div>
              </div>
              {/* 光带效果 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-[32px]">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out"
                  style={{ transform: "skewX(-45deg)", width: "200%" }}
                />
              </div>
            </motion.div>

            {/* Products teams love to use - Blue Card (Center Right) */}
            {/* 灰色背景块 */}
            <motion.div 
              className="absolute w-[400px] h-[272px] top-[439px] left-[1056px] rounded-[32px] group cursor-pointer overflow-hidden border-2 border-white/20 ring-1 ring-white/20"
              style={{
                backgroundImage: 'url(/credible-meerkat.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))"
              }}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.33, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 1.2, 0, -0.8, 0]
              }}
              transition={{
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                rotate: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
              }}
            >
              {/* 光带效果 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-[32px]">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out"
                  style={{ transform: "skewX(-45deg)", width: "200%" }}
                />
              </div>
            </motion.div>
            {/* 蓝色卡片 */}
            <motion.div 
              className="absolute w-[1080px] h-[272px] top-[439px] left-[-104px] rounded-[32px] group cursor-pointer"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              animate={{
                y: [0, -7, 0],
                rotate: [0, -1, 0, 1.2, 0]
              }}
              transition={{
                y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                rotate: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.8 }
              }}
              style={{ 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.2))"
              }}
            >
              <div className="w-[1080px] bg-[#f0f3ff] overflow-hidden absolute h-[272px] top-0 left-0 rounded-[32px]">
                <div className="relative w-[1088px] h-[266px] top-[3px] -left-1 bg-gradient-to-br from-blue-500 to-blue-700" />
              </div>
              <div className="absolute inset-0 p-8 flex items-center">
                <div className="w-1/2">
                  <p className="text-white text-xl leading-relaxed">{t.sections.difference.cards.products.description}</p>
                </div>
                <div className="w-1/2 pl-4 flex justify-end">
                  <h3 className="text-4xl font-normal text-white mb-4">{t.sections.difference.cards.products.title}</h3>
                </div>
              </div>
              {/* Heart Icon */}
              <div className="absolute top-6 right-6 w-20 h-16 flex items-center justify-center">
                <div className="w-12 h-10 bg-white rounded-t-full transform rotate-45 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2" style={{borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}></div>
              </div>
              {/* 光带效果 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-[32px]">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out"
                  style={{ transform: "skewX(-45deg)", width: "200%" }}
                />
              </div>
            </motion.div>

            {/* Fast time to value - Pink Card (Bottom Left) */}
            {/* 灰色背景块 */}
            <motion.div 
              className="absolute w-[400px] h-[272px] top-[751px] left-[-104px] rounded-[32px] group cursor-pointer overflow-hidden border-2 border-white/20 ring-1 ring-white/20"
              style={{
                backgroundImage: 'url(/frictionless-dog.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.1))"
              }}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.51, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              animate={{
                y: [0, -9, 0],
                rotate: [0, 1.5, 0, -1.2, 0]
              }}
              transition={{
                y: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2 },
                rotate: { duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 2.3 }
              }}
            >
              {/* 光带效果 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-[32px]">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out"
                  style={{ transform: "skewX(-45deg)", width: "200%" }}
                />
              </div>
            </motion.div>
            {/* 粉色卡片 */}
            <motion.div 
              className="absolute w-[1080px] h-[272px] top-[751px] left-[376px] rounded-[32px] group cursor-pointer"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.60, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              animate={{
                y: [0, -5, 0],
                rotate: [0, -0.8, 0, 1, 0]
              }}
              transition={{
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 2.5 },
                rotate: { duration: 4.9, repeat: Infinity, ease: "easeInOut", delay: 2.8 }
              }}
              style={{ 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.2))"
              }}
            >
              <div className="w-[1080px] bg-[#f0f3ff] overflow-hidden absolute h-[272px] top-0 left-0 rounded-[32px]">
                <div className="relative w-[1088px] h-[266px] top-[3px] -left-1 bg-gradient-to-br from-pink-400 to-pink-600" />
              </div>
              <div className="absolute inset-0 p-8 flex items-center">
                <div className="w-1/2">
                  <h3 className="text-4xl font-normal text-white mb-4">{t.sections.difference.cards.fastValue.title}</h3>
                </div>
                <div className="w-1/2 pl-4">
                  <p className="text-white text-xl leading-relaxed">{t.sections.difference.cards.fastValue.description}</p>
                </div>
              </div>
              {/* Pink Icon */}
              <div className="absolute top-6 left-6 w-20 h-12">
                <div className="w-16 h-8 bg-pink-300 rounded-full transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2"></div>
                <div className="w-12 h-8 bg-pink-400 rounded-full mt-1 ml-2 transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2"></div>
              </div>
              {/* 光带效果 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden rounded-[32px]">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out"
                  style={{ transform: "skewX(-45deg)", width: "200%" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scenarios & Value Section */}
      <section id="scenarios-value" className="relative bg-[rgb(0,52,50)] py-12 sm:py-20 -mt-px" data-theme="scenarios-value" data-section="scenarios-overview" data-category="product">
        <div className="relative w-full mx-auto px-4">
          {/* Sticky Title and First Card Container */}
          <div className="sticky top-32 sm:top-40 lg:top-48 z-10 bg-[rgb(0,52,50)]">
            {/* Section Title */}
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                {t.sections.scenarios?.title || 'Scenarios you need carbon footprint'}
              </h2>
            </div>
            
            {/* Card 1 - 市场准入与跨境合规 */}
            <div className="w-full h-[400px] sm:h-[480px] lg:h-[560px] xl:h-[640px] rounded-3xl overflow-hidden shadow-2xl bg-[rgb(0,52,50)] transform transition-transform duration-700 lg:block hidden">
              <div className="h-full flex justify-center gap-12 p-6">
                {/* Left Square Card - 市场准入与跨境合规 */}
                <div className="w-[400px] sm:w-[480px] lg:w-[560px] xl:w-[640px] bg-[#a8b3ff] rounded-2xl p-8 flex flex-col justify-between">
                  <div style={{transform: 'translateY(1cm)'}}>
                    <h3 className="text-4xl font-bold text-[rgb(0,52,50)] mb-8">{t.sections.scenarios.scenarioCards.marketAccess.title}</h3>
                    <div className="space-y-0 text-[rgb(0,52,50)]">
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold">{language === 'en' ? 'Company Type:' : '企业类型：'}</span>{t.sections.scenarios.scenarioCards.marketAccess.companyType}
                      </p>
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold">{language === 'en' ? 'Industries:' : '涉及行业：'}</span>{t.sections.scenarios.scenarioCards.marketAccess.industries}
                      </p>
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold">{language === 'en' ? 'Core Description:' : '核心说明：'}</span>{t.sections.scenarios.scenarioCards.marketAccess.coreDescription}
                      </p>
                      <div className="mt-24 p-4 bg-white bg-opacity-10 rounded-lg" style={{transform: 'translateY(1cm)'}}>
                        <p className="text-sm leading-relaxed text-[rgb(0,52,50)]">
                          {t.sections.scenarios.scenarioCards.marketAccess.detailDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-6">
                    <button 
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-[rgb(0,52,50)] text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center gap-2"
                    >
                      Try Now (2 Free Reports)
                      <div className="w-8 h-8 bg-[#a8b3ff] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[rgb(0,52,50)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Right Grid - Small Cards with Varying Heights */}
                <div className="w-[500px] sm:w-[600px] lg:w-[700px] xl:w-[800px] grid grid-cols-2 gap-4">
                  {/* CBAM - Short (Top Left) */}
                  <div className="bg-[#a8b3ff] rounded-xl p-4 flex flex-col justify-center">
                    <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.cbam.title}</h4>
                    <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.cbam.description}}>
                    </p>
                  </div>

                  {/* 电池相关 - Tall (Top Right) */}
                  <div className="bg-[#a8b3ff] rounded-xl p-4 flex flex-col justify-center row-span-3">
                    <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.batteryRelated.title}</h4>
                    <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.batteryRelated.description}}>
                    </p>
                  </div>

                  {/* ESPR/DPP - Tall (Bottom Left) */}
                  <div className="bg-[#a8b3ff] rounded-xl p-4 flex flex-col justify-center row-span-3">
                    <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.esprDpp.title}</h4>
                    <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.esprDpp.description}}>
                    </p>
                  </div>

                  {/* 被动核查 - Short (Bottom Right) */}
                  <div className="bg-[#a8b3ff] rounded-xl p-4 flex flex-col justify-center">
                    <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.passiveVerification.title}</h4>
                    <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.passiveVerification.description}}>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout - Only visible on mobile/tablet */}
            <div className="w-full space-y-3 sm:space-y-4 lg:hidden">
              {/* Top Large Card - 市场准入与跨境合规 */}
              <div className="w-full bg-[#a8b3ff] rounded-xl p-3 sm:p-4 shadow-xl h-[35vh] sm:h-[40vh] flex flex-col">
                <div className="text-left flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[rgb(0,52,50)] mb-2 sm:mb-3">{t.sections.scenarios.scenarioCards.marketAccess.title}</h3>
                  <div className="space-y-1 text-[rgb(0,52,50)] text-xs sm:text-sm">
                    <div className="mt-2 p-2 sm:p-3 bg-white bg-opacity-10 rounded-md">
                      <p className="text-xs sm:text-sm text-[rgb(0,52,50)] leading-tight text-left">
                        {t.sections.scenarios.scenarioCards.marketAccess.detailDescription}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3">
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[rgb(0,52,50)] text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center gap-1"
                  >
                    Try Now (2 Free Reports)
                    <div className="w-4 h-4 bg-[#a8b3ff] rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-[rgb(0,52,50)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottom 2x2 Grid - Four Small Cards */}
              <div className="flex flex-wrap justify-between gap-2">
                {/* CBAM */}
                <div className="bg-[#a8b3ff] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                  <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.cbam.title}</h4>
                  <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.cbam.description}}>
                  </p>
                </div>

                {/* 电池相关 */}
                <div className="bg-[#a8b3ff] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                  <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.batteryRelated.title}</h4>
                  <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.batteryRelated.description}}>
                  </p>
                </div>

                {/* ESPR/DPP */}
                <div className="bg-[#a8b3ff] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                  <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.esprDpp.title}</h4>
                  <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.esprDpp.description}}>
                  </p>
                </div>

                {/* 被动核查 */}
                <div className="bg-[#a8b3ff] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                  <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.marketAccess.miniCards.passiveVerification.title}</h4>
                  <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.marketAccess.miniCards.passiveVerification.description}}>
                  </p>
                </div>
              </div>
            </div>


          </div>

          {/* Stacked Horizontal Bar Images - Sequential Reveal */}
          <div className="relative w-full mx-auto">
            {/* Spacer for scroll trigger */}
            <div className="h-[60vh]"></div>

            {/* Card 2 - 供应链与大品牌采购 */}
            <div 
              className={`sticky top-32 sm:top-40 lg:top-48 z-20 transform transition-all duration-800 ease-out ${
                visibleCards.card2 ? 'translate-y-0 opacity-100' : 'translate-y-[60vh] opacity-0'
              } bg-[rgb(0,52,50)]`}
              data-card-id="card2"
            >
              {/* Section Title */}
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                  {t.sections.scenarios?.title || 'Scenarios you need carbon footprint'}
                </h2>
              </div>
              <div className="bg-[rgb(0,52,50)] pb-4">
                {/* Desktop Layout */}
                <div className="lg:block hidden">

                  <div className="w-full h-[400px] sm:h-[480px] lg:h-[560px] xl:h-[640px] rounded-3xl overflow-hidden shadow-2xl bg-[rgb(0,52,50)]">
                    <div className="h-full flex justify-center gap-12 p-6">
                      {/* Left Square Card - 供应链与大品牌采购 */}
                      <div className="w-[400px] sm:w-[480px] lg:w-[560px] xl:w-[640px] bg-[#9ef894] rounded-2xl p-8 flex flex-col justify-between">
                        <div style={{transform: 'translateY(1cm)'}}>
                          <h3 className="text-4xl font-bold text-[rgb(0,52,50)] mb-8">{t.sections.scenarios.scenarioCards.supplyChain.title}</h3>
                          <div className="space-y-0 text-[rgb(0,52,50)]">
                            <p className="text-sm leading-relaxed">
                              <span className="font-semibold">{language === 'en' ? 'Company Type:' : '企业类型：'}</span>{t.sections.scenarios.scenarioCards.supplyChain.companyType}
                            </p>
                            <p className="text-sm leading-relaxed">
                              <span className="font-semibold">{language === 'en' ? 'Industries:' : '涉及行业：'}</span>{t.sections.scenarios.scenarioCards.supplyChain.industries}
                            </p>
                            <p className="text-sm leading-relaxed">
                              <span className="font-semibold">{language === 'en' ? 'Core Concept:' : '核心概念：'}</span>{t.sections.scenarios.scenarioCards.supplyChain.coreConcept}
                            </p>
                            <div className="mt-24 p-4 bg-gray-800 bg-opacity-10 rounded-lg" style={{transform: 'translateY(1cm)'}}>
                              <p className="text-sm leading-relaxed text-[rgb(0,52,50)]">
                                {t.sections.scenarios.scenarioCards.supplyChain.detailDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto pt-6">
                          <button 
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-[rgb(0,52,50)] text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center gap-2"
                          >
                            Try Now (2 Free Reports)
                            <div className="w-8 h-8 bg-[#9ef894] rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Right Grid - Small Cards with Varying Heights */}
                      <div className="w-[500px] sm:w-[600px] lg:w-[700px] xl:w-[800px] grid grid-cols-2 gap-4">
                        {/* SBTi - Tall (Top Left) */}
                        <div className="bg-[#9ef894] rounded-xl p-4 flex flex-col justify-center">
                          <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.sbti.title}</h4>
                          <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.sbti.description}}>
                          </p>
                        </div>

                        {/* 投标入口 - Short (Top Right) */}
                        <div className="bg-[#9ef894] rounded-xl p-4 flex flex-col justify-center row-span-3">
                          <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.biddingEntry.title}</h4>
                          <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.biddingEntry.description}}>
                          </p>
                        </div>

                        {/* 供应链碳表现 - Short (Bottom Left) */}
                        <div className="bg-[#9ef894] rounded-xl p-4 flex flex-col justify-center row-span-3">
                          <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.supplyChainPerformance.title}</h4>
                          <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.supplyChainPerformance.description}}>
                          </p>
                        </div>

                        {/* 数据交换标准 - Tall (Bottom Right) */}
                        <div className="bg-[#9ef894] rounded-xl p-4 flex flex-col justify-center">
                          <h4 className="text-4xl font-bold text-[rgb(0,52,50)] mb-3">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.dataExchangeStandards.title}</h4>
                          <p className="text-sm text-[rgb(0,52,50)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.dataExchangeStandards.description}}>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout Card 2 - Only visible on mobile/tablet */}
                <div className="w-full space-y-3 sm:space-y-4 lg:hidden px-4">
                  {/* Top Large Card - 供应链与大品牌采购 */}
                  <div className="w-full bg-[#9ef894] rounded-xl p-3 sm:p-4 shadow-xl h-[35vh] sm:h-[40vh] flex flex-col">
                    <div className="text-left flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-[rgb(0,52,50)] mb-2 sm:mb-3">{t.sections.scenarios.scenarioCards.supplyChain.title}</h3>
                      <div className="space-y-1 text-[rgb(0,52,50)] text-xs sm:text-sm">
                        <div className="mt-2 p-2 sm:p-3 bg-gray-800 bg-opacity-10 rounded-md">
                          <p className="text-xs sm:text-sm text-[rgb(0,52,50)] leading-tight text-left">
                            {t.sections.scenarios.scenarioCards.supplyChain.detailDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3">
                      <button 
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-[rgb(0,52,50)] text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center gap-1"
                      >
                        Try Now (2 Free Reports)
                        <div className="w-4 h-4 bg-[#9ef894] rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Bottom 2x2 Grid - Four Small Cards */}
                  <div className="flex flex-wrap justify-between gap-2">
                    {/* SBTi */}
                    <div className="bg-[#9ef894] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                      <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.sbti.title}</h4>
                      <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.sbti.description}}>
                      </p>
                    </div>

                    {/* 投标入口 */}
                    <div className="bg-[#9ef894] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                      <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.biddingEntry.title}</h4>
                      <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.biddingEntry.description}}>
                      </p>
                    </div>

                    {/* 供应链碳表现 */}
                    <div className="bg-[#9ef894] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                      <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.supplyChainPerformance.title}</h4>
                      <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.supplyChainPerformance.description}}>
                      </p>
                    </div>

                    {/* 数据交换标准 */}
                    <div className="bg-[#9ef894] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                      <h4 className="text-xs sm:text-sm font-bold text-[rgb(0,52,50)] mb-1">{t.sections.scenarios.scenarioCards.supplyChain.miniCards.dataExchangeStandards.title}</h4>
                      <p className="text-[10px] sm:text-xs text-[rgb(0,52,50)] leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.supplyChain.miniCards.dataExchangeStandards.description}}>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer between cards */}
            <div className="h-[32vh] sm:h-[40vh] lg:h-[48vh]"></div>

            {/* Card 3 - 政府采购与行业要求 */}
            <div 
              className={`sticky top-32 sm:top-40 lg:top-48 z-30 transform transition-all duration-800 ease-out delay-200 ${
                visibleCards.card3 ? 'translate-y-0 opacity-100' : 'translate-y-[60vh] opacity-0'
              } bg-[rgb(0,52,50)]`}
              data-card-id="card3"
            >
              {/* Section Title */}
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                  {t.sections.scenarios?.title || 'Scenarios you need carbon footprint'}
                </h2>
              </div>
              <div className="bg-[rgb(0,52,50)] pb-4">
                {/* Desktop Layout */}
                <div className="lg:block hidden">

                  <div className="w-full h-[400px] sm:h-[480px] lg:h-[560px] xl:h-[640px] rounded-3xl overflow-hidden shadow-2xl bg-[rgb(0,52,50)]">
                    <div className="h-full flex justify-center gap-12 p-6">
                      {/* Left Square Card - 政府采购与行业要求 */}
                      <div className="w-[400px] sm:w-[480px] lg:w-[560px] xl:w-[640px] bg-[#6195fe] rounded-2xl p-8 flex flex-col justify-between">
                        <div style={{transform: 'translateY(1cm)'}}>
                          <h3 className="text-4xl font-bold text-white mb-8">{t.sections.scenarios.scenarioCards.governmentProcurement.title}</h3>
                          <div className="space-y-0 text-white">
                            <p className="text-sm leading-relaxed">
                              <span className="font-semibold">{language === 'en' ? 'Company Type:' : '企业类型：'}</span>{t.sections.scenarios.scenarioCards.governmentProcurement.companyType}
                            </p>
                            <p className="text-sm leading-relaxed">
                              <span className="font-semibold">{language === 'en' ? 'Industries:' : '涉及行业：'}</span>{t.sections.scenarios.scenarioCards.governmentProcurement.industries}
                            </p>
                            <p className="text-sm leading-relaxed">
                              <span className="font-semibold">{language === 'en' ? 'Core Description:' : '核心说明：'}</span>{t.sections.scenarios.scenarioCards.governmentProcurement.coreDescription}
                            </p>
                            <div className="mt-24 p-4 bg-white bg-opacity-10 rounded-lg" style={{transform: 'translateY(1cm)'}}>
                              <p className="text-sm leading-relaxed">
                                {t.sections.scenarios.scenarioCards.governmentProcurement.detailDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto pt-6">
                          <button 
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-[rgb(0,52,50)] text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center gap-2"
                          >
                            Try Now (2 Free Reports)
                            <div className="w-8 h-8 bg-[#6195fe] rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Right Grid - Small Cards with Varying Heights */}
                      <div className="w-[500px] sm:w-[600px] lg:w-[700px] xl:w-[800px] grid grid-cols-2 gap-4">
                        {/* 政府Buy Clean - Short (Top Left) */}
                        <div className="bg-[#6195fe] rounded-xl p-4 flex flex-col justify-center">
                          <h4 className="text-4xl font-bold text-white mb-3">{t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.governmentBuyClean.title}</h4>
                          <p className="text-sm text-white leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.governmentBuyClean.description}}>
                          </p>
                        </div>

                        {/* 绿色建筑 - Tall (Top Right) */}
                        <div className="bg-[#6195fe] rounded-xl p-4 flex flex-col justify-center row-span-3" style={{height: 'calc(100% - 3cm)'}}>
                          <h4 className="text-4xl font-bold text-white mb-3">{t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.greenBuilding.title}</h4>
                          <p className="text-sm text-white leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.greenBuilding.description}}>
                          </p>
                        </div>

                        {/* 行业要求 - Tall (Bottom Left) */}
                        <div className="bg-[#6195fe] rounded-xl p-4 flex flex-col justify-center row-span-3">
                          <h4 className="text-4xl font-bold text-white mb-3">{t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.industryRequirements.title}</h4>
                          <p className="text-sm text-white leading-relaxed" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.industryRequirements.description}}>
                          </p>
                        </div>

                        {/* 空白卡片 - Small-Medium (Bottom Right) */}
                        <div className="bg-[#6195fe] rounded-xl p-4 flex flex-col justify-center" style={{gridRowEnd: 'span 1.6', height: 'calc(100% + 3cm)', marginTop: '-3cm'}}>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout Card 3 - Only visible on mobile/tablet */}
                <div className="w-full space-y-3 sm:space-y-4 lg:hidden px-4">
                  {/* Top Large Card - 政府采购与行业要求 */}
                  <div className="w-full bg-[#6195fe] rounded-xl p-3 sm:p-4 shadow-xl h-[35vh] sm:h-[40vh] flex flex-col">
                    <div className="text-left flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{t.sections.scenarios.scenarioCards.governmentProcurement.title}</h3>
                      <div className="space-y-1 text-white text-xs sm:text-sm">
                        <div className="mt-2 p-2 sm:p-3 bg-white bg-opacity-10 rounded-md">
                          <p className="text-xs sm:text-sm text-white leading-tight text-left">
                            {t.sections.scenarios.scenarioCards.governmentProcurement.detailDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-3">
                      <button 
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-[rgb(0,52,50)] text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center gap-1"
                      >
                        Try Now (2 Free Reports)
                        <div className="w-4 h-4 bg-[#6195fe] rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Bottom 2x2 Grid - Three Small Cards (no empty card in mobile) */}
                  <div className="flex flex-wrap justify-between gap-2">
                    {/* 政府Buy Clean */}
                    <div className="bg-[#6195fe] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.governmentBuyClean.title}</h4>
                      <p className="text-[10px] sm:text-xs text-white leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.governmentBuyClean.description}}>
                      </p>
                    </div>

                    {/* 绿色建筑 */}
                    <div className="bg-[#6195fe] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.greenBuilding.title}</h4>
                      <p className="text-[10px] sm:text-xs text-white leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.greenBuilding.description}}>
                      </p>
                    </div>

                    {/* 行业要求 */}
                    <div className="bg-[#6195fe] rounded-lg p-2 sm:p-3 shadow-lg h-[15vh] sm:h-[17vh] flex flex-col justify-center" style={{width: '48.5%'}}>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.industryRequirements.title}</h4>
                      <p className="text-[10px] sm:text-xs text-white leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: t.sections.scenarios.scenarioCards.governmentProcurement.miniCards.industryRequirements.description}}>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Final spacing - reduced to allow natural scroll to next section */}
            <div className="h-[100vh]"></div>
          </div>
        </div>
      </section>

      {/* We Understand Your Pain Section */}
      <section className="py-6 md:py-12 lg:py-20 bg-[rgb(0,52,50)] -mt-px">
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12 lg:mb-20 xl:mb-24">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 md:mb-4 lg:mb-6" data-section-id="pain-section-title">
              {t.sections.scenarios.painSection.title}
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 lg:gap-16 relative" data-card-id="pain-cards">
            {/* Top Row */}
            {/* 成本高 - Purple */}
            <div className="bg-[#a8b3ff] rounded-lg md:rounded-2xl p-2 md:p-6 lg:p-8 shadow-xl min-h-[60px] md:min-h-[200px] lg:min-h-[240px] flex flex-col justify-center">
              <div className="text-center">
                <h3 className="text-sm md:text-2xl lg:text-3xl font-bold text-[rgb(0,52,50)] mb-1 md:mb-3 lg:mb-4">{t.sections.scenarios.painSection.cards.costHigh.title}</h3>
                <div className="w-6 md:w-12 h-0.5 bg-[rgb(0,52,50)] mx-auto mb-1 md:mb-4 lg:mb-6"></div>
                <p className="text-xs md:text-sm lg:text-base text-[rgb(0,52,50)] leading-tight" dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.cards.costHigh.description}}>
                </p>
              </div>
            </div>

            {/* 周期长 - Green */}
            <div className="bg-[#9ef894] rounded-lg md:rounded-2xl p-2 md:p-6 lg:p-8 shadow-xl min-h-[60px] md:min-h-[200px] lg:min-h-[240px] flex flex-col justify-center">
              <div className="text-center">
                <h3 className="text-sm md:text-2xl lg:text-3xl font-bold text-[rgb(0,52,50)] mb-1 md:mb-3 lg:mb-4">{t.sections.scenarios.painSection.cards.cycleLong.title}</h3>
                <div className="w-6 md:w-12 h-0.5 bg-[rgb(0,52,50)] mx-auto mb-1 md:mb-4 lg:mb-6"></div>
                <p className="text-xs md:text-sm lg:text-base text-[rgb(0,52,50)] leading-tight" dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.cards.cycleLong.description}}>
                </p>
              </div>
            </div>

            {/* 门槛高 - Blue */}
            <div className="bg-[#6195fe] rounded-lg md:rounded-2xl p-2 md:p-6 lg:p-8 shadow-xl min-h-[60px] md:min-h-[200px] lg:min-h-[240px] flex flex-col justify-center">
              <div className="text-center">
                <h3 className="text-sm md:text-2xl lg:text-3xl font-bold text-[rgb(0,52,50)] mb-1 md:mb-3 lg:mb-4">{t.sections.scenarios.painSection.cards.barrierHigh.title}</h3>
                <div className="w-6 md:w-12 h-0.5 bg-[rgb(0,52,50)] mx-auto mb-1 md:mb-4 lg:mb-6"></div>
                <p className="text-xs md:text-sm lg:text-base text-[rgb(0,52,50)] leading-tight" dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.cards.barrierHigh.description}}>
                </p>
              </div>
            </div>

            {/* Solution Bar - Animated Overlay */}
            <div className={`solution-bar-position absolute inset-0 flex items-center justify-center z-20 transition-all duration-800 ease-out pointer-events-none ${
              solutionBarVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-20 scale-90'
            }`} style={{left: '-5%', right: '-5%'}}>
              <div className="bg-white bg-opacity-30 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-2xl w-full mx-2 md:mx-4 border border-white border-opacity-40 pointer-events-auto" style={{minHeight: '160px'}}>
                <div className="text-center mb-2 md:mb-3">
                  <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-[rgb(0,52,50)] mb-2 md:mb-3 drop-shadow-lg">
                    {t.sections.scenarios.painSection.solutionTitle}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                  {/* 下降99% 成本降低 */}
                  <div className="text-center bg-white bg-opacity-40 backdrop-blur-lg rounded-lg md:rounded-xl p-3 md:p-3 border border-white border-opacity-50 shadow-lg flex items-center justify-center" style={{minHeight: '70px'}}>
                    <div className="flex items-center justify-center gap-2 md:gap-6">
                      <div className="flex items-center">
                        <h4 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[rgb(0,52,50)] drop-shadow-md">{t.sections.scenarios.painSection.solution.costReduction.title}</h4>
                      </div>
                      <div className="text-left">
                        <div dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.solution.costReduction.description}} className="text-xs md:text-sm font-semibold text-[rgb(0,52,50)] drop-shadow-sm">
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 0门槛 */}
                  <div className="text-center bg-white bg-opacity-40 backdrop-blur-lg rounded-lg md:rounded-xl p-3 md:p-3 border border-white border-opacity-50 shadow-lg flex items-center justify-center" style={{minHeight: '70px'}}>
                    <div className="flex items-center justify-center gap-2 md:gap-6">
                      <h4 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[rgb(0,52,50)] drop-shadow-md">{t.sections.scenarios.painSection.solution.zeroBarrier.title}</h4>
                      <div className="text-left">
                        <div dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.solution.zeroBarrier.description}} className="text-xs md:text-sm font-semibold text-[rgb(0,52,50)] drop-shadow-sm">
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 预核验 */}
                  <div className="text-center bg-white bg-opacity-40 backdrop-blur-lg rounded-lg md:rounded-xl p-3 md:p-3 border border-white border-opacity-50 shadow-lg flex items-center justify-center" style={{minHeight: '70px'}}>
                    <div className="flex items-center justify-center gap-2 md:gap-6">
                      <h4 className="text-sm md:text-xl lg:text-2xl xl:text-3xl font-bold text-[rgb(0,52,50)] drop-shadow-md">{t.sections.scenarios.painSection.solution.preValidation.title}</h4>
                      <div className="text-left">
                        <div dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.solution.preValidation.description}} className="text-xs md:text-sm font-semibold text-[rgb(0,52,50)] drop-shadow-sm">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            {/* 供应链压力大 - Light Green */}
            <div className="bg-[#c2f0c2] rounded-lg md:rounded-2xl p-2 md:p-6 lg:p-8 shadow-xl min-h-[60px] md:min-h-[200px] lg:min-h-[240px] flex flex-col justify-center">
              <div className="text-center">
                <h3 className="text-sm md:text-2xl lg:text-3xl font-bold text-[rgb(0,52,50)] mb-1 md:mb-3 lg:mb-4">{t.sections.scenarios.painSection.cards.supplyChainPressure.title}</h3>
                <div className="w-6 md:w-12 h-0.5 bg-[rgb(0,52,50)] mx-auto mb-1 md:mb-4 lg:mb-6"></div>
                <p className="text-xs md:text-sm lg:text-base text-[rgb(0,52,50)] leading-tight" dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.cards.supplyChainPressure.description}}>
                </p>
              </div>
            </div>

            {/* 隐形成本 - Light Blue */}
            <div className="bg-[#c2f5f7] rounded-lg md:rounded-2xl p-2 md:p-6 lg:p-8 shadow-xl min-h-[60px] md:min-h-[200px] lg:min-h-[240px] flex flex-col justify-center">
              <div className="text-center">
                <h3 className="text-sm md:text-2xl lg:text-3xl font-bold text-[rgb(0,52,50)] mb-1 md:mb-3 lg:mb-4">{t.sections.scenarios.painSection.cards.hiddenCost.title}</h3>
                <div className="w-6 md:w-12 h-0.5 bg-[rgb(0,52,50)] mx-auto mb-1 md:mb-4 lg:mb-6"></div>
                <p className="text-xs md:text-sm lg:text-base text-[rgb(0,52,50)] leading-tight" dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.cards.hiddenCost.description}}>
                </p>
              </div>
            </div>

            {/* 反复返工 - Light Pink */}
            <div className="bg-[#ffe0d0] rounded-lg md:rounded-2xl p-2 md:p-6 lg:p-8 shadow-xl min-h-[60px] md:min-h-[200px] lg:min-h-[240px] flex flex-col justify-center">
              <div className="text-center">
                <h3 className="text-sm md:text-2xl lg:text-3xl font-bold text-[rgb(0,52,50)] mb-1 md:mb-3 lg:mb-4">{t.sections.scenarios.painSection.cards.rework.title}</h3>
                <div className="w-6 md:w-12 h-0.5 bg-[rgb(0,52,50)] mx-auto mb-1 md:mb-4 lg:mb-6"></div>
                <p className="text-xs md:text-sm lg:text-base text-[rgb(0,52,50)] leading-tight" dangerouslySetInnerHTML={{__html: t.sections.scenarios.painSection.cards.rework.description}}>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Stacked Cards */}
      <section id="products" className="relative bg-[rgb(0,52,50)] -mt-px" data-theme="products" data-section="what-we-do" data-category="product">
        {/* Scrolling Text Section */}
        <div className="relative overflow-hidden py-16 bg-[rgb(0,52,50)] -mt-px">
          <div className="whitespace-nowrap">
            {/* First Row - Moving Right */}
            <div className="flex animate-scroll-right text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-cyan-custom opacity-80 mb-4">
              {Array.from({length: 6}, (_, i) => (
                <span key={i} className="mx-4 sm:mx-6 md:mx-8">{t.sections.whatWeDo.scrollingText1}</span>
              ))}
            </div>
            {/* Second Row - Moving Left */}
            <div className="flex animate-scroll-left text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold text-[#9ef894] opacity-80">
              {Array.from({length: 6}, (_, i) => (
                <span key={i} className="mx-4 sm:mx-6 md:mx-8">{t.sections.whatWeDo.scrollingText2}</span>
              ))}
            </div>
          </div>
          
          {/* Separator Line */}
          <div className="mt-12 mx-auto w-4/5 h-px bg-white opacity-30"></div>
        </div>

        {/* Fixed Header - What We Do */}
        <div className="sticky top-2 z-50 px-4 sm:pl-8 md:pl-16 lg:pl-28 pb-1 sm:pb-2 lg:pb-4">
          <div className="bg-[rgb(0,52,50)] bg-opacity-90 p-2 sm:p-4 lg:p-6 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-1 sm:mb-2 lg:mb-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-0 sm:mr-6">{t.sections.whatWeDo.title}</h2>
              <svg className="w-8 h-4 sm:w-10 h-5 md:w-12 h-6 text-yellow-400" viewBox="0 0 100 50" fill="currentColor">
                <path d="M10,25 Q50,5 90,25" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M80,20 L90,25 L80,30" fill="currentColor"/>
              </svg>
            </div>
            <p className="text-xs sm:text-base lg:text-lg text-white opacity-90 max-w-lg">
              {t.sections.whatWeDo.subtitle}
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
                      className="w-full bg-gray-800 rounded-xl object-cover h-[170px] sm:h-[220px] lg:h-[430px] cursor-pointer"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      controls={isMobile}
                      onClick={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(() => {});
                      }}
                    >
                      <source src="/videos/video1.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-white text-center lg:text-left">
                  <div className="flex items-center mb-2 sm:mb-3 lg:mb-6">
                    <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-30 rounded-full mr-3 sm:mr-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">01</span>
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">{t.features.card1.title}</h3>
                  </div>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-95">
                    {t.features.card1.description}
                  </p>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg opacity-90" dangerouslySetInnerHTML={{__html: t.features.card1.detail.replace(/\*\*(Value:)\*\*/g, '<span class="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold" style="color: rgb(0, 52, 50);">$1</span>')}}>
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
                      className="w-full bg-gray-800 rounded-xl object-cover h-[170px] sm:h-[220px] lg:h-[430px] cursor-pointer"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      controls={isMobile}
                      onClick={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(() => {});
                      }}
                    >
                      <source src="/videos/video2.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-black text-center lg:text-left">
                  <div className="flex items-center mb-2 sm:mb-3 lg:mb-6">
                    <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-30 rounded-full mr-3 sm:mr-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">02</span>
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">{t.features.card2.title}</h3>
                  </div>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-95">
                    {t.features.card2.description}
                  </p>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg opacity-90" dangerouslySetInnerHTML={{__html: t.features.card2.detail.replace(/\*\*(Value:)\*\*/g, '<span class="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold" style="color: rgb(0, 52, 50);">$1</span>')}}>
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
                      className="w-full bg-gray-800 rounded-xl object-cover h-[170px] sm:h-[220px] lg:h-[430px] cursor-pointer"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      controls={isMobile}
                      onClick={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(() => {});
                      }}
                    >
                      <source src="/videos/video3.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-white text-center lg:text-left">
                  <div className="flex items-center mb-2 sm:mb-3 lg:mb-6">
                    <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-30 rounded-full mr-3 sm:mr-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">03</span>
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">{t.features.card3.title}</h3>
                  </div>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-95">
                    {t.features.card3.description}
                  </p>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg opacity-90" dangerouslySetInnerHTML={{__html: t.features.card3.detail.replace(/\*\*(Value:)\*\*/g, '<span class="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold" style="color: rgb(0, 52, 50);">$1</span>')}}>
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
                      className="w-full bg-gray-800 rounded-xl object-cover h-[170px] sm:h-[220px] lg:h-[430px] cursor-pointer"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      controls={isMobile}
                      onClick={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(() => {});
                      }}
                    >
                      <source src="/videos/video4.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-gray-800 text-center lg:text-left">
                  <div className="flex items-center mb-2 sm:mb-3 lg:mb-6">
                    <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-50 rounded-full mr-3 sm:mr-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">04</span>
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">{t.features.card4.title}</h3>
                  </div>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-90">
                    {t.features.card4.description}
                  </p>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg opacity-80" dangerouslySetInnerHTML={{__html: t.features.card4.detail.replace(/\*\*(Value:)\*\*/g, '<span class="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold" style="color: rgb(0, 52, 50);">$1</span>')}}>
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
                      className="w-full bg-gray-800 rounded-xl object-cover h-[170px] sm:h-[220px] lg:h-[430px] cursor-pointer"
                      style={{ aspectRatio: '16/9' }}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      controls={isMobile}
                      onClick={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.play().catch(() => {});
                      }}
                    >
                      <source src="/videos/video5.mp4" type="video/mp4" />
                      <span className="text-white text-lg">视频加载中...</span>
                    </video>
                  </div>
                </div>
                <div className="order-1 lg:order-2 text-gray-800 text-center lg:text-left">
                  <div className="flex items-center mb-2 sm:mb-3 lg:mb-6">
                    <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white bg-opacity-50 rounded-full mr-3 sm:mr-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">05</span>
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold">{t.features.card5.title}</h3>
                  </div>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 lg:mb-4 opacity-90">
                    {t.features.card5.description}
                  </p>
                  <p className="text-sm sm:text-sm md:text-base lg:text-lg opacity-80" dangerouslySetInnerHTML={{__html: t.features.card5.detail.replace(/\*\*(Value:)\*\*/g, '<span class="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold" style="color: rgb(0, 52, 50);">$1</span>')}}>
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
      <div className="bg-[rgb(0,52,50)] py-8 -my-px">
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
      <section id="comparison" className="py-4 sm:py-8 lg:py-20 bg-[rgb(0,52,50)]" data-theme="comparison" data-section="comparison-overview" data-category="product">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-3 sm:mb-6 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-4 lg:mb-6">{t.sections.comparison.title}</h2>
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
                    <span className="text-base font-bold text-[rgb(0,52,50)]">{t.comparison.aiAgent.steps}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {t.comparison.aiAgent.stepList.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-white bg-opacity-80 px-1.5 py-0.5 rounded-full">
                        <span className="text-xs font-semibold text-[rgb(0,52,50)]">{step}</span>
                      </div>
                      {index < 3 && <span className="text-[rgb(0,52,50)] mx-0.5 text-xs">→</span>}
                    </div>
                  ))}
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
                    <span className="text-sm font-bold text-[rgb(0,52,50)]">{t.comparison.consultant.steps}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {t.comparison.consultant.stepList.map((step, index) => (
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
                    <span className="text-sm font-bold text-[rgb(0,52,50)]">{t.comparison.traditional.steps}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {t.comparison.traditional.stepList.map((step, index) => (
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
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-[rgb(0,52,50)] text-center leading-tight">{t.comparison.aiAgent.title}</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <p className="text-sm sm:text-xl lg:text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight whitespace-pre-line">{t.comparison.aiAgent.steps}</p>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-1 lg:gap-2 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <div className="flex flex-wrap items-center gap-1 lg:gap-2">
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">{t.comparison.aiAgent.stepList[0]}</span>
                    </div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-6 lg:h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs">→</span>
                    </div>
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse delay-300">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">{t.comparison.aiAgent.stepList[1]}</span>
                    </div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-6 lg:h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce delay-300">
                      <span className="text-white text-xs">→</span>
                    </div>
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse delay-500">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">{t.comparison.aiAgent.stepList[2]}</span>
                    </div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-6 lg:h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce delay-500">
                      <span className="text-white text-xs">→</span>
                    </div>
                    <div className="bg-white bg-opacity-80 px-1 sm:px-2 lg:px-4 py-1 lg:py-2 rounded-full shadow-md animate-pulse delay-700">
                      <span className="text-xs lg:text-sm font-semibold text-[rgb(0,52,50)]">{t.comparison.aiAgent.stepList[3]}</span>
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
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-[rgb(0,52,50)] text-center leading-tight px-2">{t.comparison.consultant.title}</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <p className="text-sm sm:text-xl lg:text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight whitespace-pre-line">{t.comparison.consultant.steps}</p>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-1 lg:gap-2 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  {t.comparison.consultant.stepList.map((step, index) => (
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
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-[rgb(0,52,50)] text-center leading-tight">{t.comparison.traditional.title}</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  <p className="text-sm sm:text-xl lg:text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight whitespace-pre-line">{t.comparison.traditional.steps}</p>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-1 lg:gap-2 min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] w-full">
                  {t.comparison.traditional.stepList.map((step, index) => (
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
      <div className="bg-[rgb(0,52,50)] py-8 -my-px">
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
      <section id="value-for-user" className="py-20 bg-[rgb(0,52,50)]" data-theme="value-for-user" data-section="value-overview" data-category="value">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">{t.sections.valueForUser.title}</h2>
          </div>

          {/* Mobile Layout - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto sm:hidden">
            {/* 1% Cost */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.cost.title}</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">{t.sections.value.cards.cost.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">{t.sections.value.cards.cost.description}</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.time.title}</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">{t.sections.value.cards.time.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">{t.sections.value.cards.time.description}</p>
                </div>
              </div>
            </div>

            {/* Zero Barrier */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.barrier.title}</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">{t.sections.value.cards.barrier.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">{t.sections.value.cards.barrier.description}</p>
                </div>
              </div>
            </div>

            {/* Trusted */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-2xl p-3 shadow-xl min-h-[160px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.trusted.title}</h3>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-yellow-400 mb-1 transition-colors duration-300">{t.sections.value.cards.trusted.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-xs">{t.sections.value.cards.trusted.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original 1x4 Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto items-end">
            {/* 1% Cost - Card #1 - 15% Increased */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[216px] sm:min-h-[259px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{t.sections.value.cards.cost.title}</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.cost.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">{t.sections.value.cards.cost.description}</p>
                </div>
              </div>
            </div>

            {/* Hours - Card #2 - 15% Increased */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[216px] sm:min-h-[259px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{t.sections.value.cards.time.title}</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.time.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">{t.sections.value.cards.time.description}</p>
                </div>
              </div>
            </div>

            {/* Zero Barrier - Card #3 - 20% Increased from 25% reduced base */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[252px] sm:min-h-[288px] lg:min-h-[350px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{t.sections.value.cards.barrier.title}</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.barrier.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">{t.sections.value.cards.barrier.description}</p>
                </div>
              </div>
            </div>

            {/* Trusted - Card #4 - 15% Increased */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-6 sm:p-8 shadow-xl min-h-[216px] sm:min-h-[259px] flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">{t.sections.value.cards.trusted.title}</h3>
                <div className="mt-auto">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">{t.sections.value.cards.trusted.subtitle}</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300 text-sm sm:text-base">{t.sections.value.cards.trusted.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bg-[rgb(0,52,50)] py-8 -my-px">
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
      <section id="pricing" className="min-h-screen py-12 sm:py-20 bg-[rgb(0,52,50)] -mt-px" data-theme="pricing" data-section="pricing-overview" data-category="conversion">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{transform: 'translateY(-1cm)'}}>
          <div className="text-center mb-6 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-6">{t.sections.pricing.title}</h2>
            <p className="text-base sm:text-xl text-white opacity-90 max-w-3xl mx-auto">
              {t.sections.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Free Plan Card */}
            <div className="bg-[#6195fe] backdrop-blur-sm p-3 sm:p-8 rounded-2xl shadow-lg border border-blue-300 flex flex-col justify-between min-h-[170px] sm:min-h-[400px]">
              <div>
                <div className="h-2 sm:h-8 mb-1 sm:mb-4"></div>
                <h3 className="text-base sm:text-2xl font-semibold mb-1 sm:mb-4 text-gray-800 text-center">{t.sections.pricing.plans.free.title}</h3>
                <div className="mb-2 sm:mb-6 text-center">
                  <span className="text-xl sm:text-4xl font-bold text-gray-800">{t.sections.pricing.plans.free.price}</span>
                  <span className="text-gray-600 text-xs sm:text-base">/month</span>
                </div>
                <div className="min-h-[35px] sm:min-h-[120px]">
                  <ul className="space-y-0.5 sm:space-y-3 text-gray-700 text-xs sm:text-base">
                    {t.sections.pricing.plans.free.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a 
                href="#contact"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1 sm:py-3 rounded-lg font-semibold transition duration-300 text-xs sm:text-base text-center block"
              >
                {t.sections.pricing.plans.free.button}
              </a>
            </div>

            {/* Standard Plan Card */}
            <div className="bg-[#9ef894] backdrop-blur-sm p-3 sm:p-8 rounded-2xl shadow-xl transform lg:scale-105 border border-[#8ee884] flex flex-col justify-between min-h-[170px] sm:min-h-[400px]">
              <div>
                <div className="h-3 sm:h-8 mb-1 sm:mb-4 flex justify-center items-start">
                  <span className="bg-gray-800 text-white px-1.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold -mt-1">{t.sections.pricing.plans.standard.popular}</span>
                </div>
                <h3 className="text-base sm:text-2xl font-semibold mb-1 sm:mb-4 text-gray-800 text-center">{t.sections.pricing.plans.standard.title}</h3>
                <div className="mb-2 sm:mb-6 text-center">
                  <span className="text-xl sm:text-4xl font-bold text-gray-800">{t.sections.pricing.plans.standard.price}</span>
                  <span className="text-gray-600 text-xs sm:text-base">/month</span>
                </div>
                <div className="min-h-[35px] sm:min-h-[120px]">
                  <ul className="space-y-0.5 sm:space-y-3 text-gray-700 text-xs sm:text-base">
                    {t.sections.pricing.plans.standard.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a 
                href="#contact"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1 sm:py-3 rounded-lg font-semibold transition duration-300 text-xs sm:text-base text-center block"
              >
                {t.sections.pricing.plans.standard.button}
              </a>
            </div>

            {/* Enterprise Plan Card */}
            <div className="bg-[#98a2f8] backdrop-blur-sm p-3 sm:p-8 rounded-2xl shadow-lg border border-purple-300 flex flex-col justify-between min-h-[170px] sm:min-h-[400px] md:col-span-2 lg:col-span-1">
              <div>
                <div className="h-2 sm:h-8 mb-1 sm:mb-4"></div>
                <h3 className="text-base sm:text-2xl font-semibold mb-1 sm:mb-4 text-gray-800 text-center">{t.sections.pricing.plans.enterprise.title}</h3>
                <div className="mb-2 sm:mb-6 text-center">
                  <span className="text-xl sm:text-4xl font-bold text-gray-800">{t.sections.pricing.plans.enterprise.price}</span>
                </div>
                <div className="min-h-[35px] sm:min-h-[120px]">
                  <ul className="space-y-0.5 sm:space-y-3 text-gray-700 text-xs sm:text-base">
                    {t.sections.pricing.plans.enterprise.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a 
                href="#contact"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-1 sm:py-3 rounded-lg font-semibold transition duration-300 text-xs sm:text-base text-center block"
              >
                {t.sections.pricing.plans.enterprise.button}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="bg-[rgb(0,52,50)] py-8 -my-px">
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
      <section id="about" className="py-6 sm:py-10 bg-[rgb(0,52,50)]" data-theme="about" data-section="about-main" data-category="info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center min-h-[280px] sm:min-h-[350px] md:min-h-[420px]">
            {/* Left side - Polar Bear Image */}
            <div className="relative h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden lg:pl-40 order-2 lg:order-1" style={{transform: 'translateY(0cm)'}}>
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
            <div className="text-white flex flex-col justify-center h-full order-1 lg:order-2" style={{transform: 'translateY(0cm)'}}>
              {/* Centered content */}
              <div className="text-center space-y-8 sm:space-y-10 md:space-y-12">
                {/* About Us title - centered */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">{t.sections.aboutUs.title}</h2>
                </div>
                
                {/* First section - centered */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                    {t.sections.aboutUs.subtitle1}
                  </h3>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                    {t.sections.aboutUs.subtitle2}
                  </h3>
                </div>
                
                {/* Second section - centered with green highlight */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                    {t.sections.aboutUs.subtitle3}
                  </h3>
                  <div className="relative inline-block">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#9ef894] leading-tight">
                      {t.sections.aboutUs.highlightText}
                    </h3>
                    {/* Hand-drawn style underline */}
                    <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 right-0 flex justify-center">
                      <svg width="150" height="8" viewBox="0 0 200 12" className="text-[#9ef894] sm:w-[180px] sm:h-[10px] md:w-[400px] md:h-[12px]">
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
      <div className="bg-[rgb(0,52,50)] py-2 -my-px">
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
      <section id="contact" className="py-8 sm:py-10 bg-[rgb(0,52,50)] text-white" data-theme="contact" data-section="contact-form" data-category="conversion">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">{t.contact.title}</h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-3xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-6xl mx-auto">
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">{t.sections.moreInfo}</h3>
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
                
                {/* New Contact Logo */}
<div className="mt-6 sm:mt-8 pt-4 sm:pt-6">
  <div className="flex justify-start">
    <Image
      src="/new-contact-logo.png"
      alt="Climate Seal Contact Logo"
      width={280}
      height={84}
      className="object-contain w-full max-w-[210px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[420px]"
      unoptimized={true}
      style={{
        clipPath: 'inset(0 0.5% 2% 0)'
      }}
    />
  </div>
</div>
              </div>
            </div>

            <div className="bg-[#98a2f8] bg-opacity-90 p-4 sm:p-6 rounded-2xl backdrop-blur-sm self-start order-1 lg:order-2">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">{t.contact.form.submit}</h3>
              <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2" data-form="contact-form" data-section="contact-form">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-black">{t.contact.form.name}*</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-1.5 sm:p-2 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                    placeholder={t.contact.form.placeholder.name}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-black">{t.contact.form.email}*</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-1.5 sm:p-2 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                    placeholder={t.contact.form.placeholder.email}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-black">{t.contact.form.phone}*</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-1.5 sm:p-2 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                    placeholder={t.contact.form.placeholder.phone}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-black">{t.contact.form.company}*</label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full p-1.5 sm:p-2 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                    placeholder={t.contact.form.placeholder.company}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-black">{t.contact.form.industry || '行业'}*</label>
                  <select 
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full p-1.5 sm:p-2 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                    required
                  >
                    <option value="">{t.contact.form.placeholder?.industry || '请选择您的行业'}</option>
                    <option value="automotive">{t.contact.form.industries?.automotive || '汽车制造业'}</option>
                    <option value="electronics">{t.contact.form.industries?.electronics || '电子电器'}</option>
                    <option value="textiles">{t.contact.form.industries?.textiles || '纺织服装'}</option>
                    <option value="chemicals">{t.contact.form.industries?.chemicals || '化工化学'}</option>
                    <option value="food-beverage">{t.contact.form.industries?.foodBeverage || '食品饮料'}</option>
                    <option value="construction">{t.contact.form.industries?.construction || '建筑建材'}</option>
                    <option value="metals">{t.contact.form.industries?.metals || '钢铁金属'}</option>
                    <option value="plastics">{t.contact.form.industries?.plastics || '塑料橡胶'}</option>
                    <option value="packaging">{t.contact.form.industries?.packaging || '包装印刷'}</option>
                    <option value="pharmaceuticals">{t.contact.form.industries?.pharmaceuticals || '医药医疗'}</option>
                    <option value="energy">{t.contact.form.industries?.energy || '能源电力'}</option>
                    <option value="manufacturing">{t.contact.form.industries?.manufacturing || '机械制造'}</option>
                    <option value="furniture">{t.contact.form.industries?.furniture || '家具家居'}</option>
                    <option value="cosmetics">{t.contact.form.industries?.cosmetics || '美妆个护'}</option>
                    <option value="toys">{t.contact.form.industries?.toys || '玩具用品'}</option>
                    <option value="agriculture">{t.contact.form.industries?.agriculture || '农业食品'}</option>
                    <option value="transportation">{t.contact.form.industries?.transportation || '交通运输'}</option>
                    <option value="retail">{t.contact.form.industries?.retail || '零售贸易'}</option>
                    <option value="other">{t.contact.form.industries?.other || '其他'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-black">{t.contact.form.message}*</label>
                  <textarea 
                    rows={2}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-1.5 sm:p-2 rounded-lg bg-white bg-opacity-90 border border-white border-opacity-50 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none text-sm"
                    placeholder={t.contact.form.placeholder.message}
                    required
                  ></textarea>
                </div>
                
                {submitMessage && (
                  <div className={`text-sm p-2 rounded-lg ${
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
                  className={`w-full py-1.5 sm:py-2 rounded-lg font-semibold transition duration-300 text-center text-sm ${
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