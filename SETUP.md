# NatijaHub — To'liq Ishga Tushirish Qo'llanmasi

## 📁 Fayl tuzilmasi
```
natijahub/
├── package.json
├── supabase-schema.sql      ← DB sxemasi
├── SETUP.md                 ← Bu fayl
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.jsx              ← Asosiy kod
    └── supabaseClient.js    ← ⚠️ BU YERGA KALITLARNI QOYING
```

---

## QADAM 1 — Supabase sozlash (5 daqiqa, BEPUL)

1. **supabase.com** ga kiring → "Start your project"
2. GitHub bilan ro'yxatdan o'ting
3. "New project" bosing:
   - Name: `natijahub`
   - Password: kuchli parol (yozib qo'ying)
   - Region: `Southeast Asia (Singapore)` — O'zbekistonga yaqin
4. Loyiha yaratilishini kuting (~2 daqiqa)

### Database sxemasini yuklash:
1. Supabase → **SQL Editor** → "New query"
2. `supabase-schema.sql` faylini oching, hammasini ko'chiring
3. SQL Editor ga joylashtiring → **"Run"** bosing ✅

### API kalitlarini olish:
1. Supabase → **Settings** → **API**
2. Ikki narsani ko'chiring:
   - `Project URL` → `https://xxxxx.supabase.co`
   - `anon public` key → uzun kalit

---

## QADAM 2 — Kalitlarni qo'yish

`src/supabaseClient.js` faylini oching:

```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'   // ← bu yerga URL
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'            // ← bu yerga kalit
```

---

## QADAM 3 — GitHub ga yuklash

1. **github.com** → "New repository" → nom: `natijahub`
2. Barcha fayllarni yuklang (drag & drop ham ishlaydi)
3. "Commit changes" bosing ✅

---

## QADAM 4 — Vercel deploy

1. **vercel.com** ga kiring → "Sign up with GitHub"
2. "New Project" → `natijahub` repo ni tanlang
3. Settings:
   - Framework: **Create React App**
   - Build: `npm run build`
   - Output: `build`
4. **"Deploy"** ✅

Tayyor! Sizning URL: `natijahub.vercel.app`

---

## QADAM 5 — O'z domeningizni ulash (ixtiyoriy)

### `natijahub.com` olish (~$12/yil):
1. **namecheap.com** yoki **godaddy.com** ga kiring
2. `natijahub.com` qidiring → xarid qiling

### Vercel ga ulash:
1. Vercel → Project → **Settings** → **Domains**
2. "Add" → `natijahub.com` kiriting
3. Namecheap/GoDaddy da DNS:
   - Type: `A`
   - Host: `@`
   - Value: `76.76.21.21` (Vercel IP)

---

## 📊 Qancha foydalanuvchi ko'taradi?

| Xizmat | Bepul plan |
|--------|-----------|
| **Vercel** (frontend) | Cheksiz pageview, 100GB bandwidth |
| **Supabase** (backend) | 50,000 foydalanuvchi, 500MB DB |

**Xulosa:** 50,000 ro'yxatdan o'tgan foydalanuvchiga qadar BEPUL!
Universitetingizning barcha talabalariga yetadi 🎉

---

## 🗺️ Keyingi rivojlanish rejasi

```
v1.0 (Hozir):   Login/Register, Intership ko'rish, Ariza berish, CV Builder
v1.1:           Push notifications (Telegram bot)
v1.2:           Tadbirkor arizalarni ko'rishi va tasdiqlash
v1.3:           Baholash tizimi (stars + sharh)
v2.0:           Boshqa universitetlarga kengaytirish
```

---

## ❓ Muammo bo'lsa

Xato xabari → Claude ga screenshot yuboring, hal qilamiz!
