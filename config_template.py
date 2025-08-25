#!/usr/bin/env python3
"""
CommonObjective 爬虫配置文件模板
请复制此文件为 config.py 并修改您的登录信息
"""

# 登录信息 - 请修改为您的账号
USERNAME = "your_email@example.com"    # 您的登录邮箱
PASSWORD = "your_password"             # 您的登录密码

# 爬取设置
START_PAGE = 1      # 起始页面 (默认从第1页开始)
END_PAGE = None     # 结束页面 (None表示爬取到最后一页)

# 请求设置
REQUEST_DELAY = 0.5  # 请求间隔时间(秒) - 避免被封IP
TIMEOUT = 30        # 请求超时时间(秒)

# 备份设置
BACKUP_INTERVAL = 10  # 每隔多少页自动备份一次

# 输出设置
OUTPUT_PREFIX = "suppliers_data"  # 输出文件名前缀

# 使用示例:
# 1. 将此文件复制为 config.py
# 2. 修改 USERNAME 和 PASSWORD
# 3. 在主程序中导入: from config import *
