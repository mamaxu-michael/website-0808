#!/usr/bin/env python3
"""
最终版本：完整的供应商信息抓取脚本
基于真实页面结构分析
"""

import requests
from bs4 import BeautifulSoup
import time
import re
import json
import csv
from urllib.parse import urljoin

class SupplierContactScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.suppliers_data = []
    
    def get_suppliers_list(self, search_url):
        """从搜索页面获取供应商列表"""
        print(f"正在获取供应商列表: {search_url}")
        
        try:
            response = self.session.get(search_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 查找供应商卡片
            business_cards = soup.find_all(class_='columns business-card')
            print(f"找到 {len(business_cards)} 个供应商卡片")
            
            suppliers = []
            
            for card in business_cards:
                supplier_info = {}
                
                # 整个卡片就是一个链接
                card_link = card.find('a', href=True)
                if card_link:
                    supplier_info['profile_url'] = urljoin(search_url, card_link.get('href', ''))
                else:
                    supplier_info['profile_url'] = ''
                
                # 提取公司名称
                name_element = card.find(class_='name')
                if name_element:
                    # 提取公司名称，去掉"Partner"标签
                    name_text = name_element.get_text(strip=True)
                    # 去掉"Partner"后缀
                    name_text = re.sub(r'\s*Partner\s*$', '', name_text)
                    supplier_info['name'] = name_text
                
                # 提取描述
                desc_element = card.find(class_='description')
                if desc_element:
                    supplier_info['description'] = desc_element.get_text(strip=True)
                
                # 提取位置
                location_element = card.find(class_='location')
                if location_element:
                    supplier_info['location'] = location_element.get_text(strip=True)
                
                if supplier_info.get('name'):
                    suppliers.append(supplier_info)
                    print(f"  {supplier_info['name']} - {supplier_info['location']}")
            
            return suppliers
            
        except Exception as e:
            print(f"获取供应商列表失败: {e}")
            return []
    
    def extract_contact_details(self, profile_url, company_name):
        """从供应商详情页面提取联系信息"""
        print(f"\n正在提取 {company_name} 的联系信息...")
        print(f"URL: {profile_url}")
        
        try:
            response = self.session.get(profile_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            contact_info = {
                'emails': [],
                'website': '',
                'phone': '',
                'address': ''
            }
            
            # 方法1: 在页面文本中查找邮箱模式
            page_text = soup.get_text()
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            found_emails = re.findall(email_pattern, page_text)
            
            # 方法2: 查找span元素中的邮箱（基于调试发现的模式）
            spans = soup.find_all('span')
            for span in spans:
                text = span.get_text(strip=True)
                if '@' in text and '.' in text:
                    span_emails = re.findall(email_pattern, text)
                    found_emails.extend(span_emails)
            
            # 方法3: 查找mailto链接
            mailto_links = soup.find_all('a', href=re.compile(r'mailto:'))
            for link in mailto_links:
                email = link['href'].replace('mailto:', '')
                found_emails.append(email)
            
            # 去重并清理邮箱
            contact_info['emails'] = list(set([email.lower() for email in found_emails if email]))
            
            # 查找网站链接
            external_links = soup.find_all('a', href=True)
            for link in external_links:
                href = link.get('href', '')
                text = link.get_text(strip=True).lower()
                
                # 查找可能是官网的链接
                if (href.startswith('http') and 
                    'commonobjective.co' not in href and
                    not any(social in href.lower() for social in ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube']) and
                    (any(keyword in text for keyword in ['website', 'www', 'visit', company_name.lower()]) or
                     any(keyword in href.lower() for keyword in [company_name.lower().replace(' ', ''), 'www']))):
                    contact_info['website'] = href
                    break
            
            # 如果没找到明显的官网链接，取第一个外部链接
            if not contact_info['website']:
                for link in external_links:
                    href = link.get('href', '')
                    if (href.startswith('http') and 
                        'commonobjective.co' not in href and
                        not any(social in href.lower() for social in ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'])):
                        contact_info['website'] = href
                        break
            
            # 查找电话号码
            phone_patterns = [
                r'\+?[\d\s\-\(\)\.]{10,}',
                r'\d{3}[\-\.\s]?\d{3}[\-\.\s]?\d{4}',
                r'\(\d{3}\)\s?\d{3}[\-\.\s]?\d{4}'
            ]
            
            for pattern in phone_patterns:
                phones = re.findall(pattern, page_text)
                for phone in phones:
                    # 清理电话号码
                    cleaned = re.sub(r'[^\d+]', '', phone)
                    if len(cleaned) >= 10 and len(cleaned) <= 15:
                        contact_info['phone'] = phone.strip()
                        break
                if contact_info['phone']:
                    break
            
            return contact_info
            
        except Exception as e:
            print(f"  提取失败: {e}")
            return {
                'emails': [],
                'website': '',
                'phone': '',
                'address': ''
            }
    
    def scrape_all_suppliers(self, search_url, max_suppliers=None, delay=3):
        """抓取所有供应商信息"""
        # 获取供应商列表
        suppliers = self.get_suppliers_list(search_url)
        
        if not suppliers:
            print("❌ 未找到供应商")
            return []
        
        # 限制处理数量
        if max_suppliers:
            suppliers = suppliers[:max_suppliers]
        
        print(f"\n开始处理 {len(suppliers)} 个供应商...")
        print("="*60)
        
        # 处理每个供应商
        for i, supplier in enumerate(suppliers, 1):
            print(f"\n[{i}/{len(suppliers)}] {supplier['name']}")
            
            # 基本信息
            supplier_data = {
                'company_name': supplier['name'],
                'location': supplier.get('location', ''),
                'description': supplier.get('description', ''),
                'profile_url': supplier.get('profile_url', ''),
                'emails': [],
                'website': '',
                'phone': '',
                'address': ''
            }
            
            # 提取联系信息
            if supplier.get('profile_url'):
                contact_info = self.extract_contact_details(
                    supplier['profile_url'], 
                    supplier['name']
                )
                supplier_data.update(contact_info)
            else:
                print("  ⚠️  没有详情页面链接")
            
            # 显示结果
            print(f"  📍 位置: {supplier_data['location']}")
            print(f"  📧 邮箱: {', '.join(supplier_data['emails']) if supplier_data['emails'] else '未找到'}")
            print(f"  🌐 网站: {supplier_data['website'] if supplier_data['website'] else '未找到'}")
            print(f"  📞 电话: {supplier_data['phone'] if supplier_data['phone'] else '未找到'}")
            
            self.suppliers_data.append(supplier_data)
            
            # 延迟
            if i < len(suppliers):
                print(f"  ⏱️  等待 {delay} 秒...")
                time.sleep(delay)
        
        return self.suppliers_data
    
    def export_results(self):
        """导出结果"""
        if not self.suppliers_data:
            print("❌ 没有数据可导出")
            return
        
        # 导出CSV
        with open('supplier_contacts.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:
            fieldnames = ['company_name', 'location', 'emails', 'website', 'phone', 'description', 'profile_url', 'address']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in self.suppliers_data:
                csv_item = item.copy()
                csv_item['emails'] = '; '.join(item['emails']) if item['emails'] else ''
                writer.writerow(csv_item)
        
        # 导出JSON
        with open('supplier_contacts.json', 'w', encoding='utf-8') as f:
            json.dump(self.suppliers_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 数据已导出:")
        print(f"   📄 supplier_contacts.csv")
        print(f"   📄 supplier_contacts.json")
        
        # 统计信息
        total_emails = sum(len(s['emails']) for s in self.suppliers_data)
        total_websites = sum(1 for s in self.suppliers_data if s['website'])
        total_phones = sum(1 for s in self.suppliers_data if s['phone'])
        
        print(f"\n📊 统计信息:")
        print(f"   供应商总数: {len(self.suppliers_data)}")
        print(f"   找到邮箱: {total_emails} 个")
        print(f"   找到网站: {total_websites} 个")
        print(f"   找到电话: {total_phones} 个")

def main():
    scraper = SupplierContactScraper()
    
    search_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    
    print("🚀 开始抓取供应商联系信息...")
    print("="*60)
    
    # 先测试前3个供应商
    suppliers = scraper.scrape_all_suppliers(search_url, max_suppliers=3, delay=2)
    
    if suppliers:
        scraper.export_results()
        print(f"\n🎉 完成! 如果效果满意，可以去掉max_suppliers限制抓取所有供应商")
    else:
        print("❌ 抓取失败")

if __name__ == "__main__":
    main()