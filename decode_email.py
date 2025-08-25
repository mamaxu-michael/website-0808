#!/usr/bin/env python3
"""
解码CloudFlare保护的邮箱
"""

def decode_cf_email(encoded):
    """解码CloudFlare保护的邮箱"""
    try:
        # CloudFlare邮箱保护解码算法
        # 第一个字符是密钥
        key = int(encoded[:2], 16)
        
        # 解码其余字符
        decoded = ""
        for i in range(2, len(encoded), 2):
            if i + 1 < len(encoded):
                char_code = int(encoded[i:i+2], 16) ^ key
                decoded += chr(char_code)
        
        return decoded
    except Exception as e:
        print(f"解码失败: {e}")
        return None

def test_decode():
    # 从页面找到的data-cfemail
    encoded_email = "c5acaba3aa85a6aaa8a8aaabaaa7afa0a6b1acb3a0eba6aa"
    
    print(f"编码的邮箱: {encoded_email}")
    
    decoded = decode_cf_email(encoded_email)
    if decoded:
        print(f"✅ 解码成功: {decoded}")
    else:
        print("❌ 解码失败")
    
    return decoded

if __name__ == "__main__":
    decoded_email = test_decode()
    
    if decoded_email:
        print(f"\n🎉 找到真实邮箱: {decoded_email}")
    else:
        print("\n需要进一步分析解码算法")