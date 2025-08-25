#!/usr/bin/env python3
"""
根据页面截图重新分析，正确提取左侧Contact区域信息
"""

import requests
from bs4 import BeautifulSoup
import re
import time

def extract_left_contact_info(url, company_name):
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    try:
        print(f"🎯 分析 {company_name} 的Contact信息")
        print(f"URL: {url}")
        print("-" * 50)
        
        response = session.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        contact_info = {
            'company_name': company_name,
            'emails': [],
            'phones': [],
            'websites': [],
            'raw_contact_text': ''
        }
        
        # 根据截图，Contact信息应该在一个包含以下结构的区域：
        # About us, Governance, No. employees, Contact
        
        # 方法1: 查找包含这些关键词的区域
        print("🔍 方法1: 查找包含About us, Governance, Contact的区域")
        
        # 查找可能的左侧栏容器
        sidebar_keywords = ['about us', 'governance', 'contact', 'employees']
        potential_sidebars = []
        
        # 查找包含多个关键词的div
        all_divs = soup.find_all('div')
        for div in all_divs:
            div_text = div.get_text().lower()
            keyword_count = sum(1 for keyword in sidebar_keywords if keyword in div_text)
            
            if keyword_count >= 3:  # 至少包含3个关键词
                potential_sidebars.append(div)
                print(f"   找到潜在sidebar，包含{keyword_count}个关键词")
        
        # 分析每个潜在的sidebar
        for i, sidebar in enumerate(potential_sidebars):
            print(f"\n📋 分析Sidebar {i+1}:")
            sidebar_text = sidebar.get_text()
            print(f"   文本长度: {len(sidebar_text)} 字符")
            
            # 提取邮箱
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            emails = re.findall(email_pattern, sidebar_text)
            if emails:
                print(f"   ✅ 找到邮箱: {emails}")
                contact_info['emails'].extend(emails)
            
            # 提取电话（包括各种格式）
            phone_patterns = [
                r'\b\d{10}\b',  # 10位数字
                r'\b0\d{9}\b',  # 以0开头的10位数字 
                r'\+\d{1,3}\s?\d{10}',  # 国际格式
                r'\(\d{3}\)\s?\d{3}[\-\s]?\d{4}'  # 美式格式
            ]
            
            for pattern in phone_patterns:
                phones = re.findall(pattern, sidebar_text)
                if phones:
                    print(f"   📞 找到电话: {phones}")
                    contact_info['phones'].extend(phones)
            
            # 提取网站
            # 查找www.开头的网站
            website_pattern = r'www\.[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
            websites = re.findall(website_pattern, sidebar_text)
            if websites:
                print(f"   🌐 找到网站: {websites}")
                contact_info['websites'].extend(websites)
            
            # 保存contact区域的原始文本用于调试
            if 'contact' in sidebar_text.lower():
                contact_info['raw_contact_text'] = sidebar_text[:500]
                print(f"   📝 Contact区域文本: {sidebar_text[:200]}...")
        
        # 方法2: 直接在整个页面搜索特定模式
        print(f"\n🔍 方法2: 在整个页面搜索特定模式")
        
        page_text = soup.get_text()
        
        # 搜索rebecca@betterpackaging.co模式
        specific_email_pattern = r'[A-Za-z0-9._%+-]*@betterpackaging\.[A-Za-z]{2,}'
        specific_emails = re.findall(specific_email_pattern, page_text, re.I)
        if specific_emails:
            print(f"   ✅ 找到特定邮箱: {specific_emails}")
            contact_info['emails'].extend(specific_emails)
        
        # 搜索类似0203516711的电话模式
        uk_phone_pattern = r'\b0\d{9,10}\b'
        uk_phones = re.findall(uk_phone_pattern, page_text)
        if uk_phones:
            print(f"   📞 找到UK电话: {uk_phones}")
            contact_info['phones'].extend(uk_phones)
        
        # 方法3: 查找HTML中的链接
        print(f"\n🔍 方法3: 分析页面链接")
        
        # mailto链接
        mailto_links = soup.find_all('a', href=re.compile(r'mailto:'))
        for link in mailto_links:
            email = link['href'].replace('mailto:', '')
            print(f"   ✅ Mailto链接: {email}")
            contact_info['emails'].append(email)
        
        # tel链接
        tel_links = soup.find_all('a', href=re.compile(r'tel:'))
        for link in tel_links:
            phone = link['href'].replace('tel:', '')
            print(f"   📞 Tel链接: {phone}")
            contact_info['phones'].append(phone)
        
        # 外部网站链接
        external_links = soup.find_all('a', href=True)
        for link in external_links:
            href = link.get('href', '')
            if ('betterpackaging' in href.lower() or 
                (href.startswith('http') and 'commonobjective' not in href)):
                if not any(social in href.lower() for social in ['facebook', 'twitter', 'linkedin']):
                    print(f"   🌐 外部链接: {href}")
                    contact_info['websites'].append(href)
        
        # 去重
        contact_info['emails'] = list(set(contact_info['emails']))
        contact_info['phones'] = list(set(contact_info['phones']))  
        contact_info['websites'] = list(set(contact_info['websites']))
        
        # 显示最终结果
        print(f"\n📊 {company_name} 联系信息汇总:")
        print(f"   📧 邮箱: {contact_info['emails'] if contact_info['emails'] else '未找到'}")
        print(f"   📞 电话: {contact_info['phones'] if contact_info['phones'] else '未找到'}")
        print(f"   🌐 网站: {contact_info['websites'] if contact_info['websites'] else '未找到'}")
        
        return contact_info
        
    except Exception as e:
        print(f"❌ 提取失败: {e}")
        return None

def test_better_packaging():
    """测试Better Packaging Co.页面"""
    url = "https://www.commonobjective.co/better-packaging-co"
    company_name = "Better Packaging Co."
    
    print("🧪 测试Better Packaging Co.页面的Contact信息提取")
    print("=" * 60)
    
    result = extract_left_contact_info(url, company_name)
    
    if result:
        # 检查是否找到了预期的信息
        expected_email = "rebecca@betterpackaging.co"
        expected_phone = "0203516711" 
        expected_website = "www.betterpackaging.com"
        
        print(f"\n🎯 验证预期结果:")
        print(f"   预期邮箱: {expected_email} - {'✅ 找到' if expected_email in result['emails'] else '❌ 未找到'}")
        print(f"   预期电话: {expected_phone} - {'✅ 找到' if expected_phone in result['phones'] else '❌ 未找到'}")
        print(f"   预期网站: {expected_website} - {'✅ 找到' if expected_website in result['websites'] else '❌ 未找到'}")
        
        return result
    else:
        print("❌ 未能提取到联系信息")
        return None

if __name__ == "__main__":
    test_better_packaging()