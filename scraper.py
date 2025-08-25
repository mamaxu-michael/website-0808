#!/usr/bin/env python3
"""
网页数据抓取工具
用于从供应商网站批量提取联系信息
"""

import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import urljoin, urlparse
import json
import csv

class SupplierScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.suppliers_data = []
        
    def get_suppliers_list(self, list_url):
        """从列表页面获取所有供应商链接"""
        try:
            response = self.session.get(list_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 需要根据实际页面结构调整选择器
            # 常见的选择器模式：
            supplier_links = []
            
            # 方法1: 查找包含供应商链接的通用选择器
            possible_selectors = [
                'a[href*="/company"]', 
                'a[href*="/supplier"]', 
                'a[href*="/organization"]',
                'a[href*="/profile"]',
                '.supplier-card a',
                '.company-card a',
                '[data-testid*="supplier"] a'
            ]
            
            for selector in possible_selectors:
                links = soup.select(selector)
                if links:
                    for link in links:
                        href = link.get('href')
                        if href:
                            full_url = urljoin(list_url, href)
                            supplier_links.append(full_url)
                    break
            
            # 如果上面的选择器都没找到，尝试查找所有链接并过滤
            if not supplier_links:
                all_links = soup.find_all('a', href=True)
                for link in all_links:
                    href = link['href']
                    # 根据URL模式判断是否是供应商页面
                    if any(keyword in href.lower() for keyword in ['company', 'supplier', 'organization', 'profile']):
                        full_url = urljoin(list_url, href)
                        supplier_links.append(full_url)
            
            return list(set(supplier_links))  # 去重
            
        except Exception as e:
            print(f"获取供应商列表失败: {e}")
            return []
    
    def extract_contact_info(self, supplier_url):
        """从供应商详情页面提取联系信息"""
        try:
            response = self.session.get(supplier_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 初始化数据结构
            supplier_data = {
                'url': supplier_url,
                'company_name': '',
                'email': '',
                'website': '',
                'phone': '',
                'address': ''
            }
            
            # 提取公司名称
            name_selectors = [
                'h1', 'h2', '.company-name', '.organization-name', 
                '[data-testid*="name"]', '.profile-title'
            ]
            for selector in name_selectors:
                element = soup.select_one(selector)
                if element and element.text.strip():
                    supplier_data['company_name'] = element.text.strip()
                    break
            
            # 提取邮箱
            # 方法1: 查找邮箱链接
            email_links = soup.find_all('a', href=re.compile(r'mailto:'))
            if email_links:
                email = email_links[0]['href'].replace('mailto:', '')
                supplier_data['email'] = email
            else:
                # 方法2: 用正则表达式在页面文本中查找邮箱
                text = soup.get_text()
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                emails = re.findall(email_pattern, text)
                if emails:
                    supplier_data['email'] = emails[0]
            
            # 提取网站链接
            website_selectors = [
                'a[href*="www."]', 'a[href*="http"]', '.website a', 
                '[data-testid*="website"] a'
            ]
            for selector in website_selectors:
                elements = soup.select(selector)
                for element in elements:
                    href = element.get('href', '')
                    # 过滤掉内部链接和社交媒体链接
                    if href and not any(social in href.lower() for social in ['facebook', 'twitter', 'linkedin', 'instagram']):
                        if href.startswith('http') and urlparse(href).netloc != urlparse(supplier_url).netloc:
                            supplier_data['website'] = href
                            break
            
            # 提取电话号码
            text = soup.get_text()
            phone_pattern = r'(\+?[\d\s\-\(\)]{10,})'
            phones = re.findall(phone_pattern, text)
            if phones:
                # 选择最可能是电话的匹配项
                for phone in phones:
                    cleaned_phone = re.sub(r'[^\d+]', '', phone)
                    if len(cleaned_phone) >= 10:
                        supplier_data['phone'] = phone.strip()
                        break
            
            return supplier_data
            
        except Exception as e:
            print(f"提取 {supplier_url} 信息失败: {e}")
            return None
    
    def scrape_all_suppliers(self, list_url, delay=1):
        """抓取所有供应商信息"""
        print("正在获取供应商列表...")
        supplier_urls = self.get_suppliers_list(list_url)
        print(f"找到 {len(supplier_urls)} 个供应商")
        
        for i, url in enumerate(supplier_urls, 1):
            print(f"处理第 {i}/{len(supplier_urls)} 个: {url}")
            
            supplier_data = self.extract_contact_info(url)
            if supplier_data:
                self.suppliers_data.append(supplier_data)
                print(f"  公司: {supplier_data['company_name']}")
                print(f"  邮箱: {supplier_data['email']}")
                print(f"  网站: {supplier_data['website']}")
            
            # 添加延迟避免被封IP
            time.sleep(delay)
        
        return self.suppliers_data
    
    def export_to_csv(self, filename='suppliers_data.csv'):
        """导出数据到CSV文件"""
        if not self.suppliers_data:
            print("没有数据可导出")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
            if self.suppliers_data:
                fieldnames = self.suppliers_data[0].keys()
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(self.suppliers_data)
        print(f"数据已导出到 {filename}")
    
    def export_to_json(self, filename='suppliers_data.json'):
        """导出数据到JSON文件"""
        if not self.suppliers_data:
            print("没有数据可导出")
            return
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.suppliers_data, f, ensure_ascii=False, indent=2)
        print(f"数据已导出到 {filename}")

# 使用示例
if __name__ == "__main__":
    scraper = SupplierScraper()
    
    # 目标URL
    list_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    
    # 开始抓取
    suppliers_data = scraper.scrape_all_suppliers(list_url, delay=2)
    
    # 导出数据
    scraper.export_to_csv('suppliers_contacts.csv')
    scraper.export_to_json('suppliers_contacts.json')
    
    print(f"\n完成! 共抓取了 {len(suppliers_data)} 个供应商的信息")