#!/usr/bin/env python3
"""
更深入分析页面，寻找真正的供应商邮箱
"""

import requests
from bs4 import BeautifulSoup
import re

def decode_cf_email(encoded):
    """解码CloudFlare保护的邮箱"""
    try:
        key = int(encoded[:2], 16)
        decoded = ""
        for i in range(2, len(encoded), 2):
            if i + 1 < len(encoded):
                char_code = int(encoded[i:i+2], 16) ^ key
                decoded += chr(char_code)
        return decoded
    except:
        return None

def find_all_emails():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("🔍 深度搜索所有可能的邮箱信息")
        print("="*60)
        
        all_emails = []
        
        # 1. 查找所有data-cfemail属性
        print("1️⃣ 查找所有CloudFlare保护的邮箱:")
        cfemail_elements = soup.find_all(attrs={'data-cfemail': True})
        for elem in cfemail_elements:
            encoded = elem.get('data-cfemail')
            decoded = decode_cf_email(encoded)
            if decoded:
                print(f"   编码: {encoded}")
                print(f"   解码: {decoded}")
                all_emails.append(decoded)
        
        # 2. 查找JavaScript中可能隐藏的邮箱
        print("\n2️⃣ 查找JavaScript中的邮箱:")
        script_tags = soup.find_all('script')
        for script in script_tags:
            if script.string:
                # 搜索邮箱模式
                email_matches = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', script.string)
                if email_matches:
                    print(f"   JS中找到: {email_matches}")
                    all_emails.extend(email_matches)
        
        # 3. 查找隐藏的div或span
        print("\n3️⃣ 查找隐藏元素中的邮箱:")
        hidden_elements = soup.find_all(['div', 'span', 'p'], style=re.compile(r'display:\s*none', re.I))
        for elem in hidden_elements:
            text = elem.get_text(strip=True)
            email_matches = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
            if email_matches:
                print(f"   隐藏元素中找到: {email_matches}")
                all_emails.extend(email_matches)
        
        # 4. 查找注释中的邮箱
        print("\n4️⃣ 查找HTML注释中的邮箱:")
        html_source = str(soup)
        comment_matches = re.findall(r'<!--.*?-->', html_source, re.DOTALL)
        for comment in comment_matches:
            email_matches = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', comment)
            if email_matches:
                print(f"   注释中找到: {email_matches}")
                all_emails.extend(email_matches)
        
        # 5. 查找页面中所有包含contact信息的区域
        print("\n5️⃣ 分析contact相关的页面区域:")
        
        # 查找可能的联系信息容器
        potential_contact_areas = soup.find_all(['div', 'section'], 
            class_=re.compile(r'contact|info|detail|profile', re.I))
        
        for area in potential_contact_areas:
            area_text = area.get_text()
            print(f"   Contact区域内容: {area_text[:200]}...")
            
            # 在这个区域搜索邮箱
            email_matches = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', area_text)
            if email_matches:
                print(f"   ✅ Contact区域找到: {email_matches}")
                all_emails.extend(email_matches)
        
        # 6. 特别查找Better Packaging相关的邮箱
        print("\n6️⃣ 查找Better Packaging相关邮箱:")
        better_packaging_patterns = [
            r'[A-Za-z0-9._%+-]*@betterpackaging\.[A-Za-z]{2,}',
            r'[A-Za-z0-9._%+-]*@better.*packaging.*\.[A-Za-z]{2,}',
            r'rebecca@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
        ]
        
        for pattern in better_packaging_patterns:
            matches = re.findall(pattern, html_source, re.I)
            if matches:
                print(f"   ✅ Better Packaging邮箱: {matches}")
                all_emails.extend(matches)
        
        # 去重
        unique_emails = list(set(all_emails))
        
        print(f"\n📧 所有找到的邮箱: {unique_emails}")
        
        # 过滤掉明显不是供应商的邮箱
        supplier_emails = [email for email in unique_emails 
                          if 'commonobjective' not in email.lower()]
        
        print(f"📧 供应商邮箱: {supplier_emails}")
        
        return supplier_emails
        
    except Exception as e:
        print(f"搜索失败: {e}")
        return []

if __name__ == "__main__":
    emails = find_all_emails()
    
    if emails:
        print(f"\n🎉 成功找到供应商邮箱: {emails}")
    else:
        print(f"\n❌ 未在页面中找到供应商邮箱")
        print("可能需要:")
        print("1. 检查是否需要登录才能看到联系信息")
        print("2. 联系信息可能在独立的contact页面")
        print("3. 邮箱可能通过AJAX动态加载")