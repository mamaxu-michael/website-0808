#!/usr/bin/env python3
"""
网页数据抓取工具测试版本
演示如何提取网页中的联系信息
"""

import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import urljoin, urlparse
import json
import csv

class SupplierScraperTest:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.suppliers_data = []
    
    def test_extract_contact_info(self, url):
        """测试从网页提取联系信息"""
        try:
            print(f"正在访问: {url}")
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 初始化数据结构
            data = {
                'url': url,
                'title': '',
                'emails': [],
                'links': [],
                'text_sample': ''
            }
            
            # 获取页面标题
            title = soup.find('title')
            if title:
                data['title'] = title.text.strip()
            
            # 查找邮箱
            # 方法1: 查找邮箱链接
            email_links = soup.find_all('a', href=re.compile(r'mailto:'))
            for link in email_links:
                email = link['href'].replace('mailto:', '')
                data['emails'].append(email)
            
            # 方法2: 在页面文本中查找邮箱
            text = soup.get_text()
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            found_emails = re.findall(email_pattern, text)
            data['emails'].extend(found_emails)
            
            # 去重
            data['emails'] = list(set(data['emails']))
            
            # 获取外部链接
            for link in soup.find_all('a', href=True):
                href = link.get('href')
                if href and href.startswith('http') and urlparse(href).netloc != urlparse(url).netloc:
                    data['links'].append(href)
            
            # 获取页面文本样本
            data['text_sample'] = text[:200] + "..." if len(text) > 200 else text
            
            return data
            
        except Exception as e:
            print(f"访问 {url} 失败: {e}")
            return None
    
    def test_multiple_sites(self, urls):
        """测试多个网站"""
        for url in urls:
            print(f"\n{'='*50}")
            data = self.test_extract_contact_info(url)
            if data:
                print(f"网站: {data['title']}")
                print(f"URL: {data['url']}")
                print(f"找到邮箱: {data['emails']}")
                print(f"外部链接数量: {len(data['links'])}")
                print(f"页面内容预览: {data['text_sample'][:100]}...")
                self.suppliers_data.append(data)
            
            time.sleep(1)  # 礼貌延迟
    
    def export_results(self):
        """导出结果"""
        if not self.suppliers_data:
            print("没有数据可导出")
            return
        
        # 导出JSON
        with open('test_results.json', 'w', encoding='utf-8') as f:
            json.dump(self.suppliers_data, f, ensure_ascii=False, indent=2)
        
        # 导出CSV
        with open('test_results.csv', 'w', newline='', encoding='utf-8-sig') as csvfile:
            fieldnames = ['url', 'title', 'emails', 'links_count', 'text_sample']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for item in self.suppliers_data:
                csv_item = {
                    'url': item['url'],
                    'title': item['title'],
                    'emails': '; '.join(item['emails']),
                    'links_count': len(item['links']),
                    'text_sample': item['text_sample'][:100]
                }
                writer.writerow(csv_item)
        
        print(f"结果已导出到 test_results.json 和 test_results.csv")

# 测试运行
if __name__ == "__main__":
    scraper = SupplierScraperTest()
    
    # 测试一些公开的示例网站
    test_urls = [
        "https://httpbin.org/html",  # 测试HTML解析
        "https://example.com",       # 简单测试页面
    ]
    
    print("开始测试网页抓取功能...")
    scraper.test_multiple_sites(test_urls)
    scraper.export_results()
    
    print(f"\n测试完成! 共处理了 {len(scraper.suppliers_data)} 个网站")