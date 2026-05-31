import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Vercel Node.js runtime explicitly set karna zaroori hai
export const config = {
  runtime: 'nodejs20.x',
};

export default async function handler(req, res) {
  // ── Security Headers ──────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS preflight request handle karna
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Sirf POST allow hai
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, service_type, message } = req.body;

    // ── Basic Validation ───────────────────────────────────────────────────
    if (!name || !phone || !service_type) {
      return res.status(400).json({ error: 'Name, phone aur service_type required hai.' });
    }

    // ── 1. Supabase mein Data Save Karna ──────────────────────────────────
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    const { error: dbError } = await supabase
      .from('inquiries')
      .insert([{ name, phone, email: email || null, service_type, message: message || null }]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      throw new Error('Database Error: ' + dbError.message);
    }

    // ── 2. Zoho SMTP se Email Bhejna ───────────────────────────────────────
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',   // India ke liye smtp.zoho.in use karo
      port: 465,
      secure: true,           // Port 465 ke liye true
      auth: {
        user: process.env.ZOHO_EMAIL,    // e.g. info@yourdomain.com
        pass: process.env.ZOHO_PASSWORD, // Zoho App Password (account password nahi!)
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Connection verify karna (debugging ke liye helpful)
    await transporter.verify();

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const mailOptions = {
      from: `"SB LED Boards Website" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL,
      subject: `🔔 New Inquiry: ${service_type} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
          
          <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 24px; border-radius: 6px 6px 0 0; margin: -20px -20px 24px -20px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">
              🔔 New Customer Inquiry
            </h2>
            <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 14px;">SB LED Boards — Website Form</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr style="background-color: #f9fafb;">
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; width: 35%; border: 1px solid #e5e7eb;">Service</td>
              <td style="padding: 12px 16px; color: #111827; border: 1px solid #e5e7eb;">${service_type}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">Name</td>
              <td style="padding: 12px 16px; color: #111827; border: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">Phone</td>
              <td style="padding: 12px 16px; color: #111827; border: 1px solid #e5e7eb;">
                <a href="tel:${phone}" style="color: #f59e0b; text-decoration: none; font-weight: bold;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; border: 1px solid #e5e7eb;">Email</td>
              <td style="padding: 12px 16px; color: #111827; border: 1px solid #e5e7eb;">${email || '<span style="color:#9ca3af;">Not provided</span>'}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 12px 16px; font-weight: bold; color: #374151; vertical-align: top; border: 1px solid #e5e7eb;">Message</td>
              <td style="padding: 12px 16px; color: #111827; border: 1px solid #e5e7eb;">${message || '<span style="color:#9ca3af;">No message</span>'}</td>
            </tr>
          </table>

          <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 14px 16px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              ⏰ <strong>Received:</strong> ${submittedAt} IST
            </p>
          </div>

          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
            This email was sent automatically from sbsignage.vercel.app
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Form submit ho gaya aur email send ho gayi!',
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: 'Request process nahi ho saka.',
      details: error.message,
    });
  }
}