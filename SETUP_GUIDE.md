# 🚀 SB LED Boards - Complete Setup Guide

## Step 1: Supabase Setup (Database)

1. **Supabase account banao**: [supabase.com](https://supabase.com) pe jaake free account banao
2. **New Project create karo**: "sb-led-boards" naam se
3. **Table banao**: SQL Editor mein yeh query run karo:

```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security disable karo (simple setup ke liye)
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
```

4. **API Keys copy karo**: Settings → API se:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

---

## Step 2: Zoho Mail Setup (Email)

1. **Zoho Mail account**: [mail.zoho.com](https://mail.zoho.com) pe jaake free account banao (ya existing use karo)
2. **App Password generate karo**:
   - Zoho Mail → Settings → Mail Accounts → Your Account
   - "Two-Factor Authentication" enable karo (required for app password)
   - "App Passwords" section mein jaake naya password generate karo
   - Is password ko save karlo - yehi `ZOHO_PASSWORD` hoga

3. **SMTP Details**:
   - Host: `smtp.zoho.com`
   - Port: `465` (SSL)
   - Username: aapka Zoho email
   - Password: app password (not regular password)

---

## Step 3: Local Development

1. **`.env.local` file banao** project root mein:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...

ZOHO_EMAIL=your-email@zoho.com
ZOHO_PASSWORD=your-app-password-here
```

2. **Install & Run**:
```bash
npm install
npm run dev
```

---

## Step 4: Vercel Deploy

1. **GitHub pe push karo**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Vercel pe jaao**: [vercel.com](https://vercel.com)
3. **"New Project" → GitHub repo import karo**
4. **Environment Variables add karo** (Settings → Environment Variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `ZOHO_EMAIL`
   - `ZOHO_PASSWORD`
5. **Deploy!** 🎉

---

## Step 5: Apni Images Add Karna

1. Apni photos ko `public/images/` folder mein daalo:
```
public/
  images/
    gallery1.jpg  (apni pehli image)
    gallery2.jpg
    gallery3.jpg
    gallery4.jpg
    gallery5.jpg
    gallery6.jpg
```

2. `src/App.tsx` mein `galleryImages` array update karo:
```js
const galleryImages = [
  { src: '/images/gallery1.jpg', alt: 'LED Board Work 1' },
  { src: '/images/gallery2.jpg', alt: 'Neon Sign Work 2' },
  // ... etc
];
```

---

## 📧 Email Format Example

Jab koi form fill karega, aapko aisa email aayega:

```
Subject: 🔔 New Inquiry - 💡 LED Board

┌─────────────────────────────┐
│      SB LED Boards          │
│   New Customer Inquiry      │
├─────────────────────────────┤
│ 📋 Service: 💡 LED Board    │
│ 👤 Name: Rahul Sharma       │
│ 📱 Phone: +91 98765 43210   │
│ 📧 Email: rahul@gmail.com   │
│ 💬 Message: 5x3 ft board    │
│            chahiye...       │
└─────────────────────────────┘
```

---

## 🔧 Troubleshooting

**Form submit nahi ho raha?**
- Vercel pe environment variables check karo
- Browser console mein error dekho

**Email nahi aa raha?**
- Zoho app password sahi hai na check karo
- Zoho SMTP settings verify karo

**Supabase mein data nahi aa raha?**
- Table name `inquiries` hai na check karo
- RLS disabled hai na confirm karo

---

## 📞 Contact Info (Website mein)

- Phone: +91 9461018391
- Email: rbsjaipur1@gmail.com
- Address: Ganesh Vihar, Jamna Puri, Jaipur - 302012
