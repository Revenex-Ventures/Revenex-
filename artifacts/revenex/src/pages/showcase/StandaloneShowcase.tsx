import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, ArrowRight, Check, Clock, MapPin, Bus, Bell, MessageCircle,
  CreditCard, ClipboardList, BookOpen, Award, Wallet, IdCard, Radar as RadarIcon,
  Mail, Send, ShieldCheck, Sparkles, Fingerprint, Github, Instagram, Linkedin,
  Smartphone, ChevronRight, Lock, Radio, GraduationCap
} from "lucide-react";

/* ============================================================
   TOKENS
   Espresso #18120E · Card #221A13 · Cream #F9F6F0
   Gold #D49A58 · Terracotta #A34E17
   Display: Fraunces · Body: Inter · Mono: JetBrains Mono
   ============================================================ */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

const NAV = {
  product: [
    { id: "attendance", label: "Attendance" },
    { id: "admissions", label: "Admissions" },
    { id: "homework", label: "Homework" },
    { id: "report-cards", label: "Report Cards" },
  ],
  solutions: [
    { id: "fee-management", label: "Fee Management" },
    { id: "student-portal", label: "Student Portal" },
    { id: "transport", label: "Transport" },
    { id: "communication", label: "Communication" },
  ],
};

const META = {
  "attendance": { eyebrow: "PRODUCT · 01", icon: Fingerprint, tag: "Attendance" },
  "admissions": { eyebrow: "PRODUCT · 02", icon: ClipboardList, tag: "Admissions" },
  "homework": { eyebrow: "PRODUCT · 03", icon: BookOpen, tag: "Homework" },
  "report-cards": { eyebrow: "PRODUCT · 04", icon: Award, tag: "Report Cards" },
  "fee-management": { eyebrow: "SOLUTIONS · 05", icon: Wallet, tag: "Fee Management" },
  "student-portal": { eyebrow: "SOLUTIONS · 06", icon: IdCard, tag: "Student Portal" },
  "transport": { eyebrow: "SOLUTIONS · 07", icon: Bus, tag: "Transport" },
  "communication": { eyebrow: "SOLUTIONS · 08", icon: MessageCircle, tag: "Communication" },
};

type ViewId = keyof typeof META;
type ReactNode = React.ReactNode;

/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="ev-eyebrow">
      {children}
      <style>{`
        .ev-eyebrow{
          font-family:'JetBrains Mono',monospace;
          font-size:11px; letter-spacing:.16em; font-weight:600;
          color:#D49A58; text-transform:uppercase;
          display:inline-flex; align-items:center; gap:8px;
        }
      `}</style>
    </div>
  );
}

function useCountUp(target: number, duration = 1400, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) scale3d(1.015,1.015,1.015)`,
      "--glare-x": `${(px + 0.5) * 100}%`,
      "--glare-y": `${(py + 0.5) * 100}%`,
    } as React.CSSProperties);
  }, [strength]);
  const onLeave = useCallback(() => {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)" });
  }, []);
  return { ref, style, onMove, onLeave };
}

function PageShell({ id, onBack, children }: { id: ViewId; onBack: () => void; children: ReactNode }) {
  const meta = META[id];
  const Icon = meta.icon;
  return (
    <div className="ev-shell" key={id}>
      <button className="ev-back" onClick={onBack}>
        <ArrowLeft size={15} strokeWidth={2.4} />
        <span>Back to Home</span>
      </button>

      <div className="ev-shell-head">
        <Eyebrow>
          <Icon size={13} strokeWidth={2.4} />
          {meta.eyebrow}
        </Eyebrow>
      </div>

      {children}

      <style>{`
        .ev-shell{
          animation: shellIn 640ms cubic-bezier(0.22,1,0.36,1) both;
          padding: 56px clamp(20px,5vw,64px) 80px;
          max-width: 1180px; margin: 0 auto;
        }
        @keyframes shellIn{
          from{ opacity:0; transform: translateY(20px) scale(0.98); }
          to{ opacity:1; transform: translateY(0) scale(1); }
        }
        .ev-back{
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; border:1px solid rgba(255,255,255,0.12);
          color:#C9BFB2; font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
          padding:8px 14px 8px 12px; border-radius:999px; cursor:pointer;
          transition: all 220ms cubic-bezier(0.22,1,0.36,1);
          margin-bottom: 36px;
        }
        .ev-back:hover{
          background: rgba(212,154,88,0.12); border-color: rgba(212,154,88,0.4); color:#F0DCC0;
          transform: translateX(-2px);
        }
        .ev-shell-head{ margin-bottom: 20px; }
        @media (prefers-reduced-motion: reduce){
          .ev-shell{ animation: none; }
        }
      `}</style>
    </div>
  );
}

function Hero({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h1 className="ev-hero-title">{title}</h1>
      <p className="ev-hero-sub">{sub}</p>
      <style>{`
        .ev-hero-title{
          font-family:'Fraunces', serif; font-weight:560; font-optical-sizing:auto;
          font-size: clamp(32px, 4.4vw, 52px); line-height:1.04; letter-spacing:-0.01em;
          color:#F9F6F0; margin: 10px 0 14px;
        }
        .ev-hero-sub{
          font-family:'Inter',sans-serif; font-size:16px; line-height:1.6;
          color:#B4A99A; max-width: 560px;
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   1. ATTENDANCE — radial gauge counting to 96.4%, radar pulse,
      click-to-check biometric scan zone
   ============================================================ */

function AttendancePage() {
  const [active, setActive] = useState(false);
  const [students, setStudents] = useState([
    { id: 1, name: "Aarav", present: false },
    { id: 2, name: "Diya", present: false },
    { id: 3, name: "Kabir", present: false },
    { id: 4, name: "Meera", present: false },
    { id: 5, name: "Ishaan", present: false },
    { id: 6, name: "Zara", present: false },
  ]);
  const [burst, setBurst] = useState<number | null>(null);

  useEffect(() => { const t = setTimeout(() => setActive(true), 120); return () => clearTimeout(t); }, []);
  const value = useCountUp(96.4, 1800, active);

  const r = 84, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  const markPresent = (id: number) => {
    setStudents((s) => s.map((st) => (st.id === id ? { ...st, present: true } : st)));
    setBurst(id);
    setTimeout(() => setBurst(null), 700);
  };

  const presentCount = students.filter((s) => s.present).length;

  return (
    <>
      <Hero title="Every child, accounted for." sub="Biometric or one-tap attendance, synced to parents in real time — no register, no guesswork." />
      <div className="att-grid">
        <div className="att-gauge-card">
          <div className="att-gauge-wrap">
            <svg viewBox="0 0 200 200" className="att-gauge-svg">
              <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="100" cy="100" r={r} fill="none" stroke="url(#gaugeGrad)"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={offset}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)" }}
              />
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D49A58" />
                  <stop offset="100%" stopColor="#A34E17" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r={r + 14} fill="none" stroke="#D49A58" strokeWidth="1" opacity="0.35" className="att-radar-ring" />
            </svg>
            <div className="att-gauge-center">
              <div className="att-gauge-num">{value.toFixed(1)}<span>%</span></div>
              <div className="att-gauge-label">Present today</div>
            </div>
          </div>
        </div>

        <div className="att-scan-card">
          <div className="att-scan-head">
            <Fingerprint size={16} color="#D49A58" strokeWidth={2} />
            <span>Biometric Scan Zone</span>
            <span className="att-scan-count">{presentCount}/{students.length} marked</span>
          </div>
          <div className="att-avatar-grid">
            {students.map((s) => (
              <button key={s.id} className={`att-avatar ${s.present ? "is-present" : ""}`} onClick={() => !s.present && markPresent(s.id)}>
                <div className="att-avatar-circle">
                  {s.present ? <Check size={18} strokeWidth={3} /> : <span>{s.name[0]}</span>}
                  {burst === s.id && Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="att-particle" style={{ "--i": i } as React.CSSProperties} />
                  ))}
                </div>
                <span className="att-avatar-name">{s.name}</span>
              </button>
            ))}
          </div>
          <p className="att-scan-hint">Tap a student to simulate a scan.</p>
        </div>
      </div>

      <style>{`
        .att-grid{ display:grid; grid-template-columns: minmax(0,0.85fr) minmax(0,1.15fr); gap:20px; }
        @media (max-width: 760px){ .att-grid{ grid-template-columns: 1fr; } }
        .att-gauge-card, .att-scan-card{
          background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:28px;
        }
        .att-gauge-wrap{ position:relative; width: 220px; height:220px; margin: 10px auto; }
        .att-gauge-svg{ width:100%; height:100%; }
        .att-radar-ring{ animation: radarPulse 2.4s ease-out infinite; transform-origin: 100px 100px; }
        @keyframes radarPulse{
          0%{ opacity:0.5; r:98px; } 100%{ opacity:0; r:130px; }
        }
        .att-gauge-center{
          position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
        }
        .att-gauge-num{ font-family:'Fraunces',serif; font-weight:600; font-size:38px; color:#F9F6F0; }
        .att-gauge-num span{ font-size:20px; color:#D49A58; }
        .att-gauge-label{ font-family:'Inter',sans-serif; font-size:12px; color:#9C8F80; margin-top:4px; }
        .att-scan-head{
          display:flex; align-items:center; gap:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; color:#F0EAE0; margin-bottom: 18px;
        }
        .att-scan-count{ margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:11px; color:#D49A58; }
        .att-avatar-grid{ display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; }
        .att-avatar{ background:transparent; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:8px; padding:6px; }
        .att-avatar-circle{
          position:relative; width:52px; height:52px; border-radius:50%;
          background: rgba(212,154,88,0.08); border:1.5px solid rgba(212,154,88,0.35);
          display:flex; align-items:center; justify-content:center;
          font-family:'Fraunces',serif; font-size:18px; color:#D49A58;
          transition: all 260ms cubic-bezier(0.22,1,0.36,1);
        }
        .att-avatar:hover .att-avatar-circle{ transform: scale(1.08); border-color:#D49A58; }
        .att-avatar.is-present .att-avatar-circle{
          background: linear-gradient(135deg,#3F7A54,#2E5D40); border-color:#68C48A; color:#fff;
        }
        .att-avatar-name{ font-family:'Inter',sans-serif; font-size:11px; color:#9C8F80; }
        .att-scan-hint{ font-family:'Inter',sans-serif; font-size:12px; color:#7A6E60; margin-top:18px; }
        .att-particle{
          position:absolute; width:5px; height:5px; border-radius:50%; background:#8FE3AC;
          left:50%; top:50%; animation: particleOut 700ms ease-out forwards;
          transform: rotate(calc(var(--i) * 60deg)) translateY(0);
        }
        @keyframes particleOut{
          0%{ opacity:1; transform: rotate(calc(var(--i) * 60deg)) translateY(0) scale(1); }
          100%{ opacity:0; transform: rotate(calc(var(--i) * 60deg)) translateY(-30px) scale(0.4); }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   2. ADMISSIONS — kanban pipeline with staggered entry,
      hover preview drawer
   ============================================================ */

function AdmissionsPage() {
  const columns = [
    { id: "inquiry", label: "Inquiry", items: [{ n: "Rhea Sharma", d: "2 docs" }, { n: "Vivaan Rao", d: "1 doc" }] },
    { id: "verify", label: "Document Verification", items: [{ n: "Ananya Iyer", d: "4/4 verified" }] },
    { id: "interview", label: "Interview", items: [{ n: "Kabir Mehta", d: "Slot: Thu 11AM" }] },
    { id: "enrolled", label: "Enrolled", items: [{ n: "Sara Khan", d: "Grade 4" }, { n: "Dev Patel", d: "Grade 2" }] },
  ];
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <>
      <Hero title="From inquiry to enrolled, in one pipeline." sub="Track every applicant through the funnel with document verification built in." />
      <div className="adm-board">
        {columns.map((col, ci) => (
          <div className="adm-col" key={col.id} style={{ transitionDelay: `${ci * 90}ms` }} data-mounted={mounted}>
            <div className="adm-col-head">
              <span>{col.label}</span>
              <span className="adm-col-count">{col.items.length}</span>
            </div>
            <div className="adm-col-body">
              {col.items.map((it, ii) => (
                <div
                  key={it.n}
                  className="adm-card"
                  style={{ transitionDelay: `${ci * 90 + ii * 80 + 120}ms` }}
                  data-mounted={mounted}
                  onMouseEnter={() => setHovered(`${col.id}-${ii}`)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="adm-card-name">{it.n}</div>
                  <div className="adm-card-meta">{it.d}</div>
                  <div className={`adm-drawer ${hovered === `${col.id}-${ii}` ? "is-open" : ""}`}>
                    <div className="adm-badge"><ShieldCheck size={11} /> ID proof</div>
                    <div className="adm-badge"><ShieldCheck size={11} /> Birth cert.</div>
                    <div className="adm-badge alt"><ShieldCheck size={11} /> Transfer cert.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .adm-board{ display:grid; grid-template-columns: repeat(4,1fr); gap:14px; }
        @media (max-width: 900px){ .adm-board{ grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px){ .adm-board{ grid-template-columns: 1fr; } }
        .adm-col{
          background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:18px; padding:14px;
          opacity:0; transform: translateY(16px); transition: all 520ms cubic-bezier(0.22,1,0.36,1);
        }
        .adm-col[data-mounted="true"]{ opacity:1; transform:translateY(0); }
        .adm-col-head{
          display:flex; justify-content:space-between; align-items:center;
          font-family:'Inter',sans-serif; font-size:12px; font-weight:600; color:#C9BFB2;
          text-transform:uppercase; letter-spacing:.04em; margin-bottom:12px; padding: 0 4px;
        }
        .adm-col-count{ background:rgba(212,154,88,0.15); color:#D49A58; border-radius:999px; padding:1px 8px; font-family:'JetBrains Mono',monospace; }
        .adm-col-body{ display:flex; flex-direction:column; gap:10px; }
        .adm-card{
          position:relative; background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 14px;
          opacity:0; transform: translateY(14px) scale(0.97); transition: all 480ms cubic-bezier(0.22,1,0.36,1);
          cursor:pointer;
        }
        .adm-card[data-mounted="true"]{ opacity:1; transform: translateY(0) scale(1); }
        .adm-card:hover{ border-color: rgba(212,154,88,0.4); transform: translateY(-2px); }
        .adm-card-name{ font-family:'Inter',sans-serif; font-size:13.5px; font-weight:600; color:#F0EAE0; }
        .adm-card-meta{ font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#9C8F80; margin-top:3px; }
        .adm-drawer{
          max-height:0; overflow:hidden; opacity:0; display:flex; flex-direction:column; gap:5px;
          transition: all 300ms cubic-bezier(0.22,1,0.36,1);
        }
        .adm-drawer.is-open{ max-height: 140px; opacity:1; margin-top:10px; }
        .adm-badge{
          display:inline-flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:10px;
          color:#8FE3AC; background: rgba(143,227,172,0.08); border:1px solid rgba(143,227,172,0.25);
          border-radius:6px; padding:3px 7px; width:fit-content;
        }
        .adm-badge.alt{ color:#D49A58; background:rgba(212,154,88,0.08); border-color:rgba(212,154,88,0.25); }
      `}</style>
    </>
  );
}

/* ============================================================
   3. HOMEWORK — 3D tilt glass cards, confetti submit,
      deadline filter dial
   ============================================================ */

function TiltCard({ children }: { children: ReactNode }) {
  const { ref, style, onMove, onLeave } = useTilt(8);
  return (
    <div ref={ref} className="hw-tilt" style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="hw-glare" style={{ background: `radial-gradient(circle at var(--glare-x,50%) var(--glare-y,50%), rgba(212,154,88,0.18), transparent 60%)` }} />
      {children}
      <style>{`
        .hw-tilt{
          position:relative; background: rgba(255,255,255,0.045); backdrop-filter: blur(10px);
          border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:20px;
          transition: transform 200ms cubic-bezier(0.22,1,0.36,1);
          transform-style: preserve-3d; overflow:hidden;
        }
        .hw-glare{ position:absolute; inset:0; pointer-events:none; transition: background 120ms; }
      `}</style>
    </div>
  );
}

function HomeworkPage() {
  const [filter, setFilter] = useState("Today");
  const [burstKey, setBurstKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const tasks = [
    { t: "Fractions worksheet — Ch. 4", subj: "Math", due: "Today" },
    { t: "Photosynthesis diagram label", subj: "Science", due: "This Week" },
    { t: "Essay: My Summer", subj: "English", due: "Overdue" },
    { t: "Map of India — states", subj: "Geography", due: "This Week" },
  ];
  const visible = tasks.filter((t) => t.due === filter);

  const submit = () => {
    setSubmitted(true);
    setBurstKey((k) => k + 1);
    setTimeout(() => setSubmitted(false), 1600);
  };

  return (
    <>
      <Hero title="Homework that hands itself in." sub="Glassy task cards, one-tap submission, and a deadline dial that keeps kids on schedule." />

      <div className="hw-dial">
        {["Today", "This Week", "Overdue"].map((f) => (
          <button key={f} className={`hw-dial-btn ${filter === f ? "is-active" : ""}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="hw-grid">
        {visible.map((task) => (
          <TiltCard key={task.t}>
            <div className="hw-subj">{task.subj}</div>
            <div className="hw-task-title">{task.t}</div>
            <div className="hw-task-foot">
              <span className={`hw-due hw-due-${task.due.replace(/\s/g, "")}`}><Clock size={11} /> {task.due}</span>
            </div>
          </TiltCard>
        ))}
        {visible.length === 0 && <p className="hw-empty">Nothing here — clear schedule.</p>}
      </div>

      <div className="hw-submit-row">
        <button className="hw-submit-btn" onClick={submit}>
          <Send size={14} /> {submitted ? "Submitted!" : "Submit Homework"}
        </button>
        <div key={burstKey} className="hw-confetti-zone">
          {submitted && Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="hw-confetti" style={{ "--i": i, "--hue": i * 24 } as React.CSSProperties} />
          ))}
        </div>
      </div>

      <style>{`
        .hw-dial{ display:inline-flex; gap:4px; background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:999px; padding:4px; margin-bottom:26px; }
        .hw-dial-btn{
          font-family:'Inter',sans-serif; font-size:12.5px; font-weight:600; color:#9C8F80;
          background:transparent; border:none; border-radius:999px; padding:7px 16px; cursor:pointer;
          transition: all 260ms cubic-bezier(0.22,1,0.36,1);
        }
        .hw-dial-btn.is-active{ background: linear-gradient(135deg,#D49A58,#A34E17); color:#18120E; }
        .hw-grid{ display:grid; grid-template-columns: repeat(3,1fr); gap:16px; min-height:130px; }
        @media (max-width:820px){ .hw-grid{ grid-template-columns: 1fr 1fr; } }
        @media (max-width:560px){ .hw-grid{ grid-template-columns: 1fr; } }
        .hw-empty{ font-family:'Inter',sans-serif; color:#7A6E60; font-size:13px; }
        .hw-subj{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:#D49A58; }
        .hw-task-title{ font-family:'Fraunces',serif; font-size:17px; color:#F9F6F0; margin: 8px 0 14px; line-height:1.3; }
        .hw-due{ display:inline-flex; align-items:center; gap:5px; font-family:'Inter',sans-serif; font-size:11.5px; padding:4px 9px; border-radius:999px; }
        .hw-due-Today{ background:rgba(212,154,88,0.14); color:#D49A58; }
        .hw-due-ThisWeek{ background:rgba(255,255,255,0.08); color:#C9BFB2; }
        .hw-due-Overdue{ background:rgba(220,90,80,0.14); color:#E88075; }
        .hw-submit-row{ margin-top:34px; position:relative; display:flex; }
        .hw-submit-btn{
          display:inline-flex; align-items:center; gap:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:13.5px;
          background: linear-gradient(135deg,#D49A58,#A34E17); color:#18120E; border:none; border-radius:12px;
          padding:12px 22px; cursor:pointer; transition: transform 200ms cubic-bezier(0.22,1,0.36,1);
        }
        .hw-submit-btn:hover{ transform: translateY(-2px); }
        .hw-confetti-zone{ position:absolute; left:50px; top:0; width:4px; height:4px; }
        .hw-confetti{
          position:absolute; width:6px; height:10px; background: hsl(var(--hue),70%,62%);
          left:0; top:0; animation: confettiFly 900ms cubic-bezier(0.22,1,0.36,1) forwards;
          animation-delay: calc(var(--i) * 12ms);
        }
        @keyframes confettiFly{
          0%{ opacity:1; transform: translate(0,0) rotate(0deg); }
          100%{ opacity:0; transform: translate(calc((var(--i) - 8) * 14px), -70px) rotate(340deg); }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   4. REPORT CARDS — animated SVG radar chart draw,
      3D flip card
   ============================================================ */

function ReportCardsPage() {
  const [drawn, setDrawn] = useState(false);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 200); return () => clearTimeout(t); }, []);

  const axes = ["Math", "Science", "English", "Art", "Sports"];
  const scores = [0.9, 0.72, 0.85, 0.6, 0.78]; // 0..1
  const cx = 110, cy = 110, R = 82;
  const pt = (i: number, r: number) => {
    const ang = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  };
  const dataPts = scores.map((s, i) => pt(i, R * s));
  const path = "M" + dataPts.map((p) => p.join(",")).join(" L") + " Z";

  return (
    <>
      <Hero title="Performance, plotted honestly." sub="A living radar of every subject, and a report card that flips to reveal the remark." />
      <div className="rc-grid">
        <div className="rc-radar-card">
          <svg viewBox="0 0 220 220" className="rc-radar-svg">
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <polygon
                key={f}
                points={axes.map((_, i) => pt(i, R * f).join(",")).join(" ")}
                fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
              />
            ))}
            {axes.map((a, i) => {
              const [x, y] = pt(i, R + 18);
              const [lx, ly] = pt(i, R);
              return (
                <g key={a}>
                  <line x1={cx} y1={cy} x2={lx} y2={ly} stroke="rgba(255,255,255,0.06)" />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="rc-axis-label">{a}</text>
                </g>
              );
            })}
            <path
              d={path} fill="rgba(212,154,88,0.22)" stroke="#D49A58" strokeWidth="2" strokeLinejoin="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: drawn ? 0 : 1,
                transition: "stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1), opacity 1.5s",
                opacity: drawn ? 1 : 0,
              }}
            />
            {dataPts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#F9F6F0"
                style={{ opacity: drawn ? 1 : 0, transition: `opacity 400ms ${300 + i * 120}ms` }} />
            ))}
          </svg>
        </div>

        <div className="rc-flip-zone">
          <div className={`rc-flip-card ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped((f) => !f)}>
            <div className="rc-face rc-front">
              <GraduationCap size={22} color="#D49A58" />
              <div className="rc-front-title">Term Report</div>
              <div className="rc-front-sub">Sara Khan · Grade 4</div>
              <div className="rc-flip-hint">Click to flip</div>
            </div>
            <div className="rc-face rc-back">
              <div className="rc-back-head">Teacher Remarks</div>
              <p className="rc-remark">"Consistent, curious, and always the first to help a classmate. Keep pushing in Art."</p>
              <div className="rc-stamp">APPROVED</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .rc-grid{ display:grid; grid-template-columns: 1.1fr 0.9fr; gap:24px; align-items:center; }
        @media (max-width:760px){ .rc-grid{ grid-template-columns: 1fr; } }
        .rc-radar-card{ background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:20px; }
        .rc-radar-svg{ width:100%; height:auto; }
        .rc-axis-label{ font-family:'Inter',sans-serif; font-size:9.5px; fill:#9C8F80; }
        .rc-flip-zone{ perspective: 1200px; display:flex; justify-content:center; }
        .rc-flip-card{
          position:relative; width: 220px; height:280px; cursor:pointer;
          transform-style: preserve-3d; transition: transform 700ms cubic-bezier(0.22,1,0.36,1);
        }
        .rc-flip-card.is-flipped{ transform: rotateY(180deg); }
        .rc-face{
          position:absolute; inset:0; backface-visibility:hidden; border-radius:20px;
          border:1px solid rgba(255,255,255,0.1); padding:22px; display:flex; flex-direction:column;
        }
        .rc-front{ background: linear-gradient(160deg,#241A13,#18120E); align-items:flex-start; justify-content: space-between; }
        .rc-front-title{ font-family:'Fraunces',serif; font-size:20px; color:#F9F6F0; margin-top:14px; }
        .rc-front-sub{ font-family:'Inter',sans-serif; font-size:12px; color:#9C8F80; margin-top:4px; }
        .rc-flip-hint{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#D49A58; }
        .rc-back{ background: linear-gradient(160deg,#3A2A19,#241A13); transform: rotateY(180deg); justify-content:space-between; }
        .rc-back-head{ font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.08em; color:#D49A58; text-transform:uppercase; }
        .rc-remark{ font-family:'Fraunces',serif; font-style:italic; font-size:14.5px; color:#F0EAE0; line-height:1.5; }
        .rc-stamp{
          align-self:flex-end; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; color:#8FE3AC;
          border:2px solid #8FE3AC; padding:4px 10px; border-radius:6px; transform: rotate(-8deg); opacity:0.85;
        }
      `}</style>
    </>
  );
}

/* ============================================================
   5. FEE MANAGEMENT — odometer counting, installment slider
   ============================================================ */

function Odometer({ value }: { value: number }) {
  const digits = Math.round(value).toString().padStart(6, "0").split("");
  return (
    <div className="fee-odo">
      {digits.map((d, i) => (
        <div key={i} className="fee-odo-digit">
          <div className="fee-odo-track" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {Array.from({ length: 10 }).map((_, n) => <span key={n}>{n}</span>)}
          </div>
        </div>
      ))}
      <style>{`
        .fee-odo{ display:flex; gap:3px; }
        .fee-odo-digit{
          width: 30px; height: 44px; overflow:hidden; background:#18120E; border-radius:6px;
          border:1px solid rgba(255,255,255,0.1); position:relative;
        }
        .fee-odo-track{ display:flex; flex-direction:column; transition: transform 1.4s cubic-bezier(0.22,1,0.36,1); }
        .fee-odo-track span{
          height:44px; display:flex; align-items:center; justify-content:center;
          font-family:'JetBrains Mono',monospace; font-weight:700; font-size:22px; color:#F9F6F0;
        }
      `}</style>
    </div>
  );
}

function FeeManagementPage() {
  const [active, setActive] = useState(false);
  useEffect(() => { const t = setTimeout(() => setActive(true), 150); return () => clearTimeout(t); }, []);
  const total = useCountUp(45000, 1600, active);
  const [split, setSplit] = useState(3);

  const perInstallment = Math.round(45000 / split);

  return (
    <>
      <Hero title="Fees, without the follow-up calls." sub="Watch the annual total roll in, then model an installment plan live for any family." />
      <div className="fee-grid">
        <div className="fee-odo-card">
          <div className="fee-odo-label">Annual Tuition</div>
          <Odometer value={total} />
          <div className="fee-odo-currency">₹ · INR</div>
        </div>

        <div className="fee-slider-card">
          <div className="fee-slider-head">
            <CreditCard size={15} color="#D49A58" />
            <span>Installment Split</span>
          </div>
          <div className="fee-slider-row">
            <input
              type="range" min="1" max="12" value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              className="fee-slider"
            />
            <span className="fee-slider-value">{split}×</span>
          </div>

          <div className="fee-receipt">
            <div className="fee-receipt-row"><span>Total fee</span><span>₹45,000</span></div>
            <div className="fee-receipt-row"><span>Installments</span><span>{split}</span></div>
            <div className="fee-receipt-divider" />
            <div className="fee-receipt-row fee-receipt-total"><span>Per installment</span><span>₹{perInstallment.toLocaleString("en-IN")}</span></div>
          </div>
        </div>
      </div>

      <style>{`
        .fee-grid{ display:grid; grid-template-columns: 0.9fr 1.1fr; gap:20px; }
        @media (max-width:760px){ .fee-grid{ grid-template-columns: 1fr; } }
        .fee-odo-card, .fee-slider-card{ background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:26px; }
        .fee-odo-card{ display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:14px; }
        .fee-odo-label{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:#9C8F80; }
        .fee-odo-currency{ font-family:'Inter',sans-serif; font-size:11px; color:#7A6E60; }
        .fee-slider-head{ display:flex; align-items:center; gap:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; color:#F0EAE0; margin-bottom:20px; }
        .fee-slider-row{ display:flex; align-items:center; gap:14px; margin-bottom: 22px; }
        .fee-slider{ flex:1; -webkit-appearance:none; height:4px; border-radius:999px; background: rgba(255,255,255,0.12); }
        .fee-slider::-webkit-slider-thumb{
          -webkit-appearance:none; width:18px; height:18px; border-radius:50%;
          background: linear-gradient(135deg,#D49A58,#A34E17); cursor:pointer;
          box-shadow: 0 0 0 4px rgba(212,154,88,0.18);
        }
        .fee-slider-value{ font-family:'JetBrains Mono',monospace; color:#D49A58; font-weight:700; font-size:15px; width:32px; }
        .fee-receipt{ background:#18120E; border:1px dashed rgba(255,255,255,0.14); border-radius:14px; padding:16px; }
        .fee-receipt-row{ display:flex; justify-content:space-between; font-family:'Inter',sans-serif; font-size:13px; color:#C9BFB2; padding:5px 0; }
        .fee-receipt-divider{ height:1px; background: rgba(255,255,255,0.1); margin: 6px 0; }
        .fee-receipt-total{ font-weight:700; color:#F9F6F0; font-size:15px; }
        .fee-receipt-total span:last-child{ color:#D49A58; font-family:'JetBrains Mono',monospace; }
      `}</style>
    </>
  );
}

/* ============================================================
   6. STUDENT PORTAL — parallax 3D ID card, bento schedule
   ============================================================ */

function StudentPortalPage() {
  const { ref, style, onMove, onLeave } = useTilt(14);
  const nextClassMin = 12;

  return (
    <>
      <Hero title="One card. Their whole school life." sub="A holographic ID that reacts to touch, and a locker that's always one tap away." />
      <div className="sp-grid">
        <div className="sp-id-zone">
          <div ref={ref} className="sp-id-card" style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
            <div className="sp-id-sheen" style={{ background: `radial-gradient(circle at var(--glare-x,50%) var(--glare-y,50%), rgba(255,255,255,0.35), transparent 55%)` }} />
            <div className="sp-id-top">
              <GraduationCap size={18} color="#18120E" />
              <span>REVENEX ID</span>
            </div>
            <div className="sp-id-avatar">SK</div>
            <div className="sp-id-name">Sara Khan</div>
            <div className="sp-id-meta">Grade 4 · Roll No. 14</div>
            <div className="sp-id-barcode" />
          </div>
        </div>

        <div className="sp-bento">
          <div className="sp-bento-card sp-bento-wide">
            <div className="sp-bento-label"><Clock size={12} /> Next Class</div>
            <div className="sp-bento-big">Science <span className="sp-bento-badge">in {nextClassMin} min</span></div>
            <div className="sp-bento-sub">Room 204 · Ms. Verma</div>
          </div>
          <div className="sp-bento-card">
            <div className="sp-bento-label">Today</div>
            <div className="sp-bento-list">
              <div>9:00 Math</div>
              <div>10:00 Science</div>
              <div>11:15 Art</div>
            </div>
          </div>
          <div className="sp-bento-card">
            <div className="sp-bento-label">Digital Locker</div>
            <div className="sp-bento-locker">
              <div className="sp-locker-item">Homework</div>
              <div className="sp-locker-item">Report Card</div>
              <div className="sp-locker-item">Timetable</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sp-grid{ display:grid; grid-template-columns: 0.75fr 1.25fr; gap:24px; align-items:start; }
        @media (max-width:760px){ .sp-grid{ grid-template-columns: 1fr; } }
        .sp-id-zone{ perspective: 1000px; display:flex; justify-content:center; }
        .sp-id-card{
          position:relative; width: 250px; height: 320px; border-radius:22px;
          background: linear-gradient(160deg,#F9F6F0,#E8DCC8);
          padding: 22px; overflow:hidden; transition: transform 150ms cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .sp-id-sheen{ position:absolute; inset:0; pointer-events:none; mix-blend-mode: overlay; }
        .sp-id-top{ display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; color:#18120E; font-weight:700; }
        .sp-id-avatar{
          width:64px; height:64px; border-radius:50%; margin: 24px 0 14px;
          background: linear-gradient(135deg,#D49A58,#A34E17); color:#18120E; font-family:'Fraunces',serif; font-weight:700; font-size:22px;
          display:flex; align-items:center; justify-content:center;
        }
        .sp-id-name{ font-family:'Fraunces',serif; font-size:19px; color:#18120E; }
        .sp-id-meta{ font-family:'Inter',sans-serif; font-size:11px; color:#5A4E3E; margin-top:2px; }
        .sp-id-barcode{
          position:absolute; bottom:18px; left:22px; right:22px; height:24px;
          background: repeating-linear-gradient(90deg,#18120E 0 2px, transparent 2px 5px);
          opacity:0.7;
        }
        .sp-bento{ display:grid; grid-template-columns: 1fr 1fr; gap:14px; }
        .sp-bento-wide{ grid-column: 1 / -1; }
        .sp-bento-card{ background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:18px; }
        .sp-bento-label{ display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.06em; text-transform:uppercase; color:#9C8F80; margin-bottom:10px; }
        .sp-bento-big{ font-family:'Fraunces',serif; font-size:22px; color:#F9F6F0; display:flex; align-items:center; gap:10px; }
        .sp-bento-badge{
          font-family:'JetBrains Mono',monospace; font-size:11px; background: rgba(212,154,88,0.16); color:#D49A58;
          padding:3px 9px; border-radius:999px; animation: badgeGlow 1.8s ease-in-out infinite;
        }
        @keyframes badgeGlow{ 0%,100%{ box-shadow: 0 0 0 0 rgba(212,154,88,0.3);} 50%{ box-shadow: 0 0 0 6px rgba(212,154,88,0);} }
        .sp-bento-sub{ font-family:'Inter',sans-serif; font-size:12px; color:#9C8F80; margin-top:6px; }
        .sp-bento-list{ display:flex; flex-direction:column; gap:8px; font-family:'Inter',sans-serif; font-size:13px; color:#C9BFB2; }
        .sp-bento-locker{ display:flex; flex-direction:column; gap:8px; }
        .sp-locker-item{
          font-family:'Inter',sans-serif; font-size:12.5px; color:#F0EAE0; background: rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:8px 10px; cursor:pointer; transition: all 200ms;
        }
        .sp-locker-item:hover{ border-color: rgba(212,154,88,0.4); background: rgba(212,154,88,0.06); }
      `}</style>
    </>
  );
}

/* ============================================================
   7. TRANSPORT — GPS map, bus moving along route (SMIL),
      geofence ripple toggle
   ============================================================ */

function TransportPage() {
  const [geofence, setGeofence] = useState(true);
  const routeD = "M 20,180 C 60,60 140,220 190,90 S 320,20 380,110";

  return (
    <>
      <Hero title="Know exactly where the bus is." sub="Live route tracking with geofenced safety alerts at every stop." />
      <div className="tr-grid">
        <div className="tr-map-card">
          <svg viewBox="0 0 400 220" className="tr-map-svg">
            <rect width="400" height="220" fill="#100C08" />
            {Array.from({ length: 9 }).map((_, i) => <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="220" stroke="rgba(255,255,255,0.035)" />)}
            {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 44} x2="400" y2={i * 44} stroke="rgba(255,255,255,0.035)" />)}

            <path d={routeD} fill="none" stroke="rgba(212,154,88,0.25)" strokeWidth="4" />
            <path d={routeD} fill="none" stroke="#D49A58" strokeWidth="2" strokeDasharray="6 6">
              <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite" />
            </path>

            {geofence && [[190, 90], [380, 110]].map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r="6" fill="none" stroke="#8FE3AC" strokeWidth="1.5" className="tr-ripple" style={{ animationDelay: `${i * 0.6}s` }} />
            ))}
            {[[20, 180], [190, 90], [380, 110]].map((p, i) => (
              <circle key={`stop${i}`} cx={p[0]} cy={p[1]} r="4" fill="#F9F6F0" />
            ))}

            <g>
              <circle r="9" fill="#D49A58">
                <animateMotion dur="6s" repeatCount="indefinite" path={routeD} rotate="auto" />
              </circle>
              <g>
                <animateMotion dur="6s" repeatCount="indefinite" path={routeD} rotate="auto" />
                <Bus />
              </g>
            </g>
          </svg>
          <div className="tr-map-legend">
            <span><span className="tr-dot gold" /> Bus 07</span>
            <span><span className="tr-dot cream" /> Stop</span>
          </div>
        </div>

        <div className="tr-side-card">
          <div className="tr-side-head">
            <RadarIcon size={15} color="#D49A58" />
            <span>Geofence Alerts</span>
          </div>
          <p className="tr-side-copy">Ripple pulses when the bus enters a designated safety zone near a stop.</p>
          <button className={`tr-toggle ${geofence ? "is-on" : ""}`} onClick={() => setGeofence((g) => !g)}>
            <span className="tr-toggle-knob" />
          </button>
          <div className="tr-side-status">{geofence ? "Alerts active" : "Alerts paused"}</div>

          <div className="tr-eta">
            <MapPin size={13} color="#D49A58" />
            <div>
              <div className="tr-eta-label">Next stop</div>
              <div className="tr-eta-value">Shivaji Nagar · 4 min</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tr-grid{ display:grid; grid-template-columns: 1.4fr 0.9fr; gap:20px; }
        @media (max-width:800px){ .tr-grid{ grid-template-columns: 1fr; } }
        .tr-map-card{ background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:14px; }
        .tr-map-svg{ width:100%; height:auto; border-radius:14px; }
        .tr-ripple{ animation: ripple 1.8s ease-out infinite; transform-origin: center; }
        @keyframes ripple{ 0%{ r:5; opacity:0.9; } 100%{ r:20; opacity:0; } }
        .tr-map-legend{ display:flex; gap:16px; margin-top:10px; padding: 0 6px; font-family:'Inter',sans-serif; font-size:11.5px; color:#9C8F80; }
        .tr-dot{ display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:5px; }
        .tr-dot.gold{ background:#D49A58; } .tr-dot.cream{ background:#F9F6F0; }
        .tr-side-card{ background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:22px; }
        .tr-side-head{ display:flex; align-items:center; gap:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; color:#F0EAE0; margin-bottom:10px; }
        .tr-side-copy{ font-family:'Inter',sans-serif; font-size:12.5px; color:#9C8F80; line-height:1.5; margin-bottom:18px; }
        .tr-toggle{
          width:46px; height:26px; border-radius:999px; background: rgba(255,255,255,0.1); border:none; cursor:pointer;
          position:relative; transition: background 260ms;
        }
        .tr-toggle.is-on{ background: linear-gradient(135deg,#D49A58,#A34E17); }
        .tr-toggle-knob{
          position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#F9F6F0;
          transition: transform 260ms cubic-bezier(0.22,1,0.36,1);
        }
        .tr-toggle.is-on .tr-toggle-knob{ transform: translateX(20px); }
        .tr-side-status{ font-family:'JetBrains Mono',monospace; font-size:11px; color:#D49A58; margin-top:8px; }
        .tr-eta{ display:flex; gap:10px; align-items:center; margin-top:24px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.08); }
        .tr-eta-label{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#7A6E60; text-transform:uppercase; }
        .tr-eta-value{ font-family:'Inter',sans-serif; font-size:13px; color:#F0EAE0; font-weight:600; }
      `}</style>
    </>
  );
}

/* ============================================================
   8. COMMUNICATION — bubbles pop in, multi-channel preview
   ============================================================ */

function CommunicationPage() {
  const [channel, setChannel] = useState("WhatsApp");
  const messages = [
    "PTA meeting moved to Friday, 4 PM.",
    "Sara's bus arrived safely at school.",
    "Fee reminder: due in 3 days.",
  ];
  const [key, setKey] = useState(0);
  useEffect(() => { setKey((k) => k + 1); }, [channel]);

  return (
    <>
      <Hero title="One message, every channel." sub="Broadcast to parents on WhatsApp, SMS, or push — preview exactly how it lands." />
      <div className="cm-grid">
        <div className="cm-bubbles-card">
          {messages.map((m, i) => (
            <div key={m} className="cm-bubble" style={{ animationDelay: `${i * 180}ms` }}>
              <Bell size={12} color="#D49A58" />
              <span>{m}</span>
            </div>
          ))}
        </div>

        <div className="cm-phone-zone">
          <div className="cm-channel-switch">
            {["WhatsApp", "SMS", "Push"].map((c) => (
              <button key={c} className={`cm-channel-btn ${channel === c ? "is-active" : ""}`} onClick={() => setChannel(c)}>
                {c === "WhatsApp" && <MessageCircle size={13} />}
                {c === "SMS" && <Smartphone size={13} />}
                {c === "Push" && <Bell size={13} />}
                {c}
              </button>
            ))}
          </div>

          <div key={key} className={`cm-phone-frame cm-frame-${channel}`}>
            {channel === "WhatsApp" && (
              <div className="cm-wa">
                <div className="cm-wa-head"><span className="cm-wa-avatar">RV</span> Revenex School</div>
                <div className="cm-wa-bubble">PTA meeting moved to Friday, 4 PM. See you there! 🎒</div>
                <div className="cm-wa-time">10:42 AM · Read</div>
              </div>
            )}
            {channel === "SMS" && (
              <div className="cm-sms">
                <div className="cm-sms-sender">REVENEX</div>
                <div className="cm-sms-bubble">Fee reminder: Rs 15,000 due in 3 days. Pay via app to avoid late fee.</div>
              </div>
            )}
            {channel === "Push" && (
              <div className="cm-push">
                <div className="cm-push-card">
                  <div className="cm-push-icon"><GraduationCap size={14} color="#18120E" /></div>
                  <div>
                    <div className="cm-push-title">Revenex School</div>
                    <div className="cm-push-body">Sara's bus arrived safely at school.</div>
                  </div>
                  <div className="cm-push-time">now</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .cm-grid{ display:grid; grid-template-columns: 1fr 0.85fr; gap:24px; align-items:start; }
        @media (max-width:800px){ .cm-grid{ grid-template-columns: 1fr; } }
        .cm-bubbles-card{ display:flex; flex-direction:column; gap:12px; }
        .cm-bubble{
          display:flex; align-items:center; gap:10px; background:#221A13; border:1px solid rgba(255,255,255,0.08);
          border-radius:16px; padding:14px 16px; font-family:'Inter',sans-serif; font-size:13.5px; color:#F0EAE0;
          animation: bubblePop 560ms cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes bubblePop{ 0%{ opacity:0; transform: translateY(14px) scale(0.9); } 100%{ opacity:1; transform: translateY(0) scale(1); } }
        .cm-channel-switch{ display:inline-flex; gap:4px; background:#221A13; border:1px solid rgba(255,255,255,0.08); border-radius:999px; padding:4px; margin-bottom:18px; }
        .cm-channel-btn{
          display:flex; align-items:center; gap:6px; font-family:'Inter',sans-serif; font-size:12px; font-weight:600; color:#9C8F80;
          background:transparent; border:none; border-radius:999px; padding:7px 13px; cursor:pointer; transition: all 220ms;
        }
        .cm-channel-btn.is-active{ background: linear-gradient(135deg,#D49A58,#A34E17); color:#18120E; }
        .cm-phone-frame{
          width: 260px; border-radius:26px; padding:16px; min-height:180px;
          animation: shellIn 420ms cubic-bezier(0.22,1,0.36,1) both;
          border: 6px solid #100C08;
        }
        .cm-frame-WhatsApp{ background: #0B141A; }
        .cm-frame-SMS{ background: #F2F2F5; }
        .cm-frame-Push{ background: #18120E; }
        .cm-wa-head{ display:flex; align-items:center; gap:8px; color:#E9EDEF; font-family:'Inter',sans-serif; font-size:13px; font-weight:600; margin-bottom:14px; }
        .cm-wa-avatar{ width:26px; height:26px; border-radius:50%; background:#25D366; color:#0B141A; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; }
        .cm-wa-bubble{ background:#005C4B; color:#E9EDEF; font-family:'Inter',sans-serif; font-size:12.5px; padding:10px 12px; border-radius:10px 10px 10px 2px; line-height:1.4; }
        .cm-wa-time{ font-family:'Inter',sans-serif; font-size:10px; color:#7A8A8F; margin-top:6px; text-align:right; }
        .cm-sms-sender{ font-family:'JetBrains Mono',monospace; font-size:10px; color:#666; margin-bottom:8px; }
        .cm-sms-bubble{ background:#fff; color:#1A1A1A; font-family:'Inter',sans-serif; font-size:12.5px; padding:10px 12px; border-radius:14px; box-shadow:0 1px 4px rgba(0,0,0,0.1); line-height:1.4; }
        .cm-push-card{ display:flex; gap:10px; align-items:flex-start; background:#F9F6F0; border-radius:14px; padding:12px; }
        .cm-push-icon{ width:26px; height:26px; border-radius:8px; background:#D49A58; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cm-push-title{ font-family:'Inter',sans-serif; font-size:12px; font-weight:700; color:#18120E; }
        .cm-push-body{ font-family:'Inter',sans-serif; font-size:11.5px; color:#5A4E3E; margin-top:2px; }
        .cm-push-time{ font-family:'Inter',sans-serif; font-size:10px; color:#9C8F80; margin-left:auto; }
      `}</style>
    </>
  );
}

const PAGES = {
  "attendance": AttendancePage,
  "admissions": AdmissionsPage,
  "homework": HomeworkPage,
  "report-cards": ReportCardsPage,
  "fee-management": FeeManagementPage,
  "student-portal": StudentPortalPage,
  "transport": TransportPage,
  "communication": CommunicationPage,
};

/* ============================================================
   FOOTER — magnetic hover pill + arrow reveal
   ============================================================ */

function FooterColumn({ title, links, hovered, setHovered, onNavigate }: {
  title: string
  links: { id: string; label: string }[]
  hovered: string | null
  setHovered: (id: string | null) => void
  onNavigate: (id: string) => void
}) {
  return (
    <div className="ft-col">
      <div className="ft-col-title">{title}</div>
      <div className="ft-links">
        {links.map((l) => (
          <button
            key={l.id}
            className="ft-link"
            onMouseEnter={() => setHovered(l.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onNavigate(l.id)}
          >
            <span className={`ft-pill ${hovered === l.id ? "is-hovered" : ""}`} />
            <span className="ft-link-label">{l.label}</span>
            <ArrowRight size={13} className={`ft-arrow ${hovered === l.id ? "is-visible" : ""}`} strokeWidth={2.4} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <footer className="ft-root">
      <div className="ft-inner">
        <div className="ft-brand">
          <div className="ft-logo">
            <div className="ft-logo-mark">R</div>
            <span>VENTURES PRIVATE LIMITED</span>
          </div>
          <p className="ft-tagline">India's modern School ERP platform built for educators.</p>
          <div className="ft-socials">
            <a href="#" className="ft-social" aria-label="LinkedIn"><Linkedin size={15} /></a>
            <a href="#" className="ft-social" aria-label="Github"><Github size={15} /></a>
            <a href="#" className="ft-social" aria-label="Instagram"><Instagram size={15} /></a>
            <a href="#" className="ft-social" aria-label="Email"><Mail size={15} /></a>
          </div>
        </div>

        <FooterColumn title="PRODUCT" links={NAV.product} hovered={hovered} setHovered={setHovered} onNavigate={onNavigate} />
        <FooterColumn title="SOLUTIONS" links={NAV.solutions} hovered={hovered} setHovered={setHovered} onNavigate={onNavigate} />

        <div className="ft-col">
          <div className="ft-col-title">COMPANY</div>
          <div className="ft-links">
            {["About Us", "Our Team", "Careers", "Contact"].map((c) => (
              <button key={c} className="ft-link ft-link-static"><span className="ft-link-label">{c}</span></button>
            ))}
          </div>
        </div>

        <div className="ft-col">
          <div className="ft-col-title">STAY UPDATED</div>
          <div className="ft-subscribe">
            <input placeholder="Enter school email" className="ft-input" />
            <button className="ft-join"><Send size={12} /> Join</button>
          </div>
          <div className="ft-contact-line"><Mail size={12} /> team@revenex.in</div>
          <div className="ft-contact-line"><Lock size={12} /> +91 90217 44355</div>
          <div className="ft-contact-line"><MapPin size={12} /> Pune &amp; Sangamner, Maharashtra</div>
        </div>
      </div>

      <style>{`
        .ft-root{ border-top:1px solid rgba(255,255,255,0.08); padding: 44px clamp(20px,5vw,64px) 40px; }
        .ft-inner{ max-width:1180px; margin:0 auto; display:grid; grid-template-columns: 1.3fr 0.85fr 0.85fr 0.85fr 1.1fr; gap: 24px; }
        @media (max-width: 900px){ .ft-inner{ grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px){ .ft-inner{ grid-template-columns: 1fr; } }
        .ft-logo{ display:flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.1em; color:#C9BFB2; font-weight:600; margin-bottom:12px; }
        .ft-logo-mark{ width:22px; height:22px; border-radius:6px; background: linear-gradient(135deg,#D49A58,#A34E17); display:flex; align-items:center; justify-content:center; color:#18120E; font-family:'Fraunces',serif; font-weight:800; font-size:12px; }
        .ft-tagline{ font-family:'Inter',sans-serif; font-size:13px; color:#8C8073; line-height:1.6; max-width:230px; margin-bottom:16px; }
        .ft-socials{ display:flex; gap:8px; }
        .ft-social{ width:32px; height:32px; border-radius:50%; border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; color:#C9BFB2; text-decoration:none; transition: all 220ms; }
        .ft-social:hover{ border-color:#D49A58; color:#D49A58; transform: translateY(-2px); }
        .ft-col-title{ font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.14em; color:#D49A58; font-weight:700; margin-bottom:16px; }
        .ft-links{ display:flex; flex-direction:column; gap:2px; }
        .ft-link{
          position:relative; display:flex; align-items:center; gap:6px; background:transparent; border:none; cursor:pointer;
          font-family:'Inter',sans-serif; font-size:14px; color:#C9BFB2; text-align:left; padding: 8px 10px; border-radius:10px;
          margin: 0 -10px; transition: color 220ms;
        }
        .ft-link:hover{ color:#F9F6F0; }
        .ft-link-static{ cursor:default; }
        .ft-link-static:hover{ color:#C9BFB2; }
        .ft-pill{
          position:absolute; inset:0; border-radius:10px; background: rgba(212,154,88,0.14);
          opacity:0; transform: scale(0.95); transition: all 260ms cubic-bezier(0.22,1,0.36,1); pointer-events:none;
        }
        .ft-pill.is-hovered{ opacity:1; transform: scale(1); }
        .ft-link-label{ position:relative; z-index:1; }
        .ft-arrow{ position:relative; z-index:1; opacity:0; transform: translateX(-6px); color:#D49A58; transition: all 260ms cubic-bezier(0.22,1,0.36,1); margin-left: auto; }
        .ft-arrow.is-visible{ opacity:1; transform: translateX(0); }
        .ft-subscribe{ display:flex; gap:6px; margin-bottom:16px; }
        .ft-input{
          flex:1; background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:10px;
          padding: 9px 12px; font-family:'Inter',sans-serif; font-size:12.5px; color:#F0EAE0; min-width:0;
        }
        .ft-input::placeholder{ color:#71675A; }
        .ft-join{
          display:flex; align-items:center; gap:5px; white-space:nowrap; background: linear-gradient(135deg,#D49A58,#A34E17);
          border:none; border-radius:10px; padding: 9px 14px; font-family:'Inter',sans-serif; font-weight:700; font-size:12px;
          color:#18120E; cursor:pointer; transition: transform 200ms;
        }
        .ft-join:hover{ transform: translateY(-1px); }
        .ft-contact-line{ display:flex; align-items:center; gap:8px; font-family:'Inter',sans-serif; font-size:12.5px; color:#9C8F80; margin-bottom:8px; }
      `}</style>
    </footer>
  );
}

/* ============================================================
   HOME HERO (context above footer)
   ============================================================ */

function HomeHero() {
  return (
    <div className="hh-root">
      <Eyebrow><Sparkles size={12} /> REVENEX SCHOOL ERP</Eyebrow>
      <h1 className="hh-title">Eight modules.<br />One calm command center.</h1>
      <p className="hh-sub">Explore the platform below — every card in the footer opens a fully interactive preview of that module.</p>
      <div className="hh-chips">
        {[...NAV.product, ...NAV.solutions].map((l) => (
          <span key={l.id} className="hh-chip"><Radio size={10} /> {l.label}</span>
        ))}
      </div>
      <style>{`
        .hh-root{ max-width:900px; margin: 0 auto; padding: 96px clamp(20px,5vw,64px) 60px; text-align:center; }
        .hh-root .ev-eyebrow{ justify-content:center; }
        .hh-title{
          font-family:'Fraunces',serif; font-weight:560; font-size: clamp(34px,5.6vw,64px); line-height:1.02;
          color:#F9F6F0; margin: 18px 0 16px; letter-spacing:-0.01em;
        }
        .hh-sub{ font-family:'Inter',sans-serif; font-size:15.5px; color:#9C8F80; max-width:480px; margin:0 auto 30px; line-height:1.6; }
        .hh-chips{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
        .hh-chip{
          display:inline-flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px;
          color:#C9BFB2; border:1px solid rgba(255,255,255,0.1); border-radius:999px; padding:6px 12px;
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

export default function App() {
  const [view, setView] = useState<ViewId | "home">("home");
  const ActivePage = view !== "home" ? PAGES[view] : null;
  const navigate = (id: string) => setView(id as ViewId | "home");

  return (
    <div className="ev-app">
      <style>{FONTS}</style>
      {view === "home" ? (
        <HomeHero />
      ) : (
        <PageShell id={view} onBack={() => setView("home")}>
          {ActivePage && <ActivePage />}
        </PageShell>
      )}
      <Footer onNavigate={navigate} />
      <style>{`
        .ev-app{
          background: #18120E; min-height: 100vh; color:#F9F6F0;
          font-family:'Inter',sans-serif;
        }
        .ev-app *{ box-sizing: border-box; }
        .ev-app button:focus-visible, .ev-app input:focus-visible{
          outline: 2px solid #D49A58; outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce){
          .ev-app *{ animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>
    </div>
  );
}
