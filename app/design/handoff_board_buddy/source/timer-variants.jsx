// timer-variants.jsx — 4+ variants of the core timer screen + supporting screens
// Each variant explores different visual/typographic/progress treatments.

// ─────────────────────────────────────────────────────────────
// VARIANT A — "Wall" (forest green, full bleed, horizontal top bar)
// The default, calm and immersive.
// ─────────────────────────────────────────────────────────────
function S3_Timer_A_Running({ progress = 0.62, timeText = '1:14', name = 'Rodrigo', next = 'Ana', state = 'calm' }) {
  // state: 'calm' | 'warn' | 'alert' | 'paused'
  const colorMap = {
    calm:   BB.calm,
    warn:   BB.warn,
    alert:  BB.alert,
    paused: '#5C544C',
  };
  const bg = colorMap[state];
  const barColor = state === 'paused' ? 'rgba(255,255,255,.4)' : '#fff';

  return (
    <Frame bg={bg} dark transparentStatus>
      {/* Top horizontal progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'rgba(0,0,0,.18)' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: barColor, transition: 'width .3s linear' }}/>
      </div>

      {/* Top chrome */}
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 100, background: 'rgba(255,255,255,.14)' }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: state === 'paused' ? 'rgba(255,255,255,.4)' : '#7BE0A8' }}/>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: 0.4, textTransform: 'uppercase' }}>
            {state === 'paused' ? 'Pausado' : 'Escuchando'}
          </span>
        </div>
        <button style={{ width: 44, height: 44, borderRadius: 22, border: 'none', background: 'rgba(255,255,255,.14)', color: '#fff', fontSize: 22, cursor: 'pointer' }}>⋯</button>
      </div>

      {/* Player name chip */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ padding: '10px 24px', borderRadius: 100, background: 'rgba(0,0,0,.18)', border: '1px solid rgba(255,255,255,.18)', marginBottom: 32 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: 0.5 }}>{name.toUpperCase()}</span>
        </div>

        {/* Giant time */}
        <div className="bb-timer-display" style={{
          fontFamily: BB.display, fontSize: 168, fontWeight: 400, color: '#fff',
          letterSpacing: -6, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums',
          opacity: state === 'paused' ? 0.55 : 1,
        }}>{timeText}</div>

        {state === 'paused' && (
          <div style={{ marginTop: 24, padding: '8px 16px', borderRadius: 100, background: 'rgba(255,255,255,.14)', fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.5 }}>PARTIDA EN PAUSA</div>
        )}

        {/* Next up */}
        <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 500 }}>Sigue</span>
          <div style={{ width: 26, height: 26, borderRadius: 13, background: 'rgba(255,255,255,.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{next[0]}</div>
          <span style={{ fontSize: 16, color: '#fff', fontWeight: 500 }}>{next}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '0 24px 28px', display: 'flex', gap: 12 }}>
        <ActionBtn icon={state === 'paused' ? 'play' : 'pause'} primary/>
        <ActionBtn icon="restart"/>
        <ActionBtn icon="skip"/>
      </div>

      {/* Voice hint */}
      <div style={{ position: 'absolute', bottom: 96, right: 24, padding: '6px 12px', borderRadius: 100, background: 'rgba(0,0,0,.25)', fontSize: 11, fontFamily: BB.mono, color: 'rgba(255,255,255,.85)' }}>
        decí "paso"
      </div>
    </Frame>
  );
}

function ActionBtn({ icon, primary }) {
  const bg = primary ? '#fff' : 'rgba(255,255,255,.16)';
  const fg = primary ? BB.ink : '#fff';
  const icons = {
    play:    <path d="M8 5l11 7-11 7V5z" fill={fg}/>,
    pause:   <g fill={fg}><rect x="7" y="5" width="3.5" height="14" rx="0.5"/><rect x="13.5" y="5" width="3.5" height="14" rx="0.5"/></g>,
    restart: <g fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></g>,
    skip:    <g fill={fg}><path d="M5 5l9 7-9 7V5z"/><rect x="16" y="5" width="3" height="14" rx="0.5"/></g>,
  };
  return (
    <button style={{
      flex: 1, height: 64, borderRadius: 18, border: 'none',
      background: bg, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="26" height="26" viewBox="0 0 24 24">{icons[icon]}</svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIANT B — "Vertical bar" (terracotta, vertical progress on left)
// ─────────────────────────────────────────────────────────────
function S3_Timer_B({ progress = 0.4, timeText = '0:48', name = 'Ana', next = 'Carlos' }) {
  return (
    <Frame bg="#FAF6F0">
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* Vertical progress bar (left edge) */}
        <div style={{ width: 24, background: BB.cream, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: `${progress * 100}%`,
            background: BB.terracotta,
            transition: 'height .3s linear',
          }}/>
          {/* tick marks */}
          {[0.25, 0.5, 0.75].map(t => (
            <div key={t} style={{ position: 'absolute', top: `${(1-t) * 100}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.5)' }}/>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: BB.calm }}/>
              <span style={{ fontSize: 12, fontWeight: 600, color: BB.ink2, letterSpacing: 0.4, textTransform: 'uppercase' }}>Escuchando</span>
            </div>
            <button style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: 'transparent', color: BB.ink, fontSize: 20, cursor: 'pointer' }}>⋯</button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px' }}>
            <div style={{ fontSize: 13, color: BB.ink3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Turno de</div>
            <div style={{ fontFamily: BB.display, fontSize: 38, fontWeight: 500, color: BB.ink, letterSpacing: -0.6, marginTop: 4 }}>{name}</div>

            <div style={{
              marginTop: 36,
              fontFamily: BB.mono, fontSize: 132, fontWeight: 500,
              color: BB.terracotta, letterSpacing: -4,
              lineHeight: 0.9, fontVariantNumeric: 'tabular-nums',
            }}>{timeText}</div>

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: BB.surface, border: `1px solid ${BB.hairline}`, borderRadius: 14 }}>
              <span style={{ fontSize: 11, color: BB.ink3, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Sigue</span>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: BB.calm, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{next[0]}</div>
              <span style={{ fontSize: 14, color: BB.ink, fontWeight: 500 }}>{next}</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ padding: '0 24px 28px', display: 'flex', gap: 10 }}>
            <BtnLight icon="pause" label="Pausar" primary/>
            <BtnLight icon="restart"/>
            <BtnLight icon="skip"/>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function BtnLight({ icon, label, primary }) {
  const bg = primary ? BB.terracotta : BB.surface;
  const fg = primary ? '#fff' : BB.ink;
  const border = primary ? 'none' : `1px solid ${BB.hairline}`;
  const icons = {
    play:    <path d="M8 5l11 7-11 7V5z" fill={fg}/>,
    pause:   <g fill={fg}><rect x="7" y="5" width="3.5" height="14" rx="0.5"/><rect x="13.5" y="5" width="3.5" height="14" rx="0.5"/></g>,
    restart: <g fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></g>,
    skip:    <g fill={fg}><path d="M5 5l9 7-9 7V5z"/><rect x="16" y="5" width="3" height="14" rx="0.5"/></g>,
  };
  return (
    <button style={{
      flex: label ? 2 : 1, height: 60, borderRadius: 16, border,
      background: bg, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      color: fg, fontSize: 15, fontWeight: 600, fontFamily: BB.sans,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24">{icons[icon]}</svg>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIANT C — "Ring" (circular progress, monospace timer, dark)
// ─────────────────────────────────────────────────────────────
function S3_Timer_C({ progress = 0.55, timeText = '1:06', name = 'Carlos', next = 'María' }) {
  const radius = 140;
  const circ = 2 * Math.PI * radius;
  return (
    <Frame bg="#1F1A16" dark>
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontFamily: BB.mono, color: 'rgba(255,255,255,.5)', letterSpacing: 1, textTransform: 'uppercase' }}>Turno 14 · 2:00</span>
        <button style={{ width: 36, height: 36, borderRadius: 18, border: '1px solid rgba(255,255,255,.16)', background: 'transparent', color: '#fff', fontSize: 18, cursor: 'pointer' }}>⋯</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', fontFamily: BB.mono, letterSpacing: 1, textTransform: 'uppercase' }}>Turno de</div>
        <div style={{ fontFamily: BB.display, fontSize: 28, color: '#fff', fontWeight: 500, marginTop: 6 }}>{name}</div>

        {/* Ring */}
        <div style={{ position: 'relative', marginTop: 28, width: 320, height: 320 }}>
          <svg width="320" height="320" viewBox="0 0 320 320" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="160" cy="160" r={radius} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="14"/>
            <circle cx="160" cy="160" r={radius} fill="none" stroke={BB.terracotta} strokeWidth="14"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: BB.mono, fontSize: 88, fontWeight: 500, color: '#fff', letterSpacing: -2, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{timeText}</div>
            <div style={{ marginTop: 10, fontSize: 12, fontFamily: BB.mono, color: 'rgba(255,255,255,.5)', letterSpacing: 1.5, textTransform: 'uppercase' }}>min : seg</div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(255,255,255,.14)' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontFamily: BB.mono, letterSpacing: 1, textTransform: 'uppercase' }}>Sigue</span>
          <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{next}</span>
        </div>
      </div>

      <div style={{ padding: '0 24px 28px', display: 'flex', gap: 12 }}>
        <DarkBtn icon="pause" primary/>
        <DarkBtn icon="restart"/>
        <DarkBtn icon="skip"/>
      </div>
    </Frame>
  );
}

function DarkBtn({ icon, primary }) {
  const bg = primary ? '#fff' : 'rgba(255,255,255,.08)';
  const fg = primary ? BB.ink : '#fff';
  const border = primary ? 'none' : '1px solid rgba(255,255,255,.14)';
  const icons = {
    play:    <path d="M8 5l11 7-11 7V5z" fill={fg}/>,
    pause:   <g fill={fg}><rect x="7" y="5" width="3.5" height="14" rx="0.5"/><rect x="13.5" y="5" width="3.5" height="14" rx="0.5"/></g>,
    restart: <g fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></g>,
    skip:    <g fill={fg}><path d="M5 5l9 7-9 7V5z"/><rect x="16" y="5" width="3" height="14" rx="0.5"/></g>,
  };
  return (
    <button style={{
      flex: 1, height: 64, borderRadius: 20, border, background: bg, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="26" height="26" viewBox="0 0 24 24">{icons[icon]}</svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// VARIANT D — "Editorial" (light, typographic, side rule)
// ─────────────────────────────────────────────────────────────
function S3_Timer_D({ progress = 0.7, timeText = '1:24', name = 'María', next = 'Rodrigo' }) {
  return (
    <Frame bg={BB.bg}>
      <div style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${BB.hairline}` }}>
        <div style={{ fontFamily: BB.mono, fontSize: 11, color: BB.ink2, letterSpacing: 1, textTransform: 'uppercase' }}>RUMMIKUB · TURNO 14</div>
        <button style={{ background: 'transparent', border: 'none', color: BB.ink, fontSize: 18, cursor: 'pointer' }}>⋯</button>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* Side rule */}
        <div style={{ width: 6, background: BB.cream, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${progress * 100}%`, background: BB.terracotta }}/>
        </div>

        <div style={{ flex: 1, padding: '32px 28px 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: BB.mono, fontSize: 11, color: BB.ink3, letterSpacing: 1.5, textTransform: 'uppercase' }}>Juega</div>
          <div style={{ fontFamily: BB.display, fontSize: 56, fontWeight: 500, color: BB.ink, letterSpacing: -1.5, lineHeight: 1, marginTop: 8 }}>{name}.</div>

          <div style={{ marginTop: 'auto', marginBottom: 24 }}>
            <div style={{ fontFamily: BB.mono, fontSize: 11, color: BB.ink3, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Tiempo restante</div>
            <div style={{
              fontFamily: BB.display, fontSize: 196, fontWeight: 300,
              color: BB.ink, letterSpacing: -8, lineHeight: 0.85,
              fontVariantNumeric: 'tabular-nums',
            }}>{timeText}</div>
          </div>

          {/* Inline progress meter — text-y */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 20, borderBottom: `1px solid ${BB.hairline}` }}>
            <div style={{ flex: 1, height: 2, background: BB.hairline, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: 2, width: `${progress * 100}%`, background: BB.ink }}/>
            </div>
            <span style={{ fontFamily: BB.mono, fontSize: 11, color: BB.ink2, letterSpacing: 0.5 }}>{Math.round(progress * 100)}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
            <div>
              <div style={{ fontFamily: BB.mono, fontSize: 10, color: BB.ink3, letterSpacing: 1, textTransform: 'uppercase' }}>Sigue</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: BB.ink, marginTop: 2 }}>{next}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, background: BB.cream }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: BB.calm }}/>
              <span style={{ fontFamily: BB.mono, fontSize: 10, color: BB.ink2, letterSpacing: 0.5, textTransform: 'uppercase' }}>Voz activa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions — minimal, text-led */}
      <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 8, borderTop: `1px solid ${BB.hairline}` }}>
        <button style={{ flex: 2, height: 56, borderRadius: 14, border: 'none', background: BB.ink, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: BB.sans }}>Pausar</button>
        <button style={{ flex: 1, height: 56, borderRadius: 14, border: `1px solid ${BB.hairline}`, background: BB.surface, color: BB.ink, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Reiniciar</button>
        <button style={{ flex: 1, height: 56, borderRadius: 14, border: `1px solid ${BB.hairline}`, background: BB.surface, color: BB.ink, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Pasar</button>
      </div>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen 4 — Low time state (warning)
// ─────────────────────────────────────────────────────────────
function S4_Timer_LowTime() {
  return <S3_Timer_A_Running progress={0.18} timeText="0:18" name="Rodrigo" next="Ana" state="warn"/>;
}

// ─────────────────────────────────────────────────────────────
// Screen 5 — Time's up (red flash)
// ─────────────────────────────────────────────────────────────
function S5_Timer_Timeout() {
  return (
    <Frame bg={BB.alert} dark transparentStatus>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ padding: '10px 24px', borderRadius: 100, background: 'rgba(0,0,0,.22)', marginBottom: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: 0.5 }}>RODRIGO</span>
        </div>
        <div style={{ fontFamily: BB.display, fontSize: 168, fontWeight: 400, color: '#fff', letterSpacing: -6, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>0:00</div>
        <div style={{ marginTop: 24, padding: '12px 22px', borderRadius: 100, background: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={BB.alert} strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="7"/><path d="M9 5v4l2.5 2"/>
          </svg>
          <span style={{ fontSize: 16, fontWeight: 700, color: BB.alert, letterSpacing: 0.3 }}>¡Tiempo agotado!</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,.7)', fontFamily: BB.mono }}>auto-reinicio en 1s</div>
      </div>

      {/* faint pulse rings */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', border: '8px solid rgba(255,255,255,.08)' }}/>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen 6 — Paused state
// ─────────────────────────────────────────────────────────────
function S6_Timer_Paused() {
  return <S3_Timer_A_Running progress={0.62} timeText="1:14" name="Ana" next="Carlos" state="paused"/>;
}

// ─────────────────────────────────────────────────────────────
// Screen 7 — Turn transition (mid-animation)
// ─────────────────────────────────────────────────────────────
function S7_Timer_Transition() {
  return (
    <Frame bg={BB.calm} dark transparentStatus>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'rgba(0,0,0,.18)' }}>
        <div style={{ height: '100%', width: '100%', background: '#fff' }}/>
      </div>

      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 100, background: 'rgba(255,255,255,.14)' }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: '#7BE0A8' }}/>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', letterSpacing: 0.4, textTransform: 'uppercase' }}>Cambiando turno</span>
        </div>
        <button style={{ width: 44, height: 44, borderRadius: 22, border: 'none', background: 'rgba(255,255,255,.14)', color: '#fff', fontSize: 22, cursor: 'pointer' }}>⋯</button>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Rodrigo sliding out (left) */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transform: 'translateX(-58%)', opacity: 0.45,
        }}>
          <div style={{ padding: '10px 24px', borderRadius: 100, background: 'rgba(0,0,0,.22)', marginBottom: 28 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>RODRIGO</span>
          </div>
          <div style={{ fontFamily: BB.display, fontSize: 144, fontWeight: 400, color: '#fff', letterSpacing: -5, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>0:42</div>
        </div>

        {/* Ana sliding in (right) — main */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transform: 'translateX(8%)',
        }}>
          <div style={{ padding: '10px 24px', borderRadius: 100, background: 'rgba(0,0,0,.22)', marginBottom: 28, border: '1px solid rgba(255,255,255,.18)' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: 0.5 }}>ANA</span>
          </div>
          <div style={{ fontFamily: BB.display, fontSize: 168, fontWeight: 400, color: '#fff', letterSpacing: -6, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>2:00</div>
        </div>

        {/* Motion indicator dots */}
        <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i === 1 ? '#fff' : 'rgba(255,255,255,.3)' }}/>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 28px', display: 'flex', gap: 12, opacity: 0.6 }}>
        <ActionBtn icon="pause" primary/>
        <ActionBtn icon="restart"/>
        <ActionBtn icon="skip"/>
      </div>
    </Frame>
  );
}

Object.assign(window, {
  S3_Timer_A_Running, S3_Timer_B, S3_Timer_C, S3_Timer_D,
  S4_Timer_LowTime, S5_Timer_Timeout, S6_Timer_Paused, S7_Timer_Transition,
  ActionBtn, BtnLight, DarkBtn,
});
