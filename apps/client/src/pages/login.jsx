import { useState, useEffect, useCallback } from "react";

/* ── Demo users ─────────────────────────────────────────── */
const DEMO_USERS = {
  "citizen@civicpulse.gov": { password: "Citizen@123", role: "Citizen", name: "Priya Sharma" },
  "admin@civicpulse.gov":   { password: "Admin@123",   role: "Admin",   name: "Rajesh Kumar" },
};

const ROLES = ["Citizen", "Admin"];
const ROLE_ICONS = { Citizen: "👤", Admin: "🛡️" };
const ROLE_DESC  = { Citizen: "Report & track grievances", Admin: "Manage portal & complaints" };

/* ── Dashboard data ─────────────────────────────────────── */
const DASHBOARD = {
  Citizen: {
    stats: [
      { label: "My Complaints", value: 4,  icon: "📋" },
      { label: "In Progress",   value: 2,  icon: "⏳" },
      { label: "Resolved",      value: 1,  icon: "✅" },
      { label: "Pending",       value: 1,  icon: "🔴" },
    ],
    nav: [
      { icon: "🏠", label: "Dashboard",     active: true  },
      { icon: "📋", label: "My Complaints", active: false },
      { icon: "➕", label: "New Complaint", active: false },
      { icon: "🔔", label: "Notifications", active: false },
      { icon: "👤", label: "Profile",        active: false },
    ],
    recent: [
      { id: "GRV-1041", title: "Pothole on MG Road",         status: "In Progress", date: "24 Feb 2026", priority: "High"   },
      { id: "GRV-1038", title: "Broken Street Light",        status: "Resolved",    date: "20 Feb 2026", priority: "Medium" },
      { id: "GRV-1030", title: "Garbage not collected",      status: "Pending",     date: "15 Feb 2026", priority: "High"   },
    ],
  },
  Admin: {
    stats: [
      { label: "Total Complaints",  value: 1240, icon: "📂" },
      { label: "Open Today",        value: 38,   icon: "🔔" },
      { label: "Resolved (MTD)",    value: 910,  icon: "✅" },
      { label: "Avg Resolve Time",  value: "38h",icon: "⏱️" },
    ],
    nav: [
      { icon: "🏠", label: "Dashboard",     active: true  },
      { icon: "📂", label: "All Complaints",active: false },
      { icon: "👥", label: "Users",         active: false },
      { icon: "📊", label: "Analytics",     active: false },
      { icon: "⚙️", label: "Settings",      active: false },
    ],
    recent: [
      { id: "GRV-1045", title: "Sewage overflow – Koramangala",  status: "Escalated",   date: "26 Feb 2026", priority: "Critical" },
      { id: "GRV-1044", title: "Road cave-in – Whitefield",      status: "In Progress", date: "25 Feb 2026", priority: "High"     },
      { id: "GRV-1043", title: "Water supply disruption",        status: "Pending",     date: "25 Feb 2026", priority: "High"     },
    ],
  },
};

const STATUS_STYLE = {
  "In Progress": { bg: "#fff8e1", color: "#b45309", border: "#f6d860" },
  "Resolved":    { bg: "#f0faf4", color: "#276749", border: "#6fcf97" },
  "Completed":   { bg: "#f0faf4", color: "#276749", border: "#6fcf97" },
  "Pending":     { bg: "#fff5f5", color: "#c53030", border: "#f5a0a0" },
  "Escalated":   { bg: "#fdf4ff", color: "#7e22ce", border: "#d8b4fe" },
};

const PRIORITY_COLOR = { Critical: "#dc2626", High: "#ea580c", Medium: "#d97706", Low: "#16a34a" };

/* ── Helpers ────────────────────────────────────────────── */
function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function Counter({ target }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof target === "string") { setV(target); return; }
    const dur = 1500, t0 = performance.now();
    const go = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }, [target]);
  return <>{typeof v === "string" ? v : target > 999 ? v.toLocaleString() : v}</>;
}

/* ── Dashboard ──────────────────────────────────────────── */
function Dashboard({ user, onLogout }) {
  const width   = useWidth();
  const isMob   = width < 700;
  const data    = DASHBOARD[user.role];
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f0f4f8", fontFamily:"'Source Sans 3',sans-serif" }}>

      {/* Sidebar overlay on mobile */}
      {isMob && open && (
        <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:199 }} />
      )}

      {/* Sidebar */}
      <div style={{
        width: 224,
        background: "linear-gradient(175deg,#07192e 0%,#0d2f58 60%,#091e3a 100%)",
        display: "flex", flexDirection: "column",
        position: isMob ? "fixed" : "relative",
        top:0, left: isMob ? (open ? 0 : -230) : 0, bottom:0,
        zIndex: isMob ? 200 : 1,
        transition: "left .28s ease",
        boxShadow: isMob && open ? "4px 0 28px rgba(0,0,0,0.5)" : "2px 0 12px rgba(0,0,0,0.15)",
        flexShrink: 0,
      }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#c8a84b,#f0d878,#c8a84b)", flexShrink:0 }} />

        {/* Logo row */}
        <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid rgba(200,168,75,0.2)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:"0.98rem", color:"#fff", fontWeight:700 }}>CivicPulse</div>
            <div style={{ fontSize:"0.6rem", color:"#c8a84b", letterSpacing:"0.15em", textTransform:"uppercase" }}>Gov. Portal</div>
          </div>
          {isMob && (
            <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", color:"#90b4d8", fontSize:"1.2rem", cursor:"pointer" }}>✕</button>
          )}
        </div>

        {/* User badge */}
        <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#c8a84b,#f0d878)", display:"grid", placeItems:"center", fontSize:"0.95rem", flexShrink:0 }}>
            {ROLE_ICONS[user.role]}
          </div>
          <div>
            <div style={{ fontSize:"0.8rem", color:"#e0eaf5", fontWeight:600 }}>{user.name}</div>
            <div style={{ fontSize:"0.64rem", color:"#7090b0" }}>{user.role}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {data.nav.map((item) => (
            <div key={item.label} onClick={() => isMob && setOpen(false)} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"9px 12px", borderRadius:4, marginBottom:2,
              background: item.active ? "rgba(200,168,75,0.15)" : "transparent",
              borderLeft: item.active ? "3px solid #c8a84b" : "3px solid transparent",
              cursor:"pointer", transition:"background .15s",
            }}
              onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize:"0.9rem" }}>{item.icon}</span>
              <span style={{ fontSize:"0.81rem", color: item.active ? "#f0d878" : "#a8c0d8", fontWeight: item.active ? 600 : 400 }}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:"12px 8px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:4, cursor:"pointer", transition:"background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,80,80,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span>🚪</span>
            <span style={{ fontSize:"0.81rem", color:"#ff9090" }}>Sign Out</span>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <div style={{ background:"#fff", borderBottom:"1px solid #dde5f0", padding:"0 22px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {isMob && (
              <button onClick={() => setOpen(true)} style={{ background:"none", border:"none", fontSize:"1.25rem", cursor:"pointer", color:"#1a4480" }}>☰</button>
            )}
            <div>
              <div style={{ fontSize:"0.98rem", fontWeight:700, color:"#1a2035", fontFamily:"'Libre Baskerville',serif" }}>
                {user.role} Dashboard
              </div>
              {!isMob && <div style={{ fontSize:"0.68rem", color:"#8a9bb0" }}>Welcome back, {user.name}</div>}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:"0.68rem", color:"#60d0a0", display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#60d0a0", display:"inline-block", animation:"blink 2s infinite" }} />
              {!isMob && "Live"}
            </span>
            <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:"0.78rem", color:"#1a4480", fontWeight:600, background:"#eef3fa", padding:"5px 12px", borderRadius:3, border:"1px solid #c8d8f0" }}>
              {ROLE_ICONS[user.role]} {user.role}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding: isMob ? "18px 14px" : "26px 28px" }}>

          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns: isMob ? "1fr 1fr" : "repeat(4,1fr)", gap: isMob ? 10 : 16, marginBottom:24 }}>
            {data.stats.map((s) => (
              <div key={s.label} style={{ background:"#fff", borderRadius:4, border:"1px solid #dde5f0", padding: isMob ? "14px 12px" : "18px 18px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: isMob ? "1.4rem" : "1.7rem", marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize: isMob ? "1.35rem" : "1.65rem", fontWeight:700, color:"#1a2035", fontVariantNumeric:"tabular-nums" }}>
                  <Counter target={s.value} />
                </div>
                <div style={{ fontSize:"0.7rem", color:"#7a8a9a", marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div style={{ background:"#fff", borderRadius:4, border:"1px solid #dde5f0", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #edf0f5", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:"0.98rem", fontWeight:700, color:"#1a2035" }}>Recent Activity</div>
              <button style={{ fontSize:"0.75rem", color:"#1a4480", background:"#eef3fa", border:"1px solid #c8d8f0", borderRadius:3, padding:"5px 13px", cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif" }}>
                View All →
              </button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.82rem" }}>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    {["ID","Title","Priority","Status","Date"].map(h => (
                      <th key={h} style={{ padding:"9px 16px", textAlign:"left", fontSize:"0.67rem", color:"#7a8a9a", fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", borderBottom:"1px solid #edf0f5", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((row, i) => {
                    const ss = STATUS_STYLE[row.status] || {};
                    const pc = PRIORITY_COLOR[row.priority] || "#555";
                    return (
                      <tr key={row.id} style={{ borderBottom: i < data.recent.length - 1 ? "1px solid #f0f4f8" : "none" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafbfc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding:"12px 16px", color:"#1a4480", fontWeight:600, whiteSpace:"nowrap" }}>{row.id}</td>
                        <td style={{ padding:"12px 16px", color:"#2a3a50", maxWidth:200 }}>{row.title}</td>
                        <td style={{ padding:"12px 16px", whiteSpace:"nowrap" }}>
                          <span style={{ color:pc, fontWeight:600, fontSize:"0.76rem" }}>● {row.priority}</span>
                        </td>
                        <td style={{ padding:"12px 16px", whiteSpace:"nowrap" }}>
                          <span style={{ background:ss.bg, color:ss.color, border:`1px solid ${ss.border}`, borderRadius:3, padding:"3px 9px", fontSize:"0.73rem", fontWeight:600 }}>{row.status}</span>
                        </td>
                        <td style={{ padding:"12px 16px", color:"#7a8a9a", whiteSpace:"nowrap" }}>{row.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop:16, fontSize:"0.65rem", color:"#9aabb0", textAlign:"center" }}>
            © {new Date().getFullYear()} CivicPulse — Ministry of Urban Development, Government of India
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Login page ─────────────────────────────────────────── */
export default function App() {
  const width  = useWidth();
  const isMob  = width < 800;

  const [mode,     setMode]     = useState("login"); // login | register
  const [role,     setRole]     = useState("Citizen");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone,    setPhone]    = useState("");
  const [aadhaar,  setAadhaar]  = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [status,   setStatus]   = useState("idle"); // idle | loading | success | error
  const [user,     setUser]     = useState(null);
  const [focus,    setFocus]    = useState("");
  const [hint,     setHint]     = useState(false);

  /* Restore session */
  useEffect(() => {
    try {
      const s = sessionStorage.getItem("cp_user") || localStorage.getItem("cp_user");
      if (s) setUser(JSON.parse(s));
    } catch {}
  }, []);

  /* Auto-fill when role tab changes */
  const prefill = useCallback((r) => {
    const entry = Object.entries(DEMO_USERS).find(([, v]) => v.role === r);
    if (entry) { setEmail(entry[0]); setPassword(entry[1].password); }
    setErrors({});
  }, []);

  const validate = () => {
    const e = {};
    if (mode === "register") {
      if (!fullname.trim())                         e.fullname = "Full name is required.";
      else if (fullname.trim().length < 2)          e.fullname = "Full name must be at least 2 characters.";
      if (!phone.trim())                            e.phone    = "Phone number is required.";
      else if (!/^\d{10}$/.test(phone))             e.phone    = "Enter a valid 10-digit phone number.";
      if (!aadhaar.trim())                          e.aadhaar  = "Aadhaar number is required.";
      else if (!/^\d{12}$/.test(aadhaar))           e.aadhaar  = "Aadhaar must be exactly 12 digits.";
      if (!email.trim())                            e.email    = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(email))         e.email    = "Enter a valid email address.";
      if (!password)                                e.password = "Password is required.";
      else if (password.length < 8)                 e.password = "Password must be at least 8 characters.";
      if (!confirmPw)                               e.confirmPw = "Please confirm your password.";
      else if (password !== confirmPw)              e.confirmPw = "Passwords do not match.";
    } else {
      if (!email.trim())                            e.email    = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(email))         e.email    = "Enter a valid email address.";
      if (!password)                                e.password = "Password is required.";
      else if (password.length < 6)                 e.password = "Password must be at least 6 characters.";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    setTimeout(() => {
      if (mode === "register") {
        // Register new citizen - prepare data for backend API
        const registrationData = {
          fullname: fullname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          aadhaar: aadhaar.trim(),
          password,
        };
        
        // TODO: Call backend /auth/register endpoint
        // For now, store locally for demo
        const u = { email, fullname: fullname.trim(), phone, role: "Citizen" };
        if (remember) localStorage.setItem("cp_user", JSON.stringify(u));
        else          sessionStorage.setItem("cp_user", JSON.stringify(u));
        setStatus("success");
        setTimeout(() => setUser(u), 700);
      } else {
        // Login
        const match = DEMO_USERS[email.toLowerCase()];
        if (match && match.password === password && match.role === role) {
          const u = { email, name: match.name, role: match.role };
          if (remember) localStorage.setItem("cp_user", JSON.stringify(u));
          else          sessionStorage.setItem("cp_user", JSON.stringify(u));
          setStatus("success");
          setTimeout(() => setUser(u), 700);
        } else {
          setStatus("error");
          setErrors({ auth: "Invalid credentials or role mismatch. Try the demo hints." });
          setTimeout(() => setStatus("idle"), 3000);
        }
      }
    }, 1400);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cp_user");
    localStorage.removeItem("cp_user");
    setUser(null); setStatus("idle"); setEmail(""); setPassword(""); setFullname(""); setPhone(""); setAadhaar(""); setConfirmPw(""); setErrors({}); setMode("login");
  };

  const toggleMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setErrors({});
    setStatus("idle");
  };

  if (user) return <Dashboard user={user} onLogout={handleLogout} />;

  const inp = (field) => ({
    width:"100%", background:"#f8fafc",
    border:`1.5px solid ${errors[field] ? "#e53e3e" : focus === field ? "#1a4480" : "#ccd5e0"}`,
    borderRadius:3, padding:"11px 14px",
    fontSize:"0.92rem", color:"#1a2035",
    fontFamily:"'Source Sans 3',sans-serif",
    outline:"none", transition:"border-color .2s, box-shadow .2s",
    boxShadow: focus === field ? `0 0 0 3px ${errors[field] ? "rgba(229,62,62,.1)" : "rgba(26,68,128,.12)"}` : "none",
  });

  const btnBg = status === "success" ? "#276749" : status === "error" ? "#c53030" : "#1a4480";
  const btnLabel = mode === "register" 
    ? (status === "loading" ? "Creating Account…" : status === "success" ? "✓ Account Created…" : status === "error" ? "❌ Registration Failed" : "Create Citizen Account")
    : (status === "loading" ? "Authenticating…" : status === "success" ? "✓ Access Granted…" : status === "error" ? "❌ Authentication Failed" : "Sign In to Portal");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0d1b2a}
        @keyframes fadeIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input::placeholder{color:#9aaabf;font-size:.88rem}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px #f8fafc inset!important;-webkit-text-fill-color:#1a2035!important}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#c8d8e8;border-radius:4px}
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", flexDirection: isMob ? "column" : "row", fontFamily:"'Source Sans 3',sans-serif" }}>

        {/* ── Left branding panel ── */}
        <div style={{
          flex: isMob ? "none" : "0 0 390px",
          background:"linear-gradient(175deg,#07192e 0%,#0d2f58 55%,#091e3a 100%)",
          display:"flex", flexDirection:"column", justifyContent:"space-between",
          padding: isMob ? "30px 22px" : "50px 42px",
          position:"relative", overflow:"hidden",
          borderRight:"1px solid rgba(200,168,75,0.28)",
        }}>
          {/* Top gold bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:5, background:"linear-gradient(90deg,#c8a84b,#f0d878,#c8a84b)" }} />
          {/* Dot texture */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"22px 22px", pointerEvents:"none" }} />
          {/* Decorative rings */}
          <div style={{ position:"absolute", bottom:-100, right:-100, width:400, height:400, borderRadius:"50%", border:"1px solid rgba(200,168,75,0.08)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:-50,  right:-50,  width:260, height:260, borderRadius:"50%", border:"1px solid rgba(200,168,75,0.06)", pointerEvents:"none" }} />

          {/* Brand */}
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ width:72, height:72, background:"linear-gradient(135deg,#c8a84b,#f0d878,#c8a84b)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, boxShadow:"0 6px 28px rgba(200,168,75,0.35)" }}>
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="32" width="32" height="4" rx="1" fill="#0d2f58"/>
                <rect x="8" y="18" width="24" height="14" rx="1" fill="#0d2f58"/>
                <rect x="6" y="15" width="28" height="4" rx="1" fill="#0d2f58"/>
                <polygon points="20,4 4,16 36,16" fill="#0d2f58"/>
                <rect x="15" y="24" width="5" height="8" rx="1" fill="#c8a84b"/>
                <rect x="22" y="24" width="5" height="8" rx="1" fill="#c8a84b"/>
                <circle cx="20" cy="12" r="2" fill="#c8a84b"/>
              </svg>
            </div>
            <div style={{ width:44, height:2, background:"linear-gradient(90deg,#c8a84b,transparent)", marginBottom:14 }} />
            <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:"1.28rem", fontWeight:700, color:"#fff", marginBottom:5 }}>CivicPulse Portal</div>
            <div style={{ fontSize:"0.68rem", color:"#c8a84b", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:4 }}>Government of India</div>
            <div style={{ fontSize:"0.66rem", color:"#5a7090", letterSpacing:"0.1em", textTransform:"uppercase" }}>Ministry of Urban Development</div>
          </div>

          {/* Quote + stats (desktop only) */}
          {!isMob && (
            <div style={{ position:"relative", zIndex:2 }}>
              <div style={{ height:1, background:"rgba(200,168,75,0.2)", marginBottom:24 }} />
              <p style={{ fontFamily:"'Libre Baskerville',serif", fontStyle:"italic", fontSize:"0.94rem", color:"#a8c0d8", lineHeight:1.8, marginBottom:8 }}>
                "Empowering citizens through transparent, AI-assisted grievance redressal and smart urban governance."
              </p>
              <div style={{ fontSize:"0.66rem", color:"#5a7090", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:24 }}>— National Smart Cities Mission</div>
              <div style={{ height:1, background:"rgba(200,168,75,0.2)", marginBottom:24 }} />
              <div style={{ display:"flex", gap:26, flexWrap:"wrap" }}>
                {[{t:94,l:"Resolution %",s:"%"},{t:12400,l:"Resolved",s:"+"},{t:38,l:"Avg. Hours",s:"h"}].map(({t,l,s}) => (
                  <div key={l} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    <span style={{ fontSize:"1.3rem", fontWeight:700, color:"#c8a84b", fontVariantNumeric:"tabular-nums" }}>
                      <Counter target={t} />{s}
                    </span>
                    <span style={{ fontSize:"0.65rem", color:"#7090b0", letterSpacing:"0.08em", textTransform:"uppercase" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security footer */}
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ height:1, background:"rgba(200,168,75,0.15)", marginBottom:14 }} />
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
              <svg width="12" height="13" viewBox="0 0 13 14" fill="none">
                <path d="M6.5 1L1.5 3.5V7C1.5 9.8 3.7 12.2 6.5 13C9.3 12.2 11.5 9.8 11.5 7V3.5L6.5 1Z" stroke="#c8a84b" strokeWidth="1.1" fill="none"/>
                <path d="M4.5 7L5.8 8.3L8.5 5.5" stroke="#c8a84b" strokeWidth="1.1" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize:"0.68rem", color:"#6a8099" }}>256-bit SSL Encrypted Connection</span>
            </div>
            <div style={{ fontSize:"0.63rem", color:"#415060", lineHeight:1.65 }}>
              Authorised access only. Violation punishable under IT Act, 2000.
            </div>
          </div>
        </div>

        {/* ── Right login panel ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#eef2f7", minHeight: isMob ? "auto" : "100vh" }}>

          {/* Top utility bar */}
          <div style={{ background:"#1a4480", padding:"7px 26px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:6 }}>
            <span style={{ fontSize:"0.68rem", color:"#90b4d8", letterSpacing:"0.05em" }}>🇮🇳 Official Portal — India.gov.in | Grievance & Urban Services</span>
            <span style={{ fontSize:"0.66rem", color:"#60d0a0", display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#60d0a0", display:"inline-block", animation:"blink 2s infinite" }} />
              All Systems Operational
            </span>
          </div>

          {/* Centred form */}
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding: isMob ? "26px 14px" : "36px 44px" }}>
            <div style={{ width:"100%", maxWidth:470, animation:"fadeIn .5s ease both" }}>

              {/* Card */}
              <div style={{ background:"#fff", borderRadius:4, border:"1px solid #ccd5e0", boxShadow:"0 2px 20px rgba(0,0,0,0.08)", overflow:"hidden" }}>

                {/* Card header */}
                <div style={{ background:"#1a4480", padding:"19px 26px", borderBottom:"3px solid #c8a84b" }}>
                  <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:"1.06rem", color:"#fff", fontWeight:700, marginBottom:3 }}>
                    {mode === "register" ? "Register as Citizen" : "Sign In to CivicPulse"}
                  </div>
                  <div style={{ fontSize:"0.74rem", color:"#90b4d8" }}>AI-Powered Smart Urban Grievance & Service Portal</div>
                </div>

                <div style={{ padding:"22px 26px 26px" }}>

                  {/* Auth error banner */}
                  {errors.auth && (
                    <div style={{ background:"#fff8f8", border:"1px solid #f5c0c0", borderLeft:"4px solid #c53030", borderRadius:3, padding:"9px 13px", fontSize:"0.79rem", color:"#c53030", marginBottom:14 }}>
                      ⚠️ {errors.auth}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>

                    {/* Full Name (Register only) */}
                    {mode === "register" && (
                      <div style={{ marginBottom:14 }}>
                        <label style={{ display:"block", fontSize:"0.74rem", color:"#3a4a5c", fontWeight:600, letterSpacing:"0.04em", marginBottom:6 }}>
                          Full Name <span style={{ color:"#e53e3e" }}>*</span>
                        </label>
                        <input
                          type="text" value={fullname}
                          onChange={e => { setFullname(e.target.value); if (errors.fullname) setErrors(p=>({...p,fullname:""})); }}
                          placeholder="Enter your full name (min 2 characters)"
                          style={inp("fullname")}
                          onFocus={() => setFocus("fullname")}
                          onBlur={() => setFocus("")}
                        />
                        {errors.fullname && <div style={{ fontSize:"0.72rem", color:"#e53e3e", marginTop:4 }}>⚠ {errors.fullname}</div>}
                      </div>
                    )}

                    {/* Phone Number (Register only) */}
                    {mode === "register" && (
                      <div style={{ marginBottom:14 }}>
                        <label style={{ display:"block", fontSize:"0.74rem", color:"#3a4a5c", fontWeight:600, letterSpacing:"0.04em", marginBottom:6 }}>
                          Phone Number <span style={{ color:"#e53e3e" }}>*</span>
                        </label>
                        <input
                          type="tel" value={phone}
                          onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); if (errors.phone) setErrors(p=>({...p,phone:""})); }}
                          placeholder="10-digit phone number"
                          style={inp("phone")}
                          onFocus={() => setFocus("phone")}
                          onBlur={() => setFocus("")}
                        />
                        {errors.phone && <div style={{ fontSize:"0.72rem", color:"#e53e3e", marginTop:4 }}>⚠ {errors.phone}</div>}
                      </div>
                    )}

                    {/* Aadhaar (Register only) */}
                    {mode === "register" && (
                      <div style={{ marginBottom:14 }}>
                        <label style={{ display:"block", fontSize:"0.74rem", color:"#3a4a5c", fontWeight:600, letterSpacing:"0.04em", marginBottom:6 }}>
                          Aadhaar Number <span style={{ color:"#e53e3e" }}>*</span>
                        </label>
                        <input
                          type="tel" value={aadhaar}
                          onChange={e => { setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12)); if (errors.aadhaar) setErrors(p=>({...p,aadhaar:""})); }}
                          placeholder="12-digit Aadhaar number"
                          style={inp("aadhaar")}
                          onFocus={() => setFocus("aadhaar")}
                          onBlur={() => setFocus("")}
                        />
                        {errors.aadhaar && <div style={{ fontSize:"0.72rem", color:"#e53e3e", marginTop:4 }}>⚠ {errors.aadhaar}</div>}
                      </div>
                    )}

                    {/* Email */}
                    <div style={{ marginBottom:14 }}>
                      <label style={{ display:"block", fontSize:"0.74rem", color:"#3a4a5c", fontWeight:600, letterSpacing:"0.04em", marginBottom:6 }}>
                        {mode === "register" ? "Email Address" : "User ID / Email"} <span style={{ color:"#e53e3e" }}>*</span>
                      </label>
                      <input
                        type="email" value={email}
                        onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p=>({...p,email:""})); }}
                        placeholder={mode === "register" ? "Your email address" : "Registered email or official ID"}
                        style={inp("email")}
                        onFocus={() => setFocus("email")}
                        onBlur={() => setFocus("")}
                      />
                      {errors.email && <div style={{ fontSize:"0.72rem", color:"#e53e3e", marginTop:4 }}>⚠ {errors.email}</div>}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom:6 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <label style={{ fontSize:"0.74rem", color:"#3a4a5c", fontWeight:600, letterSpacing:"0.04em" }}>
                          Password <span style={{ color:"#e53e3e" }}>*</span>
                        </label>
                        {mode === "login" && (
                          <a href="#" style={{ fontSize:"0.71rem", color:"#1a4480", textDecoration:"none" }}
                            onMouseEnter={e => e.target.style.textDecoration="underline"}
                            onMouseLeave={e => e.target.style.textDecoration="none"}>
                            Forgot Password?
                          </a>
                        )}
                      </div>
                      <div style={{ position:"relative" }}>
                        <input
                          type={showPw ? "text" : "password"} value={password}
                          onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p=>({...p,password:""})); }}
                          placeholder={mode === "register" ? "Create a strong password" : "Enter your password"}
                          style={{ ...inp("password"), paddingRight:42 }}
                          onFocus={() => setFocus("password")}
                          onBlur={() => setFocus("")}
                        />
                        <button type="button" onClick={() => setShowPw(p => !p)} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#7a90a8", display:"flex" }}>
                          <EyeIcon open={showPw} />
                        </button>
                      </div>
                      {errors.password && <div style={{ fontSize:"0.72rem", color:"#e53e3e", marginTop:4 }}>⚠ {errors.password}</div>}
                    </div>

                    {/* Confirm Password (Register only) */}
                    {mode === "register" && (
                      <div style={{ marginBottom:6 }}>
                        <label style={{ display:"block", fontSize:"0.74rem", color:"#3a4a5c", fontWeight:600, letterSpacing:"0.04em", marginBottom:6 }}>
                          Confirm Password <span style={{ color:"#e53e3e" }}>*</span>
                        </label>
                        <div style={{ position:"relative" }}>
                          <input
                            type={showConfirmPw ? "text" : "password"} value={confirmPw}
                            onChange={e => { setConfirmPw(e.target.value); if (errors.confirmPw) setErrors(p=>({...p,confirmPw:""})); }}
                            placeholder="Re-enter your password"
                            style={{ ...inp("confirmPw"), paddingRight:42 }}
                            onFocus={() => setFocus("confirmPw")}
                            onBlur={() => setFocus("")}
                          />
                          <button type="button" onClick={() => setShowConfirmPw(p => !p)} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#7a90a8", display:"flex" }}>
                            <EyeIcon open={showConfirmPw} />
                          </button>
                        </div>
                        {errors.confirmPw && <div style={{ fontSize:"0.72rem", color:"#e53e3e", marginTop:4 }}>⚠ {errors.confirmPw}</div>}
                      </div>
                    )}

                    {/* Remember me */}
                    <div style={{ display:"flex", alignItems:"center", gap:9, marginTop:14, marginBottom:18, cursor:"pointer", userSelect:"none" }} onClick={() => setRemember(p => !p)}>
                      <div style={{ width:16, height:16, border:`1.5px solid ${remember?"#1a4480":"#b0bfcf"}`, borderRadius:2, background:remember?"#1a4480":"#fff", display:"grid", placeItems:"center", flexShrink:0, transition:"all .15s" }}>
                        {remember && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 5.5L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontSize:"0.79rem", color:"#5a6a80" }}>Keep me signed in on this device</span>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={status !== "idle"} style={{
                      width:"100%", padding:"12px", borderRadius:3, border:"none",
                      background: btnBg, color:"#fff",
                      fontFamily:"'Source Sans 3',sans-serif",
                      fontSize:"0.94rem", fontWeight:600,
                      cursor: status === "idle" ? "pointer" : "default",
                      letterSpacing:"0.05em",
                      transition:"background .3s, opacity .2s",
                      opacity: status === "loading" ? 0.88 : 1,
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    }}
                      onMouseEnter={e => { if (status==="idle") e.currentTarget.style.background="#0f2f6a"; }}
                      onMouseLeave={e => { if (status==="idle") e.currentTarget.style.background="#1a4480"; }}
                    >
                      {status === "loading" && (
                        <span style={{ width:15, height:15, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }} />
                      )}
                      {btnLabel}
                    </button>
                  </form>

                  {/* Demo hint toggle - Login mode only */}
                  {mode === "login" && (
                    <div style={{ marginTop:12 }}>
                      <button type="button" onClick={() => setHint(p => !p)} style={{ background:"none", border:"none", fontSize:"0.72rem", color:"#7a8a9a", cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:0 }}>
                        💡 {hint ? "Hide" : "Show"} demo credentials
                      </button>
                      {hint && (
                        <div style={{ marginTop:8, background:"#f8fafc", border:"1px solid #dde8f0", borderRadius:3, padding:"11px 13px", fontSize:"0.72rem", color:"#4a5a6a", lineHeight:1.9 }}>
                          {Object.entries(DEMO_USERS).map(([em, v]) => (
                            <div key={em} style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                              <span style={{ color:"#1a4480", fontWeight:600, minWidth:54 }}>{v.role}:</span>
                              <span>{em}</span>
                              <span style={{ color:"#8a9bb0" }}>/ {v.password}</span>
                            </div>
                          ))}
                          <div style={{ marginTop:6, color:"#8a9bb0", fontSize:"0.66rem" }}>Clicking a role tab auto-fills the credentials.</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, margin:"18px 0" }}>
                    <span style={{ flex:1, height:1, background:"#e8edf5" }} />
                    <span style={{ fontSize:"0.71rem", color:"#8a9bb0" }}>
                      {mode === "login" ? "New to CivicPulse?" : "Already have an account?"}
                    </span>
                    <span style={{ flex:1, height:1, background:"#e8edf5" }} />
                  </div>

                  <button type="button" onClick={toggleMode} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", padding:"11px", borderRadius:3, border:"1.5px solid #1a4480", color:"#1a4480", background:"transparent", fontFamily:"'Source Sans 3',sans-serif", fontSize:"0.87rem", fontWeight:600, cursor:"pointer", transition:"background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background="#eef3fa"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  >
                    {mode === "login" ? "Register as a New Citizen" : "Sign In to Your Account"}
                  </button>

                  {/* Info note - Login mode only */}
                  {mode === "login" && (
                    <div style={{ marginTop:14, background:"#f0f5ff", border:"1px solid #c8d8f0", borderRadius:3, padding:"9px 13px", fontSize:"0.72rem", color:"#3a5070", lineHeight:1.65 }}>
                      ℹ️ For grievance submission or tracking, sign in as <strong>Citizen</strong>. Admins must use official credentials.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer links */}
              <div style={{ display:"flex", justifyContent:"center", gap:18, marginTop:16, flexWrap:"wrap" }}>
                {["Help Center","Accessibility","Privacy Policy","Terms of Use","Contact Us"].map(l => (
                  <a key={l} href="#" style={{ fontSize:"0.69rem", color:"#5a7090", textDecoration:"none" }}
                    onMouseEnter={e => e.target.style.textDecoration="underline"}
                    onMouseLeave={e => e.target.style.textDecoration="none"}>{l}</a>
                ))}
              </div>
              <div style={{ textAlign:"center", marginTop:10, fontSize:"0.64rem", color:"#7a8a9a" }}>
                © {new Date().getFullYear()} CivicPulse — Ministry of Urban Development, Government of India. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
