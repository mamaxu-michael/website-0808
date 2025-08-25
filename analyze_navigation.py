#!/usr/bin/env python3
"""
分析供应商页面的导航结构，查找Contact信息
"""

import requests
from bs4 import BeautifulSoup
import re

def analyze_profile_navigation():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("🔍 分析供应商页面导航结构")
        print("="*50)
        
        # 1. 查找profile-navbar（从前面的分析中发现的）
        print("1️⃣ 分析profile-navbar:")
        profile_navbars = soup.find_all(class_='profile-navbar')
        
        for i, navbar in enumerate(profile_navbars):
            print(f"   Navbar {i+1}:")
            
            # 查找导航项目
            nav_items = navbar.find_all(['a', 'button', 'div', 'li'])
            for item in nav_items:
                text = item.get_text(strip=True)
                classes = item.get('class', [])
                onclick = item.get('onclick', '')
                href = item.get('href', '')
                
                if text and len(text) < 50:
                    print(f"      '{text}' - class={classes} href='{href}' onclick='{onclick}'")
        
        # 2. 查找可能包含详细信息的隐藏区域
        print("\n2️⃣ 查找可能的内容区域:")
        content_areas = soup.find_all(['div'], class_=re.compile(r'content|tab|panel|info|detail', re.I))
        
        for area in content_areas:
            area_text = area.get_text(strip=True)
            classes = area.get('class', [])
            
            # 如果这个区域包含我们感兴趣的关键词
            if any(keyword in area_text.lower() for keyword in ['contact', 'email', 'phone', 'website', 'founded', 'employees']):
                print(f"   内容区域: class={classes}")
                print(f"   内容: {area_text[:200]}...")
                
                # 查找邮箱
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                emails = re.findall(email_pattern, area_text)
                if emails:
                    print(f"   ✅ 找到邮箱: {emails}")
                
                # 查找电话
                phone_pattern = r'\+?[\d\s\-\(\)\.]{10,}'
                phones = re.findall(phone_pattern, area_text)
                if phones:
                    clean_phones = [p for p in phones if len(re.sub(r'[^\d]', '', p)) >= 10]
                    if clean_phones:
                        print(f"   📞 找到电话: {clean_phones}")
                
                print()
        
        # 3. 查找所有可能的数据属性
        print("3️⃣ 查找data属性中的信息:")
        elements_with_data = soup.find_all(attrs=lambda x: x and any(
            attr.startswith('data-') and any(keyword in attr.lower() 
            for keyword in ['contact', 'email', 'phone', 'info']) 
            for attr in x.keys()
        ))
        
        for elem in elements_with_data:
            data_attrs = {k: v for k, v in elem.attrs.items() if k.startswith('data-')}
            print(f"   元素: {elem.name} data={data_attrs}")
        
        # 4. 查找JavaScript中可能定义的数据
        print("\n4️⃣ 查找JavaScript中的供应商数据:")
        scripts = soup.find_all('script')
        
        for script in scripts:
            if script.string:
                content = script.string
                
                # 查找可能包含联系信息的JSON或变量
                if any(keyword in content.lower() for keyword in ['email', 'contact', 'phone', 'website']):
                    
                    # 查找邮箱模式
                    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                    emails = re.findall(email_pattern, content)
                    if emails:
                        print(f"   ✅ JS中找到邮箱: {emails}")
                    
                    # 查找包含联系信息的JSON对象
                    json_patterns = [
                        r'{[^{}]*"email"[^{}]*}',
                        r'{[^{}]*"contact"[^{}]*}',
                        r'{[^{}]*"phone"[^{}]*}'
                    ]
                    
                    for pattern in json_patterns:
                        matches = re.findall(pattern, content, re.I)
                        for match in matches:
                            print(f"   可能的联系信息JSON: {match}")
        
        # 5. 尝试查找特定ID的元素
        print("\n5️⃣ 查找特定ID的元素:")
        possible_ids = ['contact', 'contact-info', 'company-info', 'profile-contact', 'sidebar-contact']
        
        for id_name in possible_ids:
            element = soup.find(id=id_name)
            if element:
                print(f"   找到ID '{id_name}': {element.get_text(strip=True)[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"分析失败: {e}")
        return False

if __name__ == "__main__":
    analyze_profile_navigation()
    
    print(f"\n💡 下一步:")
    print(f"1. 如果导航是动态的，可能需要模拟点击'Get in touch'或'Contact'")  
    print(f"2. 联系信息可能在页面的其他部分，或者通过AJAX加载")
    print(f"3. 可以尝试分析页面的完整HTML结构，查找隐藏的内容区域")