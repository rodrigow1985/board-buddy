// Utilidades de tiempo

/**
 * Formatea milisegundos a string MM:SS
 * Ej: 90_000 → "1:30"
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calcula el progreso del turno (0.0 a 1.0)
 * 1.0 = turno recién iniciado, 0.0 = tiempo agotado
 */
export function calcProgress(timeRemainingMs: number, turnDurationMs: number): number {
  if (turnDurationMs <= 0) return 0;
  return Math.max(0, Math.min(1, timeRemainingMs / turnDurationMs));
}

/**
 * Determina si el turno está en estado "warn" (≤20% restante)
 */
export function isWarnState(timeRemainingMs: number, turnDurationMs: number): boolean {
  return calcProgress(timeRemainingMs, turnDurationMs) <= 0.2;
}

/**
 * Convierte minutos y segundos a milisegundos
 */
export function toMs(minutes: number, seconds: number = 0): number {
  return (minutes * 60 + seconds) * 1000;
}

/**
 * Convierte milisegundos a segundos (redondeado hacia arriba)
 */
export function toSeconds(ms: number): number {
  return Math.ceil(ms / 1000);
}
