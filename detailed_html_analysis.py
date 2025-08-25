#!/usr/bin/env python3
"""
输出页面的完整HTML结构分析，寻找Contact区域
"""

import requests
from bs4 import BeautifulSoup
import re

def analyze_page_structure():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("🔍 页面HTML结构详细分析")
        print("=" * 60)
        
        # 1. 查找所有包含"Contact"文本的元素
        print("1️⃣ 所有包含'Contact'的元素:")
        contact_elements = soup.find_all(string=re.compile(r'contact', re.I))
        for i, elem in enumerate(contact_elements):
            parent = elem.parent if elem.parent else None
            if parent:
                print(f"   {i+1}. {parent.name}: '{elem.strip()}'")
                print(f"       HTML: {str(parent)[:150]}...")
                
                # 查看父元素的兄弟元素
                siblings = parent.find_next_siblings()[:3]
                for j, sibling in enumerate(siblings):
                    sibling_text = sibling.get_text(strip=True)
                    if sibling_text:
                        print(f"       兄弟元素{j+1}: {sibling_text[:100]}...")
                print()
        
        # 2. 查找包含"rebecca"的元素
        print("2️⃣ 搜索包含'rebecca'的元素:")
        rebecca_elements = soup.find_all(string=re.compile(r'rebecca', re.I))
        if rebecca_elements:
            for elem in rebecca_elements:
                parent = elem.parent if elem.parent else None
                print(f"   找到Rebecca: {elem}")
                if parent:
                    print(f"   父元素: {parent}")
        else:
            print("   未找到包含'rebecca'的元素")
        
        # 3. 查找包含电话号码模式的元素
        print("\n3️⃣ 搜索包含电话号码模式的元素:")
        page_text = soup.get_text()
        phone_patterns = [r'0203516711', r'020\s*3516\s*711', r'\b0\d{9}\b']
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, page_text)
            if matches:
                print(f"   找到电话模式 '{pattern}': {matches}")
        
        # 4. 查找所有文本中包含@符号的元素
        print("\n4️⃣ 搜索包含@符号的所有元素:")
        at_elements = soup.find_all(string=re.compile(r'@'))
        for elem in at_elements:
            print(f"   包含@: '{elem.strip()}'")
            parent = elem.parent if elem.parent else None
            if parent:
                print(f"   父元素: {parent.name} - {str(parent)[:100]}...")
        
        # 5. 查看页面的主要布局结构
        print("\n5️⃣ 页面主要布局结构:")
        main_containers = soup.find_all(['main', 'section', 'article', 'div'], class_=True)
        
        for container in main_containers[:20]:  # 只显示前20个
            classes = container.get('class', [])
            container_text = container.get_text(strip=True)
            
            # 如果这个容器包含我们关心的关键词
            if any(keyword in container_text.lower() 
                   for keyword in ['about us', 'contact', 'governance', 'employees']):
                print(f"   容器: {container.name} class={classes}")
                print(f"   内容预览: {container_text[:150]}...")
                
                # 查看是否有邮箱或电话
                if '@' in container_text or any(char.isdigit() for char in container_text):
                    print(f"   ⚠️  可能包含联系信息!")
                print()
        
        # 6. 查找所有input和form元素（可能的联系表单）
        print("6️⃣ 查找表单元素:")
        forms = soup.find_all('form')
        for i, form in enumerate(forms):
            print(f"   表单{i+1}: action='{form.get('action', '')}' method='{form.get('method', '')}'")
            
            inputs = form.find_all(['input', 'textarea'])
            for inp in inputs:
                name = inp.get('name', '')
                placeholder = inp.get('placeholder', '')
                input_type = inp.get('type', '')
                if any(keyword in (name + placeholder).lower() 
                       for keyword in ['email', 'phone', 'contact']):
                    print(f"     输入框: name='{name}' placeholder='{placeholder}' type='{input_type}'")
        
        # 7. 检查是否有隐藏的元素包含联系信息
        print("\n7️⃣ 检查隐藏元素:")
        hidden_elements = soup.find_all(style=re.compile(r'display:\s*none|visibility:\s*hidden', re.I))
        for elem in hidden_elements:
            elem_text = elem.get_text(strip=True)
            if '@' in elem_text or 'contact' in elem_text.lower():
                print(f"   隐藏元素包含联系信息: {elem_text[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"分析失败: {e}")
        return False

if __name__ == "__main__":
    analyze_page_structure()
    
    print(f"\n💡 建议:")
    print(f"1. 如果以上都没找到，联系信息可能需要JavaScript执行后才显示")
    print(f"2. 可能需要模拟浏览器行为（使用selenium）来获取动态内容")
    print(f"3. 或者联系信息在登录后才显示")