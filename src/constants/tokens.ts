// Design tokens — Board Buddy
// Fuente de verdad: design/handoff_board_buddy/README.md
// Todos los valores de color, tipografía, espaciado y radii vienen de acá.

// ─── Colores ───────────────────────────────────────────────────

export const Colors = {
  // Fondos
  bg: '#FAF6F0',        // sand — fondo principal
  surface: '#FFFFFF',   // cards, inputs, sheets
  cream: '#F2EADC',     // cards inactivas, backgrounds secundarios

  // Texto
  ink: '#1F1A16',       // texto principal
  ink2: '#5C544C',      // texto secundario
  ink3: '#9A938A',      // hints, etiquetas
  hairline: '#E8E1D6',  // bordes y separadores

  // Acento
  terracotta: '#C24E1B',
  terracottaSoft: '#F4E2D6',

  // Estados del timer
  calm: '#3F6B5E',      // tiempo abundante (forest)
  warn: '#D88A2F',      // ≤20% restante (amber)
  alert: '#B23A1F',     // tiempo agotado (brick)
  paused: '#5C544C',    // pausado (desaturado)

  // Colores de avatar (rotan por índice de jugador)
  avatars: ['#C24E1B', '#3F6B5E', '#7C5C3A', '#8A4F6B'],
} as const;

// ─── Tipografía ────────────────────────────────────────────────

export const Fonts = {
  sans: 'Inter',
  display: 'Fraunces_400Regular',   // display — números del timer, títulos
  mono: 'JetBrainsMono_400Regular', // números tabulares, contadores
} as const;

// Variantes de peso disponibles por familia
export const FontWeights = {
  display: {
    light: 'Fraunces_300Light',
    regular: 'Fraunces_400Regular',
    medium: 'Fraunces_500Medium',
    semibold: 'Fraunces_600SemiBold',
  },
  mono: {
    regular: 'JetBrainsMono_400Regular',
    medium: 'JetBrainsMono_500Medium',
    semibold: 'JetBrainsMono_600SemiBold',
  },
  sans: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
} as const;

// Escalas tipográficas (en sp / dp)
export const FontSizes = {
  timerXL: 168,   // número del timer — variante A
  timerLG: 132,   // número del timer — variante mono
  timerED: 196,   // número del timer — variante editorial
  displayL: 36,   // títulos de pantalla (Home, Summary)
  displayM: 24,   // títulos de TopNav
  displayS: 22,   // títulos de cards
  body: 16,       // texto de cuerpo
  bodyS: 15,      // filas de lista
  caption: 13,    // subtítulos, labels secundarios
  captionS: 12,   // overlines, hints
  micro: 11,      // labels uppercase, voice hint
} as const;

// ─── Espaciado (sistema base 4dp) ─────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  screenH: 20,   // padding horizontal de pantalla
  screenV: 24,   // padding vertical de pantalla
  cardGap: 12,   // gap entre cards
  cardPad: 16,   // padding interno de cards
} as const;

// ─── Radii ─────────────────────────────────────────────────────

export const Radii = {
  sm: 10,
  md: 16,
  lg: 18,
  pill: 100,
} as const;

// ─── Sombras ───────────────────────────────────────────────────

export const Shadows = {
  // Hairline lift — cards activas (iOS)
  cardIOS: {
    shadowColor: '#1F1A16',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
  },
  // Hairline lift — cards activas (Android)
  cardAndroid: {
    elevation: 2,
  },
  // Toggle thumb
  toggleThumbIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
} as const;

// ─── Hit-targets ───────────────────────────────────────────────

export const HitTargets = {
  min: 48,          // mínimo absoluto — todos los botones
  actionBtn: 64,    // botones del timer (Pausar, Reiniciar, Pasar)
  cta: 56,          // CTA primario (Iniciar partida)
  stepper: 44,      // botones del stepper (aceptable con área tappable mayor)
  topNav: 40,       // botón back en TopNav
} as const;

// ─── Animaciones ──────────────────────────────────────────────

export const Animations = {
  stateTransition: 250,   // cambio de color de fondo entre estados del timer
  warnPulse: 800,         // pulso de la barra en estado warn (opacity 1↔0.85)
  timeoutFlash: 300,      // flash rojo al timeout
  turnTransition: 400,    // slide horizontal al cambiar jugador
  toggleThumb: 180,       // animación thumb del toggle
} as const;
