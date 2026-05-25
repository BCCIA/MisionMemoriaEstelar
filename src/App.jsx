import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

/* =========================
   Nombre y rutas por defecto
========================= */
const GAME_NAME = "Misión Memoria Espacial";
const BASE = import.meta.env.BASE_URL;
const DEFAULT_VIDEO_URL = `${BASE}video/intro-mision.mp4`;
const DEFAULT_POSTER_URL = `${BASE}video/intro-mision_poster.jpg`;

/* =========================
   Config imágenes de cartas
========================= */
const CARDS_DIR = `${BASE}cards/`;
const CANDIDATE_COUNT = 24;
const CANDIDATES = Array.from({ length: CANDIDATE_COUNT }, (_, i) =>
  `${CARDS_DIR}card-${String(i + 1).padStart(2, "0")}.png`
);

/** =========================
 *  Iconos SVG (fallback)
 *  ========================= */
const iconProps = { width: 64, height: 64, viewBox: "0 0 64 64", fill: "none" };

const Planet = () => (
  <svg {...iconProps}><circle cx="32" cy="32" r="16" fill="#5EEAD4"/><path d="M8 28c14 6 34 6 48 0" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/></svg>
);
const Saturn = () => (
  <svg {...iconProps}><circle cx="32" cy="32" r="14" fill="#FDE68A"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="#F59E0B" strokeWidth="4"/></svg>
);
const Rocket = () => (
  <svg {...iconProps}><path d="M32 10c8 6 12 16 12 20l-8 2-2 8c-4 0-14-4-20-12 8-8 18-12 18-18z" fill="#60A5FA"/><circle cx="38" cy="24" r="4" fill="#93C5FD"/><path d="M18 38l-6 10 10-6" fill="#F87171"/></svg>
);
const Star = () => (
  <svg {...iconProps}><path d="M32 10l6.5 12.5L52 24l-10 8.5L45 44l-13-7-13 7 3-11.5L12 24l13.5-1.5L32 10z" fill="#FCD34D"/></svg>
);
const Comet = () => (
  <svg {...iconProps}><circle cx="46" cy="26" r="10" fill="#A78BFA"/><path d="M10 50c10-20 16-26 30-28" stroke="#C4B5FD" strokeWidth="6" strokeLinecap="round"/></svg>
);
const Astronaut = () => (
  <svg {...iconProps}><circle cx="32" cy="24" r="10" fill="#9CA3AF"/><rect x="22" y="34" width="20" height="14" rx="6" fill="#D1D5DB"/><circle cx="32" cy="24" r="6" fill="#111827"/></svg>
);
const Telescope = () => (
  <svg {...iconProps}><rect x="30" y="34" width="4" height="16" fill="#6B7280"/><path d="M14 20l28 10-4 8L10 26l4-6z" fill="#9CA3AF"/><circle cx="44" cy="30" r="6" fill="#93C5FD"/></svg>
);
const Galaxy = () => (
  <svg {...iconProps}><circle cx="32" cy="32" r="3" fill="#F472B6"/><ellipse cx="32" cy="32" rx="24" ry="8" stroke="#F9A8D4" strokeWidth="3"/><ellipse cx="32" cy="32" rx="8" ry="24" stroke="#F472B6" strokeWidth="3"/></svg>
);
const Alien = () => (
  <svg {...iconProps}><ellipse cx="32" cy="30" rx="12" ry="16" fill="#34D399"/><ellipse cx="26" cy="28" rx="4" ry="6" fill="#111827"/><ellipse cx="38" cy="28" rx="4" ry="6" fill="#111827"/></svg>
);
const Ufo = () => (
  <svg {...iconProps}><ellipse cx="32" cy="38" rx="18" ry="6" fill="#60A5FA"/><circle cx="32" cy="30" r="8" fill="#93C5FD"/><circle cx="22" cy="38" r="2" fill="#FCD34D"/><circle cx="32" cy="38" r="2" fill="#FCD34D"/><circle cx="42" cy="38" r="2" fill="#FCD34D"/></svg>
);
const Meteor = () => (
  <svg {...iconProps}><circle cx="44" cy="22" r="8" fill="#F59E0B"/><path d="M10 50C18 38 26 30 36 26" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/></svg>
);
const Satellite = () => (
  <svg {...iconProps}><rect x="28" y="26" width="8" height="12" fill="#9CA3AF"/><rect x="16" y="28" width="10" height="8" fill="#6B7280"/><rect x="38" y="28" width="10" height="8" fill="#6B7280"/><rect x="30" y="24" width="4" height="4" fill="#D1D5DB"/></svg>
);
const MoonFlag = () => (
  <svg {...iconProps}><circle cx="28" cy="38" r="10" fill="#E5E7EB"/><rect x="34" y="18" width="2" height="16" fill="#6B7280"/><path d="M36 20l10 2-10 4v-6z" fill="#60A5FA"/></svg>
);
const Sun = () => (
  <svg {...iconProps}><circle cx="32" cy="32" r="12" fill="#FBBF24"/><g stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"><path d="M32 6v10"/><path d="M32 48v10"/><path d="M6 32h10"/><path d="M48 32h10"/><path d="M14 14l7 7"/><path d="M43 43l7 7"/><path d="M14 50l7-7"/><path d="M43 21l7-7"/></g></svg>
);
const BlackHole = () => (
  <svg {...iconProps}><circle cx="32" cy="32" r="10" fill="#111827"/><ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="#6B7280" strokeWidth="3"/></svg>
);
const Station = () => (
  <svg {...iconProps}><rect x="20" y="28" width="24" height="8" rx="2" fill="#9CA3AF"/><rect x="12" y="26" width="6" height="12" fill="#6B7280"/><rect x="46" y="26" width="6" height="12" fill="#6B7280"/><rect x="28" y="22" width="8" height="4" fill="#D1D5DB"/></svg>
);
const Shuttle = () => (
  <svg {...iconProps}><path d="M18 40l28-8-8 14-12-2-8-4z" fill="#93C5FD"/><path d="M18 40l-6 8 10-2 2-4-6-2z" fill="#F87171"/></svg>
);
const Earth = () => (
  <svg {...iconProps}><circle cx="32" cy="32" r="16" fill="#60A5FA"/><path d="M20 30c6 0 8-8 16-8-2 6 6 8 8 12-6 4-12 8-24 4 2-4-2-4 0-8z" fill="#34D399"/></svg>
);

const ICONS = [Planet, Saturn, Rocket, Star, Comet, Astronaut, Telescope, Galaxy, Alien, Ufo, Meteor, Satellite, MoonFlag, Sun, BlackHole, Station, Shuttle, Earth];

const SPARK_COLORS = ['#ffffff', '#fde68a', '#60a5fa', '#5eead4', '#a78bfa', '#f472b6', '#fb923c'];

/* =====================
   Sistema de audio
===================== */
let _audioCtx = null;
const getCtx = () => {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
};
const tone = (freq, t0, dur, vol = 0.22, type = 'sine') => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime + t0);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t0 + dur);
    osc.start(ctx.currentTime + t0);
    osc.stop(ctx.currentTime + t0 + dur + 0.02);
  } catch (_e) { /* AudioContext no disponible */ }
};
const playFlip    = () => { tone(800, 0, 0.07, 0.15, 'sine'); tone(500, 0.04, 0.06, 0.08, 'sine'); };
const playMatch   = () => { [[660,0],[880,0.13],[1100,0.26]].forEach(([f,t]) => tone(f, t, 0.28, 0.25, 'triangle')); };
const playNoMatch = () => { tone(280, 0, 0.18, 0.12, 'sawtooth'); };
const playWin     = () => {
  [[523,0],[659,0.14],[784,0.28],[1047,0.42],[784,0.56],[1047,0.70],[1319,0.84]]
    .forEach(([f,t]) => tone(f, t, 0.35, 0.22, 'triangle'));
};

/* =====================
   Personajes seleccionables
===================== */
const AstroChar = () => (
  <svg viewBox="0 0 60 72" fill="none">
    <circle cx="30" cy="21" r="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
    <circle cx="30" cy="21" r="10" fill="#1e3a8a"/>
    <ellipse cx="27" cy="18" rx="3" ry="2" fill="rgba(255,255,255,.45)"/>
    <rect x="18" y="35" width="24" height="22" rx="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
    <rect x="23" y="41" width="14" height="8" rx="3" fill="#94a3b8"/>
    <circle cx="30" cy="45" r="2.5" fill="#60a5fa"/>
    <rect x="7"  y="36" width="13" height="7" rx="3.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
    <rect x="40" y="36" width="13" height="7" rx="3.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
    <rect x="20" y="55" width="8"  height="11" rx="3" fill="#94a3b8"/>
    <rect x="32" y="55" width="8"  height="11" rx="3" fill="#94a3b8"/>
  </svg>
);
const AlienChar = () => (
  <svg viewBox="0 0 60 72" fill="none">
    <line x1="22" y1="8"  x2="16" y2="1"  stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="15" cy="0" r="3" fill="#fbbf24"/>
    <line x1="38" y1="8"  x2="44" y2="1"  stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="45" cy="0" r="3" fill="#fbbf24"/>
    <ellipse cx="30" cy="22" rx="20" ry="18" fill="#4ade80"/>
    <ellipse cx="21" cy="20" rx="6" ry="8" fill="#111827"/>
    <ellipse cx="39" cy="20" rx="6" ry="8" fill="#111827"/>
    <ellipse cx="19" cy="18" rx="2.5" ry="3.5" fill="#60a5fa"/>
    <ellipse cx="37" cy="18" rx="2.5" ry="3.5" fill="#60a5fa"/>
    <path d="M23 32 Q30 38 37 32" stroke="#166534" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <ellipse cx="30" cy="56" rx="14" ry="16" fill="#4ade80"/>
    <path d="M16 48 Q6  54 8  64"  stroke="#4ade80" strokeWidth="7" strokeLinecap="round" fill="none"/>
    <path d="M44 48 Q54 54 52 64" stroke="#4ade80" strokeWidth="7" strokeLinecap="round" fill="none"/>
  </svg>
);
const RobotChar = () => (
  <svg viewBox="0 0 60 72" fill="none">
    <rect x="28" y="0" width="4" height="10" rx="2" fill="#6b7280"/>
    <circle cx="30" cy="0" r="4" fill="#f59e0b"/>
    <rect x="10" y="10" width="40" height="26" rx="5" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5"/>
    <rect x="15" y="17" width="11" height="8" rx="3" fill="#38bdf8"/>
    <rect x="34" y="17" width="11" height="8" rx="3" fill="#38bdf8"/>
    <rect x="18" y="30" width="24" height="3" rx="1.5" fill="#374151"/>
    <rect x="22" y="31" width="4" height="1.5" rx=".75" fill="#f59e0b"/>
    <rect x="28" y="31" width="4" height="1.5" rx=".75" fill="#f59e0b"/>
    <rect x="34" y="31" width="4" height="1.5" rx=".75" fill="#f59e0b"/>
    <rect x="14" y="38" width="32" height="24" rx="5" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5"/>
    <circle cx="30" cy="50" r="6" fill="#374151"/>
    <circle cx="30" cy="50" r="3" fill="#38bdf8"/>
    <rect x="2"  y="39" width="14" height="8" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5"/>
    <rect x="44" y="39" width="14" height="8" rx="4" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5"/>
    <rect x="18" y="60" width="10" height="9" rx="3" fill="#4b5563"/>
    <rect x="32" y="60" width="10" height="9" rx="3" fill="#4b5563"/>
  </svg>
);
const PilotChar = () => (
  <svg viewBox="0 0 60 72" fill="none">
    <ellipse cx="30" cy="11" rx="17" ry="10" fill="#92400e"/>
    <ellipse cx="30" cy="21" rx="16" ry="16" fill="#fde68a"/>
    <rect x="14" y="17" width="13" height="9"  rx="4.5" fill="#1e3a5f" opacity=".9"/>
    <rect x="33" y="17" width="13" height="9"  rx="4.5" fill="#1e3a5f" opacity=".9"/>
    <line x1="27" y1="21.5" x2="33" y2="21.5" stroke="#374151" strokeWidth="1.5"/>
    <path d="M14 21 Q9 26 11 31"  stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M46 21 Q51 26 49 31" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M18 34 Q30 40 42 34" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" fill="none"/>
    <rect x="14" y="40" width="32" height="26" rx="7" fill="#1e3a5f"/>
    <line x1="30" y1="40" x2="30" y2="66" stroke="#374151" strokeWidth="1.5"/>
    <rect x="4"  y="41" width="12" height="9" rx="4.5" fill="#1e3a5f"/>
    <rect x="44" y="41" width="12" height="9" rx="4.5" fill="#1e3a5f"/>
    <rect x="18" y="64" width="10" height="8" rx="3" fill="#374151"/>
    <rect x="32" y="64" width="10" height="8" rx="3" fill="#374151"/>
  </svg>
);
const CmdChar = () => (
  <svg viewBox="0 0 60 72" fill="none">
    <rect x="12" y="3"  width="36" height="10" rx="3" fill="#1e3a5f"/>
    <rect x="15" y="11" width="30" height="3"  rx="1.5" fill="#f59e0b"/>
    <ellipse cx="30" cy="26" rx="16" ry="16" fill="#fbbf24"/>
    <ellipse cx="22" cy="24" rx="3" ry="4" fill="#1e3a5f"/>
    <ellipse cx="38" cy="24" rx="3" ry="4" fill="#1e3a5f"/>
    <line x1="18" y1="18" x2="25" y2="20" stroke="#92400e" strokeWidth="2" strokeLinecap="round"/>
    <line x1="42" y1="18" x2="35" y2="20" stroke="#92400e" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="33" x2="36" y2="33" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="12" y="40" width="36" height="26" rx="6" fill="#1e3a5f"/>
    <circle cx="22" cy="50" r="3.5" fill="#f59e0b"/>
    <circle cx="30" cy="50" r="3.5" fill="#9ca3af"/>
    <circle cx="38" cy="50" r="3.5" fill="#b45309"/>
    <rect x="10" y="40" width="8" height="5" rx="2.5" fill="#f59e0b"/>
    <rect x="42" y="40" width="8" height="5" rx="2.5" fill="#f59e0b"/>
    <rect x="4"  y="40" width="10" height="8" rx="4" fill="#1e3a5f"/>
    <rect x="46" y="40" width="10" height="8" rx="4" fill="#1e3a5f"/>
    <rect x="18" y="64" width="10" height="8" rx="3" fill="#374151"/>
    <rect x="32" y="64" width="10" height="8" rx="3" fill="#374151"/>
  </svg>
);

const CHARACTERS = [
  { id: 'astro', name: 'Astronauta', color: '#60a5fa', Avatar: AstroChar },
  { id: 'alien', name: 'Alienígena', color: '#4ade80', Avatar: AlienChar },
  { id: 'robot', name: 'Robot',      color: '#38bdf8', Avatar: RobotChar },
  { id: 'pilot', name: 'Piloto',     color: '#ef4444', Avatar: PilotChar },
  { id: 'cmd',   name: 'Comandante', color: '#f59e0b', Avatar: CmdChar   },
];

/* ============== Utilidades ============== */
const DIFFICULTIES = { "4x4": { pairs: 8, cols: 4, rows: 4 }, "6x6": { pairs: 18, cols: 6, rows: 6 } };
const shuffle = (arr) => { const a = arr.slice(); for (let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]];} return a; };
const fmtTime = (ms) => { const s=Math.floor(ms/1000), m=Math.floor(s/60), r=s%60; return `${m.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`; };

/** Descubre imágenes en /public/cards */
async function discoverCardImages() {
  try {
    const res = await fetch(`${CARDS_DIR}cards.json`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.images) && data.images.length) {
        return data.images.map((u) => (u.startsWith("/") ? u : CARDS_DIR + u));
      }
    }
  } catch {}
  const checks = await Promise.all(
    CANDIDATES.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = src;
        })
    )
  );
  return CANDIDATES.filter((_, i) => checks[i]);
}

/** Construye mazo (imágenes si hay suficientes; si no, íconos) */
function buildDeck(pairs, images) {
  if (Array.isArray(images) && images.length >= pairs) {
    const base = images.slice(0, pairs).map((url, idx) => ({
      type: `img${idx}`,
      ImgUrl: url,
    }));
    let uid = 0;
    return shuffle([...base, ...base]).map((b) => ({
      id: `c${uid++}`,
      type: b.type,
      ImgUrl: b.ImgUrl,
      Icon: null,
      matched: false,
    }));
  }
  const base = ICONS.slice(0, pairs).map((Icon, idx) => ({ type: `t${idx}`, Icon }));
  let uid = 0;
  return shuffle([...base, ...base]).map((b) => ({
    id: `c${uid++}`,
    type: b.type,
    Icon: b.Icon,
    ImgUrl: null,
    matched: false,
  }));
}

/** =====================================================
 *  Grid responsive
 *  ===================================================== */
function useResponsiveGrid(cols, rows) {
  const wrapRef = useRef(null), headerRef = useRef(null), statsRef = useRef(null), footerRef = useRef(null);
  const [style, setStyle] = useState({ cell:120, gap:12, widthPx:600 });

  useLayoutEffect(() => {
    const calc = () => {
      const wrapW = wrapRef.current?.clientWidth || window.innerWidth;
      const wrapH = window.innerHeight;
      const headH = headerRef.current?.offsetHeight || 0;
      const statH = statsRef.current?.offsetHeight || 0;
      const footH = footerRef.current?.offsetHeight || 0;

      const gap = Math.round(Math.max(8, Math.min(20, Math.min(wrapW, wrapH) * 0.012)));
      const sidePadding = 32;
      const availW = Math.max(280, wrapW - sidePadding);
      const cellByW = Math.floor((availW - gap * (cols - 1)) / cols);

      const reservedBottom = 32;
      const availH = Math.max(300, wrapH - headH - statH - footH - reservedBottom);
      const cellByH = Math.floor(((availH - gap * (rows - 1)) / rows) * 0.75);

      const cell = Math.max(56, Math.min(220, Math.min(cellByW, cellByH)));
      const widthPx = cols * cell + (cols - 1) * gap;
      setStyle({ cell, gap, widthPx });
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", calc);
    return () => { window.removeEventListener("resize", calc); window.removeEventListener("orientationchange", calc); };
  }, [cols, rows]);

  return { style, wrapRef, headerRef, statsRef, footerRef };
}

/* =====================
   Starfield de fondo
===================== */
function Starfield() {
  const stars = useMemo(() =>
    Array.from({ length: 65 }, (_, i) => ({
      id: i,
      x: +(Math.random() * 100).toFixed(2),
      y: +(Math.random() * 100).toFixed(2),
      r: +(Math.random() * 1.6 + 0.4).toFixed(1),
      op: +(Math.random() * 0.55 + 0.15).toFixed(2),
      dur: +(Math.random() * 3 + 2).toFixed(1),
      del: +(Math.random() * 7).toFixed(1),
    })), []
  );
  const shoots = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: +(Math.random() * 60).toFixed(1),
      left: +(Math.random() * 70).toFixed(1),
      dur: +(1.4 + Math.random() * 1.6).toFixed(1),
      del: +(i * 4.5 + Math.random() * 2).toFixed(1),
    })), []
  );
  return (
    <div className="starfield" aria-hidden>
      {stars.map(s => (
        <span
          key={s.id}
          className="star-dot"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.r * 2}px`,
            height: `${s.r * 2}px`,
            '--star-op': s.op,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.del}s`,
          }}
        />
      ))}
      {shoots.map(s => (
        <span
          key={s.id}
          className="shoot-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.del}s`,
          }}
        />
      ))}
    </div>
  );
}

/* =====================
   Overlay INTRO VIDEO (con soporte retrato)
===================== */
function IntroOverlay({ step, fading, onStartRequested, onSkip, videoUrl, posterUrl }) {
  const videoRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (step === "video" && videoRef.current) {
      const v = videoRef.current;
      const onMeta = () => {
        setIsPortrait(v.videoHeight > v.videoWidth);
        v.play?.().catch(()=>{});
      };
      if (v.readyState >= 1) onMeta();
      v.addEventListener("loadedmetadata", onMeta, { once: true });
      return () => v.removeEventListener("loadedmetadata", onMeta);
    }
  }, [step]);

  return (
    <div className={`intro-modal ${fading ? "fade-out" : ""}`} role="dialog" aria-modal="true">
      {step === "gate" && (
        <div className="intro-gate-card">
          {/* Badge “Briefing” eliminado */}
          <h2>🚀 {GAME_NAME}</h2>
          <p className="intro-gate-text">
            Cadete, prepárate. Antes de despegar, mira un breve mensaje de <b>Luna</b> con las instrucciones de misión.
          </p>
          <div className="intro-gate-actions">
            <button className="btn btn-xl" onClick={onStartRequested}>Iniciar misión</button>
            <button className="btn btn-ghost" onClick={onSkip} aria-label="Saltar introducción">Saltar</button>
          </div>
        </div>
      )}

      {step === "video" && (
        <div
          className="intro-video-layer"
          style={{ "--poster": posterUrl ? `url(${posterUrl})` : "none" }}
        >
          <button className="skip-btn" onClick={onSkip} aria-label="Saltar video">⏭ Saltar</button>
          <div className={`intro-video-frame ${isPortrait ? "portrait" : ""}`}>
            {videoUrl && !loadError ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="intro-video"
                playsInline
                poster={posterUrl}
                onEnded={onSkip}
                onError={() => setLoadError(true)}
              />
            ) : (
              <div className="intro-video-empty">
                <p>No se pudo cargar <code>{DEFAULT_VIDEO_URL}</code></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** =====================
 *  Componente principal
 *  ===================== */
export default function App() {
  const [phase, setPhase] = useState("menu");            // "menu" | "playing"
  const [introStep, setIntroStep] = useState("gate");    // "gate" | "video" | "hidden"
  const [introFading, setIntroFading] = useState(false);

  const [difficulty, setDifficulty] = useState("4x4");
  const [mode, setMode] = useState("single");            // "single" | "duo"

  const [images, setImages] = useState([]);
  const [deck, setDeck] = useState(() => buildDeck(DIFFICULTIES["4x4"].pairs, []));
  const [flipped, setFlipped] = useState([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [won, setWon] = useState(false);
  const [scores, setScores] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [fxIds, setFxIds] = useState([]);
  const [charP1, setCharP1] = useState(CHARACTERS[0]);
  const [charP2, setCharP2] = useState(CHARACTERS[1]);
  const [turnBanner, setTurnBanner] = useState(false);

  const videoUrl = DEFAULT_VIDEO_URL;

  useEffect(() => {
    document.title = GAME_NAME;
    document.documentElement.style.setProperty(
      '--card-back-img',
      `url(${BASE}ui/card-back.png) center / contain no-repeat`
    );
  }, []);

  // Descubre imágenes al cargar
  useEffect(() => {
    let mounted = true;
    discoverCardImages().then((list) => {
      if (!mounted) return;
      setImages(list);
      const { pairs } = DIFFICULTIES[difficulty];
      setDeck(buildDeck(pairs, list));
    });
    return () => { mounted = false; };
  }, []);

  // Rehacer mazo si cambia dificultad estando en menú
  useEffect(() => {
    if (phase !== "menu") return;
    const { pairs } = DIFFICULTIES[difficulty];
    setDeck(buildDeck(pairs, images));
  }, [difficulty, images, phase]);

  // Timer
  useEffect(() => {
    if (!startedAt || won || phase !== "playing") return;
    const id = setInterval(() => setElapsedMs(Date.now() - startedAt), 200);
    return () => clearInterval(id);
  }, [startedAt, won, phase]);

  // Récord (solo single)
  const bestKey = `mme-best-${difficulty}`;
  const best = useMemo(() => {
    if (mode !== "single") return null;
    try {
      const raw = localStorage.getItem(bestKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, [bestKey, mode]);

  function initDeckNow() {
    const { pairs } = DIFFICULTIES[difficulty];
    setDeck(buildDeck(pairs, images));
  }

  function startGame() {
    initDeckNow();
    setFlipped([]); setLocked(false); setMoves(0); setMatchedCount(0);
    setStartedAt(null); setElapsedMs(0); setWon(false);
    setScores([0, 0]); setCurrentPlayer(0); setFxIds([]);
    setPhase("playing");
  }

  function toMenu() {
    setPhase("menu"); setWon(false); setStartedAt(null); setElapsedMs(0); setFxIds([]);
    initDeckNow();
  }

  const closeIntro = () => {
    setIntroFading(true);
    setTimeout(() => { setIntroStep("hidden"); setIntroFading(false); }, 350);
  };
  const handleIntroStart = () => { if (videoUrl) setIntroStep("video"); else closeIntro(); };

  function restart() { startGame(); }

  function onFlip(cardId) {
    if (locked || phase !== "playing") return;
    const card = deck.find((c) => c.id === cardId);
    if (!card || card.matched) return;
    if (flipped.includes(cardId)) return;

    playFlip();
    if (!startedAt) setStartedAt(Date.now());
    const next = [...flipped, cardId];
    setFlipped(next);

    if (next.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [aId, bId] = next;
      const a = deck.find((c) => c.id === aId);
      const b = deck.find((c) => c.id === bId);

      if ((a.type === b.type)) {
        setTimeout(() => {
          playMatch();
          setDeck(prev => prev.map(c => (c.id === aId || c.id === bId ? { ...c, matched:true } : c)));
          setFlipped([]);
          setMatchedCount(n => n + 1);

          if (mode === "duo") setScores(prev => { const copy=[...prev]; copy[currentPlayer]+=1; return copy; });

          setFxIds(prev => [...prev, aId, bId]);
          setTimeout(() => setFxIds(prev => prev.filter(id => id !== aId && id !== bId)), 900);

          setLocked(false);
        }, 350);
      } else {
        setTimeout(() => {
          playNoMatch();
          setFlipped([]);
          if (mode === "duo") {
            setCurrentPlayer(p => (p === 0 ? 1 : 0));
            setTurnBanner(true);
            setTimeout(() => setTurnBanner(false), 1200);
          }
          setLocked(false);
        }, 800);
      }
    }
  }

  useEffect(() => {
    const totalPairs = DIFFICULTIES[difficulty].pairs;
    if (matchedCount === totalPairs && totalPairs > 0 && !won) {
      setWon(true);
      playWin();
      if (mode === "single") {
        const finalMs = Date.now() - startedAt;
        const record = { moves, timeMs: finalMs, time: fmtTime(finalMs) };
        try {
          const prev = localStorage.getItem(bestKey);
          if (!prev) localStorage.setItem(bestKey, JSON.stringify(record));
          else {
            const p = JSON.parse(prev);
            const better = record.timeMs < p.timeMs || (record.timeMs === p.timeMs && moves < p.moves);
            if (better) localStorage.setItem(bestKey, JSON.stringify(record));
          }
        } catch {}
      }
    }
  }, [matchedCount, difficulty, startedAt, moves, won, mode, bestKey]);

  const { cols, rows } = DIFFICULTIES[difficulty];
  const { style: gridStyle, wrapRef, headerRef, statsRef, footerRef } = useResponsiveGrid(cols, rows);

  const turnAttr = mode === "duo" && phase === "playing" ? (currentPlayer === 0 ? "p1" : "p2") : "none";

  return (
    <div className="wrap" ref={wrapRef} data-turn={turnAttr}>
      <Starfield />
      {/* Intro overlay (inicial) */}
      {introStep !== "hidden" && (
        <IntroOverlay
          step={introStep}
          fading={introFading}
          onStartRequested={handleIntroStart}
          onSkip={closeIntro}
          videoUrl={DEFAULT_VIDEO_URL}
          posterUrl={DEFAULT_POSTER_URL}
        />
      )}

      <header className="topbar" ref={headerRef}>
        <div className="brand">🚀 {GAME_NAME}</div>
        <div className="controls">
          {phase === "playing" ? (
            <>
              <button className="btn btn-ghost" onClick={toMenu} title="Volver al dashboard">Dashboard</button>
              <button className="btn" onClick={restart}>Reiniciar</button>
            </>
          ) : (
            <span className="muted"></span>
          )}
        </div>
      </header>

      {/* DASHBOARD */}
      {phase === "menu" && (
        <Dashboard
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          mode={mode}
          setMode={setMode}
          onStart={startGame}
          statsRef={statsRef}
          charP1={charP1} setCharP1={setCharP1}
          charP2={charP2} setCharP2={setCharP2}
        />
      )}

      {/* JUEGO */}
      {phase === "playing" && (
        <>
          <section className="stats" ref={statsRef}>
            {mode === "single" ? (
              <>
                <div><span className="tag">Movimientos</span> <b>{moves}</b></div>
                <div><span className="tag">Tiempo</span> <b>{fmtTime(elapsedMs)}</b></div>
                <div>
                  <span className="tag">Récord</span>{" "}
                  {best ? <b>{best.time} · {best.moves} mov</b> : <span className="muted">—</span>}
                </div>
              </>
            ) : (
              <div className="duo-bar">
                <div className={"duo-player" + (currentPlayer === 0 ? " active" : " idle")}
                     style={{ '--char-color': charP1.color }}>
                  <div className="duo-avatar"><charP1.Avatar /></div>
                  <div className="duo-info">
                    <span className="duo-name">{charP1.name}</span>
                    <span className="duo-score">{scores[0]}</span>
                  </div>
                </div>

                <div className="duo-center">
                  {turnBanner
                    ? <span className="turn-flash" key={currentPlayer}>
                        {currentPlayer === 0 ? `¡Turno de ${charP1.name}!` : `¡Turno de ${charP2.name}!`}
                      </span>
                    : <span className="turn-arrow">{currentPlayer === 0 ? '◀' : '▶'}</span>
                  }
                </div>

                <div className={"duo-player" + (currentPlayer === 1 ? " active" : " idle")}
                     style={{ '--char-color': charP2.color }}>
                  <div className="duo-info right">
                    <span className="duo-name">{charP2.name}</span>
                    <span className="duo-score">{scores[1]}</span>
                  </div>
                  <div className="duo-avatar"><charP2.Avatar /></div>
                </div>
              </div>
            )}
          </section>

          <Board
            deck={deck}
            cols={cols}
            rows={rows}
            flipped={flipped}
            onFlip={onFlip}
            gridStyle={gridStyle}
            fxIds={fxIds}
          />

          {won && (
            <WinModal
              mode={mode}
              scores={scores}
              time={fmtTime(Date.now() - startedAt)}
              moves={moves}
              onAgain={restart}
              onMenu={toMenu}
              charP1={charP1}
              charP2={charP2}
            />
          )}
        </>
      )}
    </div>
  );
}

/** =============
 *  Dashboard (limpio)
 *  ============ */
function CharPicker({ label, selected, onChange, exclude }) {
  return (
    <div className="char-picker">
      <span className="dash-label">{label}</span>
      <div className="char-grid">
        {CHARACTERS.map(ch => (
          <button
            key={ch.id}
            className={"char-card" + (selected.id === ch.id ? " selected" : "") + (exclude?.id === ch.id ? " taken" : "")}
            style={{ '--ch-color': ch.color }}
            onClick={() => exclude?.id !== ch.id && onChange(ch)}
            aria-label={ch.name}
            title={ch.name}
          >
            <div className="char-card-avatar"><ch.Avatar /></div>
            <span className="char-card-name">{ch.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ difficulty, setDifficulty, mode, setMode, onStart, charP1, setCharP1, charP2, setCharP2 }) {
  return (
    <div className="dashboard">
      <div className="dash-card">
        <h1>🚀 {GAME_NAME}</h1>
        <p className="dash-sub">Elige modo, dificultad y personaje.</p>

        <div className="dash-grid">
          <div className="dash-field">
            <label className="dash-label">Dificultad</label>
            <select
              className="dash-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              aria-label="Seleccionar dificultad"
            >
              <option value="4x4">Fácil (4×4)</option>
              <option value="6x6">Experto (6×6)</option>
            </select>
          </div>

          <div className="dash-field">
            <label className="dash-label">Modo de juego</label>
            <div className="mode-toggle" role="radiogroup" aria-label="Modo de juego">
              <label className={"mode-chip " + (mode === "single" ? "selected" : "")}>
                <input type="radio" name="mode" checked={mode === "single"} onChange={() => setMode("single")} />
                1 jugador
              </label>
              <label className={"mode-chip " + (mode === "duo" ? "selected" : "")}>
                <input type="radio" name="mode" checked={mode === "duo"} onChange={() => setMode("duo")} />
                2 jugadores
              </label>
            </div>
          </div>
        </div>

        {mode === "single" ? (
          <CharPicker label="Tu personaje" selected={charP1} onChange={setCharP1} />
        ) : (
          <div className="duo-pickers">
            <CharPicker label="Jugador 1" selected={charP1} onChange={setCharP1} exclude={charP2} />
            <CharPicker label="Jugador 2" selected={charP2} onChange={setCharP2} exclude={charP1} />
          </div>
        )}

        <div className="dash-actions">
          <button className="btn btn-xl" onClick={onStart} aria-label="Iniciar juego">Iniciar misión</button>
        </div>
      </div>
    </div>
  );
}

/** ============
 *  Tablero
 *  ============ */
function Board({ deck, cols, rows, flipped, onFlip, gridStyle, fxIds }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current; if (!el) return;
    const handler = (e) => {
      const items = Array.from(el.querySelectorAll("[data-cell]"));
      const idx = items.indexOf(document.activeElement);
      if (idx === -1) return;
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      if (e.key === "ArrowRight") { e.preventDefault(); items[(idx + 1) % items.length].focus(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); items[(idx - 1 + items.length) % items.length].focus(); }
      if (e.key === "ArrowDown")  { e.preventDefault(); items[((row + 1) % rows) * cols + col].focus(); }
      if (e.key === "ArrowUp")    { e.preventDefault(); items[(((row - 1 + rows) % rows) * cols) + col].focus(); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); items[idx].click(); }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [cols, rows]);

  return (
    <div
      ref={gridRef}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${gridStyle.cell}px)`,
        gap: gridStyle.gap,
        width: gridStyle.widthPx,
      }}
      role="grid"
      aria-label="Tablero de cartas"
    >
      {deck.map((card, i) => {
        const isFlipped = flipped.includes(card.id) || card.matched;
        const isFx = fxIds?.includes(card.id);
        return (
          <Card
            key={card.id}
            card={card}
            index={i}
            isFlipped={isFlipped}
            onFlip={() => onFlip(card.id)}
            isFx={isFx}
          />
        );
      })}
    </div>
  );
}

/** ============
 *  Carta
 *  ============ */
function Card({ card, index, isFlipped, onFlip, isFx }) {
  const { Icon, ImgUrl } = card;
  const label = card.matched ? "Completada" : isFlipped ? "Visible" : "Oculta";
  return (
    <button
      className={"card " + (isFlipped ? "flipped " : "") + (isFx ? "matched-fx " : "") + (card.matched ? "matched " : "")}
      onClick={onFlip}
      data-cell
      style={{ '--i': index }}
      aria-label={`Carta ${index + 1}: ${label}`}
    >
      <div className="card-inner">
        <div className="card-face card-back"><div className="dorso">✦</div></div>
        <div className="card-face card-front">
          {ImgUrl ? (
            <img className="card-img" src={ImgUrl} alt="" loading="eager" />
          ) : (
            Icon && <Icon />
          )}
        </div>
      </div>
      {isFx && <Sparkles />}
    </button>
  );
}

/** ============
 *  Modal Win
 *  ============ */
function WinModal({ mode, scores, time, moves, onAgain, onMenu, charP1, charP2 }) {
  const [p1, p2] = scores || [0, 0];
  const winner = mode === "duo"
    ? (p1 === p2 ? null : p1 > p2 ? charP1 : charP2)
    : charP1;
  return (
    <div className="modal">
      <div className="modal-card">
        {winner && (
          <div className="win-char" style={{ '--ch-color': winner.color }}>
            <winner.Avatar />
          </div>
        )}
        <h2>🎉 ¡Misión completada!</h2>
        {mode === "single" ? (
          <>
            <p><b>Tiempo:</b> {time}</p>
            <p><b>Movimientos:</b> {moves}</p>
          </>
        ) : (
          <>
            <div className="win-score-row">
              <div className="win-score-cell" style={{ '--ch-color': charP1.color }}>
                <div className="win-score-avatar"><charP1.Avatar /></div>
                <span>{charP1.name}</span>
                <b className="win-pts">{p1}</b>
              </div>
              <span className="win-vs">vs</span>
              <div className="win-score-cell" style={{ '--ch-color': charP2.color }}>
                <div className="win-score-avatar"><charP2.Avatar /></div>
                <span>{charP2.name}</span>
                <b className="win-pts">{p2}</b>
              </div>
            </div>
            <p className="winner">
              {p1 === p2 ? "¡Empate!" : `🏆 ¡Gana ${winner.name}!`}
            </p>
          </>
        )}
        <div className="modal-actions">
          <button className="btn" onClick={onAgain}>Jugar de nuevo</button>
          <button className="btn btn-ghost" onClick={onMenu}>Volver al dashboard</button>
        </div>
      </div>
    </div>
  );
}

/** ============
 *  Sparkles FX
 *  ============ */
function Sparkles({ count = 16 }) {
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 28 + Math.random() * 40;
      return {
        id: i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 3 + Math.random() * 7,
        delay: Math.random() * 0.12,
        duration: 0.55 + Math.random() * 0.35,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      };
    });
  }, [count]);

  return (
    <div className="sparkles" aria-hidden>
      {items.map((s) => (
        <span
          key={s.id}
          className="spark"
          style={{
            "--tx": `${s.tx}px`,
            "--ty": `${s.ty}px`,
            "--d": `${s.duration}s`,
            "--delay": `${s.delay}s`,
            "--sz": `${s.size}px`,
            "--color": s.color,
          }}
        />
      ))}
    </div>
  );
}
