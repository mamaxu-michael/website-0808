#!/usr/bin/env python3
"""
专门分析Better Packaging Co.页面的联系信息
重点寻找contact区域的邮箱信息
"""

import requests
from bs4 import BeautifulSoup
import re

def deep_analyze_better_packaging():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        print(f"深度分析页面: {url}")
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print(f"页面标题: {soup.find('title').text}")
        print("\n" + "="*60)
        
        # 1. 查找包含"contact"的所有元素
        print("🔍 查找包含'contact'的元素:")
        contact_elements = soup.find_all(string=re.compile(r'contact', re.I))
        for i, elem in enumerate(contact_elements[:10]):
            parent = elem.parent if elem.parent else None
            if parent:
                print(f"  {i+1}. {parent.name}: {str(elem).strip()}")
                # 查看父元素的周围内容
                siblings = parent.find_next_siblings()[:3]
                for sibling in siblings:
                    text = sibling.get_text(strip=True)
                    if text and len(text) < 200:
                        print(f"     -> {text}")
        
        print("\n" + "="*60)
        
        # 2. 查找所有可能包含邮箱的区域
        print("📧 在整个页面搜索邮箱模式:")
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        
        # 在页面文本中搜索
        page_text = soup.get_text()
        emails_in_text = re.findall(email_pattern, page_text)
        if emails_in_text:
            print(f"  页面文本中找到: {emails_in_text}")
        else:
            print("  页面文本中未找到邮箱")
        
        # 在HTML源码中搜索（有时邮箱在注释或隐藏元素中）
        html_source = str(soup)
        emails_in_html = re.findall(email_pattern, html_source)
        if emails_in_html:
            print(f"  HTML源码中找到: {list(set(emails_in_html))}")
        
        print("\n" + "="*60)
        
        # 3. 查找特定的联系信息区域
        print("📋 查找联系信息区域:")
        
        # 查找可能包含联系信息的div/section
        contact_keywords = ['contact', 'email', 'reach', 'get in touch', 'connect']
        for keyword in contact_keywords:
            elements = soup.find_all(['div', 'section', 'p', 'span'], 
                                   string=re.compile(keyword, re.I))
            if elements:
                print(f"\n  包含'{keyword}'的元素:")
                for elem in elements[:3]:
                    print(f"    {elem.name}: {elem.get_text(strip=True)[:100]}")
                    # 查看这个元素的父容器
                    parent = elem.parent
                    if parent:
                        parent_text = parent.get_text(strip=True)
                        emails_in_parent = re.findall(email_pattern, parent_text)
                        if emails_in_parent:
                            print(f"      ✅ 父元素中找到邮箱: {emails_in_parent}")
        
        print("\n" + "="*60)
        
        # 4. 查找所有链接，特别是mailto和可能的contact页面
        print("🔗 分析所有链接:")
        links = soup.find_all('a', href=True)
        
        mailto_links = []
        contact_links = []
        external_links = []
        
        for link in links:
            href = link.get('href', '')
            text = link.get_text(strip=True)
            
            if href.startswith('mailto:'):
                mailto_links.append((href, text))
            elif any(word in href.lower() or word in text.lower() 
                    for word in ['contact', 'email', 'reach']):
                contact_links.append((href, text))
            elif href.startswith('http') and 'commonobjective.co' not in href:
                external_links.append((href, text))
        
        if mailto_links:
            print(f"  Mailto链接: {mailto_links}")
        else:
            print("  未找到mailto链接")
            
        if contact_links:
            print(f"  Contact相关链接: {contact_links[:5]}")
        
        print(f"  外部链接: {external_links[:5]}")
        
        print("\n" + "="*60)
        
        # 5. 查找特定的HTML结构模式
        print("🏗️  分析HTML结构模式:")
        
        # 查找可能包含联系信息的特殊class或id
        all_elements = soup.find_all(attrs={'class': True})
        class_names = set()
        for elem in all_elements:
            classes = elem.get('class', [])
            for cls in classes:
                if any(keyword in cls.lower() for keyword in ['contact', 'email', 'info', 'details']):
                    class_names.add(cls)
        
        if class_names:
            print(f"  可能的联系信息class: {list(class_names)}")
            for cls in list(class_names)[:5]:
                elements = soup.find_all(class_=cls)
                for elem in elements[:2]:
                    text = elem.get_text(strip=True)
                    if text and len(text) < 300:
                        print(f"    .{cls}: {text}")
                        emails = re.findall(email_pattern, text)
                        if emails:
                            print(f"      ✅ 找到邮箱: {emails}")
        
        return True
        
    except Exception as e:
        print(f"分析失败: {e}")
        return False

if __name__ == "__main__":
    deep_analyze_better_packaging()