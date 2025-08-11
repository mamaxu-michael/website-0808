import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// 初始化Resend（如果有API key的话）
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    // 验证必需字段
    if (!name || !email || !phone || !company || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, company, and message are required' },
        { status: 400 }
      );
    }

    // 如果配置了Resend，使用Resend发送
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: [
            process.env.EMAIL_TO || 'xuguang.ma@climateseal.net',
            'michaelmaplus@gmail.com' // 同时发送到Gmail备份
          ],
          subject: `新的联系表单提交 - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">Climate Seal - 新的联系表单提交</h2>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h3 style="color: #333; margin-top: 0;">客户信息</h3>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">姓名:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">邮箱:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
                        <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                      </td>
                    </tr>
                    ${phone ? `
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">电话:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
                        <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                      </td>
                    </tr>
                    ` : ''}
                    ${company ? `
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">公司:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${company}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; color: #555;">留言:</td>
                      <td style="padding: 10px 0; color: #333;">${message.replace(/\n/g, '<br>')}</td>
                    </tr>
                  </table>
                  
                  <div style="margin-top: 20px; padding: 15px; background: #e8f2ff; border-left: 4px solid #667eea; border-radius: 4px;">
                    <p style="margin: 0; color: #555; font-size: 14px;">
                      📅 提交时间: ${new Date().toLocaleString('zh-CN', { 
                        timeZone: 'Asia/Shanghai',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                  <p>此邮件由 Climate Seal 网站自动发送</p>
                </div>
              </div>
            </div>
          `,
        });

        if (error) {
          console.error('Resend error:', error);
          throw new Error('Failed to send with Resend');
        }

        return NextResponse.json(
          { message: 'Email sent successfully with Resend', data },
          { status: 200 }
        );
      } catch (resendError) {
        console.error('Resend failed, falling back to nodemailer:', resendError);
      }
    }

    // 回退到原来的nodemailer方式
    const nodemailer = await import('nodemailer');
    
    // 创建邮件传输器
    const transporter = nodemailer.default.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 邮件内容
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO || 'xuguang.ma@climateseal.net',
      subject: `新的联系表单提交 - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Climate Seal - 新的联系表单提交</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-top: 0;">客户信息</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">姓名:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">邮箱:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">电话:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
                    <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                ` : ''}
                ${company ? `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">公司:</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #555;">留言:</td>
                  <td style="padding: 10px 0; color: #333;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; padding: 15px; background: #e8f2ff; border-left: 4px solid #667eea; border-radius: 4px;">
                <p style="margin: 0; color: #555; font-size: 14px;">
                  📅 提交时间: ${new Date().toLocaleString('zh-CN', { 
                    timeZone: 'Asia/Shanghai',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
              <p>此邮件由 Climate Seal 网站自动发送</p>
            </div>
          </div>
        </div>
      `,
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully with nodemailer' },
      { status: 200 }
    );

  } catch (error) {
    console.error('邮件发送失败:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}