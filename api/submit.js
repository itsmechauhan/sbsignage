import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, email, service_type, message } = req.body;

    // 1. Supabase mein Data Save Karna
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    const { error: dbError } = await supabase
      .from('inquiries')
      .insert([{ name, phone, email, service_type, message }]);

    if (dbError) {
      throw new Error('Database Error: ' + dbError.message);
    }

    // 2. Zoho SMTP se Email Bhejna
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // 465 port ke liye true hota hai
      auth: {
        user: process.env.ZOHO_EMAIL,    // Aapka Zoho Email (e.g., info@sbledboards.com)
        pass: process.env.ZOHO_PASSWORD, // Jo App Password generate kiya tha Step 1 mein
      },
    });

    const mailOptions = {
      from: `"SB LED Boards Website" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL, // Jis email par enquiry aani hai (apna hi email yahan dalo)
      subject: `🔔 New Inquiry: ${service_type} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">New Customer Inquiry</h2>
          <table style="width: 100%; margin-top: 20px;">
            <tr><td style="padding: 8px 0; color: #666;"><strong>Service:</strong></td><td style="padding: 8px 0;">${service_type}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 8px 0;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;">${email || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Message:</strong></td><td style="padding: 8px 0;">${message || 'No message'}</td></tr>
          </table>
          <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
            Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Form submitted & email sent!' });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
};