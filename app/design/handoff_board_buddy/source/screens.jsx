// screens.jsx — Board Buddy mobile screens (Android, 412x892 viewport)
// Warm minimal aesthetic. Terracotta accent, sand background.

const BB = {
  // warm minimal palette
  bg:      '#FAF6F0',     // sand
  surface: '#FFFFFF',
  ink:     '#1F1A16',     // deep ink
  ink2:    '#5C544C',     // muted ink
  ink3:    '#9A938A',     // hint
  hairline:'#E8E1D6',
  terracotta: '#C24E1B',  // primary accent
  terracottaSoft: '#F4E2D6',
  cream:   '#F2EADC',
  // state palette — calm warm hues
  calm:    '#3F6B5E',     // forest (abundant time)
  warn:    '#D88A2F',     // amber (≤20%)
  alert:   '#B23A1F',     // brick red (timeout)
  // typography
  sans:    '"Inter", system-ui, -apple-system, sans-serif',
  display: '"Fraunces", Georgia, serif',
  mono:    '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
};

// ─────────────────────────────────────────────────────────────
// Reusable atoms
// ─────────────────────────────────────────────────────────────
function StatusBar({ dark = false, transparent = false }) {
  const c = dark ? '#fff' : BB.ink;
  return (
    <div style={{
      height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0,
      background: transparent ? 'transparent' : 'inherit',
      fontFamily: BB.sans,
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: c, letterSpacing: 0.2 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={c}>
          <path d="M1 7v3h2V7H1zm4-2v5h2V5H5zm4-2v7h2V3H9zm4-2v9h2V1h-2z"/>
        </svg>
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M7 8.5v.5M2 5a7 7 0 0110 0M4 7a4 4 0 016 0"/>
        </svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke={c}/>
          <rect x="2" y="2" width="14" height="7" rx="1" fill={c}/>
          <rect x="19.5" y="3.5" width="1.5" height="4" rx="0.5" fill={c}/>
        </svg>
      </div>
    </div>
  );
}

function GestureBar({ dark = false }) {
  return (
    <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 108, height: 4, borderRadius: 2, background: dark ? 'rgba(255,255,255,.55)' : 'rgba(31,26,22,.5)' }}/>
    </div>
  );
}

function Frame({ children, bg = BB.bg, dark = false, transparentStatus = false }) {
  return (
    <div style={{
      width: 412, height: 892,
      background: bg, color: BB.ink,
      fontFamily: BB.sans,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <StatusBar dark={dark} transparent={transparentStatus}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {children}
      </div>
      <GestureBar dark={dark}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen 1 — Home
// ─────────────────────────────────────────────────────────────
function S1_Home() {
  return (
    <Frame>
      <div style={{ padding: '32px 28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: BB.ink3, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>Hola</div>
          <div style={{ fontFamily: BB.display, fontSize: 36, fontWeight: 500, letterSpacing: -0.8, color: BB.ink, marginTop: 4, lineHeight: 1.05 }}>Board Buddy</div>
        </div>
        <button style={{ width: 44, height: 44, borderRadius: 22, border: `1px solid ${BB.hairline}`, background: BB.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={BB.ink} strokeWidth="1.5">
            <circle cx="10" cy="10" r="2.5"/>
            <path d="M10 1.5v3M10 15.5v3M3.5 3.5l2 2M14.5 14.5l2 2M1.5 10h3M15.5 10h3M3.5 16.5l2-2M14.5 5.5l2-2"/>
          </svg>
        </button>
      </div>

      {/* Resume banner */}
      <div style={{ margin: '0 20px 16px', borderRadius: 18, background: BB.terracottaSoft, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: BB.terracotta, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round">
            <path d="M5 3l9 6-9 6V3z" fill="#fff"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: BB.ink }}>Continuar partida</div>
          <div style={{ fontSize: 12, color: BB.ink2, marginTop: 2 }}>Turno de Ana · 1:12 restantes</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={BB.terracotta} strokeWidth="2" strokeLinecap="round"><path d="M6 4l5 5-5 5"/></svg>
      </div>

      {/* Section header */}
      <div style={{ padding: '8px 28px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: BB.ink, letterSpacing: 0.4, textTransform: 'uppercase' }}>Juegos</div>
        <div style={{ fontSize: 12, color: BB.ink3 }}>1 disponible</div>
      </div>

      {/* Game cards */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <GameCard active title="Rummikub" subtitle="Temporizador por turno" badge="MVP"/>
        <GameCard title="Scrabble" subtitle="Próximamente"/>
        <GameCard title="Catán" subtitle="Próximamente"/>
      </div>

      {/* Stats footer */}
      <div style={{ marginTop: 'auto', padding: '20px 28px 28px', borderTop: `1px solid ${BB.hairline}`, display: 'flex', justifyContent: 'space-between' }}>
        <Stat label="Partidas" value="14"/>
        <Stat label="Horas jugadas" value="9.2"/>
        <Stat label="Pasos por voz" value="78%"/>
      </div>
    </Frame>
  );
}

function GameCard({ title, subtitle, active, badge }) {
  return (
    <div style={{
      borderRadius: 18, background: active ? BB.surface : BB.cream,
      padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16,
      border: `1px solid ${active ? BB.hairline : 'transparent'}`,
      opacity: active ? 1 : 0.55,
      boxShadow: active ? '0 1px 0 rgba(0,0,0,.02), 0 6px 18px rgba(31,26,22,.04)' : 'none',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: active ? BB.terracotta : 'rgba(31,26,22,.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={active ? '#fff' : BB.ink2} strokeWidth="1.6" strokeLinecap="round">
          <circle cx="13" cy="13" r="9"/>
          <path d="M13 7v6l4 2.5"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: BB.display, fontSize: 22, fontWeight: 500, color: BB.ink, letterSpacing: -0.3 }}>{title}</div>
          {badge && <span style={{ fontSize: 10, fontWeight: 700, color: BB.terracotta, background: BB.terracottaSoft, padding: '2px 7px', borderRadius: 100, letterSpacing: 0.5 }}>{badge}</span>}
        </div>
        <div style={{ fontSize: 13, color: BB.ink2, marginTop: 2 }}>{subtitle}</div>
      </div>
      {active && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={BB.ink} strokeWidth="1.7" strokeLinecap="round"><path d="M7 4l6 6-6 6"/></svg>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: BB.display, fontSize: 22, fontWeight: 500, color: BB.ink, letterSpacing: -0.4 }}>{value}</div>
      <div style={{ fontSize: 11, color: BB.ink3, marginTop: 2, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen 2 — Setup partida
// ─────────────────────────────────────────────────────────────
function S2_Setup() {
  return (
    <Frame>
      <TopNav title="Nueva partida" subtitle="Rummikub"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }}>
        {/* Time stepper */}
        <FieldLabel>Tiempo por turno</FieldLabel>
        <Stepper value="2:00" hint="ajustes de 15s"/>

        {/* Players count */}
        <FieldLabel>Número de jugadores</FieldLabel>
        <Stepper value="4" hint="2 a 8"/>

        {/* Players list */}
        <FieldLabel>Jugadores</FieldLabel>
        <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          {['Rodrigo', 'Ana', 'Carlos', 'María'].map((n, i) => (
            <PlayerRow key={n} name={n} index={i} last={i === 3}/>
          ))}
        </div>

        {/* Toggles */}
        <FieldLabel>Asistencia</FieldLabel>
        <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          <ToggleRow icon="mic" title="Detección de voz" subtitle={'Decí "paso" para cambiar turno'} on/>
          <ToggleRow icon="speaker" title="Sonido al vencer" subtitle="Tono suave de alerta" on/>
          <ToggleRow icon="vibrate" title="Vibración" last/>
        </div>

        <div style={{ height: 100 }}/>
      </div>

      {/* Sticky CTA */}
      <div style={{ padding: '12px 20px 16px', borderTop: `1px solid ${BB.hairline}`, background: BB.bg }}>
        <button style={{
          width: '100%', height: 56, borderRadius: 16, border: 'none',
          background: BB.terracotta, color: '#fff',
          fontSize: 16, fontWeight: 600, fontFamily: BB.sans,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          cursor: 'pointer', letterSpacing: 0.2,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff"><path d="M5 3l9 6-9 6V3z"/></svg>
          Iniciar partida
        </button>
      </div>
    </Frame>
  );
}

function TopNav({ title, subtitle, action }) {
  return (
    <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button style={{ width: 40, height: 40, borderRadius: 20, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={BB.ink} strokeWidth="1.7" strokeLinecap="round"><path d="M12 4l-6 6 6 6"/></svg>
      </button>
      <div style={{ flex: 1 }}>
        {subtitle && <div style={{ fontSize: 11, color: BB.ink3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>{subtitle}</div>}
        <div style={{ fontFamily: BB.display, fontSize: 24, fontWeight: 500, color: BB.ink, letterSpacing: -0.4 }}>{title}</div>
      </div>
      {action}
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: BB.ink2, letterSpacing: 0.5, textTransform: 'uppercase', margin: '24px 4px 10px' }}>{children}</div>;
}

function Stepper({ value, hint }) {
  return (
    <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <button style={{ width: 44, height: 44, borderRadius: 22, border: `1px solid ${BB.hairline}`, background: BB.bg, color: BB.ink, fontSize: 22, fontWeight: 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: BB.mono, fontSize: 30, fontWeight: 500, color: BB.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {hint && <div style={{ fontSize: 11, color: BB.ink3, marginTop: 2 }}>{hint}</div>}
      </div>
      <button style={{ width: 44, height: 44, borderRadius: 22, border: 'none', background: BB.terracotta, color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
    </div>
  );
}

function PlayerRow({ name, index, last }) {
  const colors = ['#C24E1B', '#3F6B5E', '#7C5C3A', '#8A4F6B'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: last ? 'none' : `1px solid ${BB.hairline}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: colors[index % 4], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>{name[0]}</div>
      <div style={{ flex: 1, fontSize: 16, fontWeight: 500, color: BB.ink }}>{name}</div>
      <button style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={BB.ink2} strokeWidth="1.5" strokeLinecap="round">
          <path d="M11 2l3 3-9 9H2v-3l9-9z"/>
        </svg>
      </button>
    </div>
  );
}

function ToggleRow({ icon, title, subtitle, on, last }) {
  const icons = {
    mic:     <path d="M10 2a3 3 0 00-3 3v5a3 3 0 006 0V5a3 3 0 00-3-3zM4 9v1a6 6 0 0012 0V9M10 16v3M7 19h6"/>,
    speaker: <path d="M5 7v6h3l4 3V4L8 7H5zM14 8a3 3 0 010 4M16 6a6 6 0 010 8"/>,
    vibrate: <path d="M3 8v4M5 6v8M7 4v12M9 6v8M11 4v12M13 6v8M15 4v12M17 6v8"/>,
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: last ? 'none' : `1px solid ${BB.hairline}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: BB.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={BB.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {icons[icon]}
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: BB.ink }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: BB.ink3, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <Toggle on={on}/>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <div style={{
      width: 46, height: 28, borderRadius: 14,
      background: on ? BB.terracotta : '#D9D2C5',
      position: 'relative', flexShrink: 0,
      transition: 'background .18s',
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 22, height: 22, borderRadius: 11,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.18)',
        transition: 'left .18s',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen 8 — Settings (global)
// ─────────────────────────────────────────────────────────────
function S8_Settings() {
  return (
    <Frame>
      <TopNav title="Configuración"/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }}>
        <FieldLabel>General</FieldLabel>
        <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          <NavRow label="Tema" value="Sistema"/>
          <NavRow label="Idioma" value="Español"/>
          <NavRow label="Tamaño de texto" value="Mediano" last/>
        </div>

        <FieldLabel>Voz</FieldLabel>
        <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          <ToggleRow icon="mic" title="Detección activada" on/>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BB.hairline}` }}>
            <div style={{ fontSize: 12, color: BB.ink3, marginBottom: 8 }}>Palabra de paso</div>
            <div style={{ background: BB.bg, border: `1px solid ${BB.hairline}`, borderRadius: 10, padding: '10px 14px', fontFamily: BB.mono, fontSize: 16, color: BB.ink }}>paso<span style={{ color: BB.ink3, marginLeft: 4 }}>|</span></div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: BB.ink }}>Sensibilidad</div>
              <div style={{ fontSize: 13, color: BB.ink2 }}>Media</div>
            </div>
            <Slider position={0.5}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: BB.ink3 }}>
              <span>Baja</span><span>Alta</span>
            </div>
          </div>
        </div>

        <FieldLabel>Notificaciones</FieldLabel>
        <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          <ToggleRow icon="speaker" title="Sonido al vencer" on/>
          <ToggleRow icon="vibrate" title="Vibración" on last/>
        </div>

        <FieldLabel>Acerca de</FieldLabel>
        <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          <NavRow label="Versión" value="1.0.0" disabled/>
          <NavRow label="Reportar problema"/>
          <NavRow label="Términos y privacidad" last/>
        </div>
      </div>
    </Frame>
  );
}

function NavRow({ label, value, last, disabled }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: last ? 'none' : `1px solid ${BB.hairline}`, opacity: disabled ? 0.6 : 1 }}>
      <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: BB.ink }}>{label}</div>
      {value && <div style={{ fontSize: 14, color: BB.ink2, marginRight: 8 }}>{value}</div>}
      {!disabled && <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={BB.ink3} strokeWidth="1.6" strokeLinecap="round"><path d="M6 4l4 4-4 4"/></svg>}
    </div>
  );
}

function Slider({ position = 0.5 }) {
  return (
    <div style={{ height: 24, position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{ height: 4, borderRadius: 2, background: BB.hairline, width: '100%' }}/>
      <div style={{ position: 'absolute', height: 4, borderRadius: 2, background: BB.terracotta, width: `${position * 100}%` }}/>
      <div style={{ position: 'absolute', left: `calc(${position * 100}% - 12px)`, width: 24, height: 24, borderRadius: 12, background: '#fff', border: `2px solid ${BB.terracotta}`, boxShadow: '0 1px 3px rgba(0,0,0,.15)' }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen 9 — Edit player name (modal inline)
// ─────────────────────────────────────────────────────────────
function S9_EditPlayer() {
  return (
    <Frame>
      <TopNav title="Nueva partida" subtitle="Rummikub"/>
      <div style={{ flex: 1, padding: '8px 24px 0', overflow: 'hidden' }}>
        <FieldLabel>Jugadores</FieldLabel>
        <div style={{ background: BB.surface, borderRadius: 16, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          <PlayerRow name="Rodrigo" index={0}/>
          {/* Editing row */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BB.hairline}`, background: BB.cream }}>
            <div style={{ fontSize: 11, color: BB.ink2, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>Editando jugador 2</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: BB.calm, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>A</div>
              <div style={{ flex: 1, background: BB.surface, border: `2px solid ${BB.terracotta}`, borderRadius: 10, padding: '10px 14px', fontSize: 16, color: BB.ink, display: 'flex', alignItems: 'center' }}>
                Ana<div style={{ width: 1.5, height: 18, background: BB.terracotta, marginLeft: 2, animation: 'bb-blink 1s steps(2) infinite' }}/>
              </div>
              <button style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={BB.ink3} strokeWidth="2" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8"/></svg>
              </button>
            </div>
          </div>
          <PlayerRow name="Carlos" index={2}/>
          <PlayerRow name="María" index={3} last/>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{ flex: 1, height: 48, borderRadius: 14, border: `1px solid ${BB.hairline}`, background: BB.surface, color: BB.ink, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
          <button style={{ flex: 1, height: 48, borderRadius: 14, border: 'none', background: BB.terracotta, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Aceptar</button>
        </div>
      </div>

      {/* Keyboard mock */}
      <KeyboardMock/>
    </Frame>
  );
}

function KeyboardMock() {
  const row1 = ['q','w','e','r','t','y','u','i','o','p'];
  const row2 = ['a','s','d','f','g','h','j','k','l'];
  const row3 = ['z','x','c','v','b','n','m'];
  const Key = ({ children, flex = 1, dark }) => (
    <div style={{ flex, height: 42, borderRadius: 6, background: dark ? '#B7B0A4' : BB.surface, color: BB.ink, fontFamily: BB.sans, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 0 rgba(0,0,0,.06)' }}>{children}</div>
  );
  return (
    <div style={{ background: '#D9D2C5', padding: '8px 6px 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 5 }}>{row1.map(k => <Key key={k}>{k}</Key>)}</div>
      <div style={{ display: 'flex', gap: 5, padding: '0 18px' }}>{row2.map(k => <Key key={k}>{k}</Key>)}</div>
      <div style={{ display: 'flex', gap: 5 }}>
        <Key flex={1.4} dark>⇧</Key>
        {row3.map(k => <Key key={k}>{k}</Key>)}
        <Key flex={1.4} dark>⌫</Key>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        <Key flex={1.4} dark>?123</Key>
        <Key>,</Key>
        <Key flex={4}>espacio</Key>
        <Key>.</Key>
        <Key flex={1.4} dark>↵</Key>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen 10 — Game summary
// ─────────────────────────────────────────────────────────────
function S10_Summary() {
  const players = [
    { name: 'Rodrigo', turns: 8, voice: 6, button: 0, medal: '🥇', winner: true },
    { name: 'Ana',     turns: 7, voice: 5, button: 0, medal: '🥈' },
    { name: 'Carlos',  turns: 6, voice: 0, button: 4 },
    { name: 'María',   turns: 7, voice: 5, button: 0 },
  ];
  return (
    <Frame>
      <div style={{ padding: '24px 28px 8px' }}>
        <div style={{ fontSize: 12, color: BB.ink3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Rummikub</div>
        <div style={{ fontFamily: BB.display, fontSize: 36, fontWeight: 500, color: BB.ink, letterSpacing: -0.6, lineHeight: 1.05, marginTop: 4 }}>Fin de partida</div>
        <div style={{ fontSize: 14, color: BB.ink2, marginTop: 8 }}>34 minutos · 28 turnos · 20 pasos</div>
      </div>

      <div style={{ flex: 1, padding: '24px 24px 0', overflow: 'auto' }}>
        <div style={{ background: BB.surface, borderRadius: 18, border: `1px solid ${BB.hairline}`, overflow: 'hidden' }}>
          {players.map((p, i) => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
              borderBottom: i < players.length - 1 ? `1px solid ${BB.hairline}` : 'none',
              background: p.winner ? BB.terracottaSoft : 'transparent',
            }}>
              <div style={{ width: 28, fontSize: 18, textAlign: 'center' }}>{p.medal || ''}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: BB.ink }}>{p.name}</div>
                <div style={{ fontSize: 12, color: BB.ink2, marginTop: 2, fontFamily: BB.mono }}>
                  {p.turns} turnos · {p.voice > 0 && `${p.voice} voz`}{p.voice > 0 && p.button > 0 && ' · '}{p.button > 0 && `${p.button} botón`}
                </div>
              </div>
              <div style={{ fontFamily: BB.display, fontSize: 24, fontWeight: 500, color: BB.ink, fontVariantNumeric: 'tabular-nums' }}>{p.turns}</div>
            </div>
          ))}
        </div>

        {/* MVP highlight */}
        <div style={{ marginTop: 16, background: BB.cream, borderRadius: 18, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: BB.terracotta, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round">
              <path d="M11 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM5 10v1a6 6 0 0012 0v-1M11 17v3M8 20h6"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: BB.ink }}>78% de los pasos por voz</div>
            <div style={{ fontSize: 12, color: BB.ink2, marginTop: 2 }}>El reconocimiento funcionó bien hoy</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px', borderTop: `1px solid ${BB.hairline}`, display: 'flex', gap: 10, background: BB.bg }}>
        <button style={{ flex: 1, height: 52, borderRadius: 14, border: `1px solid ${BB.hairline}`, background: BB.surface, color: BB.ink, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Inicio</button>
        <button style={{ flex: 1.4, height: 52, borderRadius: 14, border: 'none', background: BB.terracotta, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff"><path d="M4 2l9 6-9 6V2z"/></svg>
          Nueva partida
        </button>
      </div>
    </Frame>
  );
}

Object.assign(window, {
  BB, Frame, StatusBar, GestureBar, TopNav, FieldLabel, Stepper, PlayerRow, ToggleRow, Toggle, NavRow, Slider, GameCard, Stat, KeyboardMock,
  S1_Home, S2_Setup, S8_Settings, S9_EditPlayer, S10_Summary,
});
