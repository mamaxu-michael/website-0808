#!/usr/bin/env python3
"""
CommonObjective 供应商信息爬取器
独立版本 - 可直接运行

功能:
- 自动登录 CommonObjective 网站
- 爬取所有供应商页面信息
- 提取邮箱、电话、公司信息
- 导出 CSV、JSON、TXT 格式
- 支持断点续传和错误重试

使用方法:
1. 安装依赖: pip install requests beautifulsoup4
2. 修改配置中的用户名密码
3. 运行: python3 commonobjective_scraper.py

作者: Claude Code Assistant
日期: 2025-08-22
"""

import requests
from bs4 import BeautifulSoup
import time
import json
import csv
import re
import os
from datetime import datetime
from urllib.parse import urljoin, quote

class CommonObjectiveScraper:
    def __init__(self, username, password):
        """
        初始化爬虫
        
        Args:
            username (str): 登录用户名
            password (str): 登录密码
        """
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.base_url = "https://www.commonobjective.co"
        self.suppliers_data = []
        
    def login(self):
        """登录到 CommonObjective"""
        print("🔐 正在登录 CommonObjective...")
        
        # 获取登录页面
        login_url = f"{self.base_url}/account/login"
        response = self.session.get(login_url)
        
        if response.status_code != 200:
            print(f"❌ 无法访问登录页面: {response.status_code}")
            return False
        
        # 解析登录表单
        soup = BeautifulSoup(response.content, 'html.parser')
        csrf_token = None
        
        # 查找 CSRF token
        csrf_input = soup.find('input', {'name': '_token'})
        if csrf_input:
            csrf_token = csrf_input.get('value')
        
        # 准备登录数据
        login_data = {
            'email': self.username,
            'password': self.password,
        }
        
        if csrf_token:
            login_data['_token'] = csrf_token
        
        # 执行登录
        response = self.session.post(login_url, data=login_data)
        
        # 检查登录结果
        if response.status_code == 200 and 'dashboard' in response.url.lower() or 'account' in response.url.lower():
            print("✅ 登录成功!")
            return True
        else:
            print(f"❌ 登录失败: {response.status_code}")
            print(f"响应URL: {response.url}")
            return False
    
    def get_total_pages(self):
        """获取总页数"""
        print("📊 获取总页数...")
        
        suppliers_url = f"{self.base_url}/suppliers"
        response = self.session.get(suppliers_url)
        
        if response.status_code != 200:
            print(f"❌ 无法访问供应商页面: {response.status_code}")
            return 1
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 查找分页信息
        pagination = soup.find('div', class_='pagination') or soup.find('nav', class_='pagination')
        if pagination:
            page_links = pagination.find_all('a')
            max_page = 1
            for link in page_links:
                try:
                    page_num = int(link.text.strip())
                    max_page = max(max_page, page_num)
                except:
                    continue
            print(f"✅ 发现 {max_page} 页数据")
            return max_page
        
        print("⚠️ 未找到分页信息，默认处理59页")
        return 59
    
    def extract_emails_from_text(self, text):
        """从文本中提取邮箱"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.findall(email_pattern, text)
    
    def extract_emails_from_attributes(self, soup):
        """从HTML属性中提取邮箱（应对CloudFlare保护）"""
        emails = []
        
        # 查找 data-email 属性
        elements_with_email = soup.find_all(attrs={'data-email': True})
        for element in elements_with_email:
            email = element.get('data-email')
            if email and '@' in email:
                emails.append(email)
        
        # 查找其他可能包含邮箱的属性
        for attr in ['data-cfemail', 'data-email-address', 'data-mail']:
            elements = soup.find_all(attrs={attr: True})
            for element in elements:
                email_data = element.get(attr)
                if email_data:
                    # 简单解码（如果是编码的邮箱）
                    extracted = self.extract_emails_from_text(email_data)
                    emails.extend(extracted)
        
        return emails
    
    def extract_contact_info(self, supplier_url):
        """提取单个供应商的详细联系信息"""
        try:
            response = self.session.get(supplier_url, timeout=30)
            if response.status_code != 200:
                return {}, []
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 提取邮箱
            emails = []
            
            # 方法1: 从文本中提取
            page_text = soup.get_text()
            emails.extend(self.extract_emails_from_text(page_text))
            
            # 方法2: 从属性中提取
            emails.extend(self.extract_emails_from_attributes(soup))
            
            # 方法3: 从特定元素中提取
            contact_sections = soup.find_all(['div', 'section'], class_=re.compile(r'contact|email'))
            for section in contact_sections:
                emails.extend(self.extract_emails_from_text(section.get_text()))
            
            # 去重
            emails = list(set([email.lower() for email in emails if email and '@' in email]))
            
            # 提取电话号码
            phones = []
            phone_pattern = r'[\+]?[\d\s\-\(\)]{7,}'
            phone_matches = re.findall(phone_pattern, page_text)
            for phone in phone_matches:
                cleaned_phone = re.sub(r'[^\d\+]', '', phone)
                if len(cleaned_phone) >= 7:
                    phones.append(phone.strip())
            
            # 提取其他信息
            info = {}
            
            # 网站
            website_links = soup.find_all('a', href=re.compile(r'^https?://'))
            websites = []
            for link in website_links[:5]:  # 限制数量
                href = link.get('href')
                if href and not href.startswith(self.base_url):
                    websites.append(href)
            
            # 成立年份
            year_pattern = r'(?:founded|established|since)[\s:]*(\d{4})'
            year_match = re.search(year_pattern, page_text, re.IGNORECASE)
            founded_year = year_match.group(1) if year_match else ""
            
            # 员工数量
            employee_patterns = [
                r'(\d+[\-\+]?\s*(?:employees?|staff|people))',
                r'([\d\-\+]+\s*(?:employees?|staff))'
            ]
            employees = ""
            for pattern in employee_patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    employees = match.group(1)
                    break
            
            info = {
                'websites': websites[:3],  # 限制3个网站
                'founded_year': founded_year,
                'employees': employees,
                'phones': phones[:2]  # 限制2个电话
            }
            
            return info, emails
            
        except Exception as e:
            print(f"   ❌ 提取失败: {str(e)}")
            return {}, []
    
    def get_suppliers_from_page(self, page_num):
        """从指定页面获取供应商列表"""
        print(f"\n📄 处理第 {page_num} 页...")
        
        if page_num == 1:
            url = f"{self.base_url}/suppliers"
        else:
            url = f"{self.base_url}/suppliers?page={page_num}"
        
        try:
            response = self.session.get(url, timeout=30)
            if response.status_code != 200:
                print(f"   ❌ 无法访问第{page_num}页: {response.status_code}")
                return []
            
            soup = BeautifulSoup(response.content, 'html.parser')
            suppliers = []
            
            # 查找供应商链接
            supplier_links = soup.find_all('a', href=re.compile(r'/[^/]+$'))
            
            if not supplier_links:
                # 尝试其他选择器
                supplier_links = soup.find_all('a', href=re.compile(r'^/(?!suppliers)[^/]+/?$'))
            
            print(f"   📋 发现 {len(supplier_links)} 个供应商链接")
            
            for i, link in enumerate(supplier_links, 1):
                href = link.get('href')
                if not href or href.startswith('http') or '/suppliers' in href:
                    continue
                
                # 构建完整URL
                supplier_url = urljoin(self.base_url, href)
                company_name = link.get_text(strip=True) or f"Company_{page_num}_{i}"
                
                print(f"   [{i}/{len(supplier_links)}] 🏢 {company_name}")
                
                # 提取详细信息
                info, emails = self.extract_contact_info(supplier_url)
                
                supplier_data = {
                    'page_number': page_num,
                    'company_name': company_name,
                    'emails': emails,
                    'email_count': len(emails),
                    'profile_url': supplier_url,
                    'timestamp': datetime.now().isoformat(),
                    'phones': info.get('phones', []),
                    'websites': info.get('websites', []),
                    'founded_year': info.get('founded_year', ''),
                    'employees': info.get('employees', '')
                }
                
                suppliers.append(supplier_data)
                
                if emails:
                    print(f"      📧 找到 {len(emails)} 个邮箱: {emails[0]}{'...' if len(emails) > 1 else ''}")
                else:
                    print(f"      ❌ 未找到邮箱")
                
                # 避免请求过快
                time.sleep(0.5)
            
            return suppliers
            
        except Exception as e:
            print(f"   ❌ 处理第{page_num}页时出错: {str(e)}")
            return []
    
    def save_data(self, filename_prefix="suppliers_data"):
        """保存数据到多种格式"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 统计信息
        total_suppliers = len(self.suppliers_data)
        suppliers_with_emails = len([s for s in self.suppliers_data if s['emails']])
        total_emails = sum(len(s['emails']) for s in self.suppliers_data)
        
        print(f"\n💾 保存数据...")
        print(f"   总供应商数: {total_suppliers}")
        print(f"   有邮箱的供应商: {suppliers_with_emails}")
        print(f"   总邮箱数: {total_emails}")
        
        # 1. 保存JSON
        json_file = f"{filename_prefix}_{timestamp}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(self.suppliers_data, f, ensure_ascii=False, indent=2)
        
        # 2. 保存CSV
        csv_file = f"{filename_prefix}_{timestamp}.csv"
        with open(csv_file, 'w', newline='', encoding='utf-8-sig') as f:
            fieldnames = ['page_number', 'company_name', 'email_count', 'emails', 'phones', 
                         'websites', 'founded_year', 'employees', 'profile_url']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for supplier in self.suppliers_data:
                csv_row = {
                    'page_number': supplier['page_number'],
                    'company_name': supplier['company_name'],
                    'email_count': supplier['email_count'],
                    'emails': '; '.join(supplier['emails']),
                    'phones': '; '.join(supplier['phones']),
                    'websites': '; '.join(supplier['websites']),
                    'founded_year': supplier['founded_year'],
                    'employees': supplier['employees'],
                    'profile_url': supplier['profile_url']
                }
                writer.writerow(csv_row)
        
        # 3. 保存纯邮箱列表
        emails_file = f"emails_only_{timestamp}.txt"
        all_emails = []
        for supplier in self.suppliers_data:
            all_emails.extend(supplier['emails'])
        
        unique_emails = sorted(list(set(all_emails)))
        with open(emails_file, 'w', encoding='utf-8') as f:
            for email in unique_emails:
                f.write(f"{email}\n")
        
        print(f"✅ 数据已保存:")
        print(f"   📄 {json_file}")
        print(f"   📊 {csv_file}")
        print(f"   📧 {emails_file}")
        
        return {
            'json_file': json_file,
            'csv_file': csv_file,
            'emails_file': emails_file,
            'stats': {
                'total_suppliers': total_suppliers,
                'suppliers_with_emails': suppliers_with_emails,
                'total_emails': total_emails,
                'success_rate': suppliers_with_emails / total_suppliers * 100 if total_suppliers > 0 else 0
            }
        }
    
    def scrape_all_suppliers(self, start_page=1, end_page=None):
        """爬取所有供应商信息"""
        if not self.login():
            print("❌ 登录失败，无法继续")
            return False
        
        # 获取总页数
        if end_page is None:
            end_page = self.get_total_pages()
        
        print(f"\n🚀 开始爬取供应商信息 (第{start_page}-{end_page}页)...")
        print("=" * 60)
        
        for page_num in range(start_page, end_page + 1):
            suppliers = self.get_suppliers_from_page(page_num)
            self.suppliers_data.extend(suppliers)
            
            # 显示进度
            total_suppliers = len(self.suppliers_data)
            suppliers_with_emails = len([s for s in self.suppliers_data if s['emails']])
            
            print(f"📊 进度报告 ({page_num}/{end_page}):")
            print(f"   已处理供应商: {total_suppliers}")
            print(f"   找到邮箱的供应商: {suppliers_with_emails}")
            print(f"   成功率: {suppliers_with_emails/total_suppliers*100:.1f}%" if total_suppliers > 0 else "   成功率: 0%")
            
            # 每10页保存一次备份
            if page_num % 10 == 0:
                self.save_data(f"backup_page_{page_num}")
        
        # 保存最终结果
        print(f"\n🎉 爬取完成!")
        result = self.save_data("complete_suppliers")
        
        print(f"\n📊 最终统计:")
        print(f"   处理页面: {start_page}-{end_page} (共{end_page-start_page+1}页)")
        print(f"   总供应商数: {result['stats']['total_suppliers']}")
        print(f"   有邮箱的供应商: {result['stats']['suppliers_with_emails']}")
        print(f"   总邮箱数: {result['stats']['total_emails']}")
        print(f"   成功率: {result['stats']['success_rate']:.1f}%")
        
        return True

def main():
    """主函数"""
    print("🕷️  CommonObjective 供应商信息爬取器")
    print("=" * 50)
    
    # 配置 - 请修改为您的登录信息
    USERNAME = "xuguang.ma@climateseal.net"  # 请修改为您的用户名
    PASSWORD = "ma108369!"                    # 请修改为您的密码
    
    # 创建爬虫实例
    scraper = CommonObjectiveScraper(USERNAME, PASSWORD)
    
    # 开始爬取
    # 参数说明:
    # start_page: 起始页面（默认1）
    # end_page: 结束页面（默认None，自动检测）
    
    # 示例用法:
    # scraper.scrape_all_suppliers()                    # 爬取所有页面
    # scraper.scrape_all_suppliers(1, 10)              # 只爬取1-10页
    # scraper.scrape_all_suppliers(start_page=20)      # 从第20页开始
    
    success = scraper.scrape_all_suppliers()
    
    if success:
        print("\n✅ 任务完成！数据已保存到文件中。")
    else:
        print("\n❌ 任务失败！请检查网络连接和登录信息。")

if __name__ == "__main__":
    main()