#!/usr/bin/env python3
"""
调试脚本：分析单个供应商页面
"""

import requests
from bs4 import BeautifulSoup
import re

def debug_supplier_page(url):
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    try:
        print(f"调试页面: {url}")
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print(f"页面标题: {soup.find('title').text if soup.find('title') else '无标题'}")
        
        # 查找所有链接
        links = soup.find_all('a', href=True)
        print(f"\n所有链接 ({len(links)} 个):")
        for i, link in enumerate(links[:20]):  # 只显示前20个
            href = link.get('href', '')
            text = link.get_text(strip=True)
            print(f"  {i+1}. {text[:50]} -> {href}")
        
        # 查找邮箱
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        page_text = soup.get_text()
        emails = re.findall(email_pattern, page_text)
        if emails:
            print(f"\n找到的邮箱: {emails}")
        else:
            print("\n未在页面文本中找到邮箱")
        
        # 查找mailto链接
        mailto_links = soup.find_all('a', href=re.compile(r'mailto:'))
        if mailto_links:
            print(f"\nMailto链接:")
            for link in mailto_links:
                print(f"  {link['href']} -> {link.get_text(strip=True)}")
        else:
            print("\n未找到mailto链接")
        
        # 查找可能包含联系信息的区域
        contact_keywords = ['contact', 'email', 'phone', 'tel', 'website', 'www']
        print(f"\n包含联系关键词的元素:")
        for keyword in contact_keywords:
            elements = soup.find_all(text=re.compile(keyword, re.I))
            if elements:
                print(f"  '{keyword}': {len(elements)} 个匹配")
                for elem in elements[:3]:  # 只显示前3个
                    parent = elem.parent if elem.parent else None
                    if parent:
                        print(f"    {parent.name}: {str(elem).strip()[:100]}")
        
        # 查找所有外部链接
        external_links = []
        for link in links:
            href = link.get('href', '')
            if href.startswith('http') and 'commonobjective.co' not in href:
                text = link.get_text(strip=True)
                external_links.append((href, text))
        
        if external_links:
            print(f"\n外部链接 ({len(external_links)} 个):")
            for href, text in external_links[:10]:
                print(f"  {text[:30]} -> {href}")
        
        return True
        
    except Exception as e:
        print(f"调试失败: {e}")
        return False

if __name__ == "__main__":
    # 测试Better Packaging Co.页面
    test_url = "https://www.commonobjective.co/better-packaging-co"
    debug_supplier_page(test_url)