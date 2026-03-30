import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "./supabaseClient";

const C = {
  primary: "#0F172A", accent: "#2D5BE3", gold: "#F59E0B",
  green: "#10B981", red: "#EF4444", muted: "#6B7280",
  light: "#F8FAFC", border: "#E2E8F0", card: "#FFFFFF",
};

const ADMIN_EMAIL = "shahriyorsobirovpm2026@gmail.com";
const AuthContext = createContext(null);

const MOCK_INTERNSHIPS = [
  { id:1, company_name:"Tasweer Academy", company_logo:"📸", role:"Marketing Intern", skills:["SMM","Content","Canva"], duration:"3 oy", type:"Gibrid", description:"Ijtimoiy tarmoqlar uchun kontent tayyorlash.", is_active:true },
  { id:2, company_name:"NatijaHub", company_logo:"🏫", role:"HR Assistant Intern", skills:["HR","Recruitment","Excel"], duration:"2 oy", type:"Ofis", description:"Kadrlar bo'limida recruitment va onboarding.", is_active:true },
  { id:3, company_name:"TechUz Startup", company_logo:"💻", role:"Business Analyst Intern", skills:["Excel","Analytics","Reporting"], duration:"2 oy", type:"Remote", description:"Biznes jarayonlarni tahlil qilish.", is_active:true },
];

// ─── UI ───────────────────────────────────────────────────────────────────────
function Badge({ text, color=C.accent }) {
  return <span style={{ background:color+"18", color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>{text}</span>;
}

function Btn({ children, onClick, color=C.primary, textColor="#fff", full, small, disabled, outline, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:outline?"transparent":disabled?"#CBD5E1":color,
      color:outline?color:disabled?"#94A3B8":textColor,
      border:outline?`1.5px solid ${color}`:"none",
      borderRadius:10, padding:small?"6px 12px":"11px 20px",
      fontSize:small?12:13, fontWeight:600,
      cursor:disabled?"not-allowed":"pointer",
      width:full?"100%":"auto", transition:"all 0.15s",
      fontFamily:"inherit", ...style,
    }}>{children}</button>
  );
}

function Input({ label, value, onChange, placeholder, type="text", rows }) {
  const base = { width:"100%", border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 13px", fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit", background:"#fff" };
  return (
    <div style={{ marginBottom:12 }}>
      {label && <label style={{ fontSize:12, fontWeight:600, display:"block", marginBottom:4, color:C.primary }}>{label}</label>}
      {rows
        ? <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder} style={{ ...base, resize:"vertical" }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={base} />}
    </div>
  );
}

function Card({ children, style={}, onClick, onMouseEnter, onMouseLeave }) {
  return <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ background:C.card, borderRadius:14, padding:16, border:`1px solid ${C.border}`, ...style }}>{children}</div>;
}

function Spinner() {
  return (
    <div style={{ display:"flex", justifyContent:"center", padding:40 }}>
      <div style={{ width:28, height:28, borderRadius:"50%", border:`3px solid ${C.border}`, borderTopColor:C.accent, animation:"spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { pending:{l:"Kutilmoqda",c:C.gold}, accepted:{l:"Qabul qilindi",c:C.green}, rejected:{l:"Rad etildi",c:C.red} };
  const s = m[status] || m.pending;
  return <span style={{ background:s.c+"18", color:s.c, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>{s.l}</span>;
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom:16 }}>
      <h3 style={{ margin:"0 0 3px", fontSize:17, fontWeight:700, color:C.primary }}>{title}</h3>
      {sub && <p style={{ margin:0, fontSize:12, color:C.muted }}>{sub}</p>}
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function LandingPage({ onLogin, onRegister }) {
  const acc="#2D5BE3", accL="#EEF2FD", accT="#1A3FB5";
  const grn="#1A7A4A", grnL="#EBF5F0";
  const amb="#8A5E1A", ambL="#FBF4E8";
  const tx="#0F0E0C", tx2="#4A4845", tx3="#7A7875";
  const br="#E5E2DC", br2="#D4D0C8";

  const features = [
    {n:"01",t:"Mos amaliyot topish",d:"Ko'nikma va soha bo'yicha filtrlash.",from:"Platforma",fC:accL,fT:accT,to:"Talaba oladi",tC:grnL,tT:grn},
    {n:"02",t:"CV builder",d:"Har amaliyotdan keyin CV o'zi yangilanadi.",from:"Platforma",fC:accL,fT:accT,to:"Talaba oladi",tC:grnL,tT:grn},
    {n:"03",t:"Rasmiy tavsiya xati",d:"Tadbirkor talabani baholab raqamli tavsiya yozadi.",from:"Tadbirkor beradi",fC:ambL,fT:amb,to:"Talaba oladi",tC:grnL,tT:grn},
    {n:"04",t:"Sertifikat tizimi",d:"Amaliyot tugagach QR kodli sertifikat.",from:"Platforma",fC:accL,fT:accT,to:"Talaba oladi",tC:grnL,tT:grn},
    {n:"05",t:"Tadbirkor uchun filtr",d:"Mos kandidatlarni filtrlab yetkazamiz.",from:"Platforma",fC:accL,fT:accT,to:"Tadbirkor oladi",tC:ambL,tT:amb},
    {n:"06",t:"Biznes marketplace",d:"Mahsulotingizni talabalar auditoriyasiga taqdim eting.",tag:"Tez kunda"},
  ];

  const problems = [
    {n:"01",t:"Nazariya amaliyotga aylanmaydi",d:"4 yil o'qiydi, biror tashkilotda ishlamaydi."},
    {n:"02",t:"Mavjud platformalar mos emas",d:"LinkedIn, HeadHunter, OLX — tajriba talab qiladi."},
    {n:"03",t:"Portfolio va CV bo'sh",d:"Vakansiyaga murojaat qilganda ko'rsatadigan narsa yo'q."},
    {n:"04",t:"Tadbirkor ham qiynaladi",d:"Yosh kadr topish uchun HR xarajati va vaqt ketadi."},
  ];

  const steps = [
    {n:"01",t:"Ro'yxatdan o'tish",d:"Ko'nikmalar va sohani kiriting",a:"Talaba",aC:accL,aT:accT},
    {n:"02",t:"Mos amaliyot topish",d:"Platforma mos internshiplarni taklif etadi",a:"Platforma",aC:accL,aT:accT},
    {n:"03",t:"Amaliyot o'tish",d:"Real muhitda tajriba yig'ish — 1–3 oy",a:"Tadbirkor",aC:ambL,aT:amb},
    {n:"04",t:"Tadbirkor tavsiya beradi",d:"Rahbar platformada baholaydi va imzolaydi",a:"Tadbirkor beradi",aC:ambL,aT:amb},
    {n:"05",t:"Vakansiyaga murojaat",d:"CV + sertifikat + tavsiya — hammasi tayyor",a:"Talaba oladi",aC:grnL,aT:grn},
  ];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#fff", color:tx, overflowX:"hidden" }}>
      <style>{`.lf:hover{background:#F2F0EC!important}.lc:hover{border-color:${br2}!important}`}</style>

      <nav style={{ position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(8px)",borderBottom:`1px solid ${br}`,padding:"0 6%",display:"flex",alignItems:"center",justifyContent:"space-between",height:60 }}>
        <div style={{ fontFamily:"Georgia,serif",fontWeight:700,fontSize:20,color:tx }}>Natija<span style={{ color:acc }}>Hub</span></div>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onLogin} style={{ background:"transparent",color:tx2,border:`1px solid ${br2}`,padding:"8px 18px",borderRadius:7,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>Kirish</button>
          <button onClick={onRegister} style={{ background:tx,color:"#fff",border:"none",padding:"8px 18px",borderRadius:7,fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>Boshlash</button>
        </div>
      </nav>

      <div style={{ padding:"96px 6% 80px",maxWidth:700,margin:"0 auto",textAlign:"center" }}>
        <h1 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(32px,4.5vw,52px)",fontWeight:700,lineHeight:1.15,marginBottom:36,letterSpacing:"-0.5px",color:tx }}>
          NatijaHub talabaning vakansiyagacha bo'lgan <em style={{ fontStyle:"normal",color:acc }}>yo'lini quradi.</em>
        </h1>
        <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:48 }}>
          <button onClick={onRegister} style={{ background:tx,color:"#fff",padding:"13px 26px",borderRadius:8,fontWeight:500,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit" }}>Boshlash</button>
          <button onClick={onLogin} style={{ background:"transparent",color:tx2,padding:"13px 26px",borderRadius:8,fontWeight:500,fontSize:14,border:`1px solid ${br2}`,cursor:"pointer",fontFamily:"inherit" }}>Tadbirkor sifatida kirish</button>
        </div>
        <div style={{ display:"flex",border:`1px solid ${br}`,borderRadius:12,overflow:"hidden" }}>
          {[["100%","Talabalar auditoriyasi"],["2+","Rasmiy hamkorlar"],["Bepul","Talaba uchun"]].map(([n,l],i,a)=>(
            <div key={l} style={{ flex:1,padding:20,textAlign:"center",borderRight:i<a.length-1?`1px solid ${br}`:"none" }}>
              <div style={{ fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:tx }}>{n}</div>
              <div style={{ fontSize:11,color:tx3,marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border:"none",borderTop:`1px solid ${br}`,margin:"0 6%" }} />

      <div style={{ padding:"64px 6%",maxWidth:1160,margin:"0 auto" }}>
        <div style={{ fontSize:11,fontWeight:700,color:tx3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12 }}>Muammo</div>
        <h2 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(24px,2.8vw,36px)",fontWeight:700,color:tx,marginBottom:40 }}>Nima uchun talaba ish topa olmaydi?</h2>
        <div style={{ background:"#F7F6F3",border:`1px solid ${br2}`,borderRadius:12,padding:"28px 32px",textAlign:"center",marginBottom:16 }}>
          <div style={{ fontFamily:"Georgia,serif",fontSize:18,fontWeight:600,color:tx }}>Tajriba olish uchun — ish kerak &nbsp;/&nbsp; Ish topish uchun — tajriba kerak</div>
          <div style={{ fontSize:13,color:tx3,marginTop:8,fontStyle:"italic" }}>"Tajribang bormi?" — talabaning eng ko'p eshitgan so'zi</div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {problems.map(p=>(
            <div key={p.n} className="lc" style={{ background:"#FAFAF8",border:`1px solid ${br}`,borderRadius:12,padding:"22px 24px" }}>
              <div style={{ fontSize:11,fontWeight:700,color:tx3,letterSpacing:1,marginBottom:10 }}>{p.n}</div>
              <div style={{ fontWeight:600,fontSize:15,marginBottom:7,color:tx }}>{p.t}</div>
              <div style={{ fontSize:13,color:tx2,lineHeight:1.6 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border:"none",borderTop:`1px solid ${br}`,margin:"0 6%" }} />

      <div style={{ padding:"64px 6%",maxWidth:1160,margin:"0 auto" }}>
        <div style={{ fontSize:11,fontWeight:700,color:tx3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12 }}>Xizmatlar</div>
        <h2 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(24px,2.8vw,36px)",fontWeight:700,color:tx,marginBottom:40 }}>NatijaHub nima beradi?</h2>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:br,border:`1px solid ${br}`,borderRadius:14,overflow:"hidden" }}>
          {features.map(f=>(
            <div key={f.n} className="lf" style={{ background:"#FAFAF8",padding:"28px 26px" }}>
              <div style={{ fontSize:11,fontWeight:700,color:tx3,letterSpacing:1,marginBottom:14 }}>{f.n}</div>
              <div style={{ fontWeight:600,fontSize:15,marginBottom:8,color:tx }}>{f.t}</div>
              <div style={{ fontSize:13,color:tx2,lineHeight:1.6 }}>{f.d}</div>
              {f.from ? (
                <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:14 }}>
                  <span style={{ fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:4,background:f.fC,color:f.fT }}>{f.from}</span>
                  <span style={{ fontSize:11,color:tx3 }}>→</span>
                  <span style={{ fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:4,background:f.tC,color:f.tT }}>{f.to}</span>
                </div>
              ) : (
                <span style={{ display:"inline-block",fontSize:11,padding:"3px 9px",borderRadius:4,marginTop:14,fontWeight:500,background:"#F2F0EC",color:tx3 }}>{f.tag}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border:"none",borderTop:`1px solid ${br}`,margin:"0 6%" }} />

      <div style={{ padding:"64px 6%",maxWidth:1160,margin:"0 auto" }}>
        <div style={{ fontSize:11,fontWeight:700,color:tx3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12 }}>Jarayon</div>
        <h2 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(24px,2.8vw,36px)",fontWeight:700,color:tx,marginBottom:40 }}>Qanday ishlaydi?</h2>
        <div style={{ border:`1px solid ${br}`,borderRadius:14,overflow:"hidden" }}>
          {steps.map((st,i)=>(
            <div key={st.n} className="lf" style={{ display:"grid",gridTemplateColumns:"60px 1fr auto",alignItems:"center",gap:20,padding:"20px 28px",background:"#FAFAF8",borderBottom:i<steps.length-1?`1px solid ${br}`:"none" }}>
              <div style={{ fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:tx3 }}>{st.n}</div>
              <div>
                <div style={{ fontWeight:600,fontSize:15,color:tx }}>{st.t}</div>
                <div style={{ fontSize:13,color:tx2,marginTop:3 }}>{st.d}</div>
              </div>
              <span style={{ fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:4,whiteSpace:"nowrap",background:st.aC,color:st.aT }}>{st.a}</span>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border:"none",borderTop:`1px solid ${br}`,margin:"0 6%" }} />

      <div style={{ padding:"64px 6%",maxWidth:1160,margin:"0 auto" }}>
        <div style={{ fontSize:11,fontWeight:700,color:tx3,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12 }}>Hamkorlar</div>
        <h2 style={{ fontFamily:"Georgia,serif",fontSize:"clamp(24px,2.8vw,36px)",fontWeight:700,color:tx,marginBottom:36 }}>Kimlar bilan ishlaymiz?</h2>
        <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
          {[
            {n:"Millat Umidi University",t:"Ta'lim hamkori",b:"Rasmiy hamkor",bC:accL,bT:accT},
            {n:"Tasweer Academy",t:"Biznes hamkori",b:"Birinchi hamkor",bC:grnL,bT:grn},
            {n:"Sizning kompaniyangiz",t:"Keyingi hamkor",b:"Bog'laning",bC:"#F2F0EC",bT:tx3,d:true},
          ].map(p=>(
            <div key={p.n} className="lc" style={{ background:"#FAFAF8",border:`1px solid ${br}`,borderStyle:p.d?"dashed":"solid",borderRadius:10,padding:"14px 20px",opacity:p.d?0.5:1 }}>
              <div style={{ fontWeight:600,fontSize:14,color:tx }}>{p.n}</div>
              <div style={{ fontSize:12,color:tx3,marginTop:3 }}>{p.t}</div>
              <span style={{ display:"inline-block",fontSize:10,padding:"2px 8px",borderRadius:3,marginTop:8,fontWeight:600,background:p.bC,color:p.bT }}>{p.b}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"64px 6%",maxWidth:1160,margin:"0 auto" }}>
        <div style={{ background:tx,borderRadius:16,padding:"52px 48px",display:"grid",gridTemplateColumns:"1fr auto",gap:40,alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#fff",marginBottom:10 }}>Birinchilar qatorida bo'ling</div>
            <div style={{ fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.7 }}>Talabamisiz yoki tadbirkormi — platformaga qo'shiling.</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:8,minWidth:180 }}>
            <button onClick={onRegister} style={{ background:"#fff",color:tx,padding:"12px 22px",borderRadius:8,fontWeight:500,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit" }}>Talaba sifatida kirish</button>
            <button onClick={onLogin} style={{ background:"transparent",color:"rgba(255,255,255,0.55)",padding:"12px 22px",borderRadius:8,fontWeight:500,fontSize:14,border:"1px solid rgba(255,255,255,0.18)",cursor:"pointer",fontFamily:"inherit" }}>Tadbirkor sifatida kirish</button>
          </div>
        </div>
      </div>

      <footer style={{ borderTop:`1px solid ${br}`,padding:"28px 6%",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
        <div style={{ fontFamily:"Georgia,serif",fontWeight:700,fontSize:15,color:tx }}>Natija<span style={{ color:acc }}>Hub</span></div>
        <div style={{ fontSize:12,color:tx3 }}>2026 · O'zbekiston · @natijahubuz</div>
      </footer>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
useEffect(() => {
  const hash = window.location.hash;
  
  // access_token ni hash dan olish
  const match = hash.match(/access_token=([^&]+)/);
  const refreshMatch = hash.match(/refresh_token=([^&]+)/);
  
  if (match && refreshMatch) {
    const accessToken = match[1];
    const refreshToken = refreshMatch[1];
    
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).then(({ error }) => {
      if (error) {
        setError("Havola muddati o'tgan. Qayta urinib ko'ring.");
      } else {
        setSessionReady(true);
      }
    });
  } else if (hash.includes("type=recovery")) {
    // Session allaqachon bor
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      } else {
        setError("Havola muddati o'tgan. Qayta urinib ko'ring.");
      }
    });
  } else {
    setError("Havola noto'g'ri. Qayta urinib ko'ring.");
  }
}, []);
function AuthScreen({ onAuth, initialMode="login", onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email:"", password:"", full_name:"", university:"", company_name:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const f = k => ({ value:form[k], onChange:e=>setForm({...form,[k]:e.target.value}) });

  const submit = async () => {
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email:form.email, password:form.password,
          options:{ data:{ full_name:form.full_name, role, university:form.university, company_name:form.company_name } }
        });
        if (error) throw error;
        if (data.user) onAuth(data.user);
      }
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const sendReset = async () => {
    if (!resetEmail) { setError("Emailni kiriting"); return; }
    setLoading(true); setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
         redirectTo: `https://natija-hub2.vercel.app/`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  // Parol tiklash sahifasi
  if (showReset) {
    return (
      <div style={{ minHeight:"100vh",background:C.light,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20 }}>
        <div style={{ textAlign:"center",marginBottom:24 }}>
          <div style={{ fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:C.primary }}>Natija<span style={{ color:C.accent }}>Hub</span></div>
          <div style={{ color:C.muted,fontSize:13,marginTop:4 }}>Parolni tiklash</div>
        </div>
        <Card style={{ width:"100%",maxWidth:400,padding:24 }}>
          {resetSent ? (
            <div style={{ textAlign:"center",padding:"16px 0" }}>
              <div style={{ fontSize:40,marginBottom:12 }}>📧</div>
              <div style={{ fontWeight:700,fontSize:16,color:C.primary,marginBottom:8 }}>Email yuborildi!</div>
              <div style={{ fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:20 }}>
                <strong>{resetEmail}</strong> manziliga parol tiklash havolasi yuborildi. Emailingizni tekshiring.
              </div>
              <Btn full onClick={()=>{ setShowReset(false); setResetSent(false); setResetEmail(""); }} color={C.primary}>
                Kirishga qaytish
              </Btn>
            </div>
          ) : (
            <>
              <div style={{ fontWeight:700,fontSize:16,color:C.primary,marginBottom:6 }}>Parolni tiklash</div>
              <div style={{ fontSize:13,color:C.muted,marginBottom:16,lineHeight:1.5 }}>
                Emailingizni kiriting — parol tiklash havolasini yuboramiz.
              </div>
              <Input
                label="Email"
                type="email"
                value={resetEmail}
                onChange={e=>setResetEmail(e.target.value)}
                placeholder="email@gmail.com"
              />
              {error && <div style={{ background:C.red+"15",color:C.red,padding:"9px 12px",borderRadius:9,fontSize:12,marginBottom:12 }}>{error}</div>}
              <Btn full onClick={sendReset} disabled={loading} color={C.accent}>
                {loading ? "Yuborilmoqda..." : "Havola yuborish"}
              </Btn>
              <button onClick={()=>{ setShowReset(false); setError(""); }} style={{ width:"100%",background:"transparent",border:"none",color:C.muted,fontSize:12,marginTop:12,cursor:"pointer",fontFamily:"inherit" }}>
                ← Orqaga
              </button>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh",background:C.light,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ textAlign:"center",marginBottom:24 }}>
        <div style={{ fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:C.primary }}>Natija<span style={{ color:C.accent }}>Hub</span></div>
        <div style={{ color:C.muted,fontSize:13,marginTop:4 }}>Talabalarning vakansiyagacha bo'lgan yo'lini quradi</div>
      </div>
      <Card style={{ width:"100%",maxWidth:400,padding:24 }}>
        <div style={{ display:"flex",background:C.light,borderRadius:10,padding:3,marginBottom:20 }}>
          {[["login","Kirish"],["register","Ro'yxat"]].map(([m,l])=>(
            <button key={m} onClick={()=>{ setMode(m); setError(""); }} style={{ flex:1,background:mode===m?C.primary:"transparent",color:mode===m?"#fff":C.muted,border:"none",borderRadius:8,padding:"8px 0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>{l}</button>
          ))}
        </div>
        {mode === "register" && (
          <>
            <div style={{ display:"flex",gap:8,marginBottom:14 }}>
              {[["student","Talaba"],["company","Tadbirkor"]].map(([r,l])=>(
                <button key={r} onClick={()=>setRole(r)} style={{ flex:1,background:role===r?C.primary:"transparent",color:role===r?"#fff":C.muted,border:`1.5px solid ${role===r?C.primary:C.border}`,borderRadius:9,padding:"9px 0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit" }}>{l}</button>
              ))}
            </div>
            <Input label="Ism Familiya" {...f("full_name")} placeholder="Ism Familiya" />
            {role==="student" && <Input label="Universitet" {...f("university")} placeholder="TDIU, WIUT..." />}
            {role==="company" && <Input label="Kompaniya nomi" {...f("company_name")} placeholder="Kompaniya nomi" />}
          </>
        )}
        <Input label="Email" type="email" {...f("email")} placeholder="email@gmail.com" />
        <Input label="Parol" type="password" {...f("password")} placeholder="Kamida 6 belgi" />
        {error && <div style={{ background:C.red+"15",color:C.red,padding:"9px 12px",borderRadius:9,fontSize:12,marginBottom:12 }}>{error}</div>}
        <Btn full onClick={submit} disabled={loading}>{loading?"Kuting...":mode==="login"?"Kirish":"Ro'yxatdan o'tish"}</Btn>

        {/* Parolni unutdim */}
        {mode === "login" && (
          <button onClick={()=>{ setShowReset(true); setResetEmail(form.email); setError(""); }} style={{ width:"100%",background:"transparent",border:"none",color:C.accent,fontSize:12,marginTop:12,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline" }}>
            Parolni unutdim?
          </button>
        )}

        {onBack && <button onClick={onBack} style={{ width:"100%",background:"transparent",border:"none",color:C.muted,fontSize:12,marginTop:8,cursor:"pointer",fontFamily:"inherit" }}>← Orqaga</button>}
      </Card>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ profile, onLogout }) {
  const isAdmin = profile?.email === ADMIN_EMAIL;
  return (
    <nav style={{ background:C.primary,padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:200 }}>
      <div style={{ fontFamily:"Georgia,serif",fontWeight:700,fontSize:17,color:"#fff" }}>
        Natija<span style={{ color:C.accent }}>Hub</span>
        {isAdmin && <span style={{ fontSize:9,background:C.gold+"30",color:C.gold,padding:"2px 6px",borderRadius:6,marginLeft:6,fontWeight:700 }}>ADMIN</span>}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"#fff",fontSize:12,fontWeight:600 }}>{profile?.full_name?.split(" ")[0]||"User"}</div>
          <div style={{ color:C.accent,fontSize:10 }}>{isAdmin?"Admin":profile?.role==="company"?"Tadbirkor":"Talaba"}</div>
        </div>
        <button onClick={onLogout} style={{ background:"#ffffff15",color:"#ffffff70",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>Chiqish</button>
      </div>
    </nav>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ page, setPage, role, isAdmin }) {
  const tabs = isAdmin
    ? [{id:"admin_users",l:"Foydalanuvchilar"},{id:"admin_internships",l:"Amaliyotlar"},{id:"admin_applications",l:"Arizalar"}]
    : role === "company"
      ? [{id:"company_home",l:"Panel"},{id:"company_internships",l:"E'lonlar"},{id:"company_applications",l:"Arizalar"}]
      : [{id:"home",l:"Amaliyotlar"},{id:"my_applications",l:"Arizalarim"},{id:"profile",l:"Profil"},{id:"resume",l:"CV"}];

  return (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:200,paddingBottom:10 }}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setPage(t.id)} style={{ flex:1,background:"none",border:"none",cursor:"pointer",padding:"10px 4px 4px",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
          <span style={{ fontSize:9,fontWeight:700,color:page===t.id?C.accent:C.muted,textTransform:"uppercase",letterSpacing:"0.5px",textAlign:"center",lineHeight:1.3 }}>{t.l}</span>
          {page===t.id && <div style={{ width:16,height:2.5,borderRadius:2,background:C.accent }} />}
        </button>
      ))}
    </div>
  );
}

// ─── INTERNSHIP CARD ──────────────────────────────────────────────────────────
function InternshipCard({ item, userId }) {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const apply = async () => {
    if (!userId) { alert("Ariza berish uchun avval tizimga kiring!"); return; }
    setLoading(true);
    try { await supabase.from("applications").insert({ internship_id:item.id, student_id:userId, status:"pending" }); setApplied(true); }
    catch { setApplied(true); }
    setLoading(false);
  };
  return (
    <Card style={{ marginBottom:10 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <div style={{ width:40,height:40,background:C.light,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{item.company_logo||"🏢"}</div>
          <div>
            <div style={{ fontWeight:700,fontSize:14,color:C.primary }}>{item.role}</div>
            <div style={{ color:C.muted,fontSize:12 }}>{item.company_name}</div>
          </div>
        </div>
        {item.type && <Badge text={item.type} color={C.primary} />}
      </div>
      {item.description && <p style={{ fontSize:13,color:C.muted,lineHeight:1.5,margin:"0 0 10px" }}>{item.description}</p>}
      <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:12 }}>
        {(item.skills||[]).map(s=><Badge key={s} text={s} color="#6366F1" />)}
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${C.border}`,paddingTop:10 }}>
        <span style={{ fontSize:12,color:C.muted }}>⏱ {item.duration||"—"}</span>
        <Btn small onClick={apply} disabled={applied||loading} color={applied?C.green:C.primary}>
          {loading?"...":applied?"Yuborildi":"Ariza berish"}
        </Btn>
      </div>
    </Card>
  );
}

// ─── STUDENT: AMALIYOTLAR ────────────────────────────────────────────────────
function StudentHome({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Barchasi");
  const [search, setSearch] = useState("");

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const{data}=await supabase.from("internships").select("*").eq("is_active",true).order("created_at",{ascending:false}); setItems(data?.length?data:MOCK_INTERNSHIPS); }
      catch { setItems(MOCK_INTERNSHIPS); }
      setLoading(false);
    })();
  },[]);

  const filtered = items
    .filter(i=>filter==="Barchasi"||i.type===filter)
    .filter(i=>!search||i.role?.toLowerCase().includes(search.toLowerCase())||i.company_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:"16px 0" }}>
      <SectionHeader title="Amaliyotlar" sub={`${items.length} ta e'lon`} />
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Qidirish..." style={{ width:"100%",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:12,background:"#fff" }} />
      <div style={{ display:"flex",gap:6,marginBottom:14,flexWrap:"wrap" }}>
        {["Barchasi","Ofis","Remote","Gibrid"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ background:filter===f?C.primary:"#fff",color:filter===f?"#fff":C.muted,border:`1px solid ${filter===f?C.primary:C.border}`,padding:"5px 14px",borderRadius:18,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit" }}>{f}</button>
        ))}
      </div>
      {loading?<Spinner/>:filtered.length===0?<div style={{ textAlign:"center",padding:32,color:C.muted,fontSize:13 }}>Hech narsa topilmadi</div>:filtered.map(item=><InternshipCard key={item.id} item={item} userId={userId} />)}
    </div>
  );
}

// ─── STUDENT: ARIZALARIM ─────────────────────────────────────────────────────
function StudentApplications({ userId }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!userId){setLoading(false);return;}
    (async()=>{
      setLoading(true);
      try { const{data}=await supabase.from("applications").select("*, internships(role,company_name,company_logo,duration,type)").eq("student_id",userId).order("created_at",{ascending:false}); setApps(data||[]); }
      catch{}
      setLoading(false);
    })();
  },[userId]);

  return (
    <div style={{ padding:"16px 0" }}>
      <SectionHeader title="Arizalarim" sub={`${apps.length} ta ariza`} />
      {loading?<Spinner/>:apps.length===0
        ?<div style={{ textAlign:"center",padding:32,color:C.muted }}><div style={{ fontWeight:600,marginBottom:6 }}>Hali ariza yo'q</div><div style={{ fontSize:12 }}>Amaliyotlar bo'limidan ariza bering</div></div>
        :apps.map(app=>(
          <Card key={app.id} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
              <div style={{ width:40,height:40,background:C.light,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{app.internships?.company_logo||"🏢"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:14,color:C.primary }}>{app.internships?.role}</div>
                <div style={{ color:C.muted,fontSize:12 }}>{app.internships?.company_name}</div>
              </div>
              <StatusBadge status={app.status||"pending"} />
            </div>
            <div style={{ display:"flex",gap:8,borderTop:`1px solid ${C.border}`,paddingTop:10 }}>
              {app.internships?.duration&&<Badge text={`⏱ ${app.internships.duration}`} color={C.muted} />}
              {app.internships?.type&&<Badge text={app.internships.type} color={C.primary} />}
            </div>
          </Card>
        ))
      }
    </div>
  );
}

// ─── STUDENT: PROFIL ─────────────────────────────────────────────────────────
function StudentProfile({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name:profile?.full_name||"", phone:profile?.phone||"", about:profile?.about||"", university:profile?.university||"", faculty:profile?.faculty||"", year:profile?.year||"" });
  const [skills, setSkills] = useState(profile?.skills||[]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const{error}=await supabase.from("profiles").update({...form,skills}).eq("id",profile.id);
      if(!error){ if(onUpdate)onUpdate({...profile,...form,skills}); setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),2000); }
    } catch{}
    setSaving(false);
  };

  return (
    <div style={{ padding:"16px 0" }}>
      <Card style={{ marginBottom:12,textAlign:"center",padding:24 }}>
        <div style={{ width:64,height:64,background:C.accent+"20",borderRadius:"50%",margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:C.accent,fontWeight:700 }}>
          {(profile?.full_name||"U")[0]}
        </div>
        <div style={{ fontWeight:700,fontSize:17,color:C.primary,marginBottom:4 }}>{profile?.full_name||"Ism kiritilmagan"}</div>
        {profile?.university&&<div style={{ color:C.muted,fontSize:13,marginBottom:3 }}>{profile.university}</div>}
        {profile?.faculty&&<div style={{ color:C.muted,fontSize:12 }}>{profile.faculty}{profile?.year&&` · ${profile.year}-kurs`}</div>}
        {profile?.phone&&<div style={{ color:C.muted,fontSize:12,marginTop:3 }}>{profile.phone}</div>}
        {profile?.about&&<div style={{ color:C.muted,fontSize:13,lineHeight:1.5,marginTop:8,padding:"0 8px" }}>{profile.about}</div>}
      </Card>

      <Card style={{ marginBottom:12 }}>
        <h4 style={{ margin:"0 0 12px",fontWeight:700,fontSize:14,color:C.primary }}>Ko'nikmalar</h4>
        <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:10 }}>
          {skills.length===0?<span style={{ fontSize:12,color:C.muted }}>Ko'nikma qo'shing</span>
            :skills.map(s=>(
              <span key={s} onClick={()=>setSkills(skills.filter(sk=>sk!==s))} style={{ background:C.accent+"15",color:C.accent,padding:"4px 11px",borderRadius:18,fontSize:12,fontWeight:600,cursor:"pointer" }}>{s} ×</span>
            ))
          }
        </div>
        <div style={{ display:"flex",gap:7 }}>
          <input value={newSkill} onChange={e=>setNewSkill(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newSkill.trim()){setSkills([...skills,newSkill.trim()]);setNewSkill("");}}} placeholder="Ko'nikma qo'shing..." style={{ flex:1,border:`1px solid ${C.border}`,borderRadius:9,padding:"8px 11px",fontSize:12,outline:"none",fontFamily:"inherit" }} />
          <Btn small onClick={()=>{if(newSkill.trim()){setSkills([...skills,newSkill.trim()]);setNewSkill("");}}}>+</Btn>
        </div>
      </Card>

      <Btn full onClick={()=>setEditing(!editing)} color={editing?C.muted:C.primary} style={{ marginBottom:10 }}>{editing?"Bekor":"Profilni tahrirlash"}</Btn>
      {saved&&<div style={{ background:C.green+"15",color:C.green,padding:"10px 14px",borderRadius:10,fontSize:13,marginBottom:10,textAlign:"center",fontWeight:600 }}>Saqlandi!</div>}
      {editing&&(
        <Card style={{ border:`1.5px solid ${C.accent}` }}>
          <Input label="Ism Familiya" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} />
          <Input label="Universitet" value={form.university} onChange={e=>setForm({...form,university:e.target.value})} />
          <Input label="Fakultet" value={form.faculty} onChange={e=>setForm({...form,faculty:e.target.value})} placeholder="Business Administration" />
          <Input label="Kurs" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} placeholder="2" />
          <Input label="Telefon" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+998 90 000 00 00" />
          <Input label="O'zim haqimda" value={form.about} onChange={e=>setForm({...form,about:e.target.value})} rows={3} placeholder="Qisqacha ma'lumot..." />
          <Btn full onClick={save} color={C.green} disabled={saving}>{saving?"Saqlanmoqda...":"Saqlash"}</Btn>
        </Card>
      )}
    </div>
  );
}

// ─── STUDENT: CV ─────────────────────────────────────────────────────────────
function StudentCV({ profile }) {
  const [exps, setExps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("preview");

  useEffect(()=>{
    if(!profile?.id){setLoading(false);return;}
    (async()=>{
      setLoading(true);
      try { const{data}=await supabase.from("experiences").select("*").eq("student_id",profile.id); setExps(data||[]); }
      catch{}
      setLoading(false);
    })();
  },[profile]);

  const allSkills=[...(new Set([...(profile?.skills||[]),...exps.flatMap(e=>e.skills||[])]))];
  const score=Math.min(100,(profile?.full_name?15:0)+(profile?.about?15:0)+(profile?.phone?10:0)+(profile?.university?10:0)+(allSkills.length>0?10:0)+exps.length*20);

  return (
    <div style={{ padding:"16px 0" }}>
      <Card style={{ marginBottom:14 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <div>
            <div style={{ fontWeight:700,fontSize:15,color:C.primary }}>CV Kuchi</div>
            <div style={{ fontSize:12,color:C.muted }}>{score<70?"Profilni to'ldiring":"Zo'r CV!"}</div>
          </div>
          <div style={{ fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:score>=70?C.green:C.gold }}>{score}%</div>
        </div>
        <div style={{ background:C.border,borderRadius:6,height:6,overflow:"hidden" }}>
          <div style={{ width:`${score}%`,height:"100%",background:score>=70?C.green:C.gold,borderRadius:6,transition:"width 0.5s" }} />
        </div>
      </Card>

      <div style={{ display:"flex",background:"#fff",borderRadius:10,padding:3,marginBottom:14,border:`1px solid ${C.border}` }}>
        {[["preview","Ko'rinish"],["experience","Tajriba"],["recs","Tavsiyalar"]].map(([id,l])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1,background:tab===id?C.primary:"transparent",color:tab===id?"#fff":C.muted,border:"none",borderRadius:8,padding:"8px 4px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit" }}>{l}</button>
        ))}
      </div>

      {loading&&<Spinner />}

      {!loading&&tab==="preview"&&(
        <Card>
          <div style={{ background:C.primary,margin:"-16px -16px 14px",padding:16,borderRadius:"14px 14px 0 0",display:"flex",gap:12,alignItems:"center" }}>
            <div style={{ width:44,height:44,background:C.accent,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff",fontWeight:700 }}>{(profile?.full_name||"U")[0]}</div>
            <div>
              <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{profile?.full_name||"Ismingiz"}</div>
              <div style={{ color:C.accent,fontSize:11 }}>{profile?.university||"Universitetingiz"}</div>
            </div>
          </div>
          {profile?.about&&<p style={{ fontSize:13,color:C.muted,lineHeight:1.6,margin:"0 0 12px" }}>{profile.about}</p>}
          {allSkills.length>0&&(
            <div style={{ marginBottom:12 }}>
              <div style={{ fontWeight:700,fontSize:11,color:C.primary,marginBottom:8,letterSpacing:"0.5px" }}>KO'NIKMALAR</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>{allSkills.map(s=><Badge key={s} text={s} color={C.accent} />)}</div>
            </div>
          )}
          {exps.length>0&&(
            <div>
              <div style={{ fontWeight:700,fontSize:11,color:C.primary,marginBottom:8,letterSpacing:"0.5px" }}>AMALIYOT TAJRIBASI</div>
              {exps.map(exp=>(
                <div key={exp.id} style={{ marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700,fontSize:13,marginBottom:3 }}>{exp.role}</div>
                  <div style={{ color:C.muted,fontSize:12,marginBottom:6 }}>{exp.company_name} · {exp.period}</div>
                  {exp.tasks?.map((t,i)=><div key={i} style={{ fontSize:12,color:C.muted,marginBottom:2 }}>· {t}</div>)}
                </div>
              ))}
            </div>
          )}
          {exps.length===0&&allSkills.length===0&&<div style={{ textAlign:"center",padding:20,color:C.muted,fontSize:13 }}>Profilni to'ldiring va amaliyot o'ting</div>}
        </Card>
      )}
      {!loading&&tab==="experience"&&(
        <div>
          <div style={{ background:C.accent+"12",border:`1px solid ${C.accent}30`,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13 }}><strong>Avtomatik</strong> — har amaliyot tugagach qo'shiladi</div>
          {exps.length===0?<div style={{ textAlign:"center",padding:28,color:C.muted,fontSize:13 }}>Hali tajriba yo'q</div>
            :exps.map(exp=>(
              <Card key={exp.id} style={{ marginBottom:10 }}>
                <div style={{ fontWeight:700,fontSize:14,marginBottom:4,color:C.primary }}>{exp.role}</div>
                <div style={{ color:C.muted,fontSize:12,marginBottom:8 }}>{exp.company_name} · {exp.period}</div>
                {exp.tasks?.map((t,i)=><div key={i} style={{ fontSize:12,color:C.muted,marginBottom:2 }}>→ {t}</div>)}
              </Card>
            ))
          }
        </div>
      )}
      {!loading&&tab==="recs"&&(
        <div>
          {exps.filter(e=>e.recommendation).length===0
            ?<div style={{ textAlign:"center",padding:"28px 16px",color:C.muted }}><div style={{ fontWeight:600,marginBottom:6,fontSize:14 }}>Tavsiyalar bu yerda ko'rinadi</div><div style={{ fontSize:12 }}>Amaliyot tugagach tadbirkor tavsiya beradi</div></div>
            :exps.filter(e=>e.recommendation).map(exp=>(
              <Card key={exp.id} style={{ marginBottom:10 }}>
                <div style={{ fontWeight:700,fontSize:14,marginBottom:4 }}>{exp.company_name}</div>
                <div style={{ background:C.light,borderRadius:9,padding:"10px 12px",marginBottom:8,borderLeft:`3px solid ${C.gold}` }}>
                  <p style={{ margin:0,fontSize:12,lineHeight:1.6,fontStyle:"italic",color:C.primary }}>"{exp.recommendation}"</p>
                </div>
                <div style={{ fontSize:11,color:C.muted,fontWeight:600 }}>— {exp.reviewer_name}</div>
              </Card>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ─── COMPANY: PANEL ──────────────────────────────────────────────────────────
function CompanyHome({ profile }) {
  const [stats, setStats] = useState({ internships:0, applications:0, accepted:0 });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!profile?.id){setLoading(false);return;}
    (async()=>{
      setLoading(true);
      try {
        const{data:int}=await supabase.from("internships").select("id").eq("company_id",profile.id);
        const ids=(int||[]).map(i=>i.id);
        let apps=[],acc=0;
        if(ids.length){const{data}=await supabase.from("applications").select("id,status").in("internship_id",ids);apps=data||[];acc=apps.filter(a=>a.status==="accepted").length;}
        setStats({internships:int?.length||0,applications:apps.length,accepted:acc});
      }catch{}
      setLoading(false);
    })();
  },[profile]);

  return (
    <div style={{ padding:"16px 0" }}>
      <Card style={{ background:"linear-gradient(135deg,#C45C2E,#F59E0B)",border:"none",marginBottom:16,padding:22 }}>
        <div style={{ color:"#fff",fontWeight:700,fontSize:17,marginBottom:4 }}>Tadbirkor Panel</div>
        <div style={{ color:"rgba(255,255,255,0.75)",fontSize:13 }}>{profile?.company_name||profile?.full_name}</div>
      </Card>
      {loading?<Spinner/>:(
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
          {[{l:"E'lonlar",v:stats.internships,c:C.accent},{l:"Arizalar",v:stats.applications,c:C.gold},{l:"Qabul",v:stats.accepted,c:C.green}].map(s=>(
            <Card key={s.l} style={{ textAlign:"center",padding:14 }}>
              <div style={{ fontWeight:800,fontSize:22,color:s.c,marginBottom:3 }}>{s.v}</div>
              <div style={{ fontSize:11,color:C.muted }}>{s.l}</div>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <div style={{ fontWeight:600,fontSize:14,marginBottom:8,color:C.primary }}>Qo'llanma</div>
        {["E'lonlar — yangi amaliyot joylang","Arizalar — talabalarni ko'ring va qabul qiling"].map((t,i)=>(
          <div key={i} style={{ display:"flex",gap:8,alignItems:"center",padding:"8px 0",borderBottom:i===0?`1px solid ${C.border}`:"none" }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:C.accent,flexShrink:0 }} />
            <span style={{ fontSize:13,color:C.muted }}>{t}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── COMPANY: E'LONLAR ───────────────────────────────────────────────────────
function CompanyInternships({ profile }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ role:"", description:"", skills:"", duration:"", type:"Ofis" });
  const [posting, setPosting] = useState(false);

  const load = async () => {
    if(!profile?.id){setLoading(false);return;}
    setLoading(true);
    try { const{data}=await supabase.from("internships").select("*").eq("company_id",profile.id).order("created_at",{ascending:false}); setItems(data||[]); }
    catch{}
    setLoading(false);
  };

  useEffect(()=>{load();},[profile]);

  const post = async () => {
    if(!form.role||!profile?.id)return;
    setPosting(true);
    try {
      await supabase.from("internships").insert({ company_id:profile.id, company_name:profile.company_name||profile.full_name, company_logo:"🏢", role:form.role, description:form.description, skills:form.skills.split(",").map(s=>s.trim()).filter(Boolean), duration:form.duration, type:form.type, is_active:true });
      setForm({role:"",description:"",skills:"",duration:"",type:"Ofis"});
      setShowForm(false); await load();
    }catch{}
    setPosting(false);
  };

  const toggle = async (id, cur) => { await supabase.from("internships").update({is_active:!cur}).eq("id",id); await load(); };
  const f = k => ({ value:form[k], onChange:e=>setForm({...form,[k]:e.target.value}) });

  return (
    <div style={{ padding:"16px 0" }}>
      <SectionHeader title="E'lonlarim" sub={`${items.length} ta amaliyot`} />
      <Btn full onClick={()=>setShowForm(!showForm)} color={showForm?C.muted:C.accent} style={{ marginBottom:12 }}>{showForm?"Bekor":"+ Yangi amaliyot"}</Btn>
      {showForm&&(
        <Card style={{ marginBottom:12,border:`1.5px solid ${C.accent}` }}>
          <h4 style={{ margin:"0 0 14px",fontWeight:700,fontSize:14 }}>Yangi amaliyot</h4>
          <Input label="Lavozim *" {...f("role")} placeholder="Marketing Intern" />
          <Input label="Tavsif" {...f("description")} placeholder="Qisqacha tavsif..." rows={3} />
          <Input label="Ko'nikmalar (vergul bilan)" {...f("skills")} placeholder="SMM, Canva, Content" />
          <Input label="Davomiyligi" {...f("duration")} placeholder="2 oy" />
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12,fontWeight:600,display:"block",marginBottom:4,color:C.primary }}>Ish turi</label>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={{ width:"100%",border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 12px",fontSize:13,outline:"none",fontFamily:"inherit",background:"#fff" }}>
              {["Ofis","Remote","Gibrid"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <Btn full onClick={post} color={C.green} disabled={posting||!form.role}>{posting?"Joylashtirilmoqda...":"Joylashtirish"}</Btn>
        </Card>
      )}
      {loading?<Spinner/>:items.length===0&&!showForm
        ?<div style={{ textAlign:"center",padding:32,color:C.muted,border:`1px dashed ${C.border}`,borderRadius:12 }}><div style={{ fontWeight:600,marginBottom:6 }}>Hali e'lon yo'q</div><div style={{ fontSize:12 }}>Birinchi amaliyotingizni joylashtiring</div></div>
        :items.map(item=>(
          <Card key={item.id} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <div>
                <div style={{ fontWeight:700,fontSize:14,color:C.primary }}>{item.role}</div>
                <div style={{ fontSize:12,color:C.muted }}>{item.type} · {item.duration}</div>
              </div>
              <span style={{ fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,background:item.is_active?C.green+"18":C.red+"18",color:item.is_active?C.green:C.red }}>{item.is_active?"Faol":"To'xtatildi"}</span>
            </div>
            {item.description&&<div style={{ fontSize:12,color:C.muted,marginBottom:8,lineHeight:1.5 }}>{item.description}</div>}
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>{(item.skills||[]).map(s=><Badge key={s} text={s} color="#6366F1" />)}</div>
            <Btn small onClick={()=>toggle(item.id,item.is_active)} color={item.is_active?C.muted:C.green} outline>{item.is_active?"To'xtatish":"Faollashtirish"}</Btn>
          </Card>
        ))
      }
    </div>
  );
}

// ─── COMPANY: ARIZALAR ───────────────────────────────────────────────────────
function CompanyApplications({ profile }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const load = async () => {
    if(!profile?.id){setLoading(false);return;}
    setLoading(true);
    try {
      const{data:int}=await supabase.from("internships").select("id,role").eq("company_id",profile.id);
      if(int?.length){
        const ids=int.map(i=>i.id);
        const{data}=await supabase.from("applications").select("*, profiles(full_name,university,phone,skills,about,faculty,year), internships(role,duration,type)").in("internship_id",ids).order("created_at",{ascending:false});
        setApplications(data||[]);
      }
    }catch{}
    setLoading(false);
  };

  useEffect(()=>{load();},[profile]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try { await supabase.from("applications").update({status}).eq("id",id); setApplications(prev=>prev.map(a=>a.id===id?{...a,status}:a)); if(selected?.id===id)setSelected(prev=>({...prev,status})); }
    catch{}
    setUpdating(null);
  };

  const filtered = applications.filter(a=>filterStatus==="all"||(a.status||"pending")===filterStatus);

  if (selected) {
    const p = selected.profiles;
    return (
      <div style={{ padding:"16px 0" }}>
        <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",color:C.accent,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:14,padding:0 }}>← Orqaga</button>
        <Card style={{ marginBottom:12 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:14 }}>
            <div style={{ width:52,height:52,background:C.accent+"20",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:C.accent,fontWeight:700 }}>{(p?.full_name||"T")[0]}</div>
            <div>
              <div style={{ fontWeight:700,fontSize:16,color:C.primary }}>{p?.full_name||"Ism yo'q"}</div>
              <div style={{ color:C.muted,fontSize:13 }}>{p?.university||"—"}</div>
              {p?.faculty&&<div style={{ color:C.muted,fontSize:12 }}>{p.faculty}{p?.year&&` · ${p.year}-kurs`}</div>}
            </div>
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:12,marginBottom:12 }}>
            <div style={{ fontSize:13,color:C.muted,marginBottom:4 }}>Lavozim: <strong style={{ color:C.primary }}>{selected.internships?.role}</strong></div>
            <div style={{ fontSize:13,color:C.muted,marginBottom:4 }}>{selected.internships?.type} · {selected.internships?.duration}</div>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:8 }}><span style={{ fontSize:12,color:C.muted }}>Holat:</span><StatusBadge status={selected.status||"pending"} /></div>
          </div>
          {p?.about&&<div style={{ borderTop:`1px solid ${C.border}`,paddingTop:12,marginBottom:12 }}><div style={{ fontWeight:600,fontSize:13,marginBottom:6,color:C.primary }}>O'zi haqida:</div><div style={{ fontSize:13,color:C.muted,lineHeight:1.6 }}>{p.about}</div></div>}
          {p?.skills?.length>0&&<div style={{ borderTop:`1px solid ${C.border}`,paddingTop:12,marginBottom:12 }}><div style={{ fontWeight:600,fontSize:13,marginBottom:8,color:C.primary }}>Ko'nikmalar:</div><div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>{p.skills.map(s=><Badge key={s} text={s} color={C.accent} />)}</div></div>}
          {p?.phone&&<div style={{ borderTop:`1px solid ${C.border}`,paddingTop:12,marginBottom:12 }}><div style={{ fontSize:13,color:C.muted }}>Telefon: <strong style={{ color:C.primary }}>{p.phone}</strong></div></div>}
        </Card>
        {(!selected.status||selected.status==="pending")&&(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <Btn onClick={()=>updateStatus(selected.id,"accepted")} color={C.green} disabled={updating===selected.id}>{updating===selected.id?"...":"Qabul qilish"}</Btn>
            <Btn onClick={()=>updateStatus(selected.id,"rejected")} color={C.red} disabled={updating===selected.id}>{updating===selected.id?"...":"Rad etish"}</Btn>
          </div>
        )}
        {selected.status==="accepted"&&<div style={{ background:C.green+"15",border:`1px solid ${C.green}30`,borderRadius:10,padding:"12px 16px",textAlign:"center",color:C.green,fontWeight:600,fontSize:14 }}>Qabul qilingan</div>}
        {selected.status==="rejected"&&<Btn full onClick={()=>updateStatus(selected.id,"pending")} color={C.muted} outline>Qayta ko'rib chiqish</Btn>}
      </div>
    );
  }

  return (
    <div style={{ padding:"16px 0" }}>
      <SectionHeader title="Arizalar" sub={`${applications.length} ta ariza`} />
      <div style={{ display:"flex",gap:6,marginBottom:14,flexWrap:"wrap" }}>
        {[["all","Barchasi"],["pending","Kutilmoqda"],["accepted","Qabul"],["rejected","Rad"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilterStatus(v)} style={{ background:filterStatus===v?C.primary:"#fff",color:filterStatus===v?"#fff":C.muted,border:`1px solid ${filterStatus===v?C.primary:C.border}`,padding:"5px 14px",borderRadius:18,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit" }}>{l}</button>
        ))}
      </div>
      {loading?<Spinner/>:filtered.length===0
        ?<div style={{ textAlign:"center",padding:32,color:C.muted,border:`1px dashed ${C.border}`,borderRadius:12 }}><div style={{ fontWeight:600,marginBottom:6 }}>Ariza yo'q</div><div style={{ fontSize:12 }}>Talabalar ariza berganda bu yerda ko'rinadi</div></div>
        :filtered.map(app=>(
          <Card key={app.id} onClick={()=>setSelected(app)} style={{ marginBottom:10,cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ display:"flex",gap:10,alignItems:"center" }}>
                <div style={{ width:40,height:40,background:C.accent+"20",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:C.accent,fontWeight:700 }}>{(app.profiles?.full_name||"T")[0]}</div>
                <div>
                  <div style={{ fontWeight:700,fontSize:14,color:C.primary }}>{app.profiles?.full_name||"Ism yo'q"}</div>
                  <div style={{ fontSize:12,color:C.muted }}>{app.internships?.role} · {app.profiles?.university||"—"}</div>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
                <StatusBadge status={app.status||"pending"} />
                <span style={{ fontSize:10,color:C.muted }}>Batafsil →</span>
              </div>
            </div>
          </Card>
        ))
      }
    </div>
  );
}

// ─── ADMIN: FOYDALANUVCHILAR ─────────────────────────────────────────────────
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const{data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false}); setUsers(data||[]); }
      catch{}
      setLoading(false);
    })();
  },[]);

  const filtered=users.filter(u=>!search||u.full_name?.toLowerCase().includes(search.toLowerCase())||u.email?.toLowerCase().includes(search.toLowerCase())||u.university?.toLowerCase().includes(search.toLowerCase()));
  const students=users.filter(u=>u.role!=="company");
  const companies=users.filter(u=>u.role==="company");

  return (
    <div style={{ padding:"16px 0" }}>
      <SectionHeader title="Foydalanuvchilar" sub={`${students.length} talaba · ${companies.length} tadbirkor`} />
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16 }}>
        {[{l:"Jami",v:users.length,c:C.accent},{l:"Talaba",v:students.length,c:C.green},{l:"Tadbirkor",v:companies.length,c:C.gold}].map(s=>(
          <Card key={s.l} style={{ textAlign:"center",padding:12 }}>
            <div style={{ fontWeight:800,fontSize:20,color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11,color:C.muted }}>{s.l}</div>
          </Card>
        ))}
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Qidirish..." style={{ width:"100%",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:12,background:"#fff" }} />
      {loading?<Spinner/>:filtered.map(u=>(
        <Card key={u.id} style={{ marginBottom:8 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ display:"flex",gap:10,alignItems:"center" }}>
              <div style={{ width:38,height:38,background:u.role==="company"?C.gold+"20":C.accent+"20",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:u.role==="company"?C.gold:C.accent,fontWeight:700 }}>{(u.full_name||u.email||"U")[0]}</div>
              <div>
                <div style={{ fontWeight:600,fontSize:13,color:C.primary }}>{u.full_name||"—"}</div>
                <div style={{ fontSize:11,color:C.muted }}>{u.university||u.company_name||u.email||"—"}</div>
              </div>
            </div>
            <Badge text={u.role==="company"?"Tadbirkor":"Talaba"} color={u.role==="company"?C.gold:C.accent} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── ADMIN: AMALIYOTLAR ───────────────────────────────────────────────────────
function AdminInternships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const{data}=await supabase.from("internships").select("*").order("created_at",{ascending:false}); setItems(data?.length?data:MOCK_INTERNSHIPS); }
      catch{setItems(MOCK_INTERNSHIPS);}
      setLoading(false);
    })();
  },[]);

  const toggle=async(id,cur)=>{ await supabase.from("internships").update({is_active:!cur}).eq("id",id); setItems(prev=>prev.map(i=>i.id===id?{...i,is_active:!cur}:i)); };
  const remove=async(id)=>{ if(!window.confirm("O'chirishni tasdiqlaysizmi?"))return; await supabase.from("internships").delete().eq("id",id); setItems(prev=>prev.filter(i=>i.id!==id)); };

  return (
    <div style={{ padding:"16px 0" }}>
      <SectionHeader title="Barcha amaliyotlar" sub={`${items.length} ta e'lon`} />
      {loading?<Spinner/>:items.map(item=>(
        <Card key={item.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div>
              <div style={{ fontWeight:700,fontSize:14,color:C.primary }}>{item.role}</div>
              <div style={{ fontSize:12,color:C.muted }}>{item.company_name} · {item.type}</div>
            </div>
            <span style={{ fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,background:item.is_active?C.green+"18":C.red+"18",color:item.is_active?C.green:C.red }}>{item.is_active?"Faol":"To'xtatildi"}</span>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <Btn small onClick={()=>toggle(item.id,item.is_active)} color={item.is_active?C.muted:C.green} outline>{item.is_active?"To'xtatish":"Faollashtirish"}</Btn>
            <Btn small onClick={()=>remove(item.id)} color={C.red} outline>O'chirish</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── ADMIN: ARIZALAR ─────────────────────────────────────────────────────────
function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const{data}=await supabase.from("applications").select("*, profiles(full_name,university), internships(role,company_name)").order("created_at",{ascending:false}); setApps(data||[]); }
      catch{}
      setLoading(false);
    })();
  },[]);

  const updateStatus=async(id,status)=>{ await supabase.from("applications").update({status}).eq("id",id); setApps(prev=>prev.map(a=>a.id===id?{...a,status}:a)); };
  const filtered=apps.filter(a=>filterStatus==="all"||(a.status||"pending")===filterStatus);
  const pending=apps.filter(a=>!a.status||a.status==="pending").length;
  const accepted=apps.filter(a=>a.status==="accepted").length;

  return (
    <div style={{ padding:"16px 0" }}>
      <SectionHeader title="Barcha arizalar" sub={`${apps.length} ta ariza`} />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
        {[{l:"Jami",v:apps.length,c:C.accent},{l:"Kutilmoqda",v:pending,c:C.gold},{l:"Qabul",v:accepted,c:C.green}].map(s=>(
          <Card key={s.l} style={{ textAlign:"center",padding:12 }}>
            <div style={{ fontWeight:800,fontSize:20,color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11,color:C.muted }}>{s.l}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"flex",gap:6,marginBottom:14,flexWrap:"wrap" }}>
        {[["all","Barchasi"],["pending","Kutilmoqda"],["accepted","Qabul"],["rejected","Rad"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilterStatus(v)} style={{ background:filterStatus===v?C.primary:"#fff",color:filterStatus===v?"#fff":C.muted,border:`1px solid ${filterStatus===v?C.primary:C.border}`,padding:"5px 14px",borderRadius:18,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit" }}>{l}</button>
        ))}
      </div>
      {loading?<Spinner/>:filtered.map(app=>(
        <Card key={app.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div>
              <div style={{ fontWeight:700,fontSize:14,color:C.primary }}>{app.profiles?.full_name||"—"}</div>
              <div style={{ fontSize:12,color:C.muted }}>{app.internships?.role} — {app.internships?.company_name}</div>
              <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>{app.profiles?.university||"—"}</div>
            </div>
            <StatusBadge status={app.status||"pending"} />
          </div>
          {(!app.status||app.status==="pending")&&(
            <div style={{ display:"flex",gap:8 }}>
              <Btn small onClick={()=>updateStatus(app.id,"accepted")} color={C.green}>Qabul</Btn>
              <Btn small onClick={()=>updateStatus(app.id,"rejected")} color={C.red}>Rad</Btn>
            </div>
          )}
        </Card>
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
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(()=>{
    // Hash tekshirish
    const hash = window.location.hash;
    if (hash.includes("reset-password") || hash.includes("type=recovery")) {
      setIsResetPassword(true);
    }

    // Session tekshirish
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);loadProfile(session.user.id);}
      setAuthLoading(false);
    });

    // Auth o'zgarishlarini kuzatish
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{
      if(_e === "PASSWORD_RECOVERY"){
        setIsResetPassword(true);
      }
      if(session?.user){setUser(session.user);loadProfile(session.user.id);setShowAuth(false);}
      else{setUser(null);setProfile(null);}
    });

    return()=>subscription.unsubscribe();
  },[]);

  const loadProfile=async(uid)=>{
    try {
      const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();
      if(data){
        setProfile(data);
        const isAdmin=data.email===ADMIN_EMAIL;
        if(isAdmin)setPage("admin_users");
        else if(data.role==="company")setPage("company_home");
        else setPage("home");
      }
    }catch{}
  };

  const logout=async()=>{ await supabase.auth.signOut(); setUser(null);setProfile(null);setPage("home");setShowAuth(false); };

  if(authLoading)return(
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.light }}><Spinner /></div>
  );

  if(isResetPassword)return(
    <ResetPasswordScreen onDone={()=>{
      setIsResetPassword(false);
      window.location.hash="";
      setShowAuth(true);
      setAuthMode("login");
    }} />
  );

  if(!user&&!showAuth)return(
    <LandingPage
      onLogin={()=>{setAuthMode("login");setShowAuth(true);}}
      onRegister={()=>{setAuthMode("register");setShowAuth(true);}}
    />
  );

  if(showAuth)return(
    <AuthScreen initialMode={authMode} onAuth={u=>{setUser(u);loadProfile(u.id);}} onBack={()=>setShowAuth(false)} />
  );

  const isAdmin=profile?.email===ADMIN_EMAIL;
  const role=profile?.role||"student";

  const renderPage=()=>{
    if(isAdmin){
      if(page==="admin_users")return<AdminUsers />;
      if(page==="admin_internships")return<AdminInternships />;
      if(page==="admin_applications")return<AdminApplications />;
      return<AdminUsers />;
    }
    if(role==="company"){
      if(page==="company_home")return<CompanyHome profile={profile} />;
      if(page==="company_internships")return<CompanyInternships profile={profile} />;
      if(page==="company_applications")return<CompanyApplications profile={profile} />;
      return<CompanyHome profile={profile} />;
    }
    if(page==="home")return<StudentHome userId={user?.id} />;
    if(page==="my_applications")return<StudentApplications userId={user?.id} />;
    if(page==="profile")return<StudentProfile profile={profile} onUpdate={setProfile} />;
    if(page==="resume")return<StudentCV profile={profile} />;
    return<StudentHome userId={user?.id} />;
  };

  return (
    <AuthContext.Provider value={{user,profile}}>
      <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif",background:C.light,minHeight:"100vh",color:C.primary }}>
        <Navbar profile={profile} onLogout={logout} />
        <div style={{ maxWidth:520,margin:"0 auto",padding:"0 16px 90px" }}>
          {renderPage()}
        </div>
        <BottomNav page={page} setPage={setPage} role={role} isAdmin={isAdmin} />
      </div>
    </AuthContext.Provider>
  );
}
