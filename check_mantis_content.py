#!/usr/bin/env python3
"""
详细检查Mantis World页面我实际看到的内容
"""

import requests
from bs4 import BeautifulSoup
import re

def check_mantis_world_content():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/mantis-world"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("🔍 我实际看到的Mantis World页面内容")
        print("=" * 60)
        
        # 1. 搜索您提到的具体信息
        search_terms = [
            'info@mantisworld.com',
            '+442072248991', 
            'www.mantisworld.com',
            'Business size',
            'Catalyst',
            'Founded in',
            '2000',
            'Private Company',
            '10-49',
            'Well made clothing'
        ]
        
        page_text = soup.get_text()
        html_source = str(soup)
        
        print("1️⃣ 搜索您提到的具体信息:")
        found_terms = []
        for term in search_terms:
            if term.lower() in page_text.lower() or term.lower() in html_source.lower():
                found_terms.append(term)
                print(f"   ✅ 找到: {term}")
            else:
                print(f"   ❌ 未找到: {term}")
        
        # 2. 显示页面的主要内容结构
        print(f"\n2️⃣ 页面主要内容（前500字符）:")
        print(page_text[:500])
        
        # 3. 查找所有可能包含contact信息的区域
        print(f"\n3️⃣ 搜索包含contact、email、phone的区域:")
        contact_keywords = ['contact', 'email', 'phone', 'tel', '@', 'www.', 'founded', 'employees']
        
        for keyword in contact_keywords:
            if keyword.lower() in page_text.lower():
                # 找到关键词周围的文本
                pattern = f'.{{0,50}}{re.escape(keyword)}.{{0,50}}'
                matches = re.findall(pattern, page_text, re.I)
                if matches:
                    print(f"   '{keyword}' 周围的文本:")
                    for match in matches[:3]:
                        print(f"     {match.strip()}")
        
        # 4. 检查是否有JavaScript可能影响内容显示
        print(f"\n4️⃣ 检查JavaScript内容:")
        scripts = soup.find_all('script')
        js_has_contact_data = False
        
        for script in scripts:
            if script.string:
                content = script.string.lower()
                if any(term.lower() in content for term in ['mantisworld.com', 'contact', 'email']):
                    js_has_contact_data = True
                    print(f"   ✅ JavaScript中可能包含联系信息")
                    break
        
        if not js_has_contact_data:
            print(f"   ❌ JavaScript中未发现明显的联系信息")
        
        # 5. 总结发现
        print(f"\n📊 总结:")
        print(f"   找到的信息: {len(found_terms)}/{len(search_terms)} 个")
        print(f"   找到的信息: {found_terms}")
        
        if len(found_terms) < len(search_terms) / 2:
            print(f"   ⚠️  我看到的页面内容与您描述的差异很大")
            print(f"   可能原因:")
            print(f"   - 需要JavaScript执行才能显示完整内容")
            print(f"   - 需要登录或特殊权限")
            print(f"   - 地区差异或A/B测试")
            print(f"   - 页面使用了反爬虫技术")
        
        return found_terms
        
    except Exception as e:
        print(f"检查失败: {e}")
        return []

if __name__ == "__main__":
    found = check_mantis_world_content()
    
    print(f"\n💡 结论:")
    if len(found) > 5:
        print(f"✅ 我能看到大部分信息，可以继续优化抓取脚本")
    else:
        print(f"❌ 我看到的页面内容不完整，需要使用其他方法（如Selenium）获取动态内容")