// Valores predeterminados de configuración

export const Defaults = {
  turnDurationMs: 120_000,   // 2 minutos
  playerCount: 4,
  playerNames: ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'],
  triggerWord: 'paso',
  voiceSensitivity: 0.5,
  voiceEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
} as const;
