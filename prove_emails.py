#!/usr/bin/env python3
"""
证明邮箱的真实性 - 精确定位邮箱在页面中的位置
"""

import requests
from bs4 import BeautifulSoup
import re

def prove_emails_location():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    # 登录
    print("🔐 登录中...")
    login_page = session.get("https://www.commonobjective.co/login")
    soup = BeautifulSoup(login_page.content, 'html.parser')
    
    login_form = soup.find('form', action='/login')
    form_data = {}
    hidden_inputs = login_form.find_all('input', type='hidden')
    for inp in hidden_inputs:
        name = inp.get('name')
        value = inp.get('value', '')
        if name:
            form_data[name] = value
    
    form_data['email'] = "xuguang.ma@climateseal.net"
    form_data['password'] = "ma108369!"
    
    login_response = session.post("https://www.commonobjective.co/login", data=form_data, allow_redirects=True)
    
    if "dashboard" not in login_response.url:
        print("❌ 登录失败")
        return False
    
    print("✅ 登录成功")
    
    # 获取Mantis World页面
    print("\n🔍 分析Mantis World页面中的邮箱...")
    response = session.get("https://www.commonobjective.co/mantis-world")
    html_content = response.text
    
    # 保存完整页面供用户检查
    with open('/Users/xuguangma/Desktop/website-0808-08-20/mantis_world_logged_in.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("✅ 完整页面已保存到: mantis_world_logged_in.html")
    
    # 查找目标邮箱
    target_emails = [
        'prama@mantisworld.com',
        'Basak@mantisworld.com', 
        'marion@mantisworld.com',
        'russ@mantisworld.com'
    ]
    
    print("\n📧 邮箱位置验证:")
    print("="*60)
    
    for email in target_emails:
        print(f"\n🎯 查找: {email}")
        
        # 检查邮箱是否存在
        if email.lower() in html_content.lower():
            print(f"   ✅ 确认存在于HTML中！")
            
            # 找到邮箱的精确位置和上下文
            lines = html_content.split('\n')
            for i, line in enumerate(lines):
                if email.lower() in line.lower():
                    print(f"   📍 位置: 第 {i+1} 行")
                    print(f"   📝 完整行内容: {line.strip()}")
                    
                    # 显示上下文（前后各3行）
                    context_start = max(0, i-3)
                    context_end = min(len(lines), i+4)
                    
                    print(f"   📋 上下文:")
                    for j in range(context_start, context_end):
                        prefix = ">>> " if j == i else "    "
                        print(f"   {prefix}{j+1:4d}: {lines[j].strip()}")
                    break
        else:
            print(f"   ❌ 未找到")
    
    # 创建一个简化的验证脚本供用户使用
    verification_script = '''
#!/usr/bin/env python3
"""
用户验证脚本 - 您可以用自己的账号验证邮箱
"""

import requests
from bs4 import BeautifulSoup

def verify_emails():
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    # 请替换为您的登录信息
    YOUR_EMAIL = "xuguang.ma@climateseal.net"  # 您的邮箱
    YOUR_PASSWORD = "ma108369!"  # 您的密码
    
    # 登录
    login_page = session.get("https://www.commonobjective.co/login")
    soup = BeautifulSoup(login_page.content, 'html.parser')
    
    login_form = soup.find('form', action='/login')
    form_data = {}
    hidden_inputs = login_form.find_all('input', type='hidden')
    for inp in hidden_inputs:
        name = inp.get('name')
        value = inp.get('value', '')
        if name:
            form_data[name] = value
    
    form_data['email'] = YOUR_EMAIL
    form_data['password'] = YOUR_PASSWORD
    
    login_response = session.post("https://www.commonobjective.co/login", data=form_data, allow_redirects=True)
    
    if "dashboard" not in login_response.url:
        print("登录失败")
        return
    
    # 获取页面并检查邮箱
    response = session.get("https://www.commonobjective.co/mantis-world")
    html_content = response.text.lower()
    
    test_emails = [
        'prama@mantisworld.com',
        'basak@mantisworld.com',
        'marion@mantisworld.com', 
        'russ@mantisworld.com'
    ]
    
    print("验证结果:")
    for email in test_emails:
        exists = email.lower() in html_content
        print(f"{email}: {'✅ 存在' if exists else '❌ 不存在'}")

if __name__ == "__main__":
    verify_emails()
'''
    
    with open('/Users/xuguangma/Desktop/website-0808-08-20/verify_emails.py', 'w', encoding='utf-8') as f:
        f.write(verification_script)
    
    print(f"\n📝 已创建验证脚本: verify_emails.py")
    print(f"   您可以运行此脚本自己验证邮箱的存在")
    
    # 额外验证：检查邮箱格式是否合理
    print(f"\n🔍 邮箱格式合理性检查:")
    email_pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    
    for email in target_emails:
        is_valid_format = bool(re.match(email_pattern, email))
        domain = email.split('@')[1] if '@' in email else ''
        print(f"   {email}: 格式{'✅ 有效' if is_valid_format else '❌ 无效'}, 域名: {domain}")
    
    return True

if __name__ == "__main__":
    prove_emails_location()
    
    print(f"\n💡 证明方式:")
    print(f"1. 完整页面HTML已保存，您可以用文本编辑器打开查找邮箱")
    print(f"2. 运行verify_emails.py脚本自己验证") 
    print(f"3. 所有邮箱都是mantisworld.com域名，格式合理")
    print(f"4. 可以尝试发送测试邮件验证邮箱是否真实有效")