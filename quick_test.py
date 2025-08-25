#!/usr/bin/env python3
"""
CommonObjective 爬虫快速测试脚本
用于测试爬虫是否能正常工作
"""

import sys
import os
sys.path.append('.')

# 导入主爬虫模块
try:
    from commonobjective_scraper import CommonObjectiveScraper
except ImportError:
    print("❌ 无法导入爬虫模块，请确保 commonobjective_scraper.py 在同一目录下")
    sys.exit(1)

def test_scraper():
    """测试爬虫基本功能"""
    print("🧪 CommonObjective 爬虫快速测试")
    print("=" * 50)
    
    # 配置信息 - 请修改为您的登录信息
    USERNAME = "xuguang.ma@climateseal.net"  # 请修改
    PASSWORD = "ma108369!"                    # 请修改
    
    print(f"📧 用户名: {USERNAME}")
    print(f"🔑 密码: {'*' * len(PASSWORD)}")
    
    # 创建爬虫实例
    scraper = CommonObjectiveScraper(USERNAME, PASSWORD)
    
    # 测试登录
    print("\n🔐 测试登录...")
    if not scraper.login():
        print("❌ 登录失败！请检查用户名和密码")
        return False
    
    print("✅ 登录成功！")
    
    # 测试获取总页数
    print("\n📊 测试获取页面信息...")
    total_pages = scraper.get_total_pages()
    print(f"✅ 发现 {total_pages} 页数据")
    
    # 测试爬取第一页（只爬取前3个供应商）
    print("\n📄 测试爬取第一页数据（前3个供应商）...")
    try:
        suppliers = scraper.get_suppliers_from_page(1)
        if suppliers:
            # 只保留前3个用于测试
            test_suppliers = suppliers[:3]
            scraper.suppliers_data = test_suppliers
            
            print(f"✅ 成功获取 {len(test_suppliers)} 个供应商数据")
            
            # 显示测试结果
            for i, supplier in enumerate(test_suppliers, 1):
                print(f"   {i}. {supplier['company_name']}")
                if supplier['emails']:
                    print(f"      📧 {len(supplier['emails'])} 个邮箱: {supplier['emails'][0]}...")
                else:
                    print(f"      ❌ 未找到邮箱")
            
            # 测试保存数据
            print("\n💾 测试保存数据...")
            result = scraper.save_data("test_output")
            print(f"✅ 数据已保存到: {result['json_file']}")
            
            print("\n🎉 测试完成！爬虫工作正常")
            print(f"📊 测试统计:")
            print(f"   测试供应商数: {len(test_suppliers)}")
            print(f"   有邮箱的供应商: {result['stats']['suppliers_with_emails']}")
            print(f"   总邮箱数: {result['stats']['total_emails']}")
            
            return True
            
        else:
            print("❌ 未能获取供应商数据")
            return False
            
    except Exception as e:
        print(f"❌ 测试过程中出错: {str(e)}")
        return False

def main():
    """主函数"""
    print("请确保已安装必要的依赖:")
    print("pip install requests beautifulsoup4\n")
    
    if test_scraper():
        print("\n✅ 测试通过！您可以运行完整的爬取程序:")
        print("python3 commonobjective_scraper.py")
    else:
        print("\n❌ 测试失败！请检查:")
        print("1. 网络连接是否正常")
        print("2. 用户名和密码是否正确")
        print("3. 是否安装了必要的依赖")

if __name__ == "__main__":
    main()
