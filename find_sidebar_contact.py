#!/usr/bin/env python3
"""
专门查找左侧Contact区域的联系信息
"""

import requests
from bs4 import BeautifulSoup
import re

def find_left_sidebar_contact():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("🔍 查找左侧Contact区域")
        print("="*50)
        
        # 1. 查找包含"About us", "Founded in", "Contact"等文本的区域
        sidebar_keywords = ['About us', 'Founded in', 'Governance', 'No. employees', 'Contact']
        
        print("1️⃣ 寻找左侧边栏结构:")
        for keyword in sidebar_keywords:
            elements = soup.find_all(string=re.compile(keyword, re.I))
            for elem in elements:
                parent = elem.parent if elem.parent else None
                if parent:
                    print(f"   找到'{keyword}': {parent.name} - {str(parent)[:150]}...")
                    
                    # 查看父元素的父元素，可能是整个sidebar容器
                    grandparent = parent.parent if parent.parent else None
                    if grandparent:
                        print(f"   父容器: {grandparent.name} class={grandparent.get('class', [])}")
        
        print("\n2️⃣ 查找可能的sidebar容器:")
        # 查找可能包含sidebar的div
        potential_sidebars = soup.find_all(['div', 'aside', 'section'], 
                                         class_=re.compile(r'sidebar|side|left|profile|info|detail', re.I))
        
        for i, sidebar in enumerate(potential_sidebars):
            print(f"   Sidebar {i+1}: class={sidebar.get('class', [])}")
            text = sidebar.get_text()[:300]
            print(f"   内容预览: {text}")
            
            # 如果这个区域包含多个sidebar关键词，很可能就是我们要找的
            keyword_count = sum(1 for keyword in sidebar_keywords 
                              if keyword.lower() in text.lower())
            if keyword_count >= 3:
                print(f"   ✅ 可能的目标区域! 包含{keyword_count}个关键词")
                
                # 在这个区域中专门查找Contact信息
                print(f"   🔍 在此区域查找Contact信息:")
                
                # 查找邮箱
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                emails = re.findall(email_pattern, text)
                if emails:
                    print(f"      ✅ 找到邮箱: {emails}")
                
                # 查找电话
                phone_patterns = [
                    r'\+?[\d\s\-\(\)\.]{10,}',
                    r'\d{3}[\-\.\s]?\d{3}[\-\.\s]?\d{4}'
                ]
                for pattern in phone_patterns:
                    phones = re.findall(pattern, text)
                    if phones:
                        print(f"      📞 找到电话: {phones}")
                        break
                
                # 查找网站
                links = sidebar.find_all('a', href=True)
                for link in links:
                    href = link.get('href', '')
                    if href.startswith('http') and 'commonobjective.co' not in href:
                        print(f"      🌐 找到外部链接: {href} - {link.get_text(strip=True)}")
            
            print()
        
        # 3. 直接搜索"Contact"后面的内容
        print("3️⃣ 直接搜索Contact关键词附近的内容:")
        contact_elements = soup.find_all(string=re.compile(r'contact', re.I))
        
        for elem in contact_elements:
            parent = elem.parent if elem.parent else None
            if parent:
                # 查看Contact元素后面的兄弟元素
                siblings = []
                current = parent
                for i in range(5):  # 查看后面5个元素
                    current = current.find_next_sibling()
                    if current:
                        sibling_text = current.get_text(strip=True)
                        if sibling_text:
                            siblings.append(sibling_text)
                            print(f"   Contact后的内容: {sibling_text}")
                            
                            # 在这些内容中查找邮箱
                            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                            emails = re.findall(email_pattern, sibling_text)
                            if emails:
                                print(f"   ✅ Contact区域找到邮箱: {emails}")
                    else:
                        break
        
        # 4. 查找特定的HTML结构模式
        print("\n4️⃣ 查找列表或定义列表结构:")
        lists = soup.find_all(['ul', 'ol', 'dl'])
        for lst in lists:
            list_text = lst.get_text()
            if any(keyword.lower() in list_text.lower() for keyword in sidebar_keywords):
                print(f"   找到包含sidebar信息的列表:")
                print(f"   {list_text[:200]}...")
                
                # 在列表中查找邮箱
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                emails = re.findall(email_pattern, list_text)
                if emails:
                    print(f"   ✅ 列表中找到邮箱: {emails}")
        
        return True
        
    except Exception as e:
        print(f"查找失败: {e}")
        return False

if __name__ == "__main__":
    find_left_sidebar_contact()