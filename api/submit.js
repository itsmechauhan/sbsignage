const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
  // CORS headers for safety
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, service_type, message } = req.body;

    // 1. Save to Supabase
    const { data, error: dbError } = await supabase
      .from('inquiries')
      .insert([{ name, phone, email, service_type, message }])
      .select();

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError });
    }

    // 2. Send email via Zoho SMTP (Only works if env vars are set in Vercel)
    if (process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD) {
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
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 10px;">
            <div style="background: #111; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; color: white;">
              <h2 style="margin: 0;">SB LED Boards</h2>
              <p style="margin: 5px 0 0 0; color: #aaa;">New Customer Inquiry</p>
            </div>
            <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px;">
              <p><strong>Service:</strong> ${serviceLabels[service_type] || service_type}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email || 'N/A'}</p>
              <p><strong>Message:</strong> ${message || 'No message'}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #888;">Received on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({ success: true, message: 'Form submitted successfully!' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};