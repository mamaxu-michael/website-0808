#!/usr/bin/env python3
"""
查找页面中Get in touch对应的内容区域
"""

import requests
from bs4 import BeautifulSoup
import re

def find_get_in_touch_content():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("🔍 查找Get in touch内容区域")
        print("="*50)
        
        # 1. 查找所有可能的section或div，特别是可能对应导航的
        print("1️⃣ 查找页面的主要section:")
        
        all_sections = soup.find_all(['section', 'div'], 
                                   attrs={'id': True, 'class': True})
        
        for section in all_sections:
            section_id = section.get('id', '')
            section_classes = section.get('class', [])
            section_text = section.get_text(strip=True)
            
            # 查找可能与导航项对应的section
            if (any(keyword in section_id.lower() for keyword in ['contact', 'touch', 'about', 'info']) or
                any(keyword in ' '.join(section_classes).lower() for keyword in ['contact', 'touch', 'about', 'info']) or
                any(keyword in section_text.lower()[:100] for keyword in ['get in touch', 'contact', 'about us'])):
                
                print(f"   Section: id='{section_id}' class={section_classes}")
                print(f"   内容: {section_text[:200]}...")
                
                # 在这个section中查找联系信息
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                emails = re.findall(email_pattern, section_text)
                if emails:
                    print(f"   ✅ 找到邮箱: {emails}")
                
                # 查找电话
                phone_pattern = r'\+?[\d\s\-\(\)\.]{10,}'
                phones = re.findall(phone_pattern, section_text)
                clean_phones = [p for p in phones if len(re.sub(r'[^\d]', '', p)) >= 10]
                if clean_phones:
                    print(f"   📞 找到电话: {clean_phones}")
                
                # 查找网站链接
                links = section.find_all('a', href=True)
                external_links = [link for link in links 
                                if link.get('href', '').startswith('http') 
                                and 'commonobjective.co' not in link.get('href', '')]
                if external_links:
                    for link in external_links[:3]:
                        print(f"   🌐 外部链接: {link.get('href')} - {link.get_text(strip=True)}")
                
                print()
        
        # 2. 查找可能的锚点元素
        print("2️⃣ 查找锚点元素:")
        anchor_keywords = ['get-in-touch', 'contact', 'about-us', 'touch', 'contact-info']
        
        for keyword in anchor_keywords:
            # 查找对应的ID
            element = soup.find(id=keyword)
            if element:
                print(f"   找到锚点ID '{keyword}': {element.get_text(strip=True)[:150]}...")
            
            # 查找对应的name属性
            element = soup.find(attrs={'name': keyword})
            if element:
                print(f"   找到锚点name '{keyword}': {element.get_text(strip=True)[:150]}...")
        
        # 3. 搜索整个页面，寻找结构化的公司信息
        print("\n3️⃣ 搜索结构化的公司信息:")
        
        # 查找可能包含公司信息的列表或表格
        info_containers = soup.find_all(['dl', 'ul', 'ol', 'table', 'div'])
        
        for container in info_containers:
            container_text = container.get_text()
            
            # 如果包含多个公司信息关键词，可能就是我们要找的
            info_keywords = ['founded', 'employees', 'email', 'phone', 'website', 'address', 'contact']
            matching_keywords = [kw for kw in info_keywords if kw in container_text.lower()]
            
            if len(matching_keywords) >= 3:
                print(f"   找到可能的公司信息区域 (匹配{len(matching_keywords)}个关键词): {matching_keywords}")
                print(f"   内容: {container_text[:300]}...")
                
                # 提取邮箱
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                emails = re.findall(email_pattern, container_text)
                if emails:
                    print(f"   ✅ 公司信息区域找到邮箱: {emails}")
                
                print()
        
        # 4. 直接在整个页面HTML中搜索可能的模式
        print("4️⃣ 在HTML中搜索特定模式:")
        html_source = str(soup)
        
        # 搜索可能的公司信息模式
        patterns = [
            r'Founded[:\s]*(\d{4})',
            r'Employees[:\s]*(\d+)',
            r'Website[:\s]*([^\s<]+)',
            r'Email[:\s]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})',
            r'Phone[:\s]*(\+?[\d\s\-\(\)\.]{10,})'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, html_source, re.I)
            if matches:
                print(f"   找到模式 '{pattern.split('[')[0]}': {matches}")
        
        return True
        
    except Exception as e:
        print(f"查找失败: {e}")
        return False

if __name__ == "__main__":
    find_get_in_touch_content()