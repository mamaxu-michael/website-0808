#!/usr/bin/env python3
"""
登录CommonObjective并抓取供应商联系信息
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import json
import csv

class CommonObjectiveScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.logged_in = False
        self.suppliers_data = []
    
    def login(self, email, password):
        """登录到CommonObjective"""
        print("🔐 正在登录CommonObjective...")
        
        try:
            # 1. 先访问登录页面获取表单信息
            login_page_url = "https://www.commonobjective.co/login"
            response = self.session.get(login_page_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 2. 查找登录表单
            login_form = soup.find('form', action='/login')
            if not login_form:
                print("❌ 未找到登录表单")
                return False
            
            # 3. 获取CSRF token或其他隐藏字段
            hidden_inputs = login_form.find_all('input', type='hidden')
            form_data = {}
            for inp in hidden_inputs:
                name = inp.get('name')
                value = inp.get('value', '')
                if name:
                    form_data[name] = value
            
            # 4. 添加登录凭据
            form_data['email'] = email
            form_data['password'] = password
            
            print(f"📝 登录表单数据: {list(form_data.keys())}")
            
            # 5. 提交登录表单
            login_response = self.session.post(
                "https://www.commonobjective.co/login",
                data=form_data,
                allow_redirects=True
            )
            
            print(f"📊 登录响应状态码: {login_response.status_code}")
            print(f"📊 最终URL: {login_response.url}")
            
            # 6. 检查是否登录成功
            if self.check_login_status():
                print("✅ 登录成功！")
                self.logged_in = True
                return True
            else:
                print("❌ 登录失败")
                return False
                
        except Exception as e:
            print(f"❌ 登录过程出错: {e}")
            return False
    
    def check_login_status(self):
        """检查是否已登录"""
        try:
            # 访问一个需要登录才能看到完整内容的页面
            test_url = "https://www.commonobjective.co/mantis-world"
            response = self.session.get(test_url)
            
            # 检查页面是否包含登录后才能看到的内容
            page_text = response.text.lower()
            
            # 寻找登录状态的标志
            login_indicators = [
                'contact',
                'founded in',
                'governance',
                'employees',
                '@' # 邮箱符号
            ]
            
            found_indicators = sum(1 for indicator in login_indicators if indicator in page_text)
            
            if found_indicators >= 3:
                print(f"✅ 检测到登录状态（找到{found_indicators}个指标）")
                return True
            else:
                print(f"❌ 未检测到登录状态（只找到{found_indicators}个指标）")
                return False
                
        except Exception as e:
            print(f"❌ 检查登录状态失败: {e}")
            return False
    
    def extract_supplier_contact(self, supplier_url, company_name):
        """提取单个供应商的联系信息（需要登录状态）"""
        if not self.logged_in:
            print(f"❌ 未登录，无法获取{company_name}的详细信息")
            return None
        
        try:
            print(f"\n🎯 提取 {company_name} 的联系信息")
            print(f"URL: {supplier_url}")
            
            response = self.session.get(supplier_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            page_text = soup.get_text()
            
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
            
            # 1. 提取邮箱
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            emails = re.findall(email_pattern, page_text)
            # 过滤掉系统邮箱
            supplier_emails = [email for email in emails 
                             if 'commonobjective' not in email.lower()]
            contact_info['emails'] = list(set(supplier_emails))
            
            # 2. 提取电话号码
            phone_patterns = [
                r'\+\d{1,3}\s?\d{10,11}',  # 国际格式
                r'\+\d{11,12}',  # 简单国际格式
                r'\b0\d{9,10}\b',  # 英国格式
                r'\(\d{3}\)\s?\d{3}[\-\s]?\d{4}'  # 美式格式
            ]
            
            for pattern in phone_patterns:
                phones = re.findall(pattern, page_text)
                contact_info['phones'].extend(phones)
            
            contact_info['phones'] = list(set(contact_info['phones']))
            
            # 3. 提取网站
            # 查找www.开头的网站
            website_pattern = r'www\.[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:/[^\s]*)?'
            websites = re.findall(website_pattern, page_text)
            
            # 查找http链接
            http_links = soup.find_all('a', href=re.compile(r'^https?://'))
            for link in http_links:
                href = link.get('href', '')
                if ('commonobjective' not in href.lower() and 
                    not any(social in href.lower() for social in ['facebook', 'twitter', 'linkedin', 'instagram'])):
                    websites.append(href)
            
            contact_info['websites'] = list(set(websites))
            
            # 4. 提取公司信息
            # Founded year
            founded_pattern = r'Founded in[:\s]*(\d{4})'
            founded_match = re.search(founded_pattern, page_text, re.I)
            if founded_match:
                contact_info['founded_year'] = founded_match.group(1)
            
            # Governance
            governance_patterns = [
                r'Governance[:\s]*([^\n]+)',
                r'Private Company',
                r'Public Company'
            ]
            for pattern in governance_patterns:
                match = re.search(pattern, page_text, re.I)
                if match:
                    contact_info['governance'] = match.group(1 if '(' in pattern else 0).strip()
                    break
            
            # Employees
            employee_pattern = r'No\.\s*employees[:\s]*([^\n]+)'
            employee_match = re.search(employee_pattern, page_text, re.I)
            if employee_match:
                contact_info['employees'] = employee_match.group(1).strip()
            
            # Business size
            business_size_pattern = r'Business size[:\s]*([^\n]+)'
            business_match = re.search(business_size_pattern, page_text, re.I)
            if business_match:
                contact_info['business_size'] = business_match.group(1).strip()
            
            # 显示结果
            print(f"   📧 邮箱: {', '.join(contact_info['emails']) if contact_info['emails'] else '未找到'}")
            print(f"   📞 电话: {', '.join(contact_info['phones']) if contact_info['phones'] else '未找到'}")
            print(f"   🌐 网站: {', '.join(contact_info['websites'][:2]) if contact_info['websites'] else '未找到'}")
            print(f"   🏢 成立年份: {contact_info['founded_year'] if contact_info['founded_year'] else '未找到'}")
            print(f"   📊 员工数: {contact_info['employees'] if contact_info['employees'] else '未找到'}")
            
            return contact_info
            
        except Exception as e:
            print(f"❌ 提取{company_name}信息失败: {e}")
            return None
    
    def scrape_suppliers(self, search_url, max_suppliers=5):
        """抓取供应商列表并提取联系信息"""
        if not self.logged_in:
            print("❌ 请先登录")
            return []
        
        print(f"\n🔍 获取供应商列表...")
        
        try:
            # 获取供应商列表
            response = self.session.get(search_url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            business_cards = soup.find_all(class_='columns business-card')
            print(f"找到 {len(business_cards)} 个供应商")
            
            suppliers = []
            for card in business_cards:
                # 获取公司名称
                name_element = card.find(class_='name')
                if name_element:
                    name_text = name_element.get_text(strip=True)
                    name_text = re.sub(r'\s*Partner\s*$', '', name_text)
                    
                    # 获取链接
                    card_link = card.find('a', href=True)
                    if card_link:
                        supplier_url = f"https://www.commonobjective.co{card_link.get('href')}"
                        suppliers.append({
                            'name': name_text,
                            'url': supplier_url
                        })
            
            # 限制数量
            suppliers = suppliers[:max_suppliers]
            
            print(f"\n开始提取 {len(suppliers)} 个供应商的详细信息...")
            print("=" * 60)
            
            # 提取每个供应商的详细信息
            for i, supplier in enumerate(suppliers, 1):
                print(f"\n[{i}/{len(suppliers)}]", end=" ")
                
                contact_info = self.extract_supplier_contact(
                    supplier['url'], 
                    supplier['name']
                )
                
                if contact_info:
                    self.suppliers_data.append(contact_info)
                
                # 延迟避免请求过快
                if i < len(suppliers):
                    time.sleep(2)
            
            return self.suppliers_data
            
        except Exception as e:
            print(f"❌ 抓取供应商列表失败: {e}")
            return []
    
    def export_results(self):
        """导出结果"""
        if not self.suppliers_data:
            print("❌ 没有数据可导出")
            return
        
        # 导出CSV
        with open('logged_in_suppliers.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:
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
        
        # 导出JSON
        with open('logged_in_suppliers.json', 'w', encoding='utf-8') as f:
            json.dump(self.suppliers_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 数据已导出:")
        print(f"   📄 logged_in_suppliers.csv")
        print(f"   📄 logged_in_suppliers.json")
        
        # 统计信息
        total_emails = sum(len(s['emails']) for s in self.suppliers_data)
        total_phones = sum(len(s['phones']) for s in self.suppliers_data)
        total_websites = sum(len(s['websites']) for s in self.suppliers_data)
        
        print(f"\n📊 统计信息:")
        print(f"   供应商总数: {len(self.suppliers_data)}")
        print(f"   总邮箱数: {total_emails}")
        print(f"   总电话数: {total_phones}")
        print(f"   总网站数: {total_websites}")

def main():
    scraper = CommonObjectiveScraper()
    
    # 登录信息
    email = "xuguang.ma@climateseal.net"
    password = "ma108369!"
    
    # 供应商搜索URL
    search_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    
    print("🚀 开始登录抓取流程")
    print("=" * 60)
    
    # 1. 登录
    if scraper.login(email, password):
        # 2. 抓取供应商数据（先测试3个）
        suppliers = scraper.scrape_suppliers(search_url, max_suppliers=3)
        
        if suppliers:
            # 3. 导出数据
            scraper.export_results()
            print(f"\n🎉 成功完成！抓取了 {len(suppliers)} 个供应商的联系信息")
        else:
            print("❌ 未能抓取到供应商数据")
    else:
        print("❌ 登录失败，无法继续")

if __name__ == "__main__":
    main()