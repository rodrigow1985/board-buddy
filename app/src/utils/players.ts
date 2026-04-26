import { Colors } from '@src/constants/tokens';

export interface Player {
  id: string;
  name: string;
  color: string;
  turns: number;
  passesByVoice: number;
  passesByButton: number;
}

let _idCounter = 0;

/**
 * Genera un ID único combinando índice, timestamp y contador incremental.
 */
export function generatePlayerId(index: number): string {
  return `player_${index}_${Date.now()}_${_idCounter++}`;
}

/**
 * Crea un jugador con valores iniciales
 */
export function createPlayer(index: number, name?: string): Player {
  return {
    id: generatePlayerId(index),
    name: name ?? `Jugador ${index + 1}`,
    color: Colors.avatars[index % Colors.avatars.length],
    turns: 0,
    passesByVoice: 0,
    passesByButton: 0,
  };
}

/**
 * Retorna el índice del siguiente jugador (circular)
 */
export function nextPlayerIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current + 1) % total;
}

/**
 * Retorna la inicial de un nombre para el avatar
 */
export function playerInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

/**
 * Retorna el porcentaje de pasos realizados por voz sobre el total
 * Ej: 0.78 → 78%
 */
export function voicePassRate(players: Player[]): number {
  const totalVoice = players.reduce((sum, p) => sum + p.passesByVoice, 0);
  const totalButton = players.reduce((sum, p) => sum + p.passesByButton, 0);
  const total = totalVoice + totalButton;
  if (total === 0) return 0;
  return totalVoice / total;
}
