import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CloudRain,
  Droplets,
  FilePlus2,
  FlaskConical,
  Gauge,
  HeartPulse,
  Languages,
  MapPin,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Navigation,
  PhoneCall,
  Radio,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";

type ScenarioKey = "flood" | "baseline" | "pipeline";
type Language = "EN" | "অসমীয়া" | "हिंदी";

const scenarios: Record<ScenarioKey, { label: string; short: string; risk: number; level: string; tone: string }> = {
  flood: { label: "Brahmaputra flood in Majuli", short: "Flood scenario", risk: 88.5, level: "Critical", tone: "critical" },
  baseline: { label: "Dry season baseline", short: "Baseline scenario", risk: 18, level: "Low", tone: "low" },
  pipeline: { label: "Tea estate pipeline leak", short: "Dibrugarh scenario", risk: 71, level: "High", tone: "high" },
};

const districts = [
  { name: "Majuli", meta: "River island · 9 wards", risk: 88.5, level: "Critical", tone: "critical", delta: "+18%" },
  { name: "Dibrugarh", meta: "Tea estates · 14 wards", risk: 71, level: "High", tone: "high", delta: "+9%" },
  { name: "Dhubri", meta: "Relief camps · 11 wards", risk: 43, level: "Watch", tone: "watch", delta: "+4%" },
  { name: "Kamrup Metro", meta: "Urban wards · 31 wards", risk: 26, level: "Low", tone: "low", delta: "−2%" },
];

function RiskPill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`risk-pill ${tone}`}>{children}</span>;
}

function Sparkline({ color = "#ef6b56", points = "0,31 12,29 24,30 36,22 48,24 60,15 72,17 84,10 96,12 108,4" }: { color?: string; points?: string }) {
  return (
    <svg viewBox="0 0 108 36" className="h-9 w-28" aria-hidden="true" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="108" cy="4" r="2.4" fill={color} />
    </svg>
  );
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function Sidebar({ active, setActive, collapsed, setCollapsed }: { active: string; setActive: (value: string) => void; collapsed: boolean; setCollapsed: (value: boolean) => void }) {
  const nav = [
    { label: "Overview", icon: Activity },
    { label: "Live signals", icon: Radio },
    { label: "Field reports", icon: FilePlus2 },
    { label: "Safe water", icon: Droplets },
  ];
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="flex items-center justify-between px-3 pb-8">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="brand-mark"><Waves size={19} strokeWidth={2.4} /></div>
          {!collapsed && <div className="whitespace-nowrap"><div className="brand-name">assam<span>sentinel</span></div><div className="brand-sub">Community health network</div></div>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="icon-button desktop-only" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}><ChevronRight size={17} className={collapsed ? "" : "rotate-180"} /></button>
      </div>
      {!collapsed && <div className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Monitor</div>}
      <nav className="space-y-1">
        {nav.map(({ label, icon: Icon }) => (
          <button key={label} onClick={() => setActive(label)} className={`nav-item ${active === label ? "active" : ""}`} title={collapsed ? label : undefined}>
            <Icon size={18} strokeWidth={active === label ? 2.5 : 2} /><span className={collapsed ? "sr-only" : ""}>{label}</span>{!collapsed && label === "Live signals" && <span className="ml-auto live-dot" />}
          </button>
        ))}
      </nav>
      {!collapsed && <>
        <div className="mt-9 px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Resources</div>
        <nav className="space-y-1">
          <button onClick={() => setActive("Response playbook")} className={`nav-item ${active === "Response playbook" ? "active" : ""}`}><BookOpen size={18} /><span>Response playbook</span></button>
          <button onClick={() => setActive("Help center")} className={`nav-item ${active === "Help center" ? "active" : ""}`}><CircleHelp size={18} /><span>Help center</span></button>
        </nav>
        <div className="mt-auto pt-8">
          <div className="offline-card"><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><span className="status-dot" /> Offline ready</div><p className="mt-2 text-xs leading-5 text-slate-500">Reports stay safe when the network is weak. Sync when you reconnect.</p><button className="mt-3 flex items-center gap-2 text-xs font-bold text-[#18786f]">View sync status <ChevronRight size={14} /></button></div>
        </div>
      </>}
      {collapsed && <div className="mt-auto flex justify-center"><span className="status-dot" title="Offline ready" /></div>}
    </aside>
  );
}

function Header({ language, setLanguage, onMenu }: { language: Language; setLanguage: (value: Language) => void; onMenu: () => void }) {
  return (
    <header className="topbar">
      <div className="flex min-w-0 items-center gap-3"><button onClick={onMenu} className="icon-button mobile-only" aria-label="Open menu"><Menu size={20} /></button><div><div className="eyebrow">Assam · District health operations</div><h1 className="page-title">Good morning, Ananya <span className="wave">✳</span></h1></div></div>
      <div className="flex items-center gap-2 sm:gap-3"><div className="sync-status"><span className="status-dot" /> <span className="hidden sm:inline">Data synced</span><span className="sm:hidden">Synced</span><span className="text-slate-400">·</span><span>2 min ago</span></div><div className="language-switcher"><Languages size={15} /><select value={language} onChange={(e) => setLanguage(e.target.value as Language)} aria-label="Choose language"><option>EN</option><option>অসমীয়া</option><option>हिंदी</option></select><ChevronDown size={13} /></div><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span className="notification-badge">3</span></button><div className="avatar">AS</div></div>
    </header>
  );
}

function RiskChart({ scenario }: { scenario: ScenarioKey }) {
  const isFlood = scenario === "flood";
  const isPipeline = scenario === "pipeline";
  const bars = isFlood ? [18, 20, 24, 28, 35, 44, 62, 84, 89, 87, 92, 89] : isPipeline ? [26, 28, 29, 31, 34, 39, 46, 55, 64, 69, 71, 71] : [24, 22, 23, 20, 18, 17, 19, 18, 16, 18, 17, 18];
  return <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl bg-[#f8faf8] p-4"><div className="chart-grid" /><div className="absolute inset-x-4 top-4 flex justify-between text-[10px] font-semibold text-slate-400"><span>Risk score</span><span>Last 12 hours</span></div><div className="absolute inset-x-4 bottom-5 flex items-end gap-1.5 sm:gap-2" style={{ height: "84px" }}>{bars.map((height, i) => <div key={i} className="group relative flex h-full flex-1 items-end"><div className={`w-full rounded-t-md transition-all duration-500 ${height > 70 ? "bg-[#ef6b56]" : height > 40 ? "bg-[#edb55a]" : "bg-[#75b8a9]"}`} style={{ height: `${height}%` }} /></div>)}</div><div className="absolute bottom-1.5 inset-x-4 flex justify-between text-[9px] font-medium text-slate-400"><span>12h ago</span><span>6h ago</span><span>Now</span></div></div>;
}

function SignalRow({ icon: Icon, label, detail, value, delta, tone, progress }: { icon: React.ElementType; label: string; detail: string; value: string; delta: string; tone: "red" | "amber" | "teal"; progress: number }) {
  const color = tone === "red" ? "#ef6b56" : tone === "amber" ? "#e6a84d" : "#249789";
  return <div className="signal-row"><div className={`signal-icon ${tone}`}><Icon size={17} /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><div><div className="text-sm font-bold text-slate-800">{label}</div><div className="text-[11px] text-slate-500">{detail}</div></div><div className="text-right"><div className="text-sm font-black text-slate-900">{value}</div><div className={`text-[11px] font-bold ${tone === "red" ? "text-[#dc5f4b]" : tone === "amber" ? "text-[#bb7e25]" : "text-[#178479]"}`}>{delta}</div></div></div><div className="mt-2"><MiniBar value={progress} color={color} /></div></div></div>;
}

function SafeWaterMap() {
  return <div className="map-card"><div className="map-heading"><div><div className="section-kicker">Citizen view</div><h3 className="section-title">Safe water points</h3></div><button className="more-button" aria-label="More map options"><MoreHorizontal size={18} /></button></div><div className="safe-map"><div className="map-river one" /><div className="map-river two" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-label label-one">Majuli M-02</div><div className="map-label label-two">Kamalabari</div><span className="map-pin pin-one"><Droplets size={13} /></span><span className="map-pin pin-two"><Droplets size={13} /></span><span className="map-pin pin-three"><Droplets size={13} /></span><span className="map-pin pin-four"><Droplets size={13} /></span><div className="map-legend"><span><i className="legend-safe" /> Safe point</span><span><i className="legend-alert" /> Advisory</span></div></div><div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-2 text-xs text-slate-500"><span className="status-dot" /> <strong className="text-slate-700">8</strong> points verified today</div><button className="text-xs font-bold text-[#18786f]">Open map <ChevronRight size={13} className="inline" /></button></div></div>;
}

function ReportModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Report symptoms"><div className="report-modal"><div className="flex items-start justify-between"><div><div className="section-kicker">Offline-first report</div><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Report a health signal</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Simple, private reporting for ASHA workers, schools, pharmacies and citizens.</p></div><button onClick={onClose} className="icon-button" aria-label="Close"><X size={18} /></button></div>{submitted ? <div className="success-state"><div className="success-icon"><CheckCircle2 size={30} /></div><h3>Report saved safely</h3><p>Your report is stored on this device and will sync automatically when a network is available.</p><button onClick={onSaved} className="primary-button">Back to overview</button></div> : <div className="mt-6 space-y-4"><label className="field-label">What did you notice?<select className="field-input"><option>More people with loose motions</option><option>Unsafe drinking water</option><option>School absenteeism</option><option>Fever or vomiting cluster</option></select></label><label className="field-label">Area or village<input className="field-input" placeholder="e.g. Sector 2, Kamalabari" /></label><label className="field-label">Number of people affected<div className="counter"><button type="button">−</button><span>5</span><button type="button">+</button></div></label><label className="field-label">Add a note <textarea className="field-input min-h-20 resize-none" placeholder="Optional: what should the health team know?" /></label><button onClick={() => setSubmitted(true)} className="primary-button flex w-full items-center justify-center gap-2"><Send size={16} /> Save report</button><p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400"><ShieldCheck size={13} /> No names or phone numbers are collected</p></div>}</div></div>;
}

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [scenario, setScenario] = useState<ScenarioKey>("flood");
  const [language, setLanguage] = useState<Language>("EN");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [toast, setToast] = useState("");
  const current = scenarios[scenario];
  const scenarioCopy = useMemo(() => scenario === "flood" ? "River level and turbidity are rising faster than usual. Take action before the next clinic report arrives." : scenario === "pipeline" ? "A pressure drop and medicine sales spike suggest a possible water-line issue near tea garden clinics." : "All monitored signals are within the normal dry-season range. Continue routine checks.", [scenario]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };

  return <div className="app-shell">
    <Sidebar active={active} setActive={(value) => { setActive(value); setMobileMenu(false); if (value !== "Overview") notify(`${value} view is ready for the next prototype step.`); }} collapsed={collapsed} setCollapsed={setCollapsed} />
    {mobileMenu && <div className="mobile-drawer"><div className="mobile-drawer-head"><div className="brand-name">assam<span>sentinel</span></div><button onClick={() => setMobileMenu(false)} className="icon-button"><X size={18} /></button></div><div className="space-y-1">{["Overview", "Live signals", "Field reports", "Safe water", "Response playbook", "Help center"].map((item) => <button key={item} className={`nav-item ${active === item ? "active" : ""}`} onClick={() => { setActive(item); setMobileMenu(false); }}>{item === "Overview" ? <Activity size={18} /> : item === "Live signals" ? <Radio size={18} /> : item === "Field reports" ? <FilePlus2 size={18} /> : item === "Safe water" ? <Droplets size={18} /> : <BookOpen size={18} />}{item}</button>)}</div></div>}
    <main className="main-content"><Header language={language} setLanguage={setLanguage} onMenu={() => setMobileMenu(true)} />
      <div className="content-wrap">
        <section className="hero-grid"><div className="hero-copy"><div className="flex items-center gap-2"><span className="live-badge"><span className="live-pulse" /> LIVE MONITORING</span><span className="text-xs font-semibold text-slate-500">10 Sep 2026 · 10:42 AM</span></div><h2>Catch the signal.<br /><em>Protect the village.</em></h2><p>Assam Sentinel brings river, water, pharmacy, school and field signals into one clear picture—so your team can act <strong>48–72 hours earlier.</strong></p><div className="hero-actions"><button onClick={() => setShowReport(true)} className="primary-button"><FilePlus2 size={17} /> Report a signal</button><button onClick={() => notify("Response playbook opened.")} className="secondary-button"><BookOpen size={17} /> Response playbook</button></div></div><div className="hero-visual"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-orbit orbit-three" /><div className="hero-center"><Waves size={28} /><span>Early<br />warning</span></div><div className="hero-node node-river"><Waves size={16} /><span>River</span></div><div className="hero-node node-water"><Droplets size={16} /><span>Water</span></div><div className="hero-node node-field"><Users size={16} /><span>Field</span></div><div className="hero-node node-school"><BookOpen size={16} /><span>School</span></div><div className="hero-visual-label">One shared picture<br /><span>for every health team</span></div></div></section>

        <section className="scenario-strip"><div className="scenario-title"><div className="icon-tile"><Sparkles size={17} /></div><div><div className="section-kicker">Demo mode</div><div className="text-sm font-bold text-slate-800">Show the system in action</div></div></div><div className="scenario-buttons">{(Object.keys(scenarios) as ScenarioKey[]).map((key) => <button key={key} onClick={() => setScenario(key)} className={`scenario-button ${scenario === key ? "selected" : ""}`}><span className={`scenario-dot ${scenarios[key].tone}`} />{scenarios[key].short}</button>)}</div><div className="scenario-label"><span className="hidden sm:inline">Selected:</span> {current.label}<ChevronDown size={14} /></div></section>

        <section className="alert-banner"><div className="alert-icon"><AlertTriangle size={20} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-black text-[#a94132]">{current.level === "Critical" ? "Immediate attention needed" : current.level === "High" ? "High risk signal detected" : "Routine monitoring"}</span><RiskPill tone={current.tone}>{current.level.toUpperCase()}</RiskPill><span className="hidden text-xs font-semibold text-[#a94132] sm:inline">· Predicted window: {scenario === "baseline" ? "No outbreak pattern" : "24–48 hours"}</span></div><p className="mt-1 text-xs leading-5 text-[#8b554b]">{scenarioCopy}</p></div><button onClick={() => notify("Action checklist opened.")} className="alert-action">View action checklist <ChevronRight size={15} /></button></section>

        <section className="kpi-grid"><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon teal"><Gauge size={18} /></div><span className="kpi-trend up"><ArrowUpRight size={13} /> 12%</span></div><div className="kpi-value">{current.risk}<span>/100</span></div><div className="kpi-label">Community risk score</div><Sparkline color={current.tone === "low" ? "#249789" : "#ef6b56"} points={scenario === "baseline" ? "0,22 12,24 24,21 36,23 48,20 60,21 72,19 84,20 96,18 108,19" : undefined} /></div><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon coral"><AlertTriangle size={18} /></div><span className="kpi-trend up"><ArrowUpRight size={13} /> 2 new</span></div><div className="kpi-value">04</div><div className="kpi-label">Active alerts today</div><div className="mt-3 flex items-center gap-1.5"><span className="mini-avatar">AS</span><span className="mini-avatar second">RK</span><span className="mini-avatar third">+2</span><span className="ml-2 text-[11px] text-slate-500">teams notified</span></div></div><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon yellow"><Droplets size={18} /></div><span className="kpi-trend down"><ArrowDownRight size={13} /> 4%</span></div><div className="kpi-value">86<span>%</span></div><div className="kpi-label">Safe water coverage</div><div className="mt-4"><MiniBar value={86} color="#e2ac48" /></div><div className="mt-2 text-[11px] font-semibold text-slate-500">8 of 9 points verified</div></div><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon blue"><HeartPulse size={18} /></div><span className="kpi-trend neutral"><RefreshCw size={12} /> Live</span></div><div className="kpi-value">132</div><div className="kpi-label">Field reports this week</div><div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-slate-500"><span className="status-dot" /> 8 received offline · syncing</div></div></section>

        <section className="dashboard-grid"><div className="panel risk-panel"><div className="panel-header"><div><div className="section-kicker">AI prediction · Majuli M-02</div><h3 className="section-title">Outbreak risk trend</h3></div><button className="more-button" aria-label="More risk trend options"><MoreHorizontal size={18} /></button></div><div className="risk-score-row"><div className={`big-score ${current.tone}`}>{current.risk}</div><div><RiskPill tone={current.tone}>{current.level} risk</RiskPill><div className="mt-1 text-xs text-slate-500">{scenario === "baseline" ? "Within seasonal norms" : "Predicted outbreak window: 24–48h"}</div></div><div className="ml-auto hidden text-right sm:block"><div className="text-xs font-semibold text-slate-400">Compared with yesterday</div><div className={`mt-1 text-sm font-black ${current.tone === "low" ? "text-[#178479]" : "text-[#dc5f4b]"}`}>{current.tone === "low" ? "−6.2 points" : "+14.8 points"}</div></div></div><RiskChart scenario={scenario} /><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-slate-500"><span className="flex items-center gap-1.5"><i className="legend-dot coral" /> Disease signals</span><span className="flex items-center gap-1.5"><i className="legend-dot amber" /> Environmental signals</span><span className="ml-auto flex items-center gap-1 text-[#18786f]"><Sparkles size={12} /> Explainable AI enabled</span></div></div><div className="panel signals-panel"><div className="panel-header"><div><div className="section-kicker">Why this changed</div><h3 className="section-title">Signals driving the score</h3></div><button onClick={() => notify("Signal details opened.")} className="more-button" aria-label="Open signal details"><ChevronRight size={18} /></button></div><div className="space-y-4"><SignalRow icon={Waves} label="River level" detail="CWC gauge · Brahmaputra" value={"+2.1σ"} delta="Above danger mark" tone="red" progress={86} /><SignalRow icon={Droplets} label="Water turbidity" detail="Sensor · Sector 2" value={"18.4 NTU"} delta="+35% in 6h" tone="amber" progress={68} /><SignalRow icon={Activity} label="Community symptoms" detail="ASHA + pharmacy reports" value={"+210%"} delta="Anti-diarrheal sales" tone="red" progress={92} /><SignalRow icon={CloudRain} label="Rainfall" detail="IMD nowcast · 24h" value={"86 mm"} delta="Heavy rain likely" tone="amber" progress={74} /></div><button onClick={() => notify("All signal sources are visible in Live signals.")} className="view-all-button">View all 12 signals <ChevronRight size={15} /></button></div></section>

        <section className="lower-grid"><div className="panel action-panel"><div className="panel-header"><div><div className="section-kicker">Recommended next steps</div><h3 className="section-title">Act before the alert grows</h3></div><span className="text-xs font-bold text-slate-400">{scenario === "baseline" ? "Routine" : "Priority 1 of 3"}</span></div><div className="action-list"><div className="action-item priority"><div className="action-number">1</div><div className="flex-1"><div className="action-title">Send boil-water advisory</div><div className="action-desc">Reach 4,820 households in Majuli M-02</div></div><button onClick={() => notify("SMS advisory queued for review.")} className="action-button">Review <ChevronRight size={14} /></button></div><div className="action-item"><div className="action-number">2</div><div className="flex-1"><div className="action-title">Pre-position ORS & zinc</div><div className="action-desc">At Primary Health Centre, Kamalabari</div></div><button onClick={() => notify("Resource request drafted.")} className="action-button">Prepare <ChevronRight size={14} /></button></div><div className="action-item"><div className="action-number">3</div><div className="flex-1"><div className="action-title">Verify water point</div><div className="action-desc">Field check due in Sector 2 · today</div></div><button onClick={() => notify("Field task assigned to ASHA team.")} className="action-button">Assign <ChevronRight size={14} /></button></div></div></div><SafeWaterMap /></section>

        <section className="footer-note"><div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#18786f]" /><span>Designed for Assam’s low-bandwidth health operations</span></div><span className="hidden sm:inline">Data sources: CWC · IMD · ASHA field logs · local pharmacies · schools</span><button onClick={() => notify("About this prototype opened.")} className="font-bold text-[#18786f]">About this prototype <ChevronRight size={13} className="inline" /></button></section>
      </div>
    </main>
    <nav className="mobile-bottom-nav"><button className={active === "Overview" ? "active" : ""} onClick={() => setActive("Overview")}><Activity size={19} /><span>Overview</span></button><button onClick={() => setShowReport(true)}><FilePlus2 size={19} /><span>Report</span></button><button onClick={() => setActive("Safe water")} className={active === "Safe water" ? "active" : ""}><Droplets size={19} /><span>Safe water</span></button><button onClick={() => notify("Notifications opened.")}><Bell size={19} /><span>Alerts</span></button></nav>
    {showReport && <ReportModal onClose={() => setShowReport(false)} onSaved={() => { setShowReport(false); notify("Report added to field signals."); }} />}
    {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
  </div>;
}
