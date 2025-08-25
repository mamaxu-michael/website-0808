#!/usr/bin/env python3
"""
详细分析目标网站结构
"""

import requests
from bs4 import BeautifulSoup
import re
import json

def analyze_page_structure(url):
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    try:
        print(f"\n{'='*60}")
        print(f"分析页面: {url}")
        print('='*60)
        
        response = session.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 分析页面标题
        title = soup.find('title')
        print(f"页面标题: {title.text.strip() if title else '无标题'}")
        
        # 查找所有链接并分析模式
        links = soup.find_all('a', href=True)
        internal_links = []
        
        for link in links:
            href = link.get('href', '')
            text = link.get_text(strip=True)
            
            # 只关注内部链接
            if href.startswith('/') or 'commonobjective.co' in href:
                internal_links.append({
                    'href': href,
                    'text': text,
                    'classes': link.get('class', [])
                })
        
        print(f"\n内部链接总数: {len(internal_links)}")
        
        # 分析链接模式
        link_patterns = {}
        for link in internal_links:
            href = link['href']
            
            # 提取URL模式
            if '/' in href:
                parts = href.split('/')
                if len(parts) >= 2:
                    pattern = '/'.join(parts[:2]) if parts[0] == '' else parts[0]
                    if pattern not in link_patterns:
                        link_patterns[pattern] = []
                    link_patterns[pattern].append(link)
        
        print("\n链接模式分析:")
        for pattern, links_list in sorted(link_patterns.items()):
            if len(links_list) > 1:  # 只显示重复模式
                print(f"  {pattern}: {len(links_list)} 个链接")
                # 显示前3个例子
                for link in links_list[:3]:
                    print(f"    {link['href']} - {link['text'][:50]}")
        
        # 查找可能的组织/公司链接
        org_links = []
        for link in internal_links:
            href = link['href']
            text = link['text']
            
            # 检查是否可能是组织页面
            if (any(keyword in href.lower() for keyword in ['-co', '-inc', '-ltd', '-llc']) or
                any(keyword in text.lower() for keyword in ['company', 'co.', 'inc.', 'ltd.', 'llc']) or
                re.match(r'^/[a-z0-9-]+(?:-[a-z0-9]+)*$', href)):
                org_links.append(link)
        
        print(f"\n可能的组织链接: {len(org_links)}")
        for link in org_links[:10]:  # 显示前10个
            print(f"  {link['href']} - {link['text']}")
        
        # 查找邮箱
        text_content = soup.get_text()
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text_content)
        if emails:
            print(f"\n找到的邮箱: {emails}")
        
        # 查找具体的HTML结构
        print(f"\n页面结构分析:")
        
        # 查找包含组织信息的容器
        possible_containers = soup.find_all(['div', 'section', 'article'], class_=True)
        container_classes = {}
        for container in possible_containers:
            classes = ' '.join(container.get('class', []))
            if classes:
                container_classes[classes] = container_classes.get(classes, 0) + 1
        
        print("常见容器类名:")
        for class_name, count in sorted(container_classes.items(), key=lambda x: x[1], reverse=True)[:10]:
            if count > 1:
                print(f"  .{class_name}: {count} 个")
        
        return {
            'title': title.text.strip() if title else '',
            'internal_links': len(internal_links),
            'org_links': len(org_links),
            'emails': emails,
            'link_patterns': {k: len(v) for k, v in link_patterns.items()}
        }
        
    except Exception as e:
        print(f"分析失败: {e}")
        return None

def main():
    urls = [
        "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85",
        "https://www.commonobjective.co/better-packaging-co"
    ]
    
    results = {}
    for url in urls:
        result = analyze_page_structure(url)
        if result:
            results[url] = result
    
    # 保存分析结果
    with open('page_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n分析完成! 结果已保存到 page_analysis.json")

if __name__ == "__main__":
    main()