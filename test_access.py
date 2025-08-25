#!/usr/bin/env python3
"""
测试访问目标网站
"""

import requests
from bs4 import BeautifulSoup

def test_website_access():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    urls_to_test = [
        "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85",
        "https://www.commonobjective.co/better-packaging-co"
    ]
    
    for url in urls_to_test:
        try:
            print(f"\n测试访问: {url}")
            response = session.get(url, timeout=10)
            print(f"状态码: {response.status_code}")
            print(f"内容长度: {len(response.content)} 字节")
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                title = soup.find('title')
                print(f"页面标题: {title.text.strip() if title else '无标题'}")
                
                # 尝试找到一些关键元素
                links = soup.find_all('a', href=True)
                print(f"找到链接数量: {len(links)}")
                
                # 查找可能的供应商链接模式
                supplier_links = []
                for link in links[:10]:  # 只检查前10个链接
                    href = link.get('href', '')
                    text = link.get_text(strip=True)
                    if any(keyword in href.lower() or keyword in text.lower() 
                           for keyword in ['company', 'supplier', 'organization', 'profile']):
                        supplier_links.append((href, text))
                
                if supplier_links:
                    print("可能的供应商链接:")
                    for href, text in supplier_links[:5]:
                        print(f"  {text}: {href}")
                else:
                    print("未找到明显的供应商链接模式")
            
        except Exception as e:
            print(f"访问失败: {e}")

if __name__ == "__main__":
    test_website_access()