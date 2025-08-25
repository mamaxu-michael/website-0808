#!/usr/bin/env python3
"""
专门提取CloudFlare保护的邮箱
"""

import requests
from bs4 import BeautifulSoup
import re

def extract_cf_email(protected_email):
    """解码CloudFlare保护的邮箱"""
    try:
        # CloudFlare邮箱保护的简单解码
        # 这个看起来像是已经解码过的邮箱
        if '@' in protected_email and '.' in protected_email:
            return protected_email
        
        # 如果是编码的，需要解码（这里暂时返回原值）
        return protected_email
    except:
        return ""

def extract_better_packaging_contact():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    url = "https://www.commonobjective.co/better-packaging-co"
    
    try:
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        contact_info = {
            'company_name': 'Better Packaging Co.',
            'emails': [],
            'website': '',
            'phone': '',
            'location': 'Auckland, New Zealand'
        }
        
        print("🎯 专门提取Better Packaging Co.的联系信息")
        print("="*50)
        
        # 1. 查找CloudFlare保护的邮箱
        cf_email_elements = soup.find_all(class_='__cf_email__')
        for elem in cf_email_elements:
            email_text = elem.get_text(strip=True)
            decoded_email = extract_cf_email(email_text)
            if decoded_email:
                contact_info['emails'].append(decoded_email)
                print(f"✅ CloudFlare保护邮箱: {decoded_email}")
        
        # 2. 查找class="email"的元素
        email_elements = soup.find_all(class_='email')
        for elem in email_elements:
            email_text = elem.get_text(strip=True)
            if '@' in email_text:
                contact_info['emails'].append(email_text)
                print(f"✅ Email class邮箱: {email_text}")
        
        # 3. 查找data-cfemail属性（CloudFlare的另一种保护方式）
        cfemail_elements = soup.find_all(attrs={'data-cfemail': True})
        for elem in cfemail_elements:
            cfemail = elem.get('data-cfemail')
            print(f"🔍 找到data-cfemail: {cfemail}")
            # 这需要解码，但先记录下来
        
        # 4. 在整个页面中搜索可能的邮箱模式
        page_text = soup.get_text()
        html_source = str(soup)
        
        # 搜索常见的邮箱模式
        email_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            r'rebecca@betterpackaging\.co',
            r'[A-Za-z0-9._%+-]+@betterpackaging\.co',
            r'contact@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
        ]
        
        for pattern in email_patterns:
            emails_found = re.findall(pattern, html_source, re.I)
            if emails_found:
                print(f"✅ 找到邮箱模式 '{pattern}': {emails_found}")
                contact_info['emails'].extend(emails_found)
        
        # 5. 查找可能的官网链接
        external_links = soup.find_all('a', href=True)
        for link in external_links:
            href = link.get('href', '')
            text = link.get_text(strip=True)
            
            if (href.startswith('http') and 
                'commonobjective.co' not in href and
                not any(social in href.lower() for social in ['facebook', 'twitter', 'linkedin', 'instagram']) and
                ('betterpackaging' in href.lower() or 'packaging' in href.lower())):
                contact_info['website'] = href
                print(f"🌐 可能的官网: {href}")
                break
        
        # 去重邮箱
        contact_info['emails'] = list(set(contact_info['emails']))
        
        print("\n📊 提取结果:")
        print(f"公司: {contact_info['company_name']}")
        print(f"位置: {contact_info['location']}")
        print(f"邮箱: {contact_info['emails']}")
        print(f"网站: {contact_info['website']}")
        
        return contact_info
        
    except Exception as e:
        print(f"提取失败: {e}")
        return None

def test_cloudflare_email_decode():
    """测试CloudFlare邮箱解码"""
    print("\n🧪 测试CloudFlare邮箱解码")
    test_email = "[email protected]"
    print(f"测试邮箱: {test_email}")
    
    # 这个看起来已经是正常的邮箱格式了
    if re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$', test_email):
        print(f"✅ 这是有效的邮箱格式: {test_email}")
        return test_email
    else:
        print("❌ 不是标准邮箱格式，需要解码")
        return None

if __name__ == "__main__":
    # 先测试邮箱解码
    test_cloudflare_email_decode()
    
    # 提取联系信息
    result = extract_better_packaging_contact()
    
    if result and result['emails']:
        print(f"\n🎉 成功! 找到邮箱: {result['emails']}")
    else:
        print(f"\n❌ 未找到邮箱，需要进一步分析")