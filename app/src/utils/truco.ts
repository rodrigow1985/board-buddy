// Utilidades de lógica de Truco — cálculo de puntos y validaciones de cantos

// ─── Tipos ────────────────────────────────────────────────────────

export type EnvidoLevel = 'envido' | 'real_envido' | 'falta_envido';
export type TrucoLevel = 'truco' | 'retruco' | 'vale_cuatro';
export type FlorLevel = 'flor' | 'contra_flor' | 'contra_flor_al_resto';
export type CantoType = 'envido' | 'truco' | 'flor';

// ─── Envido: puntos según secuencia de cantos ─────────────────────

/**
 * Calcula los puntos en juego para una secuencia de cantos de envido.
 * @param history  Secuencia de cantos de envido (ej: ['envido', 'real_envido'])
 * @param targetScore Puntos objetivo de la partida (15 o 30)
 * @param loserScore  Puntos actuales del equipo que pierde el falta envido
 * @returns { accepted, rejected } — puntos si lo quieren / si no lo quieren
 */
export function envidoPoints(
  history: EnvidoLevel[],
  targetScore: number,
  loserScore: number,
): { accepted: number; rejected: number } {
  if (history.length === 0) return { accepted: 0, rejected: 0 };

  let accepted = 0;
  let rejected = 0;
  let hasFalta = false;

  for (const level of history) {
    if (level === 'envido') {
      rejected = accepted > 0 ? accepted : 1;
      accepted += 2;
    } else if (level === 'real_envido') {
      rejected = accepted > 0 ? accepted : 1;
      accepted += 3;
    } else if (level === 'falta_envido') {
      rejected = accepted > 0 ? accepted : 1;
      hasFalta = true;
    }
  }

  if (hasFalta) {
    // Falta envido: los puntos que le faltan al perdedor para llegar al target
    accepted = targetScore - loserScore;
  }

  return { accepted, rejected };
}

// ─── Truco: puntos según nivel ────────────────────────────────────

const TRUCO_POINTS: Record<TrucoLevel, { accepted: number; rejected: number }> = {
  truco: { accepted: 2, rejected: 1 },
  retruco: { accepted: 3, rejected: 2 },
  vale_cuatro: { accepted: 4, rejected: 3 },
};

export function trucoPoints(level: TrucoLevel): { accepted: number; rejected: number } {
  return TRUCO_POINTS[level];
}

// ─── Flor: puntos según nivel ─────────────────────────────────────

export function florPoints(
  level: FlorLevel,
  targetScore: number,
  loserScore: number,
): { accepted: number; rejected: number } {
  switch (level) {
    case 'flor':
      return { accepted: 3, rejected: 0 }; // flor sin respuesta = 3 directos
    case 'contra_flor':
      return { accepted: 6, rejected: 3 };
    case 'contra_flor_al_resto':
      return { accepted: targetScore - loserScore, rejected: 6 };
  }
}

// ─── Sin canto de truco: mano base vale 1 punto ──────────────────

export const HAND_BASE_POINTS = 1;

// ─── Validaciones de cantos ──────────────────────────────────────

/** El envido solo se puede cantar si no se cantó truco todavía */
export function canCallEnvido(trucoLevel: TrucoLevel | null): boolean {
  return trucoLevel === null;
}

/** Siguiente nivel de truco válido */
export function nextTrucoLevel(current: TrucoLevel | null): TrucoLevel | null {
  if (current === null) return 'truco';
  if (current === 'truco') return 'retruco';
  if (current === 'retruco') return 'vale_cuatro';
  return null; // ya está en vale_cuatro, no se puede subir más
}

/** Verifica si un nivel de envido se puede agregar a la secuencia */
export function canAddEnvidoLevel(
  history: EnvidoLevel[],
  level: EnvidoLevel,
): boolean {
  // Si ya se cantó falta envido, no se puede cantar nada más
  if (history.includes('falta_envido')) return false;

  // Real envido y falta envido se pueden cantar una sola vez
  if (level === 'real_envido' && history.includes('real_envido')) return false;
  if (level === 'falta_envido') return true; // siempre se puede como cierre

  // Envido se puede cantar hasta 2 veces
  if (level === 'envido') {
    return history.filter((h) => h === 'envido').length < 2;
  }

  return true;
}

// ─── Fase de la partida ──────────────────────────────────────────

export function getPhase(score: number): 'malas' | 'buenas' {
  return score < 15 ? 'malas' : 'buenas';
}
