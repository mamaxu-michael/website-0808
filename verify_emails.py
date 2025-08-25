
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
