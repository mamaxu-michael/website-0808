#!/usr/bin/env python3
"""
调试供应商卡片链接提取
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def debug_supplier_cards():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    search_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    
    try:
        response = session.get(search_url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        business_cards = soup.find_all(class_='columns business-card')
        print(f"找到 {len(business_cards)} 个供应商卡片")
        
        for i, card in enumerate(business_cards[:3], 1):  # 只调试前3个
            print(f"\n卡片 {i}:")
            print("-" * 30)
            
            # 查看卡片的完整HTML结构
            print("卡片HTML:")
            print(card.prettify()[:500] + "...")
            
            # 查找名称元素
            name_element = card.find(class_='name')
            if name_element:
                print(f"\n名称元素: {name_element}")
                
                # 查找其中的链接
                links = name_element.find_all('a', href=True)
                print(f"名称中的链接: {len(links)} 个")
                for link in links:
                    href = link.get('href')
                    text = link.get_text(strip=True)
                    full_url = urljoin(search_url, href)
                    print(f"  文本: '{text}'")
                    print(f"  链接: '{href}'")
                    print(f"  完整URL: '{full_url}'")
            
            # 查找卡片中的所有链接
            all_links = card.find_all('a', href=True)
            print(f"\n卡片中所有链接: {len(all_links)} 个")
            for link in all_links:
                href = link.get('href')
                text = link.get_text(strip=True)
                classes = link.get('class', [])
                print(f"  '{text}' -> '{href}' (classes: {classes})")
    
    except Exception as e:
        print(f"调试失败: {e}")

if __name__ == "__main__":
    debug_supplier_cards()