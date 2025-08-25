#!/usr/bin/env python3
"""
基于页面结构分析的精确抓取脚本
"""

import requests
from bs4 import BeautifulSoup
import time
import re
import json
import csv
from urllib.parse import urljoin

class PreciseSupplierScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.suppliers_data = []
    
    def extract_suppliers_from_search_page(self, search_url):
        """从搜索页面提取供应商链接"""
        print(f"正在分析搜索页面: {search_url}")
        
        try:
            response = self.session.get(search_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 根据分析结果，查找供应商卡片
            business_cards = soup.find_all(class_='columns business-card')
            print(f"找到 {len(business_cards)} 个供应商卡片")
            
            suppliers = []
            
            for card in business_cards:
                supplier_info = {}
                
                # 提取公司名称
                name_element = card.find(class_='name')
                if name_element:
                    # 查找名称中的链接
                    link = name_element.find('a')
                    if link:
                        supplier_info['name'] = link.get_text(strip=True)
                        supplier_info['url'] = urljoin(search_url, link.get('href', ''))
                    else:
                        supplier_info['name'] = name_element.get_text(strip=True)
                        supplier_info['url'] = ''
                
                # 提取描述
                desc_element = card.find(class_='description')
                if desc_element:
                    supplier_info['description'] = desc_element.get_text(strip=True)
                
                # 提取位置
                location_element = card.find(class_='location')
                if location_element:
                    supplier_info['location'] = location_element.get_text(strip=True)
                
                # 提取logo
                logo_element = card.find(class_='business-logo')
                if logo_element:
                    img = logo_element.find('img')
                    if img:
                        supplier_info['logo'] = img.get('src', '')
                
                if supplier_info.get('name'):
                    suppliers.append(supplier_info)
                    print(f"  找到供应商: {supplier_info['name']}")
            
            return suppliers
            
        except Exception as e:
            print(f"提取供应商列表失败: {e}")
            return []
    
    def extract_contact_from_supplier_page(self, supplier_url):
        """从供应商详情页面提取联系信息"""
        print(f"正在提取联系信息: {supplier_url}")
        
        try:
            response = self.session.get(supplier_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            contact_info = {
                'url': supplier_url,
                'emails': [],
                'website': '',
                'phone': '',
                'address': ''
            }
            
            # 提取页面所有文本用于分析
            page_text = soup.get_text()
            
            # 查找邮箱
            # 方法1: mailto链接
            mailto_links = soup.find_all('a', href=re.compile(r'mailto:'))
            for link in mailto_links:
                email = link['href'].replace('mailto:', '')
                contact_info['emails'].append(email)
            
            # 方法2: 文本中的邮箱
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            found_emails = re.findall(email_pattern, page_text)
            contact_info['emails'].extend(found_emails)
            
            # 去重邮箱
            contact_info['emails'] = list(set(contact_info['emails']))
            
            # 查找网站链接
            external_links = soup.find_all('a', href=True)
            for link in external_links:
                href = link.get('href', '')
                if (href.startswith('http') and 
                    'commonobjective.co' not in href and
                    not any(social in href.lower() for social in ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'])):
                    contact_info['website'] = href
                    break
            
            # 查找电话号码
            phone_patterns = [
                r'\+?[\d\s\-\(\)]{10,}',
                r'\d{3}[\-\.\s]?\d{3}[\-\.\s]?\d{4}',
                r'\(\d{3}\)\s?\d{3}[\-\.\s]?\d{4}'
            ]
            
            for pattern in phone_patterns:
                phones = re.findall(pattern, page_text)
                if phones:
                    # 选择最可能的电话号码
                    for phone in phones:
                        cleaned = re.sub(r'[^\d+]', '', phone)
                        if len(cleaned) >= 10:
                            contact_info['phone'] = phone.strip()
                            break
                    if contact_info['phone']:
                        break
            
            # 查找地址信息 (寻找包含地址关键词的文本)
            address_keywords = ['address', 'location', 'street', 'avenue', 'road', 'city', 'country']
            text_blocks = soup.find_all(['p', 'div', 'span'])
            for block in text_blocks:
                text = block.get_text(strip=True)
                if any(keyword in text.lower() for keyword in address_keywords) and len(text) > 20:
                    contact_info['address'] = text[:200]  # 限制长度
                    break
            
            return contact_info
            
        except Exception as e:
            print(f"提取联系信息失败: {e}")
            return None
    
    def scrape_all_suppliers(self, search_url, max_suppliers=5, delay=2):
        """抓取所有供应商信息"""
        # 第一步：从搜索页面获取供应商列表
        suppliers = self.extract_suppliers_from_search_page(search_url)
        
        if not suppliers:
            print("未找到供应商，请检查页面结构")
            return []
        
        print(f"\n开始提取 {min(len(suppliers), max_suppliers)} 个供应商的详细信息...")
        
        # 第二步：提取每个供应商的详细信息
        for i, supplier in enumerate(suppliers[:max_suppliers], 1):
            print(f"\n[{i}/{min(len(suppliers), max_suppliers)}] 处理: {supplier['name']}")
            
            # 合并基本信息
            supplier_data = {
                'company_name': supplier['name'],
                'description': supplier.get('description', ''),
                'location': supplier.get('location', ''),
                'logo': supplier.get('logo', ''),
                'profile_url': supplier.get('url', ''),
                'emails': [],
                'website': '',
                'phone': '',
                'address': ''
            }
            
            # 如果有详情页面链接，提取联系信息
            if supplier.get('url'):
                contact_info = self.extract_contact_from_supplier_page(supplier['url'])
                if contact_info:
                    supplier_data.update({
                        'emails': contact_info['emails'],
                        'website': contact_info['website'],
                        'phone': contact_info['phone'],
                        'address': contact_info['address']
                    })
            
            self.suppliers_data.append(supplier_data)
            
            # 显示提取结果
            print(f"  公司名称: {supplier_data['company_name']}")
            print(f"  位置: {supplier_data['location']}")
            print(f"  邮箱: {', '.join(supplier_data['emails']) if supplier_data['emails'] else '未找到'}")
            print(f"  网站: {supplier_data['website'] or '未找到'}")
            print(f"  电话: {supplier_data['phone'] or '未找到'}")
            
            # 添加延迟
            if i < min(len(suppliers), max_suppliers):
                print(f"  等待 {delay} 秒...")
                time.sleep(delay)
        
        return self.suppliers_data
    
    def export_to_csv(self, filename='suppliers_contacts.csv'):
        """导出到CSV"""
        if not self.suppliers_data:
            print("没有数据可导出")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
            fieldnames = ['company_name', 'location', 'emails', 'website', 'phone', 'description', 'profile_url', 'address', 'logo']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in self.suppliers_data:
                csv_item = item.copy()
                csv_item['emails'] = '; '.join(item['emails']) if item['emails'] else ''
                writer.writerow(csv_item)
        
        print(f"数据已导出到 {filename}")
    
    def export_to_json(self, filename='suppliers_contacts.json'):
        """导出到JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.suppliers_data, f, ensure_ascii=False, indent=2)
        print(f"数据已导出到 {filename}")

# 主程序
if __name__ == "__main__":
    scraper = PreciseSupplierScraper()
    
    search_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    
    # 开始抓取（限制前5个供应商作为演示）
    suppliers_data = scraper.scrape_all_suppliers(search_url, max_suppliers=5, delay=3)
    
    # 导出数据
    if suppliers_data:
        scraper.export_to_csv()
        scraper.export_to_json()
        print(f"\n✅ 完成! 共抓取了 {len(suppliers_data)} 个供应商的信息")
        
        # 显示统计
        total_emails = sum(len(s['emails']) for s in suppliers_data)
        total_websites = sum(1 for s in suppliers_data if s['website'])
        total_phones = sum(1 for s in suppliers_data if s['phone'])
        
        print(f"统计信息:")
        print(f"  找到邮箱: {total_emails} 个")
        print(f"  找到网站: {total_websites} 个") 
        print(f"  找到电话: {total_phones} 个")
    else:
        print("❌ 未能抓取到任何数据")