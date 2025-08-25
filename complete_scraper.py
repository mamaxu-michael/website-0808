#!/usr/bin/env python3
"""
完整版本：抓取所有页面的所有供应商邮箱
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import json
import csv
import urllib.parse

class CompleteSupplierScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.logged_in = False
        self.all_suppliers_data = []
        self.total_emails_found = 0
    
    def login(self, email, password):
        """登录"""
        print("🔐 正在登录...")
        
        try:
            login_page = self.session.get("https://www.commonobjective.co/login")
            soup = BeautifulSoup(login_page.content, 'html.parser')
            
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
    
    def get_all_pages_suppliers(self, base_search_url):
        """获取所有页面的供应商列表"""
        print("\n🔍 发现所有页面的供应商...")
        
        all_suppliers = []
        page = 1
        
        while True:
            # 构建分页URL
            if page == 1:
                page_url = base_search_url
            else:
                # 添加page参数
                separator = "&" if "?" in base_search_url else "?"
                page_url = f"{base_search_url}{separator}page={page}"
            
            print(f"\n📄 正在抓取第 {page} 页...")
            print(f"URL: {page_url}")
            
            try:
                response = self.session.get(page_url)
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # 查找供应商卡片
                business_cards = soup.find_all(class_='columns business-card')
                
                if not business_cards:
                    print(f"   第 {page} 页没有找到供应商，结束抓取")
                    break
                
                print(f"   找到 {len(business_cards)} 个供应商")
                
                # 提取供应商信息
                page_suppliers = []
                for card in business_cards:
                    name_element = card.find(class_='name')
                    if name_element:
                        name_text = name_element.get_text(strip=True)
                        name_text = re.sub(r'\s*Partner\s*$', '', name_text)
                        
                        card_link = card.find('a', href=True)
                        if card_link:
                            supplier_url = f"https://www.commonobjective.co{card_link.get('href')}"
                            page_suppliers.append({
                                'name': name_text,
                                'url': supplier_url,
                                'page': page
                            })
                
                if not page_suppliers:
                    print(f"   第 {page} 页没有有效供应商，结束抓取")
                    break
                
                all_suppliers.extend(page_suppliers)
                print(f"   ✅ 第 {page} 页添加了 {len(page_suppliers)} 个供应商")
                
                # 检查是否有下一页
                # 查找分页导航
                pagination = soup.find_all(['a', 'li'], string=re.compile(r'next|下一页|\d+', re.I))
                has_next_page = False
                
                for nav_element in pagination:
                    if nav_element.name == 'a' and nav_element.get('href'):
                        href = nav_element.get('href')
                        if f"page={page+1}" in href or 'next' in href.lower():
                            has_next_page = True
                            break
                
                # 也检查是否还有更多内容的其他迹象
                if not has_next_page:
                    # 尝试访问下一页看是否存在
                    next_page_url = f"{base_search_url}{'&' if '?' in base_search_url else '?'}page={page+1}"
                    test_response = self.session.get(next_page_url)
                    test_soup = BeautifulSoup(test_response.content, 'html.parser')
                    test_cards = test_soup.find_all(class_='columns business-card')
                    has_next_page = len(test_cards) > 0
                
                if not has_next_page:
                    print(f"   没有更多页面了")
                    break
                
                page += 1
                time.sleep(1)  # 延迟避免请求过快
                
            except Exception as e:
                print(f"   ❌ 第 {page} 页抓取失败: {e}")
                break
        
        print(f"\n📊 总共发现 {len(all_suppliers)} 个供应商，分布在 {page} 页")
        return all_suppliers
    
    def extract_emails_advanced(self, html_content, company_domain=None):
        """高级邮箱提取"""
        emails = []
        
        # 多种邮箱提取方法
        methods = [
            # 1. data-email属性 (最准确的)
            r'data-email=["\']([^"\']+)["\']',
            # 2. 标准邮箱模式
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            # 3. JavaScript中的邮箱
            r'email["\']?\s*:\s*["\']([^"\']+@[^"\']+)["\']',
            # 4. mailto链接
            r'mailto:([^"\'>\s]+)'
        ]
        
        for pattern in methods:
            matches = re.findall(pattern, html_content, re.I)
            emails.extend(matches)
        
        # 去重和过滤
        emails = list(set(emails))
        filtered_emails = []
        
        exclude_domains = ['commonobjective.co', 'climateseal.net', 'google.com', 'facebook.com', 'analytics']
        
        for email in emails:
            email = email.strip()
            if email and '@' in email and '.' in email:
                if not any(domain in email.lower() for domain in exclude_domains):
                    filtered_emails.append(email)
        
        return filtered_emails
    
    def extract_supplier_details(self, supplier):
        """提取单个供应商详细信息"""
        try:
            response = self.session.get(supplier['url'])
            html_content = response.text
            soup = BeautifulSoup(html_content, 'html.parser')
            page_text = soup.get_text()
            
            # 提取邮箱
            emails = self.extract_emails_advanced(html_content)
            
            # 提取其他信息
            contact_info = {
                'page_number': supplier['page'],
                'company_name': supplier['name'],
                'emails': emails,
                'email_count': len(emails),
                'phones': [],
                'websites': [],
                'founded_year': '',
                'employees': '',
                'profile_url': supplier['url']
            }
            
            # 电话号码
            phone_patterns = [
                r'\+\d{1,3}\s?\d{10,12}',
                r'\b0\d{9,10}\b',
                r'\(\d{3}\)\s?\d{3}[\-\s]?\d{4}'
            ]
            
            for pattern in phone_patterns:
                phones = re.findall(pattern, page_text)
                contact_info['phones'].extend(phones)
            
            contact_info['phones'] = list(set(contact_info['phones']))
            
            # 网站
            website_patterns = [
                r'www\.[A-Za-z0-9.-]+\.[A-Za-z]{2,}',
                r'https?://[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
            ]
            
            for pattern in website_patterns:
                websites = re.findall(pattern, html_content)
                contact_info['websites'].extend(websites)
            
            # 过滤网站
            filtered_sites = []
            exclude_sites = ['commonobjective', 'facebook', 'twitter', 'linkedin', 'instagram']
            for site in contact_info['websites']:
                if not any(ex in site.lower() for ex in exclude_sites):
                    filtered_sites.append(site)
            
            contact_info['websites'] = list(set(filtered_sites))[:3]
            
            # 公司信息
            founded_match = re.search(r'Founded in[:\s]*(\d{4})', page_text, re.I)
            if founded_match:
                contact_info['founded_year'] = founded_match.group(1)
            
            employee_match = re.search(r'No\.\s*employees[:\s]*([^\n]+)', page_text, re.I)
            if employee_match:
                contact_info['employees'] = employee_match.group(1).strip()
            
            self.total_emails_found += len(emails)
            
            return contact_info
            
        except Exception as e:
            print(f"   ❌ 提取 {supplier['name']} 失败: {e}")
            return None
    
    def scrape_all_suppliers(self, base_search_url):
        """抓取所有供应商"""
        if not self.logged_in:
            print("❌ 请先登录")
            return []
        
        # 1. 获取所有页面的供应商列表
        all_suppliers = self.get_all_pages_suppliers(base_search_url)
        
        if not all_suppliers:
            print("❌ 没有找到供应商")
            return []
        
        print(f"\n🚀 开始抓取 {len(all_suppliers)} 个供应商的详细信息...")
        print("=" * 80)
        
        # 2. 抓取每个供应商的详细信息
        for i, supplier in enumerate(all_suppliers, 1):
            print(f"\n[{i}/{len(all_suppliers)}] 📧 {supplier['name']} (第{supplier['page']}页)")
            
            contact_info = self.extract_supplier_details(supplier)
            
            if contact_info:
                self.all_suppliers_data.append(contact_info)
                
                # 显示结果
                emails_display = ', '.join(contact_info['emails'][:3]) if contact_info['emails'] else '❌ 未找到'
                if len(contact_info['emails']) > 3:
                    emails_display += f" (+{len(contact_info['emails'])-3}个)"
                
                print(f"   📧 邮箱({contact_info['email_count']}): {emails_display}")
                print(f"   📞 电话: {', '.join(contact_info['phones'][:2]) if contact_info['phones'] else '❌ 未找到'}")
            
            # 进度报告
            if i % 10 == 0:
                completed_suppliers = len([s for s in self.all_suppliers_data if s])
                suppliers_with_emails = len([s for s in self.all_suppliers_data if s and s['emails']])
                print(f"\n📊 进度报告 ({i}/{len(all_suppliers)}):")
                print(f"   完成供应商: {completed_suppliers}")
                print(f"   找到邮箱的供应商: {suppliers_with_emails}")
                print(f"   总邮箱数: {self.total_emails_found}")
            
            # 延迟
            time.sleep(1)
        
        return self.all_suppliers_data
    
    def export_complete_results(self):
        """导出完整结果"""
        if not self.all_suppliers_data:
            print("❌ 没有数据")
            return
        
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        
        # CSV导出
        csv_filename = f'all_suppliers_complete_{timestamp}.csv'
        with open(csv_filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
            fieldnames = ['page_number', 'company_name', 'email_count', 'emails', 'phones', 
                         'websites', 'founded_year', 'employees', 'profile_url']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in self.all_suppliers_data:
                csv_item = item.copy()
                csv_item['emails'] = '; '.join(item['emails']) if item['emails'] else ''
                csv_item['phones'] = '; '.join(item['phones']) if item['phones'] else ''
                csv_item['websites'] = '; '.join(item['websites']) if item['websites'] else ''
                writer.writerow(csv_item)
        
        # JSON导出
        json_filename = f'all_suppliers_complete_{timestamp}.json'
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(self.all_suppliers_data, f, ensure_ascii=False, indent=2)
        
        # 邮箱单独导出
        emails_filename = f'all_emails_only_{timestamp}.txt'
        with open(emails_filename, 'w', encoding='utf-8') as f:
            f.write("所有供应商邮箱列表\\n")
            f.write("=" * 50 + "\\n\\n")
            
            for supplier in self.all_suppliers_data:
                if supplier['emails']:
                    f.write(f"{supplier['company_name']}:\\n")
                    for email in supplier['emails']:
                        f.write(f"  - {email}\\n")
                    f.write("\\n")
        
        # 统计报告
        suppliers_with_emails = [s for s in self.all_suppliers_data if s['emails']]
        pages_covered = set(s['page_number'] for s in self.all_suppliers_data)
        
        print(f"\\n✅ 完整抓取结果已导出:")
        print(f"   📄 {csv_filename}")
        print(f"   📄 {json_filename}")  
        print(f"   📄 {emails_filename}")
        
        print(f"\\n📊 最终统计:")
        print(f"   总页面数: {len(pages_covered)}")
        print(f"   总供应商数: {len(self.all_suppliers_data)}")
        print(f"   找到邮箱的供应商: {len(suppliers_with_emails)}")
        print(f"   总邮箱数: {self.total_emails_found}")
        print(f"   平均每个供应商邮箱数: {self.total_emails_found/len(self.all_suppliers_data):.1f}")
        print(f"   邮箱获取成功率: {len(suppliers_with_emails)/len(self.all_suppliers_data)*100:.1f}%")
        
        # 按页面统计
        print(f"\\n📄 按页面统计:")
        for page_num in sorted(pages_covered):
            page_suppliers = [s for s in self.all_suppliers_data if s['page_number'] == page_num]
            page_emails = sum(len(s['emails']) for s in page_suppliers)
            print(f"   第{page_num}页: {len(page_suppliers)}个供应商, {page_emails}个邮箱")

def main():
    scraper = CompleteSupplierScraper()
    
    # 登录信息
    email = "xuguang.ma@climateseal.net"
    password = "ma108369!"
    
    # 搜索URL
    base_search_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    
    print("🌟 完整版本：抓取所有页面所有供应商邮箱")
    print("=" * 80)
    
    if scraper.login(email, password):
        suppliers = scraper.scrape_all_suppliers(base_search_url)
        
        if suppliers:
            scraper.export_complete_results()
            print(f"\\n🎉 任务完成！成功抓取了所有供应商的联系信息")
        else:
            print("❌ 抓取失败")
    else:
        print("❌ 登录失败")

if __name__ == "__main__":
    main()