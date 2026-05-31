import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, email, service_type, message } = req.body;
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return res.status(500).json({ error: 'Server configuration missing' });
    }

    const supabase = createClient(url, key);
    const { error: dbError } = await supabase
      .from('inquiries')
      .insert([{ name, phone, email, service_type, message }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ error: 'Database save failed', details: dbError.message });
    }

    // Email bhejna (Optional)
    if (process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.com', port: 465, secure: true,
          auth: { user: process.env.ZOHO_EMAIL, pass: process.env.ZOHO_PASSWORD },
        });
        await transporter.sendMail({
          from: process.env.ZOHO_EMAIL, to: process.env.ZOHO_EMAIL,
          subject: `New Inquiry: ${service_type}`,
          html: `<p>Name: ${name}</p><p>Phone: ${phone}</p><p>Service: ${service_type}</p>`,
        });
      } catch (e) { console.error('Email failed', e); }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Error' });
  }
};