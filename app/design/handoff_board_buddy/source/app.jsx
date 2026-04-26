// app.jsx — Board Buddy design canvas root

const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect, TweakColor, TweakSlider } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "calmColor": "#3F6B5E",
  "warnColor": "#D88A2F",
  "alertColor": "#B23A1F",
  "accent": "#C24E1B",
  "timerFont": "Fraunces",
  "timerSize": 168
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to the BB token map at runtime so all screens reflect changes
  React.useEffect(() => {
    if (!window.BB) return;
    window.BB.calm  = t.calmColor;
    window.BB.warn  = t.warnColor;
    window.BB.alert = t.alertColor;
    window.BB.terracotta = t.accent;
    document.documentElement.style.setProperty('--bb-timer-font', t.timerFont);
    document.documentElement.style.setProperty('--bb-timer-size', t.timerSize + 'px');
  }, [t]);

  const fontMap = {
    'Fraunces':       '"Fraunces", Georgia, serif',
    'JetBrains Mono': '"JetBrains Mono", ui-monospace, monospace',
    'Inter':          '"Inter", system-ui, sans-serif',
  };

  return (
    <React.Fragment>
      {/* Inject a global override for the giant timer numbers in variant A */}
      <style>{`
        .bb-timer-display { font-family: ${fontMap[t.timerFont]} !important; font-size: ${t.timerSize}px !important; }
      `}</style>

      <DesignCanvas>
        <DCSection id="overview" title="Board Buddy" subtitle="Hi-fi para handoff a Claude Code · Android · 412×892">
          <DCArtboard id="home"     label="01 · Home"               width={412} height={892}><window.S1_Home/></DCArtboard>
          <DCArtboard id="setup"    label="02 · Configurar partida" width={412} height={892}><window.S2_Setup/></DCArtboard>
          <DCArtboard id="edit"     label="09 · Editar nombre"      width={412} height={892}><window.S9_EditPlayer/></DCArtboard>
          <DCArtboard id="settings" label="08 · Ajustes globales"   width={412} height={892}><window.S8_Settings/></DCArtboard>
          <DCArtboard id="summary"  label="10 · Resumen de partida" width={412} height={892}><window.S10_Summary/></DCArtboard>
        </DCSection>

        <DCSection id="timer-states" title="Temporizador — estados" subtitle="Pantalla principal: corriendo, poco tiempo, agotado, pausa, transición">
          <DCArtboard id="run"   label="03 · Corriendo (calm)"      width={412} height={892}><window.S3_Timer_A_Running/></DCArtboard>
          <DCArtboard id="warn"  label="04 · Poco tiempo (≤20%)"    width={412} height={892}><window.S4_Timer_LowTime/></DCArtboard>
          <DCArtboard id="alert" label="05 · Tiempo agotado"        width={412} height={892}><window.S5_Timer_Timeout/></DCArtboard>
          <DCArtboard id="pause" label="06 · Pausa"                 width={412} height={892}><window.S6_Timer_Paused/></DCArtboard>
          <DCArtboard id="trans" label="07 · Transición de turno"   width={412} height={892}><window.S7_Timer_Transition/></DCArtboard>
        </DCSection>

        <DCSection id="timer-variants" title="Temporizador — variantes visuales" subtitle="4 direcciones: barra horizontal · vertical · anillo · editorial">
          <DCArtboard id="vA" label="A · Wall (forest, barra horizontal)" width={412} height={892}><window.S3_Timer_A_Running/></DCArtboard>
          <DCArtboard id="vB" label="B · Bar (light, barra vertical)"     width={412} height={892}><window.S3_Timer_B/></DCArtboard>
          <DCArtboard id="vC" label="C · Ring (dark, anillo circular)"    width={412} height={892}><window.S3_Timer_C/></DCArtboard>
          <DCArtboard id="vD" label="D · Editorial (tipográfico)"         width={412} height={892}><window.S3_Timer_D/></DCArtboard>

          <DCPostIt top={-12} right={32} rotate={3} width={220}>
            Las 4 variantes comparten datos y acciones — solo cambia el lenguaje visual. Sirven como input para Claude Code: un componente <b>&lt;TurnTimer variant /&gt;</b>.
          </DCPostIt>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Paleta de estados">
          <TweakColor label="Tiempo abundante" value={t.calmColor}  onChange={(v) => setTweak('calmColor', v)}/>
          <TweakColor label="Poco tiempo"      value={t.warnColor}  onChange={(v) => setTweak('warnColor', v)}/>
          <TweakColor label="Agotado"          value={t.alertColor} onChange={(v) => setTweak('alertColor', v)}/>
          <TweakColor label="Acento (UI)"      value={t.accent}     onChange={(v) => setTweak('accent', v)}/>
        </TweakSection>

        <TweakSection label="Tipografía del timer">
          <TweakRadio  label="Familia" value={t.timerFont}
            options={[
              { value: 'Fraunces',       label: 'Serif' },
              { value: 'JetBrains Mono', label: 'Mono' },
              { value: 'Inter',          label: 'Sans' },
            ]}
            onChange={(v) => setTweak('timerFont', v)}/>
          <TweakSlider label="Tamaño" value={t.timerSize} min={96} max={220} step={4} unit="px"
            onChange={(v) => setTweak('timerSize', v)}/>
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
