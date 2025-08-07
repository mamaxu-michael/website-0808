import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Climate Seal</h3>
            <p className="text-gray-300 mb-4">
              致力于提供环保解决方案，保护地球气候。
            </p>
            <p className="text-gray-400 text-sm">
              &copy; 2024 Climate Seal. 版权所有。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition duration-300">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition duration-300">
                  产品
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition duration-300">
                  价格
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition duration-300">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">联系信息</h4>
            <ul className="space-y-2 text-gray-300">
              <li>邮箱: info@climate-seal.com</li>
              <li>电话: +1 (555) 123-4567</li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition duration-300">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              Built with Next.js & Tailwind CSS
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                服务条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;