# NatijaHub — Deploy Qilish Qo'llanmasi

## 🚀 Vercel orqali (Tavsiya etiladi — BEPUL)

### Qadam 1: GitHub ga yuklash

1. github.com ga kiring (account oching agar yo'q bo'lsa)
2. "New repository" bosing
3. Nom: `natijahub`
4. "Create repository" bosing
5. Quyidagi fayllarni yuklang:
   - `package.json`
   - `public/index.html`
   - `src/index.js`
   - `src/App.jsx`

### Qadam 2: Vercel ga ulash

1. vercel.com ga kiring
2. "Sign up with GitHub" bosing
3. "New Project" → GitHub repo ni tanlang → `natijahub`
4. Settings:
   - Framework: **Create React App**
   - Build command: `npm run build`
   - Output: `build`
5. "Deploy" bosing ✅

### Qadam 3: Domain ulash

**Bepul Vercel domain** (darhol tayyor):
- `natijahub.vercel.app` ✅

**O'z domeningiz** (masalan: `natijahub.uz`):
1. Vercel → Project → Settings → Domains
2. "Add Domain" → `natijahub.uz` kiriting
3. Domen registratoringizda DNS ni o'rnating:
   - Type: `CNAME`
   - Name: `@` yoki `www`
   - Value: `cname.vercel-dns.com`

---

## 💰 Domen narxi (O'zbekistonda)

| Domen | Narx/yil | Qaerdan |
|-------|----------|---------|
| `.uz` | ~$30-50 | cctld.uz |
| `.com` | ~$10-15 | namecheap.com |
| `.site` | ~$3-5 | namecheap.com |

**Tavsiya:** Hozircha `natijahub.vercel.app` bepul ishlating, keyinchalik `.com` yoki `.uz` oling

---

## 📊 Vercel Free Plan — Qancha foydalanuvchini ko'taradi?

| Parametr | Miqdor |
|----------|--------|
| Bandwidth | 100 GB/oy |
| Requests | Cheksiz statik |
| Concurrent users | **10,000+ bir vaqtda** |
| Uptime | 99.99% |

**Hozirgi NatijaHub uchun:** Chunki bu statik React app (backend yo'q), Vercel CDN orqali **millionlab foydalanuvchi**ni ham ko'taradi.

⚠️ **Muhim eslatma:** Hozir ma'lumotlar "mock" (to'qima). Real foydalanuvchilar uchun backend (ma'lumotlar bazasi) kerak bo'ladi — bu keyingi qadam.

---

## 🗺️ Keyingi qadamlar

```
Hozir:     Statik demo → Vercel (bepul, 10,000+ user)
1-qadam:   Backend qo'shish → Supabase (bepul, 500MB DB)
2-qadam:   Auth (login/register) → Supabase Auth
3-qadam:   Real data → foydalanuvchilar o'z ma'lumotini kiritadi
4-qadam:   O'z domen → natijahub.uz yoki natijahub.com
```

---

## 📞 Yordam kerak bo'lsa

Ushbu qo'llanma bo'yicha savol bo'lsa, Claude ga yozing!
