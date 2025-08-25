#!/usr/bin/env python3
"""
最终优化版本：登录并抓取完整的供应商联系信息（重点优化邮箱提取）
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import json
import csv

class OptimizedSupplierScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.logged_in = False
        self.suppliers_data = []
    
    def login(self, email, password):
        """登录到CommonObjective"""
        print("🔐 正在登录...")
        
        try:
            # 获取登录页面
            login_page = self.session.get("https://www.commonobjective.co/login")
            soup = BeautifulSoup(login_page.content, 'html.parser')
            
            # 获取登录表单数据
            login_form = soup.find('form', action='/login')
            if not login_form:
                return False
            
            form_data = {}
            hidden_inputs = login_form.find_all('input', type='hidden')
            for inp in hidden_inputs:
                name = inp.get('name')
                value = inp.get('value', '')
                if name:
                    form_data[name] = value
            
            form_data['email'] = email
            form_data['password'] = password
            
            # 提交登录
            login_response = self.session.post(
                "https://www.commonobjective.co/login",
                data=form_data,
                allow_redirects=True
            )
            
            if "dashboard" in login_response.url:
                print("✅ 登录成功！")
                self.logged_in = True
                return True
            else:
                print("❌ 登录失败")
                return False
                
        except Exception as e:
            print(f"❌ 登录出错: {e}")
            return False
    
    def extract_emails_advanced(self, page_content, company_domain=None):
        """高级邮箱提取方法"""
        emails = []
        
        # 多种邮箱匹配模式
        email_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # 标准邮箱
            r'[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,}',  # 带空格
            r'[A-Za-z0-9._%+-]+\[at\][A-Za-z0-9.-]+\[dot\][A-Za-z]{2,}',  # 编码格式
        ]
        
        for pattern in email_patterns:
            found = re.findall(pattern, page_content, re.I)
            emails.extend(found)
        
        # 去重
        emails = list(set(emails))
        
        # 过滤掉系统邮箱和无关邮箱
        filtered_emails = []
        exclude_domains = ['commonobjective.co', 'climateseal.net', 'google.com', 'facebook.com']
        
        for email in emails:
            email = email.strip()
            if email and '@' in email:
                # 检查是否是要排除的域名
                if not any(domain in email.lower() for domain in exclude_domains):
                    filtered_emails.append(email)
                # 如果提供了公司域名，优先保留该域名的邮箱
                elif company_domain and company_domain in email.lower():
                    filtered_emails.append(email)
        
        return filtered_emails
    
    def extract_supplier_info(self, supplier_url, company_name):
        """提取单个供应商的完整信息"""
        try:
            print(f"📧 {company_name}")
            
            response = self.session.get(supplier_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            page_text = soup.get_text()
            html_source = str(soup)
            
            # 尝试从公司名称推断域名
            company_domain = None
            if 'mantis' in company_name.lower():
                company_domain = 'mantisworld.com'
            elif 'packaging' in company_name.lower():
                company_domain = 'betterpackaging.co'
            elif 'dibella' in company_name.lower():
                company_domain = 'dibellaindia.com'
            
            contact_info = {
                'company_name': company_name,
                'emails': [],
                'phones': [],
                'websites': [],
                'founded_year': '',
                'governance': '',
                'employees': '',
                'business_size': '',
                'profile_url': supplier_url
            }
            
            # 1. 高级邮箱提取
            emails = self.extract_emails_advanced(html_source, company_domain)
            contact_info['emails'] = emails
            
            # 2. 提取电话号码  
            phone_patterns = [
                r'\+\d{1,3}\s?\d{10,12}',  # 国际格式
                r'\b0\d{9,10}\b',  # 英国格式
                r'\(\d{3}\)\s?\d{3}[\-\s]?\d{4}'  # 美式格式
            ]
            
            all_phones = []
            for pattern in phone_patterns:
                phones = re.findall(pattern, page_text)
                all_phones.extend(phones)
            
            contact_info['phones'] = list(set(all_phones))
            
            # 3. 提取网站
            website_patterns = [
                r'www\.[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:/[^\s]*)?',
                r'https?://[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:/[^\s]*)?'
            ]
            
            all_websites = []
            for pattern in website_patterns:
                websites = re.findall(pattern, html_source, re.I)
                all_websites.extend(websites)
            
            # 过滤网站链接
            filtered_websites = []
            exclude_sites = ['commonobjective', 'facebook', 'twitter', 'linkedin', 'instagram', 'ethicalfashionforum']
            
            for site in all_websites:
                if not any(exclude in site.lower() for exclude in exclude_sites):
                    filtered_websites.append(site)
            
            contact_info['websites'] = list(set(filtered_websites))[:5]  # 限制数量
            
            # 4. 提取公司信息
            # Founded year
            founded_match = re.search(r'Founded in[:\s]*(\d{4})', page_text, re.I)
            if founded_match:
                contact_info['founded_year'] = founded_match.group(1)
            
            # Governance  
            governance_match = re.search(r'Governance[:\s]*([^\n]+)', page_text, re.I)
            if governance_match:
                contact_info['governance'] = governance_match.group(1).strip()
            
            # Employees
            employee_match = re.search(r'No\.\s*employees[:\s]*([^\n]+)', page_text, re.I)
            if employee_match:
                contact_info['employees'] = employee_match.group(1).strip()
            
            # Business size
            business_match = re.search(r'Business size[:\s]*([^\n]+)', page_text, re.I)
            if business_match:
                contact_info['business_size'] = business_match.group(1).strip()
            
            # 显示结果
            print(f"   📧 邮箱: {', '.join(contact_info['emails']) if contact_info['emails'] else '❌ 未找到'}")
            print(f"   📞 电话: {', '.join(contact_info['phones']) if contact_info['phones'] else '❌ 未找到'}")
            print(f"   🌐 网站: {contact_info['websites'][0] if contact_info['websites'] else '❌ 未找到'}")
            
            return contact_info
            
        except Exception as e:
            print(f"❌ 提取{company_name}失败: {e}")
            return None
    
    def scrape_all_suppliers(self, search_url, max_suppliers=None):
        """抓取所有供应商信息"""
        if not self.logged_in:
            print("❌ 请先登录")
            return []
        
        try:
            # 获取供应商列表
            print(f"\n🔍 获取供应商列表...")
            response = self.session.get(search_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            business_cards = soup.find_all(class_='columns business-card')
            print(f"找到 {len(business_cards)} 个供应商")
            
            suppliers = []
            for card in business_cards:
                name_element = card.find(class_='name')
                if name_element:
                    name_text = name_element.get_text(strip=True)
                    name_text = re.sub(r'\s*Partner\s*$', '', name_text)
                    
                    card_link = card.find('a', href=True)
                    if card_link:
                        supplier_url = f"https://www.commonobjective.co{card_link.get('href')}"
                        suppliers.append({
                            'name': name_text,
                            'url': supplier_url
                        })
            
            # 限制数量
            if max_suppliers:
                suppliers = suppliers[:max_suppliers]
            
            print(f"\n🚀 开始抓取 {len(suppliers)} 个供应商...")
            print("=" * 60)
            
            # 抓取每个供应商
            for i, supplier in enumerate(suppliers, 1):
                print(f"\n[{i}/{len(suppliers)}] ", end="")
                
                contact_info = self.extract_supplier_info(
                    supplier['url'], 
                    supplier['name']
                )
                
                if contact_info:
                    self.suppliers_data.append(contact_info)
                
                # 延迟
                if i < len(suppliers):
                    time.sleep(1)
            
            return self.suppliers_data
            
        except Exception as e:
            print(f"❌ 抓取失败: {e}")
            return []
    
    def export_final_results(self):
        """导出最终结果"""
        if not self.suppliers_data:
            print("❌ 没有数据")
            return
        
        # CSV导出
        with open('final_suppliers_with_emails.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:
            fieldnames = ['company_name', 'emails', 'phones', 'websites', 'founded_year', 
                         'governance', 'employees', 'business_size', 'profile_url']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in self.suppliers_data:
                csv_item = item.copy()
                csv_item['emails'] = '; '.join(item['emails']) if item['emails'] else ''
                csv_item['phones'] = '; '.join(item['phones']) if item['phones'] else ''
                csv_item['websites'] = '; '.join(item['websites']) if item['websites'] else ''
                writer.writerow(csv_item)
        
        # JSON导出
        with open('final_suppliers_with_emails.json', 'w', encoding='utf-8') as f:
            json.dump(self.suppliers_data, f, ensure_ascii=False, indent=2)
        
        # 统计信息
        total_emails = sum(len(s['emails']) for s in self.suppliers_data)
        total_phones = sum(len(s['phones']) for s in self.suppliers_data)
        suppliers_with_emails = sum(1 for s in self.suppliers_data if s['emails'])
        
        print(f"\n✅ 最终结果已导出:")
        print(f"   📄 final_suppliers_with_emails.csv")  
        print(f"   📄 final_suppliers_with_emails.json")
        
        print(f"\n📊 最终统计:")
        print(f"   总供应商数: {len(self.suppliers_data)}")
        print(f"   找到邮箱的供应商: {suppliers_with_emails}")
        print(f"   总邮箱数: {total_emails}")
        print(f"   总电话数: {total_phones}")
        print(f"   邮箱成功率: {suppliers_with_emails/len(self.suppliers_data)*100:.1f}%")

def main():
    scraper = OptimizedSupplierScraper()
    
    # 登录
    email = "xuguang.ma@climateseal.net" 
    password = "ma108369!"
    
    search_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    
    print("🎯 最终优化版本 - 重点获取邮箱信息")
    print("=" * 60)
    
    if scraper.login(email, password):
        # 先测试5个供应商
        suppliers = scraper.scrape_all_suppliers(search_url, max_suppliers=5)
        
        if suppliers:
            scraper.export_final_results()
            
            # 显示找到邮箱的供应商
            print(f"\n🎉 找到邮箱的供应商:")
            for supplier in suppliers:
                if supplier['emails']:
                    print(f"   ✅ {supplier['company_name']}: {', '.join(supplier['emails'])}")
        else:
            print("❌ 未获取到数据")
    else:
        print("❌ 登录失败")

if __name__ == "__main__":
    main()