#!/usr/bin/env python3
"""
实时备份监控脚本 - 定期保存抓取进度
Real-time backup monitor - saves scraping progress periodically
"""

import time
import json
import csv
import os
import subprocess
import re
from datetime import datetime

class BackupMonitor:
    def __init__(self):
        self.backup_interval = 60  # 每60秒备份一次
        self.progress_pattern = r'\[(\d+)/(\d+)\].*📧\s+(.+?)\s+\(第(\d+)页\)'
        self.email_pattern = r'📧\s+邮箱\((\d+)\):\s+([^\n]+)'
        self.phone_pattern = r'📞\s+电话:\s+([^\n]+)'
        self.current_data = []
        
    def extract_progress_from_output(self, output):
        """从输出中提取进度信息"""
        suppliers = []
        lines = output.split('\n')
        
        current_supplier = None
        for line in lines:
            line = line.strip()
            
            # 匹配供应商信息
            supplier_match = re.search(self.progress_pattern, line)
            if supplier_match:
                current_index = int(supplier_match.group(1))
                total_count = int(supplier_match.group(2))
                company_name = supplier_match.group(3)
                page_number = int(supplier_match.group(4))
                
                current_supplier = {
                    'index': current_index,
                    'total': total_count,
                    'company_name': company_name,
                    'page_number': page_number,
                    'emails': [],
                    'email_count': 0,
                    'phones': [],
                    'profile_url': '',
                    'timestamp': datetime.now().isoformat()
                }
                
            # 匹配邮箱信息
            elif current_supplier and '📧 邮箱' in line:
                email_match = re.search(self.email_pattern, line)
                if email_match:
                    email_count = int(email_match.group(1))
                    emails_str = email_match.group(2)
                    if '❌ 未找到' not in emails_str:
                        emails = [email.strip() for email in emails_str.split(',')]
                        current_supplier['emails'] = emails
                        current_supplier['email_count'] = email_count
                    
            # 匹配电话信息
            elif current_supplier and '📞 电话' in line:
                phone_match = re.search(self.phone_pattern, line)
                if phone_match:
                    phone_str = phone_match.group(1).strip()
                    if '❌ 未找到' not in phone_str:
                        current_supplier['phones'] = [phone_str]
                
                # 电话信息是最后一行，保存供应商数据
                if current_supplier:
                    suppliers.append(current_supplier)
                    current_supplier = None
                    
        return suppliers
    
    def get_bash_output(self):
        """获取后台bash进程的输出"""
        try:
            result = subprocess.run([
                'python3', '-c', '''
import subprocess
import sys
try:
    # 尝试获取bash输出
    result = subprocess.run(["ps", "aux"], capture_output=True, text=True)
    print("Background processes found")
    print(result.stdout[:500])  # 只显示前500字符
except Exception as e:
    print(f"Error: {e}")
'''
            ], capture_output=True, text=True, timeout=10)
            return result.stdout
        except Exception as e:
            print(f"获取bash输出失败: {e}")
            return ""
    
    def save_backup(self, suppliers):
        """保存备份数据"""
        if not suppliers:
            print("📝 没有新的供应商数据需要备份")
            return
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 合并新数据到现有数据
        existing_names = {s['company_name'] for s in self.current_data}
        new_suppliers = [s for s in suppliers if s['company_name'] not in existing_names]
        
        if new_suppliers:
            self.current_data.extend(new_suppliers)
            print(f"📝 新增 {len(new_suppliers)} 个供应商到备份")
        
        # 保存JSON备份
        json_filename = f'backup_progress_{timestamp}.json'
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(self.current_data, f, ensure_ascii=False, indent=2)
        
        # 保存CSV备份
        csv_filename = f'backup_progress_{timestamp}.csv'
        with open(csv_filename, 'w', newline='', encoding='utf-8-sig') as f:
            if self.current_data:
                fieldnames = ['index', 'company_name', 'page_number', 'email_count', 
                            'emails', 'phones', 'profile_url', 'timestamp']
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                
                for supplier in self.current_data:
                    csv_row = supplier.copy()
                    csv_row['emails'] = '; '.join(supplier['emails']) if supplier['emails'] else ''
                    csv_row['phones'] = '; '.join(supplier['phones']) if supplier['phones'] else ''
                    writer.writerow(csv_row)
        
        # 保存邮箱列表
        emails_filename = f'backup_emails_{timestamp}.txt'
        with open(emails_filename, 'w', encoding='utf-8') as f:
            f.write(f"抓取进度备份 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 60 + "\n\n")
            
            total_emails = 0
            suppliers_with_emails = 0
            
            for supplier in self.current_data:
                if supplier['emails']:
                    suppliers_with_emails += 1
                    f.write(f"{supplier['company_name']} (第{supplier['page_number']}页):\n")
                    for email in supplier['emails']:
                        f.write(f"  - {email}\n")
                        total_emails += 1
                    f.write("\n")
            
            f.write(f"\n统计信息:\n")
            f.write(f"总供应商数: {len(self.current_data)}\n")
            f.write(f"有邮箱的供应商: {suppliers_with_emails}\n")
            f.write(f"总邮箱数: {total_emails}\n")
            if len(self.current_data) > 0:
                f.write(f"邮箱获取成功率: {suppliers_with_emails/len(self.current_data)*100:.1f}%\n")
        
        # 统计信息
        total_emails = sum(len(s['emails']) for s in self.current_data)
        suppliers_with_emails = len([s for s in self.current_data if s['emails']])
        
        print(f"✅ 备份完成:")
        print(f"   📄 {json_filename}")
        print(f"   📄 {csv_filename}")
        print(f"   📄 {emails_filename}")
        print(f"📊 当前统计:")
        print(f"   总供应商数: {len(self.current_data)}")
        print(f"   有邮箱的供应商: {suppliers_with_emails}")
        print(f"   总邮箱数: {total_emails}")
        if len(self.current_data) > 0:
            print(f"   邮箱获取成功率: {suppliers_with_emails/len(self.current_data)*100:.1f}%")
    
    def monitor_and_backup(self):
        """主监控循环"""
        print("🔄 实时备份监控已启动")
        print(f"⏰ 备份间隔: {self.backup_interval}秒")
        print("=" * 50)
        
        while True:
            try:
                # 模拟获取进度数据（因为无法直接访问bash输出）
                # 在实际环境中，这里会解析真实的bash输出
                print(f"📡 {datetime.now().strftime('%H:%M:%S')} - 检查抓取进度...")
                
                # 这里应该从实际的bash进程获取输出
                # 由于技术限制，我们创建一个基于时间的模拟备份
                
                # 检查是否有新的进度文件
                progress_files = [f for f in os.listdir('.') if f.startswith('progress_') and f.endswith('.txt')]
                
                if progress_files:
                    # 读取最新的进度文件
                    latest_file = max(progress_files, key=os.path.getmtime)
                    print(f"📂 发现进度文件: {latest_file}")
                    
                    try:
                        with open(latest_file, 'r', encoding='utf-8') as f:
                            content = f.read()
                            suppliers = self.extract_progress_from_output(content)
                            if suppliers:
                                self.save_backup(suppliers)
                            else:
                                print("📝 没有从进度文件中提取到新数据")
                    except Exception as e:
                        print(f"❌ 读取进度文件失败: {e}")
                else:
                    print("📝 没有发现新的进度文件，创建时间戳备份...")
                    # 即使没有新数据，也创建一个时间戳备份确认监控正在运行
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    status_file = f'backup_status_{timestamp}.txt'
                    with open(status_file, 'w', encoding='utf-8') as f:
                        f.write(f"备份监控状态 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                        f.write(f"当前备份数据量: {len(self.current_data)} 个供应商\n")
                        f.write("监控系统正常运行\n")
                    print(f"✅ 状态文件已创建: {status_file}")
                
                print(f"⏰ 等待 {self.backup_interval} 秒后进行下次备份...")
                print("-" * 30)
                time.sleep(self.backup_interval)
                
            except KeyboardInterrupt:
                print("\n🛑 用户中断，备份监控已停止")
                break
            except Exception as e:
                print(f"❌ 监控过程中出现错误: {e}")
                time.sleep(10)  # 出错后等待10秒再重试

def main():
    monitor = BackupMonitor()
    monitor.monitor_and_backup()

if __name__ == "__main__":
    main()