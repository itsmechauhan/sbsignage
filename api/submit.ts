import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, service_type, message } = req.body;

    // 1. Save to Supabase
    const { data, error: dbError } = await supabase
      .from('inquiries')
      .insert([
        {
          name,
          phone,
          email,
          service_type,
          message,
        },
      ])
      .select();

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({ error: 'Database error' });
    }

    // 2. Send email via Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    const serviceLabels = {
      'LED Board': '💡 LED Board',
      'Neon Signage': '✨ Neon Signage',
      'Maintenance': '🔧 Maintenance',
    };

    const mailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: process.env.ZOHO_EMAIL,
      subject: `🔔 New Inquiry - ${serviceLabels[service_type] || service_type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">SB LED Boards</h1>
            <p style="color: #a0a0a0; margin: 10px 0 0 0;">New Customer Inquiry</p>
          </div>
          <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>📋 Service:</strong> ${serviceLabels[service_type] || service_type}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;"><strong>👤 Name:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;"><strong>📱 Phone:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;"><strong>📧 Email:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #666; vertical-align: top;"><strong>💬 Message:</strong></td>
                <td style="padding: 12px 0;">${message || 'No message'}</td>
              </tr>
            </table>
            <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #999; font-size: 12px;">
              <p>Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              <p>SB LED Boards - Jaipur, Rajasthan</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully!',
      data 
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
