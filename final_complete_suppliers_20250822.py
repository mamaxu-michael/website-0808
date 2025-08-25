#!/usr/bin/env python3
"""
最终完整版供应商数据整合脚本
Final Complete Suppliers Data Integration Script
创建最新、最完整的供应商数据库
"""

import json
import csv
import time
from datetime import datetime

def create_final_complete_backup():
    """创建最终完整版数据备份"""
    
    print("🚀 创建最终完整版供应商数据库...")
    print("=" * 70)
    
    # 读取现有的完整数据
    try:
        with open('all_suppliers_complete_20250822_163237.json', 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
        print(f"✅ 成功加载现有数据: {len(existing_data)} 个供应商")
    except FileNotFoundError:
        print("❌ 未找到现有数据文件")
        return
    
    # 统计现有数据
    total_suppliers = len(existing_data)
    suppliers_with_emails = len([s for s in existing_data if s.get('emails')])
    total_emails = sum(len(s.get('emails', [])) for s in existing_data)
    
    print(f"📊 现有数据统计:")
    print(f"   总供应商数: {total_suppliers}")
    print(f"   有邮箱的供应商: {suppliers_with_emails}")
    print(f"   总邮箱数: {total_emails}")
    print(f"   邮箱获取成功率: {suppliers_with_emails/total_suppliers*100:.1f}%")
    
    # 创建时间戳
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. 创建最终JSON备份
    final_json_filename = f'FINAL_suppliers_database_{timestamp}.json'
    with open(final_json_filename, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    
    # 2. 创建最终CSV备份 (修复版)
    final_csv_filename = f'FINAL_suppliers_database_{timestamp}.csv'
    with open(final_csv_filename, 'w', newline='', encoding='utf-8-sig') as f:
        fieldnames = ['page_number', 'company_name', 'email_count', 'emails', 'phones', 
                     'websites', 'founded_year', 'employees', 'profile_url']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for supplier in existing_data:
            csv_row = {
                'page_number': supplier.get('page_number', ''),
                'company_name': supplier.get('company_name', ''),
                'email_count': len(supplier.get('emails', [])),
                'emails': '; '.join(supplier.get('emails', [])),
                'phones': '; '.join(supplier.get('phones', [])) if supplier.get('phones') else '',
                'websites': '; '.join(supplier.get('websites', [])) if supplier.get('websites') else '',
                'founded_year': supplier.get('founded_year', ''),
                'employees': supplier.get('employees', ''),
                'profile_url': supplier.get('profile_url', '')
            }
            writer.writerow(csv_row)
    
    # 3. 创建纯邮箱列表
    final_emails_filename = f'FINAL_email_list_{timestamp}.txt'
    with open(final_emails_filename, 'w', encoding='utf-8') as f:
        f.write(f"CommonObjective 供应商邮箱数据库 - 最终版本\n")
        f.write(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 70 + "\n\n")
        f.write(f"📊 数据统计:\n")
        f.write(f"   总供应商数: {total_suppliers}\n")
        f.write(f"   有邮箱供应商: {suppliers_with_emails}\n") 
        f.write(f"   总邮箱数: {total_emails}\n")
        f.write(f"   成功率: {suppliers_with_emails/total_suppliers*100:.1f}%\n")
        f.write(f"   覆盖页面: 59页\n\n")
        
        # 按页面分组显示
        current_page = 0
        for supplier in existing_data:
            page_num = supplier.get('page_number', 0)
            if page_num != current_page:
                current_page = page_num
                f.write(f"\n📄 第{page_num}页:\n")
                f.write("-" * 50 + "\n")
            
            if supplier.get('emails'):
                f.write(f"🏢 {supplier.get('company_name', 'Unknown')}\n")
                for email in supplier.get('emails', []):
                    f.write(f"   📧 {email}\n")
                if supplier.get('phones'):
                    f.write(f"   📞 {'; '.join(supplier.get('phones', []))}\n")
                f.write("\n")
    
    # 4. 创建简洁邮箱列表(每行一个邮箱)
    simple_emails_filename = f'FINAL_emails_only_{timestamp}.txt'
    with open(simple_emails_filename, 'w', encoding='utf-8') as f:
        all_emails = []
        for supplier in existing_data:
            all_emails.extend(supplier.get('emails', []))
        
        # 去重并排序
        unique_emails = sorted(list(set(all_emails)))
        for email in unique_emails:
            f.write(f"{email}\n")
    
    # 5. 创建公司名称列表
    companies_filename = f'FINAL_companies_list_{timestamp}.txt'
    with open(companies_filename, 'w', encoding='utf-8') as f:
        f.write(f"CommonObjective 供应商公司名录 - 最终版本\n")
        f.write(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 70 + "\n\n")
        
        for i, supplier in enumerate(existing_data, 1):
            f.write(f"{i:04d}. {supplier.get('company_name', 'Unknown')}\n")
            if supplier.get('emails'):
                f.write(f"      📧 {supplier.get('emails')[0]}\n")  # 显示第一个邮箱
    
    print("\n🎉 最终完整版数据库创建成功!")
    print("=" * 70)
    print("📄 生成文件:")
    print(f"   🗃️  {final_json_filename} - 完整JSON数据库")
    print(f"   📊 {final_csv_filename} - Excel兼容CSV文件") 
    print(f"   📧 {final_emails_filename} - 详细邮箱列表")
    print(f"   📝 {simple_emails_filename} - 纯邮箱列表")
    print(f"   🏢 {companies_filename} - 公司名录")
    
    print(f"\n📈 最终数据统计:")
    print(f"   ✅ 总供应商数: {total_suppliers}")
    print(f"   📧 有邮箱供应商: {suppliers_with_emails} ({suppliers_with_emails/total_suppliers*100:.1f}%)")
    print(f"   📮 总邮箱数: {total_emails}")
    print(f"   📄 覆盖页面: 59页")
    print(f"   🌐 来源: CommonObjective 官方供应商目录")
    
    # 按页面统计
    page_stats = {}
    for supplier in existing_data:
        page = supplier.get('page_number', 0)
        if page not in page_stats:
            page_stats[page] = {'total': 0, 'with_emails': 0, 'emails': 0}
        page_stats[page]['total'] += 1
        if supplier.get('emails'):
            page_stats[page]['with_emails'] += 1
            page_stats[page]['emails'] += len(supplier.get('emails', []))
    
    print(f"\n📊 页面统计摘要:")
    for page in sorted(page_stats.keys())[:10]:  # 显示前10页
        stats = page_stats[page]
        print(f"   第{page}页: {stats['total']}家供应商, {stats['emails']}个邮箱")
    if len(page_stats) > 10:
        print(f"   ... (共{len(page_stats)}页)")
    
    return {
        'total_suppliers': total_suppliers,
        'suppliers_with_emails': suppliers_with_emails, 
        'total_emails': total_emails,
        'files': [final_json_filename, final_csv_filename, final_emails_filename, 
                 simple_emails_filename, companies_filename]
    }

if __name__ == "__main__":
    result = create_final_complete_backup()
    print(f"\n🚀 任务完成! 数据已安全备份到5个文件中")