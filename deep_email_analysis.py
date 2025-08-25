#!/usr/bin/env python3
"""
专门分析登录后页面的邮箱信息位置
"""

import requests
from bs4 import BeautifulSoup
import re

def analyze_logged_in_page_for_emails():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    # 先登录
    print("🔐 登录中...")
    
    # 获取登录页面
    login_page = session.get("https://www.commonobjective.co/login")
    soup = BeautifulSoup(login_page.content, 'html.parser')
    
    # 获取登录表单数据
    login_form = soup.find('form', action='/login')
    form_data = {}
    
    hidden_inputs = login_form.find_all('input', type='hidden')
    for inp in hidden_inputs:
        name = inp.get('name')
        value = inp.get('value', '')
        if name:
            form_data[name] = value
    
    form_data['email'] = "xuguang.ma@climateseal.net"
    form_data['password'] = "ma108369!"
    
    # 登录
    login_response = session.post(
        "https://www.commonobjective.co/login",
        data=form_data,
        allow_redirects=True
    )
    
    if "dashboard" not in login_response.url:
        print("❌ 登录失败")
        return False
    
    print("✅ 登录成功")
    
    # 现在分析Mantis World页面寻找邮箱
    print("\n🔍 深度分析Mantis World页面寻找邮箱...")
    
    mantis_response = session.get("https://www.commonobjective.co/mantis-world")
    soup = BeautifulSoup(mantis_response.content, 'html.parser')
    
    print("1️⃣ 在页面HTML源码中搜索info@mantisworld.com:")
    html_source = str(soup)
    if "info@mantisworld.com" in html_source.lower():
        print("   ✅ 在HTML源码中找到了！")
        # 找到邮箱周围的上下文
        lines = html_source.split('\n')
        for i, line in enumerate(lines):
            if "info@mantisworld.com" in line.lower():
                start = max(0, i-3)
                end = min(len(lines), i+4)
                context = '\n'.join(lines[start:end])
                print(f"   上下文:\n{context}")
                break
    else:
        print("   ❌ 在HTML源码中未找到")
    
    print("\n2️⃣ 搜索所有可能的邮箱模式:")
    # 更全面的邮箱正则表达式
    email_patterns = [
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # 标准邮箱
        r'[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}',  # 带空格的邮箱
        r'[A-Za-z0-9._%+-]+\[at\][A-Za-z0-9.-]+\[dot\][A-Za-z]{2,}',  # 编码邮箱
        r'mailto:([^"\'>\s]+)',  # mailto链接
    ]
    
    page_text = soup.get_text()
    
    all_found_emails = []
    for i, pattern in enumerate(email_patterns, 1):
        matches = re.findall(pattern, html_source, re.I)
        if matches:
            print(f"   模式{i}: {matches}")
            all_found_emails.extend(matches)
    
    if not all_found_emails:
        print("   ❌ 未找到任何邮箱")
    
    print("\n3️⃣ 检查特定的HTML元素:")
    
    # 查找可能包含邮箱的元素类型
    target_elements = [
        ('span', None),
        ('div', None), 
        ('p', None),
        ('a', {'href': re.compile(r'mailto:', re.I)}),
        ('*', {'class': re.compile(r'contact|email|info', re.I)}),
        ('*', {'id': re.compile(r'contact|email|info', re.I)})
    ]
    
    for element_type, attrs in target_elements:
        if element_type == '*':
            elements = soup.find_all(attrs=attrs)
        else:
            elements = soup.find_all(element_type, attrs=attrs)
        
        for elem in elements:
            elem_text = elem.get_text(strip=True)
            elem_html = str(elem)
            
            # 检查是否包含邮箱
            if '@' in elem_text or 'mailto:' in elem_html.lower():
                print(f"   {element_type}元素包含@: {elem_text[:100]}...")
                print(f"   HTML: {elem_html[:200]}...")
                
                # 在这个元素中提取邮箱
                emails_in_elem = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', elem_text)
                if emails_in_elem:
                    print(f"   ✅ 提取到邮箱: {emails_in_elem}")
                print()
    
    print("\n4️⃣ 检查JavaScript中的邮箱:")
    scripts = soup.find_all('script')
    for script in scripts:
        if script.string:
            content = script.string
            if 'mantisworld.com' in content.lower() or '@' in content:
                # 在JavaScript中搜索邮箱
                js_emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', content)
                if js_emails:
                    print(f"   ✅ JavaScript中找到邮箱: {js_emails}")
                elif 'mantisworld' in content.lower():
                    print(f"   🔍 JavaScript中包含mantisworld: {content[:200]}...")
    
    print("\n5️⃣ 检查data属性和隐藏字段:")
    # 查找所有带data属性的元素
    data_elements = soup.find_all(attrs=lambda x: x and any(
        attr.startswith('data-') for attr in x.keys()
    ))
    
    for elem in data_elements:
        data_attrs = {k: v for k, v in elem.attrs.items() if k.startswith('data-')}
        for attr_name, attr_value in data_attrs.items():
            if isinstance(attr_value, str) and '@' in attr_value:
                print(f"   ✅ data属性中找到邮箱: {attr_name}='{attr_value}'")
    
    print("\n6️⃣ 保存页面内容用于手动检查:")
    with open('/Users/xuguangma/Desktop/website-0808-08-20/mantis_logged_in.html', 'w', encoding='utf-8') as f:
        f.write(html_source)
    print("   ✅ 页面内容已保存到 mantis_logged_in.html")
    
    return True

if __name__ == "__main__":
    analyze_logged_in_page_for_emails()