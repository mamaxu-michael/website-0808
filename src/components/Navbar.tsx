'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ClimateSealLogo from './ClimateSealLogo';
import { useLanguage, LanguageSwitcher } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.products, href: '#products' },
    { name: t.nav.pricing, href: '#pricing' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    // Smooth scroll to section
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
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-lg font-medium transition duration-300 cursor-pointer"
              >
                {item.name}
              </button>
            ))}
            {/* Language Switcher */}
            <LanguageSwitcher />
            {/* User Login Button */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <span className="text-white text-lg">{t.nav.login}</span>
            </div>
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
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-lg font-medium w-full text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-teal-700 pt-3 mt-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <span className="text-white text-lg">{t.nav.login}</span>
                  </div>
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