'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ClimateSealLogo from './ClimateSealLogo';
import { useLanguage, LanguageSwitcher } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const { t, language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: t.nav.home, href: '#home', route: '/' },
    { name: t.nav.products, href: '#products', route: '/' },
    { name: t.nav.pricing, href: '#pricing', route: '/' },
    { name: t.nav.about, href: '#about', route: '/' },
    { name: t.nav.contact, href: '#contact', route: '/' },
  ];

  const handleNavClick = (href: string, route: string) => {
    setIsOpen(false);
    
    // If we're not on the homepage, navigate to homepage first
    if (pathname !== '/') {
      router.push(route + href);
      return;
    }
    
    // If we're on homepage, smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-[rgb(0,52,50)] bg-opacity-95 backdrop-blur-sm shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 sm:h-24">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <ClimateSealLogo />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              // Special handling for Products menu
              if (item.name === t.nav.products) {
                return (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                      className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-lg font-medium transition duration-300 cursor-pointer flex items-center space-x-1"
                    >
                      <span>{item.name}</span>
                      <svg className={`w-4 h-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isProductsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-[rgb(0,52,50)] bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 z-50">
                        <Link
                          href="/solution-resources"
                          className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/5 transition-colors rounded-lg"
                          onClick={() => setIsProductsDropdownOpen(false)}
                        >
                          {language === 'zh' ? '解决方案资源' : 'Solution Resources'}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href, item.route)}
                  className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-lg font-medium transition duration-300 cursor-pointer"
                >
                  {item.name}
                </button>
              );
            })}
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-400 hover:bg-teal-800"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-teal-800 bg-opacity-95">
              {navItems.map((item) => {
                // Special handling for Products menu in mobile
                if (item.name === t.nav.products) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                        className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-lg font-medium w-full text-left flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        <svg className={`w-4 h-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isProductsDropdownOpen && (
                        <div className="pl-6 py-2">
                          <Link
                            href="/solution-resources"
                            className="block px-3 py-2 text-white hover:text-yellow-400 hover:bg-white/5 rounded-md transition-colors"
                            onClick={() => {
                              setIsProductsDropdownOpen(false);
                              setIsOpen(false);
                            }}
                          >
                            {language === 'zh' ? '解决方案资源' : 'Solution Resources'}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href, item.route)}
                    className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-lg font-medium w-full text-left"
                  >
                    {item.name}
                  </button>
                );
              })}
              <div className="border-t border-teal-700 pt-3 mt-3">
                <div className="flex items-center justify-center px-3 py-2">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;