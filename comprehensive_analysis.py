#!/usr/bin/env python3
"""
完整分析页面HTML结构，寻找所有可能的联系信息
"""

import requests
from bs4 import BeautifulSoup
import re
import json

def comprehensive_analysis():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        html_source = response.text
        
        print("🔍 完整页面分析")
        print("="*50)
        
        # 1. 在原始HTML中搜索邮箱（有时BeautifulSoup会处理掉一些内容）
        print("1️⃣ 在原始HTML中搜索邮箱:")
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        raw_emails = re.findall(email_pattern, html_source)
        if raw_emails:
            unique_emails = list(set(raw_emails))
            print(f"   原始HTML中的所有邮箱: {unique_emails}")
            
            # 过滤掉明显的系统邮箱
            supplier_emails = [email for email in unique_emails 
                             if not any(domain in email.lower() 
                                      for domain in ['commonobjective', 'google', 'facebook', 'analytics'])]
            if supplier_emails:
                print(f"   ✅ 可能的供应商邮箱: {supplier_emails}")
        else:
            print("   原始HTML中未找到邮箱")
        
        # 2. 搜索可能被编码或隐藏的邮箱
        print("\n2️⃣ 搜索编码的邮箱模式:")
        encoded_patterns = [
            r'[A-Za-z0-9._%+-]+\s*\[at\]\s*[A-Za-z0-9.-]+\s*\[dot\]\s*[A-Za-z]{2,}',
            r'[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}',
            r'mailto:["\']([^"\']+)["\']',
        ]
        
        for pattern in encoded_patterns:
            matches = re.findall(pattern, html_source, re.I)
            if matches:
                print(f"   编码邮箱模式: {matches}")
        
        # 3. 搜索电话号码
        print("\n3️⃣ 搜索电话号码:")
        phone_patterns = [
            r'\+?\d{1,3}[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}',
            r'\+?\d{1,3}[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{3}',
            r'\(\d{3}\)\s*\d{3}[\s\-]?\d{4}'
        ]
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, html_source)
            if matches:
                print(f"   找到电话: {matches}")
        
        # 4. 搜索网站URL
        print("\n4️⃣ 搜索相关网站:")
        website_patterns = [
            r'https?://(?:www\.)?betterpackaging\.[A-Za-z]{2,}(?:/[^\s]*)?',
            r'https?://[A-Za-z0-9.-]*packaging[A-Za-z0-9.-]*\.[A-Za-z]{2,}(?:/[^\s]*)?',
            r'betterpackaging\.[A-Za-z]{2,}'
        ]
        
        for pattern in website_patterns:
            matches = re.findall(pattern, html_source, re.I)
            if matches:
                print(f"   相关网站: {matches}")
        
        # 5. 分析页面中的所有外部链接
        print("\n5️⃣ 分析所有外部链接:")
        external_links = soup.find_all('a', href=re.compile(r'^https?://'))
        
        supplier_links = []
        for link in external_links:
            href = link.get('href', '')
            text = link.get_text(strip=True)
            
            # 过滤掉社交媒体和常见的第三方链接
            if not any(domain in href.lower() for domain in 
                      ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 
                       'google', 'commonobjective', 'ethicalfashionforum']):
                supplier_links.append((href, text))
        
        if supplier_links:
            print("   可能的供应商链接:")
            for href, text in supplier_links[:10]:
                print(f"     {text[:30]} -> {href}")
        else:
            print("   未找到明显的供应商链接")
        
        # 6. 搜索JSON数据中的联系信息
        print("\n6️⃣ 搜索JSON数据:")
        json_patterns = [
            r'window\.__[A-Z_]+__\s*=\s*({.*?});',
            r'var\s+[A-Za-z_]+\s*=\s*({.*?"email".*?});',
            r'<script[^>]*type=["\']application/json["\'][^>]*>(.*?)</script>'
        ]
        
        for pattern in json_patterns:
            matches = re.findall(pattern, html_source, re.DOTALL | re.I)
            for match in matches:
                try:
                    # 尝试解析JSON
                    if match.strip().startswith('{'):
                        data = json.loads(match)
                        print(f"   找到JSON数据: {str(data)[:200]}...")
                        
                        # 在JSON中搜索邮箱
                        json_str = json.dumps(data)
                        json_emails = re.findall(email_pattern, json_str)
                        if json_emails:
                            print(f"   ✅ JSON中找到邮箱: {json_emails}")
                except:
                    # 如果不是有效JSON，直接搜索邮箱
                    match_emails = re.findall(email_pattern, match)
                    if match_emails:
                        print(f"   ✅ 数据中找到邮箱: {match_emails}")
        
        # 7. 检查meta标签
        print("\n7️⃣ 检查meta标签:")
        meta_tags = soup.find_all('meta')
        for meta in meta_tags:
            content = meta.get('content', '')
            name = meta.get('name', '')
            property_attr = meta.get('property', '')
            
            if any(keyword in (name + property_attr + content).lower() 
                   for keyword in ['contact', 'email', 'author']):
                print(f"   Meta: name='{name}' property='{property_attr}' content='{content}'")
                
                # 在meta内容中搜索邮箱
                meta_emails = re.findall(email_pattern, content)
                if meta_emails:
                    print(f"   ✅ Meta中找到邮箱: {meta_emails}")
        
        return True
        
    except Exception as e:
        print(f"分析失败: {e}")
        return False

if __name__ == "__main__":
    comprehensive_analysis()
    
    print(f"\n💭 总结:")
    print(f"如果以上方法都没找到邮箱，可能是因为:")
    print(f"1. 联系信息需要登录后才能查看")
    print(f"2. 联系信息通过JavaScript动态加载")
    print(f"3. 联系信息在其他页面或弹窗中")
    print(f"4. 网站使用了特殊的反爬虫机制")
    print(f"5. 供应商确实没有在此页面提供直接的邮箱联系方式")