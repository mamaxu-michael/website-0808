# CommonObjective 供应商信息爬取器

一个用于爬取 CommonObjective 网站供应商联系信息的独立工具。

## 功能特点

✅ **自动登录** - 无需手动操作  
✅ **全面提取** - 邮箱、电话、公司信息、网站等  
✅ **多种格式** - 导出CSV、JSON、TXT格式  
✅ **断点续传** - 支持从指定页面开始  
✅ **错误处理** - 自动重试和错误恢复  
✅ **进度显示** - 实时显示爬取进度  

## 安装依赖

```bash
pip install requests beautifulsoup4
```

## 配置

1. 打开 `commonobjective_scraper.py` 文件
2. 修改以下配置：

```python
# 在 main() 函数中修改这两行
USERNAME = "你的邮箱@example.com"    # 改为你的用户名
PASSWORD = "你的密码"               # 改为你的密码
```

## 使用方法

### 基本用法 - 爬取所有页面
```bash
python3 commonobjective_scraper.py
```

### 高级用法 - 修改代码中的参数

```python
# 只爬取前10页
scraper.scrape_all_suppliers(1, 10)

# 从第20页开始爬取到最后
scraper.scrape_all_suppliers(start_page=20)

# 爬取指定范围 (第15-25页)
scraper.scrape_all_suppliers(15, 25)
```

## 输出文件

程序会自动生成以下文件：

1. **`complete_suppliers_YYYYMMDD_HHMMSS.json`** - 完整数据（JSON格式）
2. **`complete_suppliers_YYYYMMDD_HHMMSS.csv`** - Excel兼容表格
3. **`emails_only_YYYYMMDD_HHMMSS.txt`** - 纯邮箱列表

## 自动备份

- 每处理10页会自动创建备份文件
- 备份文件名格式：`backup_page_XX_YYYYMMDD_HHMMSS.*`

## 常见问题

### Q: 登录失败怎么办？
A: 请检查用户名和密码是否正确，确保账号可以正常登录网站。

### Q: 爬取速度很慢？
A: 程序内置了延时机制防止被封IP，这是正常现象。

### Q: 中途中断了怎么办？
A: 程序会自动保存备份，您可以从中断的页面继续：
```python
scraper.scrape_all_suppliers(start_page=中断的页面号)
```

### Q: 想只爬取特定页面？
A: 修改代码中的参数：
```python
scraper.scrape_all_suppliers(起始页, 结束页)
```

## 注意事项

1. 请合理使用，避免频繁请求
2. 遵守网站的服务条款
3. 建议在非高峰时段运行
4. 首次运行建议先测试几页

## 更新日志

- **2025-08-22**: 初始版本发布
