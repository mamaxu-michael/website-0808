#!/usr/bin/env python3
"""
测试页面访问并确认看到的内容
"""

import requests
from bs4 import BeautifulSoup

def test_page_access(url, description):
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    try:
        print(f"🔗 测试访问: {description}")
        print(f"URL: {url}")
        print("-" * 50)
        
        response = session.get(url)
        print(f"✅ 状态码: {response.status_code}")
        print(f"✅ 内容长度: {len(response.content)} 字节")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 获取页面标题
            title = soup.find('title')
            if title:
                print(f"✅ 页面标题: {title.text.strip()}")
            
            # 获取页面主要内容的一些关键信息来证明访问成功
            # 查找公司名称
            h1_tags = soup.find_all('h1')
            if h1_tags:
                for h1 in h1_tags[:3]:
                    print(f"✅ H1标题: {h1.get_text(strip=True)}")
            
            # 查找导航菜单来证明这是供应商页面
            nav_items = soup.find_all(['a', 'li', 'div'], string=lambda text: text and any(
                keyword in text.lower() for keyword in ['showcase', 'about us', 'get in touch', 'products', 'sustainability']
            ))
            
            if nav_items:
                print("✅ 找到供应商页面导航:")
                for item in nav_items[:5]:
                    text = item.get_text(strip=True)
                    if text and len(text) < 50:
                        print(f"   - {text}")
            
            # 查找公司描述或其他特征性内容
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc:
                print(f"✅ 页面描述: {meta_desc.get('content', '')[:100]}...")
            
            # 查找页面中的主要文本内容（前200字符）
            page_text = soup.get_text(strip=True)
            if page_text:
                print(f"✅ 页面文本开头: {page_text[:200]}...")
            
            return True
        else:
            print(f"❌ 访问失败，状态码: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ 访问出错: {e}")
        return False

def main():
    print("🧪 测试页面访问能力")
    print("=" * 60)
    
    # 测试1: 供应商列表页面
    list_url = "https://www.commonobjective.co/search/organisations?filters%5Bprofile_question_answers%5D%5B%5D=86%7C84%7C608%7C933%7C610%7C85"
    success1 = test_page_access(list_url, "供应商搜索列表页面")
    
    print("\n" + "=" * 60)
    
    # 测试2: Mantis World供应商详情页面
    detail_url = "https://www.commonobjective.co/mantis-world"
    success2 = test_page_access(detail_url, "Mantis World供应商详情页面")
    
    print("\n" + "=" * 60)
    
    # 测试3: Better Packaging Co.供应商详情页面（作为对比）
    detail_url2 = "https://www.commonobjective.co/better-packaging-co"
    success3 = test_page_access(detail_url2, "Better Packaging Co.供应商详情页面")
    
    print(f"\n📊 测试结果总结:")
    print(f"   供应商列表页面: {'✅ 可访问' if success1 else '❌ 无法访问'}")
    print(f"   Mantis World页面: {'✅ 可访问' if success2 else '❌ 无法访问'}")
    print(f"   Better Packaging页面: {'✅ 可访问' if success3 else '❌ 无法访问'}")
    
    if success1 and success2:
        print(f"\n🎉 确认：我可以成功访问供应商列表页面和子页面！")
    elif success2 or success3:
        print(f"\n⚠️  我可以访问供应商子页面，但可能无法获取完整内容")
    else:
        print(f"\n❌ 访问存在问题，可能需要其他方法")

if __name__ == "__main__":
    main()