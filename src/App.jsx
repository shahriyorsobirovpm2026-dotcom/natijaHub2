import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "./supabaseClient";

const C = {
  primary: "#1a1a2e", accent: "#e8a838", accent2: "#c45c2e",
  light: "#fdf6ec", muted: "#6b7280", green: "#22c55e", border: "#e5e7eb", red: "#ef4444",
};

const AuthContext = createContext(null);
function useAuth() { return useContext(AuthContext); }

const MOCK_INTERNSHIPS = [
  { id: 1, company_name: "Shiraq Business School", company_logo: "🏫", role: "HR Assistant Intern", skills: ["HR", "Recruitment", "Communication"], duration: "2 oy", type: "Ofis", faculty: "BA", created_at: "2025-02-15", description: "Kadrlar bo'limida recruitment va onboarding jarayonlarida yordam berish." },
  { id: 2, company_name: "Tasweer Academy", company_logo: "📸", role: "Marketing Intern", skills: ["SMM", "Content", "Canva"], duration: "3 oy", type: "Gibrid", faculty: "Marketing", created_at: "2025-02-10", description: "Ijtimoiy tarmoqlar uchun kontent tayyorlash va marketing strategiyasi." },
  { id: 3, company_name: "TechUz Startup", company_logo: "💻", role: "Business Analyst Intern", skills: ["Excel", "Analytics", "Reporting"], duration: "2 oy", type: "Remote", faculty: "BA", created_at: "2025-02-28", description: "Biznes jarayonlarni tahlil qilish va hisobotlar tayyorlash." },
];

const MOCK_EXPERIENCES = [
  { id: 1, company_name: "Tasweer Academy", company_logo: "📸", role: "Marketing Intern", duration: "3 oy", period: "Okt 2024 – Yan 2025", skills: ["SMM", "Content", "Canva"], rating: 4.8, stars: 5, recommendation: "Shahriyor kontent strategiyasini ishlab chiqishda juda yaxshi ko'rsatdi. Mustaqil ishlash qobiliyati yuqori.", reviewer_name: "Aziz Karimov, Marketing Director", tasks: ["30+ ta post va stories tayyorladi", "Kontent kalendarini boshqardi", "Follower o'sishiga 18% hissa qo'shdi"] },
];

function Badge({ text, color = C.accent }) {
  return <span style={{ background: color + "20", color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{text}</span>;
}

function Btn({ children, onClick, color = C.primary, textColor = "#fff", full, small, disabled, outline }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? "transparent" : disabled ? "#ccc" : color, color: outline ? color : textColor,
      border: outline ? `2px solid ${color}` : "none", borderRadius: 12,
      padding: small ? "7px 14px" : "12px 20px", fontSize: small ? 12 : 14,
      fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : "auto", transition: "all 0.2s", fontFamily: "inherit",
    }}>{children}</button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 13 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        width: "100%", border: `1px solid ${C.border}`, borderRadius: 10,
        padding: "10px 13px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
      }} />
    </div>
  );
}

function Card({ children, style = {}, ...rest }) {
  return <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: `1px solid ${C.border}`, ...style }} {...rest}>{children}</div>;
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 36 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.accent, animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onLogin, onRegister }) {
  const lp = {
    bg: "#FFFFFF", bg2: "#F2F0EC", card: "#FAFAF8",
    border: "#E5E2DC", border2: "#D4D0C8",
    text: "#0F0E0C", text2: "#4A4845", text3: "#7A7875",
    acc: "#2D5BE3", accLight: "#EEF2FD", accText: "#1A3FB5",
    green: "#1A7A4A", greenLight: "#EBF5F0",
    amber: "#8A5E1A", amberLight: "#FBF4E8",
  };

  const features = [
    { num: "01", title: "Mos amaliyot topish", desc: "Ko'nikma va soha bo'yicha filtrlash. Talabaga mos internship topamiz.", from: "Platforma", fromC: lp.accLight, fromT: lp.accText, to: "Talaba oladi", toC: lp.greenLight, toT: lp.green },
    { num: "02", title: "CV builder", desc: "Har amaliyotdan keyin CV o'zi yangilanadi. Qo'lda hech narsa qilmaysiz.", from: "Platforma", fromC: lp.accLight, fromT: lp.accText, to: "Talaba oladi", toC: lp.greenLight, toT: lp.green },
    { num: "03", title: "Rasmiy tavsiya xati", desc: "Tadbirkor talabani baholab platformada raqamli tavsiya yozadi.", from: "Tadbirkor beradi", fromC: lp.amberLight, fromT: lp.amber, to: "Talaba oladi", toC: lp.greenLight, toT: lp.green },
    { num: "04", title: "Sertifikat tizimi", desc: "Amaliyot tugagach sertifikat beriladi. QR orqali har kim tekshira oladi.", from: "Platforma", fromC: lp.accLight, fromT: lp.accText, to: "Talaba oladi", toC: lp.greenLight, toT: lp.green },
    { num: "05", title: "Tadbirkor uchun filtr", desc: "Biz talabalarni filtrlab mos kandidatlarni yetkazamiz. Vaqt va pul tejaladi.", from: "Platforma", fromC: lp.accLight, fromT: lp.accText, to: "Tadbirkor oladi", toC: lp.amberLight, toT: lp.amber },
    { num: "06", title: "Biznes marketplace", desc: "Mahsulotingizni talabalar auditoriyasiga taqdim eting.", from: null, tag: "Tez kunda", tagC: lp.bg2, tagT: lp.text3 },
  ];

  const problems = [
    { num: "01", title: "Nazariya amaliyotga aylanmaydi", desc: "4 yil o'qiydi, biror tashkilotda ishlamaydi. Diplom bor, tajriba yo'q." },
    { num: "02", title: "Mavjud platformalar mos emas", desc: "LinkedIn, HeadHunter, OLX — barchasi tajriba yoki katta yoshlilar uchun." },
    { num: "03", title: "Portfolio va CV bo'sh", desc: "Vakansiyaga murojaat qilganda ko'rsatadigan hech narsasi yo'q." },
    { num: "04", title: "Tadbirkor ham qiynaladi", desc: "Yosh kadr topish uchun HR xarajati va vaqt ketadi." },
  ];

  const steps = [
    { n: "01", title: "Ro'yxatdan o'tish", desc: "Ko'nikmalar va sohani kiriting", actor: "Talaba", aC: lp.accLight, aT: lp.accText },
    { n: "02", title: "Mos amaliyot topish", desc: "Platforma mos internshiplarni taklif etadi", actor: "Platforma", aC: lp.accLight, aT: lp.accText },
    { n: "03", title: "Amaliyot o'tish", desc: "Real muhitda tajriba yig'ish — 1 dan 3 oygacha", actor: "Tadbirkor", aC: lp.amberLight, aT: lp.amber },
    { n: "04", title: "Tadbirkor tavsiya beradi", desc: "Rahbar platformada baholaydi va raqamli tavsiya yozadi", actor: "Tadbirkor beradi", aC: lp.amberLight, aT: lp.amber },
    { n: "05", title: "Vakansiyaga murojaat", desc: "CV + sertifikat + tavsiya xati — hammasi tayyor", actor: "Talaba oladi", aC: lp.greenLight, aT: lp.green },
  ];

  const s = {
    nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${lp.border}`, padding: "0 6%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 },
    logo: { fontFamily: "'Sora','Georgia',serif", fontWeight: 700, fontSize: 20, color: lp.text, letterSpacing: "-0.3px" },
    navLinks: { display: "flex", alignItems: "center", gap: 24 },
    navA: { color: lp.text2, fontSize: 14, fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" },
    navCta: { background: lp.text, color: "#fff", padding: "8px 18px", borderRadius: 7, fontSize: 14, fontWeight: 500, cursor: "pointer", border: "none", fontFamily: "inherit" },
    hero: { padding: "96px 6% 80px", maxWidth: 700, margin: "0 auto", textAlign: "center" },
    h1: { fontFamily: "'Sora','Georgia',serif", fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 36, letterSpacing: "-0.5px", color: lp.text },
    heroBtns: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 },
    btnPrimary: { background: lp.text, color: "#fff", padding: "13px 26px", borderRadius: 8, fontWeight: 500, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "opacity .15s" },
    btnOutline: { background: "transparent", color: lp.text2, padding: "13px 26px", borderRadius: 8, fontWeight: 500, fontSize: 14, border: `1px solid ${lp.border2}`, cursor: "pointer", fontFamily: "inherit" },
    statsRow: { display: "flex", border: `1px solid ${lp.border}`, borderRadius: 12, overflow: "hidden" },
    stat: { flex: 1, padding: 20, textAlign: "center", borderRight: `1px solid ${lp.border}` },
    statNum: { fontFamily: "'Sora','Georgia',serif", fontSize: 22, fontWeight: 700, color: lp.text },
    statLabel: { fontSize: 12, color: lp.text3, marginTop: 3 },
    divider: { border: "none", borderTop: `1px solid ${lp.border}`, margin: "0 6%" },
    section: { padding: "64px 6%", maxWidth: 1160, margin: "0 auto" },
    secTag: { fontSize: 11, fontWeight: 700, color: lp.text3, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 },
    secTitle: { fontFamily: "'Sora','Georgia',serif", fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 14, letterSpacing: "-0.3px", color: lp.text },
    secSub: { fontSize: 15, color: lp.text2, maxWidth: 520, lineHeight: 1.7 },
    probCard: { background: lp.card, border: `1px solid ${lp.border}`, borderRadius: 12, padding: "22px 24px" },
    featGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: lp.border, border: `1px solid ${lp.border}`, borderRadius: 14, overflow: "hidden", marginTop: 40 },
    featItem: { background: lp.card, padding: "28px 26px" },
    stepsWrap: { marginTop: 40, border: `1px solid ${lp.border}`, borderRadius: 14, overflow: "hidden" },
    stepRow: { display: "grid", gridTemplateColumns: "60px 1fr auto", alignItems: "center", gap: 20, padding: "20px 28px", background: lp.card, borderBottom: `1px solid ${lp.border}` },
    ctaBox: { background: lp.text, borderRadius: 16, padding: "52px 48px", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" },
    footer: { borderTop: `1px solid ${lp.border}`, padding: "28px 6%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: lp.bg, color: lp.text, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700&family=DM+Sans:wght@400;500&display=swap');
        .feat-item:hover { background: #F2F0EC !important; }
        .step-row:hover { background: #F2F0EC !important; }
        .prob-card:hover { border-color: ${lp.border2} !important; }
        .partner-item:hover { border-color: ${lp.border2} !important; }
        .btn-primary:hover { opacity: 0.8; }
        @media(max-width:800px){ .feat-grid-inner { grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:640px){ .prob-grid-inner { grid-template-columns: 1fr !important; } .cta-box-inner { grid-template-columns: 1fr !important; padding: 36px 28px !important; } .steps-row { grid-template-columns: 48px 1fr !important; } .step-actor { display: none; } }
        @media(max-width:480px){ .stats-row-inner { flex-direction: column !important; } .hero-section { padding: 56px 6% 48px !important; } }
        @media(max-width:640px){ .nav-links-inner { display: none !important; } }
      `}</style>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.logo}>Natija<span style={{ color: lp.acc }}>Hub</span></div>
        <div className="nav-links-inner" style={s.navLinks}>
          <button style={s.navA}>Xizmatlar</button>
          <button style={s.navA}>Jarayon</button>
          <button style={s.navA}>Hamkorlar</button>
          <button onClick={onLogin} style={s.navCta}>Kirish</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero-section" style={s.hero}>
        <h1 style={s.h1}>
          NatijaHub talabaning vakansiyagacha bo'lgan{" "}
          <em style={{ fontStyle: "normal", color: lp.acc }}>yo'lini quradi.</em>
        </h1>
        <div style={s.heroBtns}>
          <button className="btn-primary" onClick={onRegister} style={s.btnPrimary}>Boshlash</button>
          <button onClick={onLogin} style={s.btnOutline}>Tadbirkor sifatida kirish</button>
        </div>
        <div className="stats-row-inner" style={s.statsRow}>
          {[["100%", "Talabalar auditoriyasi"], ["2+", "Rasmiy hamkorlar"], ["Bepul", "Talaba uchun"]].map(([num, label], i, arr) => (
            <div key={label} style={{ ...s.stat, borderRight: i < arr.length - 1 ? `1px solid ${lp.border}` : "none" }}>
              <div style={s.statNum}>{num}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <hr style={s.divider} />

      {/* PROBLEM */}
      <div style={s.section}>
        <div style={s.secTag}>Muammo</div>
        <h2 style={s.secTitle}>Nima uchun talaba ish topa olmaydi?</h2>
        <p style={s.secSub}>Ko'p talaba ko'p joylarga ariza beradi. Javob har doim bir xil.</p>
        <div style={{ marginTop: 40 }}>
          <div style={{ background: "#F7F6F3", border: `1px solid ${lp.border2}`, borderRadius: 12, padding: "28px 32px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Sora',serif", fontSize: 18, fontWeight: 600, color: lp.text, lineHeight: 1.5 }}>
              Tajriba olish uchun — ish kerak&nbsp;&nbsp;/&nbsp;&nbsp;Ish topish uchun — tajriba kerak
            </div>
            <div style={{ fontSize: 13, color: lp.text3, marginTop: 8, fontStyle: "italic" }}>"Tajribang bormi?" — talabaning eng ko'p eshitgan so'zi</div>
          </div>
          <div className="prob-grid-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {problems.map(p => (
              <div key={p.num} className="prob-card" style={s.probCard}>
                <div style={{ fontSize: 11, fontWeight: 700, color: lp.text3, letterSpacing: 1, marginBottom: 10 }}>{p.num}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 7, color: lp.text }}>{p.title}</div>
                <div style={{ fontSize: 13, color: lp.text2, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={s.divider} />

      {/* FEATURES */}
      <div style={s.section}>
        <div style={s.secTag}>Xizmatlar</div>
        <h2 style={s.secTitle}>NatijaHub nima beradi?</h2>
        <p style={s.secSub}>Talaba uchun bepul. Tadbirkor uchun qulay. Ikki tomonga ham foydali.</p>
        <div className="feat-grid-inner" style={{ ...s.featGrid, gridTemplateColumns: "repeat(3,1fr)" }}>
          {features.map(f => (
            <div key={f.num} className="feat-item" style={s.featItem}>
              <div style={{ fontSize: 11, fontWeight: 700, color: lp.text3, letterSpacing: 1, marginBottom: 14 }}>{f.num}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: lp.text }}>{f.title}</div>
              <div style={{ fontSize: 13, color: lp.text2, lineHeight: 1.6 }}>{f.desc}</div>
              {f.from ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 4, background: f.fromC, color: f.fromT }}>{f.from}</span>
                  <span style={{ fontSize: 11, color: lp.text3 }}>→</span>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 4, background: f.toC, color: f.toT }}>{f.to}</span>
                </div>
              ) : (
                <span style={{ display: "inline-block", fontSize: 11, padding: "3px 9px", borderRadius: 4, marginTop: 14, fontWeight: 500, background: f.tagC, color: f.tagT }}>{f.tag}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr style={s.divider} />

      {/* STEPS */}
      <div style={s.section}>
        <div style={s.secTag}>Jarayon</div>
        <h2 style={s.secTitle}>Qanday ishlaydi?</h2>
        <p style={s.secSub}>Ro'yxatdan o'tishdan vakansiyagacha — 5 qadam.</p>
        <div style={s.stepsWrap}>
          {steps.map((st, i) => (
            <div key={st.n} className="step-row" style={{ ...s.stepRow, borderBottom: i < steps.length - 1 ? `1px solid ${lp.border}` : "none" }}>
              <div style={{ fontFamily: "'Sora',serif", fontSize: 18, fontWeight: 700, color: lp.text3 }}>{st.n}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: lp.text }}>{st.title}</div>
                <div style={{ fontSize: 13, color: lp.text2, marginTop: 3 }}>{st.desc}</div>
              </div>
              <span className="step-actor" style={{ fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 4, whiteSpace: "nowrap", background: st.aC, color: st.aT }}>{st.actor}</span>
            </div>
          ))}
        </div>
      </div>

      <hr style={s.divider} />

      {/* PARTNERS */}
      <div style={s.section}>
        <div style={s.secTag}>Hamkorlar</div>
        <h2 style={s.secTitle}>Kimlar bilan ishlaymiz?</h2>
        <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
          {[
            { name: "Millat Umidi University", type: "Ta'lim hamkori", badge: "Rasmiy hamkor", bC: lp.accLight, bT: lp.accText },
            { name: "Tasweer Academy", type: "Biznes hamkori", badge: "Birinchi hamkor", bC: lp.greenLight, bT: lp.green },
            { name: "Sizning kompaniyangiz", type: "Keyingi hamkor", badge: "Bog'laning", bC: lp.bg2, bT: lp.text3, dashed: true },
          ].map(p => (
            <div key={p.name} className="partner-item" style={{ background: lp.card, border: `1px solid ${lp.border}`, borderStyle: p.dashed ? "dashed" : "solid", borderRadius: 10, padding: "14px 20px", opacity: p.dashed ? 0.5 : 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: lp.text }}>{p.name}</div>
              <div style={{ fontSize: 12, color: lp.text3, marginTop: 3 }}>{p.type}</div>
              <span style={{ display: "inline-block", fontSize: 10, padding: "2px 8px", borderRadius: 3, marginTop: 8, fontWeight: 600, background: p.bC, color: p.bT }}>{p.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "64px 6%", maxWidth: 1160, margin: "0 auto" }}>
        <div className="cta-box-inner" style={s.ctaBox}>
          <div>
            <div style={{ fontFamily: "'Sora',serif", fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px" }}>Birinchilar qatorida bo'ling</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>Talabamisiz yoki tadbirkormi — platformaga qo'shiling. Sizning fikringiz bizga eng muhim.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 180 }}>
            <button onClick={onRegister} style={{ background: "#fff", color: lp.text, padding: "12px 22px", borderRadius: 8, fontWeight: 500, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Talaba sifatida kirish</button>
            <button onClick={onLogin} style={{ background: "transparent", color: "rgba(255,255,255,0.55)", padding: "12px 22px", borderRadius: 8, fontWeight: 500, fontSize: 14, border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Tadbirkor sifatida kirish</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={{ fontFamily: "'Sora',serif", fontWeight: 700, fontSize: 15, color: lp.text }}>Natija<span style={{ color: lp.acc }}>Hub</span></div>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: lp.text3 }}>
          <span>@natijahubuz</span>
          <span>natija-hub2.vercel.app</span>
        </div>
        <div style={{ fontSize: 12, color: lp.text3 }}>2026 · O'zbekiston</div>
      </footer>
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "", full_name: "", university: "", company_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const f = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  const submit = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { full_name: form.full_name, role, university: form.university, company_name: form.company_name } }
        });
        if (error) throw error;
        if (data.user && !data.user.email_confirmed_at) setSuccess("✅ Email tasdiqlash xati yuborildi!");
        else if (data.user) onAuth(data.user);
      }
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.light, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.primary, fontFamily: "'Sora','Georgia',serif" }}>Natija<span style={{ color: C.accent }}>Hub</span></div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>Talabalarning vakansiyagacha bo'lgan yo'lini quradi</div>
      </div>

      <Card style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", background: C.light, borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {[["login", "Kirish"], ["register", "Ro'yxat"]].map(([m, l]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, background: mode === m ? C.primary : "transparent", color: mode === m ? "#fff" : C.muted,
              border: "none", borderRadius: 10, padding: "8px 0", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
            }}>{l}</button>
          ))}
        </div>

        {mode === "register" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["student", "Talaba"], ["company", "Tadbirkor"]].map(([r, l]) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, background: role === r ? C.primary : "transparent", color: role === r ? "#fff" : C.muted,
                  border: `2px solid ${role === r ? C.primary : C.border}`, borderRadius: 10, padding: "9px 0",
                  cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                }}>{l}</button>
              ))}
            </div>
            <Input label="Ism Familiya" {...f("full_name")} placeholder="Ism Familiya" />
            {role === "student" && <Input label="Universitet" {...f("university")} placeholder="TDIU, WIUT..." />}
            {role === "company" && <Input label="Kompaniya nomi" {...f("company_name")} placeholder="Kompaniya nomi" />}
          </>
        )}

        <Input label="Email" type="email" {...f("email")} placeholder="sizning@email.com" />
        <Input label="Parol" type="password" {...f("password")} placeholder="Kamida 6 belgi" />

        {error && <div style={{ background: C.red + "15", color: C.red, padding: "9px 13px", borderRadius: 10, fontSize: 13, marginBottom: 12 }}>⚠️ {error}</div>}
        {success && <div style={{ background: C.green + "15", color: C.green, padding: "9px 13px", borderRadius: 10, fontSize: 13, marginBottom: 12 }}>{success}</div>}

        <Btn full onClick={submit} disabled={loading}>
          {loading ? "Kuting..." : mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
        </Btn>
      </Card>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ profile, onLogout }) {
  return (
    <nav style={{ background: C.primary, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "'Sora','Georgia',serif" }}>Natija<span style={{ color: C.accent }}>Hub</span></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{profile.full_name?.split(" ")[0] || "User"}</div>
          <div style={{ color: C.accent, fontSize: 10 }}>{profile.role === "company" ? "Tadbirkor" : "Talaba"}</div>
        </div>
        <button onClick={onLogout} style={{ background: "#ffffff15", color: "#ffffff80", border: "none", borderRadius: 8, padding: "5px 9px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Chiqish</button>
      </div>
    </nav>
  );
}

// ─── INTERNSHIP CARD ──────────────────────────────────────────────────────────
function InternshipCard({ item, userId }) {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const apply = async () => {
    if (!userId) { alert("Ariza berish uchun avval tizimga kiring!"); return; }
    setLoading(true);
    try {
      await supabase.from("applications").insert({ internship_id: item.id, student_id: userId });
      setApplied(true);
    } catch { setApplied(true); }
    setLoading(false);
  };

  return (
    <Card style={{ marginBottom: 12 }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, background: C.light, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{item.company_logo || "🏢"}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{item.role}</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{item.company_name}</div>
          </div>
        </div>
        {item.type && <Badge text={item.type} color={C.primary} />}
      </div>
      {item.description && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, margin: "0 0 10px" }}>{item.description}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
        {(item.skills || []).map((s) => <Badge key={s} text={s} color={C.accent2} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
        <span style={{ fontSize: 12, color: C.muted }}>⏱ {item.duration || "—"}</span>
        <Btn small onClick={apply} disabled={applied || loading} color={applied ? C.green : C.primary}>
          {loading ? "⏳" : applied ? "Yuborildi" : "Ariza berish"}
        </Btn>
      </div>
    </Card>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function StudentHome({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Barchasi");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from("internships").select("*").eq("is_active", true).order("created_at", { ascending: false });
        setItems(data?.length ? data : MOCK_INTERNSHIPS);
      } catch { setItems(MOCK_INTERNSHIPS); }
      setLoading(false);
    })();
  }, []);

  const filters = ["Barchasi", "BA", "Marketing", "Remote"];
  const filtered = filter === "Barchasi" ? items : items.filter(i => i.faculty === filter || i.type === filter);

  return (
    <div style={{ padding: "18px 0" }}>
      <div style={{ background: `linear-gradient(135deg,${C.primary},#16213e)`, borderRadius: 18, padding: "24px 20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, background: C.accent + "15", borderRadius: "50%" }} />
        <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>XUSH KELIBSIZ</div>
        <h2 style={{ color: "#fff", margin: "0 0 5px", fontSize: 20, fontWeight: 800 }}>Real amaliyot toping</h2>
        <p style={{ color: "#ffffff60", fontSize: 13, margin: "0 0 14px" }}>{items.length} ta intership mavjud</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 18 }}>
        {[{ l: "E'lon", v: items.length, i: "📋" }, { l: "Hamkor", v: "2+", i: "🤝" }, { l: "Talaba", v: "39+", i: "🎓" }].map(s => (
          <Card key={s.l} style={{ textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: 18, marginBottom: 3 }}>{s.i}</div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{s.l}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? C.primary : "#fff", color: filter === f ? "#fff" : C.muted,
            border: `1px solid ${filter === f ? C.primary : C.border}`, padding: "5px 13px",
            borderRadius: 18, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
          }}>{f}</button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.map(item => <InternshipCard key={item.id} item={item} userId={userId} />)}
    </div>
  );
}

function StudentProfile({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: profile?.full_name || "", phone: profile?.phone || "", about: profile?.about || "", university: profile?.university || "" });
  const [skills, setSkills] = useState(profile?.skills || ["HR", "Marketing", "Excel"]);
  const [newSkill, setNewSkill] = useState("");
  const [apps, setApps] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.id) (async () => {
      try {
        const { data } = await supabase.from("applications").select("*, internships(role,company_name,company_logo)").eq("student_id", profile.id);
        setApps(data || []);
      } catch { }
    })();
  }, [profile]);

  const save = async () => {
    setSaving(true);
    try { await supabase.from("profiles").update({ ...form, skills }).eq("id", profile.id); if (onUpdate) onUpdate({ ...profile, ...form, skills }); setEditing(false); } catch { setEditing(false); }
    setSaving(false);
  };

  const statusMap = { pending: { l: "Ko'rib chiqilmoqda", c: "#f59e0b" }, accepted: { l: "Qabul qilindi", c: C.green }, rejected: { l: "Rad etildi", c: C.red } };

  return (
    <div style={{ padding: "18px 0" }}>
      <div style={{ background: `linear-gradient(135deg,${C.primary},#16213e)`, borderRadius: 18, padding: 20, marginBottom: 14, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, background: C.accent, borderRadius: "50%", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
        <h3 style={{ color: "#fff", margin: "0 0 3px", fontSize: 17, fontWeight: 800 }}>{profile?.full_name || "Ism kiritilmagan"}</h3>
        <p style={{ color: "#ffffff60", margin: "0 0 12px", fontSize: 12 }}>{profile?.university || "Universitet"}</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[{ v: apps.length, l: "Ariza" }, { v: apps.filter(a => a.status === "accepted").length, l: "Qabul" }, { v: skills.length, l: "Ko'nikma" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ color: C.accent, fontWeight: 800, fontSize: 16 }}>{s.v}</div>
              <div style={{ color: "#ffffff50", fontSize: 10 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <Card style={{ marginBottom: 12 }}>
        <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>Ko'nikmalarim</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {skills.map(s => <span key={s} onClick={() => setSkills(skills.filter(sk => sk !== s))} style={{ background: C.primary + "10", color: C.primary, padding: "4px 11px", borderRadius: 18, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{s} ×</span>)}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Ko'nikma qo'shing..." onKeyDown={e => { if (e.key === "Enter" && newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(""); } }}
            style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 9, padding: "7px 11px", fontSize: 12, outline: "none", fontFamily: "inherit" }} />
          <Btn small onClick={() => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(""); } }}>+</Btn>
        </div>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>Arizalarim ({apps.length})</h4>
        {apps.length === 0 ? <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "12px 0" }}>Hali ariza yo'q</div>
          : apps.map(app => {
            const st = statusMap[app.status] || statusMap.pending;
            return (
              <div key={app.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 34, height: 34, background: C.light, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{app.internships?.company_logo || "🏢"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{app.internships?.role}</div>
                  <div style={{ color: C.muted, fontSize: 11 }}>{app.internships?.company_name}</div>
                </div>
                <span style={{ background: st.c + "20", color: st.c, fontSize: 10, padding: "3px 9px", borderRadius: 18, fontWeight: 600 }}>{st.l}</span>
              </div>
            );
          })}
      </Card>

      <Btn full onClick={() => setEditing(!editing)} color={editing ? C.muted : C.primary}>{editing ? "Bekor" : "Profileni tahrirlash"}</Btn>
      {editing && (
        <Card style={{ marginTop: 10, border: `2px solid ${C.accent}` }}>
          <Input label="Ism Familiya" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Universitet" value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} />
          <Input label="Telefon" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 ..." />
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>O'zim haqimda</label>
            <textarea value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} rows={3} style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 11px", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <Btn full onClick={save} color={C.green} disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</Btn>
        </Card>
      )}
    </div>
  );
}

function ResumeBuilder({ profile }) {
  const [tab, setTab] = useState("preview");
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (profile?.id) {
          const { data } = await supabase.from("experiences").select("*").eq("student_id", profile.id);
          setExps(data?.length ? data : MOCK_EXPERIENCES);
        } else { setExps(MOCK_EXPERIENCES); }
      } catch { setExps(MOCK_EXPERIENCES); }
      setLoading(false);
    })();
  }, [profile]);

  const allSkills = [...new Set(exps.flatMap(e => e.skills || []))];
  const score = Math.min(100, (profile?.about ? 20 : 0) + (profile?.phone ? 10 : 0) + exps.length * 25 + allSkills.length * 5);

  return (
    <div style={{ padding: "18px 0" }}>
      <div style={{ background: `linear-gradient(135deg,${C.primary},#16213e)`, borderRadius: 18, padding: "20px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ color: C.accent, fontSize: 10, fontWeight: 700, marginBottom: 3 }}>AVTOMATIK CV</div>
            <h3 style={{ color: "#fff", margin: 0, fontSize: 16, fontWeight: 800 }}>Resume Builder</h3>
          </div>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `conic-gradient(${C.accent} ${score * 3.6}deg, #ffffff20 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.accent, fontSize: 11, fontWeight: 800 }}>{score}%</span>
            </div>
          </div>
        </div>
        <div style={{ background: "#ffffff20", borderRadius: 5, height: 4, overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: C.accent, borderRadius: 5, transition: "width 0.5s" }} />
        </div>
      </div>

      <div style={{ display: "flex", background: "#fff", borderRadius: 11, padding: 3, marginBottom: 16, border: `1px solid ${C.border}` }}>
        {[["preview", "Ko'rinish"], ["experience", "Tajriba"], ["recs", "Tavsiyalar"]].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: tab === id ? C.primary : "transparent", color: tab === id ? "#fff" : C.muted, border: "none", borderRadius: 9, padding: "8px 4px", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>{l}</button>
        ))}
      </div>

      {loading && <Spinner />}

      {!loading && tab === "preview" && (
        <Card>
          <div style={{ background: C.primary, margin: "-18px -18px 14px", padding: "16px 18px", display: "flex", gap: 11, alignItems: "center" }}>
            <div style={{ width: 46, height: 46, background: C.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{profile?.full_name || "Ismingiz"}</div>
              <div style={{ color: C.accent, fontSize: 11 }}>{profile?.university || "Universitetingiz"}</div>
            </div>
          </div>
          {profile?.about && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>{profile.about}</p>}
          {allSkills.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 7, color: C.primary }}>KO'NIKMALAR</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{allSkills.map(s => <Badge key={s} text={s} color={C.primary} />)}</div>
            </div>
          )}
          {exps.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 9, color: C.primary }}>AMALIYOT TAJRIBASI</div>
              {exps.map(exp => (
                <div key={exp.id} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role}</div>
                      <div style={{ color: C.muted, fontSize: 11 }}>{exp.company_name} • {exp.duration}</div>
                    </div>
                    <div style={{ fontSize: 10, color: C.muted }}>{exp.period}</div>
                  </div>
                  {exp.tasks?.length > 0 && (
                    <ul style={{ margin: "4px 0 0 13px", padding: 0 }}>
                      {exp.tasks.map((t, i) => <li key={i} style={{ fontSize: 12, color: C.muted, marginBottom: 1 }}>{t}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {!loading && tab === "experience" && (
        <div>
          <div style={{ background: C.accent + "15", border: `1px solid ${C.accent}40`, borderRadius: 11, padding: "10px 13px", marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 13 }}><strong>Avtomatik</strong> — har amaliyot tugagach qo'shiladi</div>
          </div>
          {exps.map(exp => (
            <Card key={exp.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 9, marginBottom: 9 }}>
                <div style={{ width: 38, height: 38, background: C.light, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{exp.company_logo || "🏢"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.role}</div>
                  <div style={{ color: C.muted, fontSize: 11 }}>{exp.company_name} • {exp.period}</div>
                </div>
                <span style={{ background: C.green + "20", color: C.green, fontSize: 10, padding: "3px 8px", borderRadius: 18, fontWeight: 700, height: "fit-content" }}>Bajarildi</span>
              </div>
              {exp.tasks?.map((t, i) => <div key={i} style={{ display: "flex", gap: 5, marginBottom: 3 }}><span style={{ color: C.accent, fontSize: 11 }}>→</span><span style={{ fontSize: 12, color: C.muted }}>{t}</span></div>)}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>{(exp.skills || []).map(s => <Badge key={s} text={s} color={C.primary} />)}</div>
            </Card>
          ))}
        </div>
      )}

      {!loading && tab === "recs" && (
        <div>
          {exps.filter(e => e.recommendation).map(exp => (
            <Card key={exp.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 20 }}>{exp.company_logo || "🏢"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{exp.company_name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{exp.role}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= (exp.stars||5) ? C.accent : "#e5e7eb", fontSize: 13 }}>★</span>)}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{exp.rating}/5.0</div>
                </div>
              </div>
              <div style={{ background: C.light, borderRadius: 9, padding: "10px 12px", marginBottom: 7, borderLeft: `3px solid ${C.accent}` }}>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>"{exp.recommendation}"</p>
              </div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>— {exp.reviewer_name}</div>
            </Card>
          ))}
          {exps.filter(e => e.recommendation).length === 0 && (
            <div style={{ textAlign: "center", padding: "28px 16px", color: C.muted }}>
              <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 14 }}>Tavsiyalar bu yerda ko'rinadi</div>
              <div style={{ fontSize: 12 }}>Amaliyot tugagach tadbirkor tavsiya beradi</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CompanyDashboard({ profile }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ role: "", description: "", skills: "", duration: "", type: "Ofis" });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (profile?.id) (async () => {
      setLoading(true);
      try { const { data } = await supabase.from("internships").select("*").eq("company_id", profile.id); setItems(data || []); } catch { }
      setLoading(false);
    })();
    else setLoading(false);
  }, [profile]);

  const post = async () => {
    if (!form.role || !profile?.id) return;
    setPosting(true);
    try {
      await supabase.from("internships").insert({ company_id: profile.id, company_name: profile.company_name || profile.full_name, company_logo: "🏢", role: form.role, description: form.description, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean), duration: form.duration, type: form.type, is_active: true });
      setForm({ role: "", description: "", skills: "", duration: "", type: "Ofis" }); setShowForm(false);
      const { data } = await supabase.from("internships").select("*").eq("company_id", profile.id); setItems(data || []);
    } catch { }
    setPosting(false);
  };

  const f = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div style={{ padding: "18px 0" }}>
      <div style={{ background: `linear-gradient(135deg,${C.accent2},${C.accent})`, borderRadius: 18, padding: "22px 18px", marginBottom: 18 }}>
        <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>Tadbirkor Panel</h2>
        <p style={{ color: "#ffffff80", margin: 0, fontSize: 12 }}>{profile?.company_name || profile?.full_name || "Kompaniyangiz"}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
        {[{ l: "E'lon", v: items.length, i: "📋" }, { l: "Ariza", v: "—", i: "👥" }, { l: "Qabul", v: "—", i: "✅" }].map(s => (
          <Card key={s.l} style={{ textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{s.i}</div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{s.l}</div>
          </Card>
        ))}
      </div>

      <Btn full onClick={() => setShowForm(!showForm)} color={showForm ? C.muted : C.primary}>
        {showForm ? "Yopish" : "+ Intership e'lon qilish"}
      </Btn>

      {showForm && (
        <Card style={{ marginTop: 10, border: `2px solid ${C.accent}` }}>
          <h4 style={{ margin: "0 0 12px", fontWeight: 700 }}>Yangi intership</h4>
          <Input label="Lavozim" {...f("role")} placeholder="HR Assistant Intern" />
          <Input label="Tavsif" {...f("description")} placeholder="Qisqacha tavsif..." />
          <Input label="Ko'nikmalar (vergul bilan)" {...f("skills")} placeholder="HR, Excel, Communication" />
          <Input label="Davomiyligi" {...f("duration")} placeholder="2 oy" />
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Ish turi</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 11px", fontSize: 13, outline: "none", fontFamily: "inherit" }}>
              {["Ofis", "Remote", "Gibrid"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <Btn full onClick={post} color={C.accent} textColor={C.primary} disabled={posting || !profile?.id}>
            {posting ? "Joylashtirilmoqda..." : "E'lonni joylashtirish"}
          </Btn>
        </Card>
      )}

      {loading ? <Spinner /> : (
        <div style={{ marginTop: 14 }}>
          {items.length > 0 && <h4 style={{ margin: "0 0 10px", fontWeight: 700 }}>Mening e'lonlarim ({items.length})</h4>}
          {items.map(item => <InternshipCard key={item.id} item={item} />)}
          {items.length === 0 && !showForm && (
            <div style={{ textAlign: "center", padding: "28px 14px", color: C.muted, border: `1px dashed ${C.border}`, borderRadius: 13, marginTop: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 3 }}>Hali e'lon yo'q</div>
              <div style={{ fontSize: 12 }}>Birinchi internshipingizni e'lon qiling</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BottomNav({ page, setPage, role }) {
  const studentTabs = [{ id: "home", i: "🏠", l: "Bosh" }, { id: "resume", i: "📄", l: "Resume" }, { id: "profile", i: "👤", l: "Profil" }];
  const companyTabs = [{ id: "dashboard", i: "📊", l: "Panel" }];
  const tabs = role === "company" ? companyTabs : studentTabs;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "7px 0 13px", zIndex: 100 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setPage(t.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 20px", fontFamily: "inherit" }}>
          <span style={{ fontSize: 19 }}>{t.i}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: page === t.id ? C.primary : C.muted }}>{t.l}</span>
          {page === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent }} />}
        </button>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("home");
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user.id); setShowAuth(false); }
      else { setUser(null); setProfile(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (uid) => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
      if (data) { setProfile(data); setPage(data.role === "company" ? "dashboard" : "home"); }
    } catch { }
  };

  const logout = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); setPage("home"); };

  if (authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
      <Spinner />
    </div>
  );

  // Landing page — foydalanuvchi login qilmagan
  if (!user && !showAuth) {
    return (
      <LandingPage
        onLogin={() => { setAuthMode("login"); setShowAuth(true); }}
        onRegister={() => { setAuthMode("register"); setShowAuth(true); }}
      />
    );
  }

  if (showAuth) return (
    <AuthScreen
      initialMode={authMode}
      onAuth={(u) => { setUser(u); loadProfile(u.id); setShowAuth(false); }}
    />
  );

  const role = profile?.role || "student";

  const renderPage = () => {
    if (role === "company") return <CompanyDashboard profile={profile} />;
    if (page === "home") return <StudentHome userId={user?.id} />;
    if (page === "resume") return <ResumeBuilder profile={profile} />;
    if (page === "profile") return <StudentProfile profile={profile} onUpdate={setProfile} />;
    return <StudentHome userId={user?.id} />;
  };

  return (
    <AuthContext.Provider value={{ user, profile }}>
      <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.light, minHeight: "100vh", color: C.primary }}>
        <Navbar profile={profile} onLogout={logout} />
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 14px 88px" }}>
          {renderPage()}
        </div>
        <BottomNav page={page} setPage={setPage} role={role} />
      </div>
    </AuthContext.Provider>
  );
}

