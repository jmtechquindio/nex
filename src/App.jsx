import { useState, useEffect, useRef } from "react";
import { ChevronDown, CheckCircle, Menu, X, Zap, Brain, BarChart3, MessageSquare, TrendingUp, ArrowRight, ChevronLeft, ChevronRight, Quote, Shield, Lock, MessageCircle, Calculator } from "lucide-react";

/* ── Animated counter ── */
const AnimatedCounter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !vis) setVis(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [vis]);
  useEffect(() => {
    if (!vis) return;
    let s = 0; const inc = end / 125;
    const t = setInterval(() => { s += inc; if (s >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [vis, end]);
  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Scroll reveal ── */
const Reveal = ({ children, delay = 0 }) => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setVis(true), delay); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>{children}</div>;
};

/* ── Canvas network (optimized) ── */
const Network = () => {
  const canRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const can = canRef.current; if (!can) return;
    const ctx = can.getContext("2d");
    can.width = can.offsetWidth; can.height = can.offsetHeight;
    const N = 25;
    const pts = Array.from({ length: N }, () => ({ x: Math.random() * can.width, y: Math.random() * can.height, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
    let frame = 0;
    function anim() {
      frame++; ctx.clearRect(0, 0, can.width, can.height);
      ctx.fillStyle = "rgba(59,130,246,0.45)";
      for (let i = 0; i < N; i++) {
        const p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > can.width) p.vx *= -1;
        if (p.y < 0 || p.y > can.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      if (frame % 2 === 0) {
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d2 = dx * dx + dy * dy;
          if (d2 < 12000) { ctx.beginPath(); ctx.strokeStyle = `rgba(59,130,246,${.12 * (1 - d2 / 12000)})`; ctx.lineWidth = 1; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
        }
      }
      animRef.current = requestAnimationFrame(anim);
    }
    anim(); return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);
  return <canvas ref={canRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

/* ── ROI Calculator ── */
const ROICalc = () => {
  const [emp, setEmp] = useState(10);
  const [hrs, setHrs] = useState(15);
  const [sal, setSal] = useState(3000);
  const hrCost = sal / 160;
  const savedHrs = emp * hrs * 0.65;
  const savedMoney = Math.round(savedHrs * hrCost * 12);
  const roi = Math.round((savedMoney / 12000) * 100);
  const Slider = ({ label, val, min, max, step, onChange, suffix }) => (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-blue-400 font-semibold">{val}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-blue-500 h-1 rounded-full" />
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2"><Calculator size={20} className="text-blue-400" /> Configura tu empresa</h3>
        <Slider label="Empleados en procesos repetitivos" val={emp} min={1} max={100} step={1} onChange={setEmp} suffix=" personas" />
        <Slider label="Horas semanales en tareas manuales" val={hrs} min={1} max={40} step={1} onChange={setHrs} suffix=" hrs/semana" />
        <Slider label="Salario mensual promedio" val={sal} min={500} max={10000} step={100} onChange={setSal} suffix=" USD" />
      </div>
      <div className="bg-gradient-to-br from-blue-900/40 to-gray-900 border border-blue-500/30 rounded-xl p-8 flex flex-col justify-center space-y-6">
        <h3 className="text-xl font-semibold text-blue-300">Tu ahorro estimado</h3>
        <div>
          <p className="text-gray-400 text-sm mb-1">Horas recuperadas al mes</p>
          <p className="text-4xl font-bold text-white">{Math.round(savedHrs * 4).toLocaleString()} <span className="text-lg font-normal text-gray-400">hrs</span></p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Ahorro anual estimado</p>
          <p className="text-4xl font-bold text-green-400">${savedMoney.toLocaleString()} <span className="text-lg font-normal text-gray-400">USD/año</span></p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">ROI estimado (inversión base $12k)</p>
          <p className="text-4xl font-bold text-blue-400">{roi}%</p>
        </div>
        <p className="text-xs text-gray-500">*Estimado basado en 65% de automatización promedio.</p>
      </div>
    </div>
  );
};

/* ── Testimonials ── */
const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  const tests = [
    { text: "La implementación de IA redujo el tiempo de respuesta al cliente en un 65%. Un cambio invaluable para nuestro equipo.", author: "María González", role: "Directora de Operaciones, Retail" },
    { text: "Automatizamos 15 horas semanales de trabajo manual. Ahora el equipo se enfoca en estrategia, no en datos.", author: "Carlos Ramírez", role: "CEO, Logística" },
    { text: "El chatbot maneja el 80% de consultas entrantes. El equipo humano solo atiende casos complejos.", author: "Ana Martínez", role: "Gerente, Salud" }
  ];
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % tests.length), 6000); return () => clearInterval(t); }, []);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-8">
        <Quote className="text-blue-500 mb-6" size={40} />
        <div className="min-h-[140px]">
          <p className="text-xl text-gray-300 mb-8 italic leading-relaxed">"{tests[idx].text}"</p>
          <div><p className="text-blue-400 font-semibold">{tests[idx].author}</p><p className="text-gray-500 text-sm">{tests[idx].role}</p></div>
        </div>
        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setIdx(p => (p - 1 + tests.length) % tests.length)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex gap-2">{tests.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "bg-blue-500 w-8" : "bg-gray-600 w-2"}`} />)}</div>
          <button onClick={() => setIdx(p => (p + 1) % tests.length)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
};

/* ── FAQ ── */
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "¿Cuánto tiempo toma implementar?", a: "Proyectos simples: 2-3 semanas. Soluciones complejas: 2-3 meses. Siempre entregamos un MVP funcional en las primeras 2 semanas." },
    { q: "¿Necesito conocimientos técnicos?", a: "No. Diseñamos interfaces intuitivas con capacitación completa para tu equipo." },
    { q: "¿Qué tan segura es mi información?", a: "Usamos protocolos de seguridad empresarial, datos encriptados en tránsito y en reposo, y nunca compartimos tu información con terceros." },
    { q: "¿Ofrecen soporte post-implementación?", a: "Sí. 3 meses de soporte incluidos en todos los proyectos, más planes de mantenimiento mensual disponibles." },
    { q: "¿Con qué sistemas se integran?", a: "HubSpot, Salesforce, WhatsApp Business, Google Workspace, Notion, Slack, ERPs y más de 200 herramientas vía API." }
  ];
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((f, i) => (
        <Reveal key={i} delay={i * 50}>
          <div className="bg-gray-900 border border-gray-800 rounded-lg hover:border-blue-500/40 transition-colors">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left p-5 flex justify-between items-center gap-4">
              <span className="font-medium text-base pr-4">{f.q}</span>
              <ChevronDown className={`text-blue-500 flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} size={18} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-40" : "max-h-0"}`}>
              <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

/* ── Main ── */
export default function NexusAI() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captcha, setCaptcha] = useState(false);

  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Requerido";
    if (!form.email.trim()) e.email = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Inválido";
    if (!form.phone.trim()) e.phone = "Requerido";
    if (!form.message.trim()) e.message = "Requerido";
    if (!captcha) e.captcha = "Verifica que no eres un robot";
    return e;
  };
  const submit = e => {
    e.preventDefault(); if (submitting) return;
    const errs = validate(); setErrors(errs);
    if (!Object.keys(errs).length) {
      setSubmitting(true);
      setTimeout(() => { setSuccess(true); setForm({ name: "", email: "", phone: "", message: "" }); setCaptcha(false); setSubmitting(false); setTimeout(() => setSuccess(false), 8000); }, 1500);
    }
  };
  const change = (k, v) => { setForm({ ...form, [k]: v }); if (errors[k]) setErrors({ ...errors, [k]: "" }); };

  const svcs = [
    { icon: Zap, title: "Automatización de procesos", items: ["Eliminación de tareas repetitivas", "Integración entre sistemas", "Flujos de trabajo inteligentes"] },
    { icon: MessageSquare, title: "Agentes IA", items: ["Chatbots de atención al cliente", "Asistentes internos", "Agentes autónomos"] },
    { icon: Brain, title: "IA para negocio", items: ["Análisis predictivo", "Toma de decisiones", "Procesamiento de documentos"] },
    { icon: TrendingUp, title: "Automatización comercial", items: ["Calificación de leads", "Respuestas automáticas", "Embudos inteligentes"] },
    { icon: BarChart3, title: "Consultoría IA", items: ["Diagnóstico de procesos", "Mapa de casos de uso", "Hoja de ruta de implementación"] }
  ];

  const stack = ["OpenAI", "LangChain", "n8n", "Make", "Zapier", "Python", "HubSpot", "WhatsApp API", "Google AI", "Anthropic"];

  const industries = [
    { emoji: "🏥", name: "Salud" }, { emoji: "🏬", name: "Retail" }, { emoji: "🏦", name: "Fintech" },
    { emoji: "⚖️", name: "Legal" }, { emoji: "🚚", name: "Logística" }, { emoji: "🏗️", name: "Construcción" },
    { emoji: "🎓", name: "Educación" }, { emoji: "🏨", name: "Hotelería" }
  ];

  const cases = [
    { icon: MessageSquare, title: "Atención 24/7", desc: "Chatbot multicanal que resuelve consultas, agenda citas y escala casos complejos al equipo humano.", res: ["80% resuelto de forma automática", "Respuesta en menos de 30 segundos"] },
    { icon: BarChart3, title: "Análisis predictivo", desc: "Modelo que predice demanda de inventario y optimiza compras automáticamente.", res: ["−45% exceso de stock", "78% de precisión en predicción"] },
    { icon: Zap, title: "Screening de RRHH", desc: "Filtrado automático de CVs, ranking de candidatos y primer contacto por IA.", res: ["−60% tiempo en selección", "100× más rápido que manual"] }
  ];

  const steps = [
    { num: "01", title: "Diagnóstico", desc: "Mapeamos tus procesos e identificamos los cuellos de botella con mayor impacto." },
    { num: "02", title: "Diseño", desc: "Diseñamos la solución técnica adaptada a tu stack y objetivos de negocio." },
    { num: "03", title: "Implementación", desc: "Desarrollamos e integramos la solución con soporte continuo durante el proceso." },
    { num: "04", title: "Optimización", desc: "Medimos resultados, ajustamos y escalamos según el rendimiento real." }
  ];

  const Input = ({ k, type = "text", placeholder }) => (
    <div>
      <input type={type} placeholder={placeholder} value={form[k]} onChange={e => change(k, e.target.value)}
        className={`w-full bg-gray-950 border ${errors[k] ? "border-red-500" : "border-gray-700"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors`} />
      {errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">

      {/* ── Floating WhatsApp CTA ── */}
      <a href="https://wa.me/573212257107" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all hover:scale-105"
        style={{ boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}>
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </a>

      {/* ── Nav ── */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? "bg-gray-950/85 backdrop-blur-xl border-b border-gray-800/50" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-xl font-bold tracking-tight">
              <span className="text-blue-500">Nexus</span> AI
            </button>
            <div className="hidden md:flex space-x-8 items-center text-sm">
              {[["servicios", "Servicios"], ["casos", "Casos"], ["roi", "Calculadora ROI"], ["testimonios", "Testimonios"], ["faq", "FAQ"]].map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)} className="text-gray-400 hover:text-blue-400 transition-colors">{label}</button>
              ))}
              <button onClick={() => scrollTo("contacto")} className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition-colors">Contacto</button>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 px-4 py-4 space-y-2">
            {[["servicios", "Servicios"], ["casos", "Casos"], ["roi", "Calculadora ROI"], ["testimonios", "Testimonios"], ["faq", "FAQ"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left text-gray-300 py-2 text-sm">{label}</button>
            ))}
            <button onClick={() => scrollTo("contacto")} className="block w-full text-left bg-blue-600 px-4 py-2 rounded-lg text-sm">Contacto</button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Network />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/20 to-gray-950"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div className="inline-block mb-5 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">
            <Shield className="inline mr-2" size={14} />Transformación empresarial con IA
          </div>
          <div className="rounded-2xl px-4 py-2" style={{ backdropFilter: "blur(8px)", background: "rgba(3,7,18,0.4)" }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                Inteligencia Artificial<br />que escala tu negocio
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Diseñamos soluciones de IA que automatizan procesos, reducen costos y mejoran tus decisiones. Sin fricción técnica para tu equipo.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo("roi")} className="group bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-base font-medium transition-all hover:scale-105 inline-flex items-center justify-center gap-2">
              Calcular mi ROI <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
            <button onClick={() => scrollTo("contacto")} className="border border-gray-700 hover:border-blue-500/50 px-8 py-4 rounded-lg text-base font-medium transition-all inline-flex items-center justify-center gap-2">
              Agendar diagnóstico
            </button>
          </div>
          <div className="mt-16 animate-bounce"><ChevronDown size={28} className="mx-auto text-gray-600" /></div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[{ val: 40, suf: "%", label: "Reducción de costos" }, { val: 60, suf: "%", label: "Ahorro en tiempo" }, { val: 24, suf: "/7", label: "Disponibilidad" }].map((s, i) => (
            <Reveal key={i} delay={i * 150}>
              <div>
                <div className="text-4xl font-bold text-blue-500 mb-1"><AnimatedCounter end={s.val} suffix={s.suf} /></div>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Servicios ── */}
      <section id="servicios" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest text-center mb-3">Qué hacemos</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Servicios</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Soluciones de IA diseñadas a medida para los retos específicos de tu empresa.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {svcs.map((s, i) => {
              const I = s.icon;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="group bg-gray-900/60 border border-gray-800 rounded-xl p-7 hover:border-blue-500/50 h-full transition-all duration-300"
                    style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                    <div className="w-11 h-11 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4"><I className="text-blue-400" size={22} /></div>
                    <h3 className="text-lg font-semibold mb-4 text-white">{s.title}</h3>
                    <ul className="space-y-2">
                      {s.items.map((it, j) => <li key={j} className="text-gray-400 flex items-start text-sm gap-2"><CheckCircle className="text-blue-500/60 mt-0.5 flex-shrink-0" size={14} />{it}</li>)}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-16 border-y border-gray-800/50 bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal>
            <p className="text-gray-500 text-sm text-center mb-8 uppercase tracking-widest">Tecnologías que dominamos</p>
            <div className="flex flex-wrap justify-center gap-3">
              {stack.map((t, i) => (
                <span key={i} className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-blue-500/50 rounded-full text-sm text-gray-300 transition-colors cursor-default">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Casos ── */}
      <section id="casos" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest text-center mb-3">Resultados reales</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Casos de uso</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Proyectos que ya transformaron operaciones reales en distintos sectores.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((c, i) => {
              const I = c.icon;
              return (
                <Reveal key={i} delay={i * 100}>
                  <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-7 hover:border-blue-500/40 transition-all duration-300 h-full"
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                    <div className="w-11 h-11 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4"><I className="text-blue-400" size={22} /></div>
                    <h3 className="text-lg font-semibold mb-3">{c.title}</h3>
                    <p className="text-gray-400 mb-5 text-sm leading-relaxed">{c.desc}</p>
                    <div className="space-y-2">{c.res.map((r, j) => <div key={j} className="flex items-start gap-2 text-sm"><CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={14} /><span className="text-gray-300">{r}</span></div>)}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ROI Calculator ── */}
      <section id="roi" className="py-24 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest text-center mb-3">¿Cuánto puedes ahorrar?</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Calculadora de ROI</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Ajusta los parámetros de tu empresa y ve el impacto real de la automatización.</p>
          </Reveal>
          <ROICalc />
        </div>
      </section>

      {/* ── Industrias ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest text-center mb-3">¿Tu sector?</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Industrias que atendemos</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Experiencia en sectores con alta demanda de automatización e IA.</p>
          </Reveal>
          <div className="grid grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="bg-gray-900/60 border border-gray-800 hover:border-blue-500/40 rounded-xl p-5 text-center transition-all duration-300"
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(59,130,246,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div className="text-3xl mb-2">{ind.emoji}</div>
                  <p className="text-sm text-gray-300 font-medium">{ind.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metodología ── */}
      <section className="py-24 bg-gray-900/40">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest text-center mb-3">Cómo trabajamos</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Metodología</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Un proceso probado que minimiza riesgos y maximiza resultados desde el día uno.</p>
          </Reveal>
          <div className="relative grid md:grid-cols-4 gap-8">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-500/20 via-blue-500/60 to-blue-500/20"></div>
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <span className="text-xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">{s.num}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seguridad ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="bg-gradient-to-br from-blue-950/40 to-gray-900 border border-blue-500/20 rounded-xl p-10 text-center">
              <Lock className="text-blue-400 mx-auto mb-5" size={40} />
              <h2 className="text-2xl font-bold mb-4">Tus datos, seguros</h2>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Trabajamos con encriptación de extremo a extremo, cumplimiento de normativas de privacidad (GDPR, ISO 27001) y acuerdos de confidencialidad en cada proyecto. Tu información nunca se comparte con terceros ni se usa para entrenar modelos públicos.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {["Encriptación E2E", "NDA incluido", "Datos en tus servidores", "Auditorías disponibles"].map((b, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-300">{b}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section id="testimonios" className="py-24 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest text-center mb-3">Lo que dicen</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Testimonios</h2>
          </Reveal>
          <Testimonials />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest text-center mb-3">Dudas frecuentes</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">FAQ</h2>
          </Reveal>
          <FAQ />
        </div>
      </section>

      {/* ── Contacto ── */}
      <section id="contacto" className="py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mb-3">Sin compromiso</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Agenda tu diagnóstico gratuito</h2>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto">En 30 minutos te mostramos qué procesos de tu empresa se pueden automatizar y cuánto podrías ahorrar.</p>
          </Reveal>
          <Reveal delay={150}>
            {success ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-10 max-w-md mx-auto">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-green-400 mb-2">¡Mensaje enviado!</h3>
                <p className="text-gray-300 text-sm">Te contactaremos en menos de 24 horas.</p>
              </div>
            ) : (
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-8 max-w-md mx-auto text-left">
                <div className="space-y-4">
                  <Input k="name" placeholder="Nombre completo" />
                  <Input k="email" type="email" placeholder="Email corporativo" />
                  <Input k="phone" type="tel" placeholder="Teléfono / WhatsApp" />
                  <div>
                    <textarea placeholder="¿Qué proceso quieres automatizar?" rows="4" value={form.message} onChange={e => change("message", e.target.value)}
                      className={`w-full bg-gray-950 border ${errors.message ? "border-red-500" : "border-gray-700"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors`}></textarea>
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <div>
                    <button onClick={() => setCaptcha(!captcha)} className={`w-full p-3 border ${captcha ? "border-green-500 bg-green-500/10" : "border-gray-700 bg-gray-950"} rounded-lg flex items-center gap-3 text-sm transition-colors`}>
                      <div className={`w-5 h-5 border-2 rounded flex-shrink-0 flex items-center justify-center ${captcha ? "bg-green-500 border-green-500" : "border-gray-600"}`}>
                        {captcha && <CheckCircle size={14} className="text-white" />}
                      </div>
                      No soy un robot
                    </button>
                    {errors.captcha && <p className="text-red-400 text-xs mt-1">{errors.captcha}</p>}
                  </div>
                  <button onClick={submit} disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-medium inline-flex items-center justify-center gap-2 transition-colors">
                    {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Enviando...</> : <>Enviar solicitud <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 border-t border-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold mb-2"><span className="text-blue-500">Nexus</span> AI</div>
              <p className="text-gray-500 text-sm">Agencia de Inteligencia Artificial y Automatización empresarial.</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3 text-gray-300">Navegación</p>
              <div className="space-y-2">
                {[["servicios", "Servicios"], ["casos", "Casos de uso"], ["roi", "Calculadora ROI"], ["faq", "FAQ"]].map(([id, label]) => (
                  <button key={id} onClick={() => scrollTo(id)} className="block text-gray-500 hover:text-blue-400 text-sm transition-colors">{label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3 text-gray-300">Contacto</p>
              <a href="tel:+573212257107" className="block text-gray-500 hover:text-blue-400 text-sm mb-1">📞 321 225 7107</a>
              <a href="https://wa.me/573212257107" className="block text-gray-500 hover:text-green-400 text-sm">💬 WhatsApp</a>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-6 text-center text-gray-600 text-xs">© 2025 Nexus AI. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
}
