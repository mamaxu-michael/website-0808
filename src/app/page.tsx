'use client';

import React from 'react';
import Image from 'next/image';

export default function Home() {
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
      `}</style>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="min-h-screen bg-[rgb(0,52,50)] relative overflow-hidden">
        {/* Background overlay - removed for unified color */}
        
        <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left text-white px-4 lg:px-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              Climate Seal
            </h1>
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              AI Carbon Footprint
            </h2>
            <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
              Credibility Drives Better Climate
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-[rgb(0,52,50)] px-8 py-3 rounded-full font-semibold text-lg transition duration-300">
              Get Trial
            </button>
          </div>
          
          {/* Polar Bears Image */}
          <div className="relative h-full min-h-[600px] lg:min-h-screen">
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
            <div className="flex animate-scroll-right text-6xl md:text-8xl font-bold text-white opacity-80 mb-4">
              <span className="mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-8">Gain Credibility At Low Cost</span>
              <span className="mx-8">Gain Credibility At Low Cost</span>
            </div>
            {/* Second Row - Moving Left */}
            <div className="flex animate-scroll-left text-6xl md:text-8xl font-bold text-[#9ef894] opacity-80">
              <span className="mx-8">Use Credit At Low Cost</span>
              <span className="mx-8">Use Credit At Low Cost</span>
              <span className="mx-8">Use Credit At Low Cost</span>
              <span className="mx-8">Use Credit At Low Cost</span>
              <span className="mx-8">Use Credit At Low Cost</span>
              <span className="mx-8">Use Credit At Low Cost</span>
            </div>
          </div>
          
          {/* Separator Line */}
          <div className="mt-12 mx-auto w-4/5 h-px bg-white opacity-30"></div>
        </div>

        {/* Fixed Header - What We Do */}
        <div className="sticky top-4 z-50 pl-28 pb-4">
          <div className="bg-[rgb(0,52,50)] bg-opacity-90 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white mr-6">What We Do</h2>
              <svg className="w-12 h-6 text-yellow-400" viewBox="0 0 100 50" fill="currentColor">
                <path d="M10,25 Q50,5 90,25" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M80,20 L90,25 L80,30" fill="currentColor"/>
              </svg>
            </div>
            <p className="text-lg text-white opacity-90 max-w-lg">
              Get a credible carbon footprint at 1% of the cost and time
            </p>
          </div>
        </div>

        {/* Stacked Product Cards */}
        <div className="relative container mx-auto px-4">
          {/* Card 1 - Blue */}
          <div className="sticky top-55 z-10 mb-16">
            <div className="bg-gradient-to-r from-[#6195fe] to-[#6195fe] rounded-3xl p-12 shadow-2xl min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover"
                      style={{ aspectRatio: '16/9', height: '430px' }}
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
                <div className="order-1 lg:order-2 text-white">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 rounded-full mb-6">
                    <span className="text-2xl font-bold text-gray-800">01</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Auto Regulation Match & LCA Build</h3>
                  <p className="text-lg mb-4 opacity-95">
                    Enter a product name and sales region, and the engine fetches the newest EU Battery Regulation 2023/1542 and ISO 14067 requirements, then spins up a compliant boundary and base LCA in 30 seconds.
                  </p>
                  <p className="text-base opacity-90">
                    Eliminates 90% of regulatory research effort and ships a multi-standard-ready model that sails through audits and customer reviews.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Green */}
          <div className="sticky top-55 z-20 mb-16">
            <div className="bg-gradient-to-r from-[#9ef894] to-[#9ef894] rounded-3xl p-12 shadow-2xl min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover"
                      style={{ aspectRatio: '16/9', height: '430px' }}
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
                <div className="order-1 lg:order-2 text-white">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 rounded-full mb-6">
                    <span className="text-2xl font-bold text-gray-800">02</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">BOM Parsing in Seconds</h3>
                  <p className="text-lg mb-4 opacity-95">
                    Drop an Excel or ERP BOM and the system instantly extracts hierarchy, quantities and materials—no line-by-line typing.
                  </p>
                  <p className="text-base opacity-90">
                    Thousands-part assemblies become calculation-ready in minutes, and engineering, finance and carbon teams work off the same structured table.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Purple/Lavender */}
          <div className="sticky top-55 z-30 mb-16">
            <div className="bg-gradient-to-r from-[#98a2f8] to-[#98a2f8] rounded-3xl p-12 shadow-2xl min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover"
                      style={{ aspectRatio: '16/9', height: '430px' }}
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
                <div className="order-1 lg:order-2 text-white">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-30 rounded-full mb-6">
                    <span className="text-2xl font-bold text-gray-800">03</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Smart Emission-Factor Matching</h3>
                  <p className="text-lg mb-4 opacity-95">
                    The engine live-matches BOM lines, energy and logistics data against ecoinvent and other libraries, returning the optimal factor, provenance
                  </p>
                  <p className="text-base opacity-90">
                    Cuts weeks of manual lookup, while fully traceable factors pass audits or customer spot-checks instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Peach/Salmon */}
          <div className="sticky top-55 z-40 mb-16">
            <div className="bg-gradient-to-r from-[#ffe0d0] to-[#ffe0d0] rounded-3xl p-12 shadow-2xl min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover"
                      style={{ aspectRatio: '16/9', height: '430px' }}
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
                <div className="order-1 lg:order-2 text-gray-800">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-50 rounded-full mb-6">
                    <span className="text-2xl font-bold text-gray-800">04</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Quality & Risk Analytics</h3>
                  <p className="text-lg mb-4 opacity-90">
                    One click builds a data-quality radar, a ±95% Monte-Carlo band, and a heat-map that flags high-impact, low-quality items—then rolls up an overall trust score.
                  </p>
                  <p className="text-base opacity-80">
                    Teams see the critical 20% of inputs that drive 80% of uncertainty, and quantified CIs give investors, auditors and insurers a solid risk metric.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 - Light Teal/Cyan */}
          <div className="sticky top-55 z-50 mb-16">
            <div className="bg-gradient-to-r from-[#c2f5f7] to-[#c2f5f7] rounded-3xl p-12 shadow-2xl min-h-[490px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center h-full">
                <div className="order-2 lg:order-1">
                  <div className="bg-gray-900 rounded-2xl p-2">
                    <video 
                      className="w-full bg-gray-800 rounded-xl object-cover"
                      style={{ aspectRatio: '16/9', height: '430px' }}
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
                <div className="order-1 lg:order-2 text-gray-800">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-50 rounded-full mb-6">
                    <span className="text-2xl font-bold text-gray-800">05</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">End-to-End Custom Service</h3>
                  <p className="text-lg mb-4 opacity-90">
                    The supply-chain module bulk-invites Tier-2/3 suppliers, lets AI auto-calculate their footprints, and syncs bidirectionally with SAP Green Ledger, Oracle NetSuite and other ERP/SRM suites. Credit-scored, high-quality data can be packaged into carbon assets and linked to finance partners.
                  </p>
                  <p className="text-base opacity-80">
                    Suppliers create audit-grade reports at just 1% of the usual time and cost, sharing only final numbers to stay secure; brands obtain high-trust results and cut supply-chain carbon-management costs by 90%+. Credit-approved data can be monetised as carbon assets or collateral for green loans, unlocking climate value early.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-[rgb(0,52,50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Compare With Traditional Way</h2>
          </div>

          <div className="space-y-8">
            {/* Climate Seal AI - 4 Steps */}
            <div className="bg-[#9ef894] rounded-3xl p-8 shadow-2xl min-h-[200px] flex items-center">
              <div className="grid items-center w-full" style={{gridTemplateColumns: '1fr 120px 3fr'}}>
                <div className="flex flex-col items-center justify-center space-y-4 min-h-[120px]">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <div className="text-2xl font-bold text-[rgb(0,52,50)]">🤖</div>
                  </div>
                  <h3 className="text-lg font-bold text-[rgb(0,52,50)] text-center">AI Agent</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight">4<br/>STEPS</p>
                </div>
                <div className="flex items-center justify-center space-x-4 min-h-[120px]">
                  <div className="flex items-center space-x-2">
                    <div className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-md animate-pulse">
                      <span className="text-sm font-semibold text-[rgb(0,52,50)]">① Minimal Data</span>
                    </div>
                    <div className="w-6 h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs">→</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-md animate-pulse delay-300">
                      <span className="text-sm font-semibold text-[rgb(0,52,50)]">② Confirm</span>
                    </div>
                    <div className="w-6 h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce delay-300">
                      <span className="text-white text-xs">→</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-md animate-pulse delay-500">
                      <span className="text-sm font-semibold text-[rgb(0,52,50)]">③ Send to Verifier</span>
                    </div>
                    <div className="w-6 h-6 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce delay-500">
                      <span className="text-white text-xs">→</span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-md animate-pulse delay-700">
                    <span className="text-sm font-semibold text-[rgb(0,52,50)]">④ Certification</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Expert + Software - 11 Steps */}
            <div className="bg-[#c2f5f7] rounded-3xl p-8 shadow-2xl min-h-[200px] flex items-center">
              <div className="grid items-center w-full" style={{gridTemplateColumns: '1fr 120px 3fr'}}>
                <div className="flex flex-col items-center justify-center space-y-4 min-h-[120px]">
                  <div className="flex items-center space-x-2">
                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                      <div className="text-xl font-bold text-[rgb(0,52,50)]">👨‍💼</div>
                    </div>
                    <div className="text-2xl font-bold text-[rgb(0,52,50)]">+</div>
                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                      <div className="text-xl font-bold text-[rgb(0,52,50)]">💻</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[rgb(0,52,50)] text-center">Third Party Carbon Consultant + Carbon Accounting Software</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight">11<br/>STEPS</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 min-h-[120px]">
                  {[
                    "① Training", "② Doc + Reg Map", "③ Data Checklist", "④ Data Clean",
                    "⑤ Gap Fill", "⑥ Build Model", "⑦ Factor Match", "⑧ Submit",
                    "⑨ Issue List", "⑩ Corrections", "⑪ Certification"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className={`bg-white bg-opacity-80 px-3 py-1 rounded-full shadow-md text-xs font-semibold text-[rgb(0,52,50)] animate-pulse`} 
                           style={{animationDelay: `${index * 200}ms`}}>
                        {step}
                      </div>
                      {index < 10 && (
                        <div className={`w-4 h-4 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce`}
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
            <div className="bg-[#98a2f8] rounded-3xl p-8 shadow-2xl min-h-[200px] flex items-center">
              <div className="grid items-center w-full" style={{gridTemplateColumns: '1fr 120px 3fr'}}>
                <div className="flex flex-col items-center justify-center space-y-4 min-h-[120px]">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <div className="text-2xl font-bold text-[rgb(0,52,50)]">👨‍💼</div>
                  </div>
                  <h3 className="text-lg font-bold text-[rgb(0,52,50)] text-center">Third Party Carbon Consultant</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[120px]">
                  <p className="text-3xl font-bold text-[rgb(0,52,50)] text-center leading-tight">12<br/>STEPS</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 min-h-[120px]">
                  {[
                    "① Kick-Off", "② Info Search", "③ Data Prep", "④ Clean + Interview",
                    "⑤ Calc Model", "⑥ Factor Calc", "⑦ Draft Report", "⑧ Review",
                    "⑨ Submit to Verifier", "⑩ Issue Feedback", "⑪ Info Correction", "⑫ Certification"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className={`bg-white bg-opacity-80 px-3 py-1 rounded-full shadow-md text-xs font-semibold text-[rgb(0,52,50)] animate-pulse`}
                           style={{animationDelay: `${index * 150}ms`}}>
                        {step}
                      </div>
                      {index < 11 && (
                        <div className={`w-4 h-4 bg-[rgb(0,52,50)] rounded-full flex items-center justify-center animate-bounce`}
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

      {/* Value Section */}
      <section className="py-20 bg-[rgb(0,52,50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Value For User And Enterprise</h2>
          </div>

          <div className="flex justify-center items-end gap-8 max-w-7xl mx-auto">
            {/* 1% Cost */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-8 shadow-xl min-h-[300px] w-72 flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-4xl font-bold text-white group-hover:text-yellow-400 mb-4 transition-colors duration-300">1% Cost</h3>
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Cost Reduce</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300">Less Than $70 Per Credible Report</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-8 shadow-xl min-h-[300px] w-72 flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-4xl font-bold text-white group-hover:text-yellow-400 mb-4 transition-colors duration-300">Hours</h3>
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Time Saving</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300">From Months To Hours</p>
                </div>
              </div>
            </div>

            {/* Zero Barrier */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-8 shadow-xl min-h-[390px] w-72 flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-4xl font-bold text-white group-hover:text-yellow-400 mb-4 transition-colors duration-300">Zero Barrier</h3>
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Zero Experience Requirement</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300">Any Role Can Create Credible Result</p>
                </div>
              </div>
            </div>

            {/* Trusted */}
            <div className="group bg-[#6366f1] hover:bg-[#5b57f7] rounded-3xl p-8 shadow-xl min-h-[300px] w-72 flex flex-col justify-between transition-all duration-300 hover:scale-105 cursor-pointer">
              <div>
                <h3 className="text-4xl font-bold text-white group-hover:text-yellow-400 mb-4 transition-colors duration-300">Trusted</h3>
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 mb-2 transition-colors duration-300">Verification Level Credibility</h4>
                  <p className="text-white group-hover:text-yellow-400 opacity-80 group-hover:opacity-100 transition-all duration-300">Virtual Certification Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen py-20 bg-[rgb(0,52,50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Pricing Plans</h2>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              Choose the right plan to start your carbon footprint journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-[#6195fe] backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-blue-300 flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="h-8 mb-4"></div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Free Version</h3>
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-gray-800">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="min-h-[120px]">
                  <ul className="space-y-3 text-gray-700">
                    <li>✓ 50 free factor matching per month</li>
                    <li>✓ Registration required</li>
                  </ul>
                </div>
              </div>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition duration-300">
                Get Started
              </button>
            </div>

            <div className="bg-[#9ef894] backdrop-blur-sm p-8 rounded-2xl shadow-xl transform scale-105 border border-[#8ee884] flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="h-8 mb-4 flex justify-center">
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">Popular</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Standard Version</h3>
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-gray-800">$98</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="min-h-[120px]">
                  <ul className="space-y-3 text-gray-700">
                    <li>✓ 200 factor matching per month</li>
                    <li>✓ Equivalent to 3-5 general product carbon footprint reports</li>
                  </ul>
                </div>
              </div>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition duration-300">
                Upgrade Now
              </button>
            </div>

            <div className="bg-[#98a2f8] backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-300 flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="h-8 mb-4"></div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Enterprise Version</h3>
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-gray-800">Custom</span>
                </div>
                <div className="min-h-[120px]">
                  <ul className="space-y-3 text-gray-700">
                    <li>✓ ERP/CRM/SRM integration</li>
                    <li>✓ Asset development features</li>
                    <li>✓ Supply chain management</li>
                    <li>✓ Custom deployment service</li>
                  </ul>
                </div>
              </div>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl font-bold text-[rgb(0,52,50)] mb-8">关于我们</h2>
                <p className="text-xl text-gray-600 mb-6">
                  Climate Seal 致力于通过先进的AI技术和数据分析，帮助企业实现碳中和目标，推动全球气候变化的积极改善。
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  我们的使命是让每一个企业都能轻松追踪、分析和优化自己的碳足迹，为地球的可持续发展贡献力量。通过可信的数据和智能的解决方案，我们相信每一个小小的改变都能带来巨大的影响。
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[rgb(0,52,50)] mb-2">100+</div>
                    <div className="text-gray-600">合作企业</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[rgb(0,52,50)] mb-2">50M+</div>
                    <div className="text-gray-600">减少碳排放 (吨)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[rgb(0,52,50)] mb-2">95%</div>
                    <div className="text-gray-600">客户满意度</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-100 to-blue-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-semibold text-[rgb(0,52,50)] mb-6">我们的价值观</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-4">🌱</span>
                      <div>
                        <h4 className="font-semibold text-[rgb(0,52,50)] mb-1">可持续性</h4>
                        <p className="text-gray-600">致力于为地球的长远发展提供解决方案</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-4">🔬</span>
                      <div>
                        <h4 className="font-semibold text-[rgb(0,52,50)] mb-1">创新</h4>
                        <p className="text-gray-600">运用前沿技术推动环保领域的突破</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-4">🤝</span>
                      <div>
                        <h4 className="font-semibold text-[rgb(0,52,50)] mb-1">合作</h4>
                        <p className="text-gray-600">与全球伙伴共同建设绿色未来</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 bg-[rgb(0,52,50)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">联系我们</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              准备开始您的碳中和之旅？我们的专家团队随时为您提供支持
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold mb-8">获取更多信息</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📧</span>
                  <div>
                    <h4 className="font-semibold mb-1">邮箱</h4>
                    <p className="opacity-80">info@climate-seal.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <h4 className="font-semibold mb-1">电话</h4>
                    <p className="opacity-80">+86 400-123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">🏢</span>
                  <div>
                    <h4 className="font-semibold mb-1">办公地址</h4>
                    <p className="opacity-80">上海市浦东新区陆家嘴金融中心</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">⏰</span>
                  <div>
                    <h4 className="font-semibold mb-1">工作时间</h4>
                    <p className="opacity-80">周一至周五 9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-6">发送消息</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">姓名</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">邮箱</label>
                  <input 
                    type="email" 
                    className="w-full p-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">公司名称</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="请输入公司名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">消息内容</label>
                  <textarea 
                    rows={4}
                    className="w-full p-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                    placeholder="请描述您的需求或问题"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-[rgb(0,52,50)] py-3 rounded-lg font-semibold transition duration-300"
                >
                  发送消息
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