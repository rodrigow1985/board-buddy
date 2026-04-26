import { create } from 'zustand';
import { Player, nextPlayerIndex } from '@src/utils/players';

export type TimerStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'timeout'
  | 'transitioning'
  | 'finished';

export type PassReason = 'voice' | 'button';

export interface TurnRecord {
  playerId: string;
  endReason: 'voice' | 'button' | 'timeout';
  durationMs: number;
}

interface TimerState {
  gameId: string;
  players: Player[];
  currentPlayerIndex: number;
  turnDurationMs: number;
  timeRemainingMs: number;
  status: TimerStatus;
  startedAt: number | null;       // timestamp de inicio de sesión
  turnStartedAt: number | null;   // timestamp de inicio del turno actual
  turnHistory: TurnRecord[];

  // Acciones
  initGame: (players: Player[], turnDurationMs: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  passTurn: (reason: PassReason) => void;
  restartTurn: () => void;
  onTimeout: () => void;
  endTransition: () => void;
  finish: () => void;
  tick: (elapsedMs: number) => void;
  reset: () => void;
}

const INITIAL_STATE: Omit<TimerState, keyof ReturnType<typeof createActions>> = {
  gameId: 'rummikub',
  players: [],
  currentPlayerIndex: 0,
  turnDurationMs: 120_000,
  timeRemainingMs: 120_000,
  status: 'idle',
  startedAt: null,
  turnStartedAt: null,
  turnHistory: [],
};

function createActions(set: (fn: (s: TimerState) => Partial<TimerState>) => void) {
  return {
    initGame: (players: Player[], turnDurationMs: number) =>
      set(() => ({
        ...INITIAL_STATE,
        players,
        turnDurationMs,
        timeRemainingMs: turnDurationMs,
      })),

    start: () =>
      set((s) => {
        if (s.status !== 'idle') return {};
        const now = Date.now();
        return {
          status: 'running',
          startedAt: now,
          turnStartedAt: now,
        };
      }),

    pause: () =>
      set((s) => {
        if (s.status !== 'running') return {};
        return { status: 'paused' };
      }),

    resume: () =>
      set((s) => {
        if (s.status !== 'paused') return {};
        return { status: 'running', turnStartedAt: Date.now() };
      }),

    passTurn: (reason: PassReason) =>
      set((s) => {
        if (s.status !== 'running' && s.status !== 'paused') return {};

        const durationMs = s.turnDurationMs - s.timeRemainingMs;
        const record: TurnRecord = {
          playerId: s.players[s.currentPlayerIndex]?.id ?? '',
          endReason: reason,
          durationMs,
        };

        // Actualizar stats del jugador
        const players = s.players.map((p, i) => {
          if (i !== s.currentPlayerIndex) return p;
          return {
            ...p,
            turns: p.turns + 1,
            passesByVoice: reason === 'voice' ? p.passesByVoice + 1 : p.passesByVoice,
            passesByButton: reason === 'button' ? p.passesByButton + 1 : p.passesByButton,
          };
        });

        return {
          status: 'transitioning',
          players,
          turnHistory: [...s.turnHistory, record],
          currentPlayerIndex: nextPlayerIndex(s.currentPlayerIndex, s.players.length),
          timeRemainingMs: s.turnDurationMs,
        };
      }),

    restartTurn: () =>
      set((s) => {
        if (s.status !== 'running' && s.status !== 'paused') return {};
        return {
          timeRemainingMs: s.turnDurationMs,
          turnStartedAt: s.status === 'running' ? Date.now() : s.turnStartedAt,
        };
      }),

    onTimeout: () =>
      set((s) => {
        if (s.status !== 'running') return {};

        const record: TurnRecord = {
          playerId: s.players[s.currentPlayerIndex]?.id ?? '',
          endReason: 'timeout',
          durationMs: s.turnDurationMs,
        };

        const players = s.players.map((p, i) => {
          if (i !== s.currentPlayerIndex) return p;
          return { ...p, turns: p.turns + 1 };
        });

        return {
          status: 'timeout',
          players,
          timeRemainingMs: 0,
          turnHistory: [...s.turnHistory, record],
        };
      }),

    // Llamado después de los 1s de auto-reinicio post-timeout
    endTransition: () =>
      set((s) => {
        if (s.status !== 'transitioning' && s.status !== 'timeout') return {};
        return {
          status: 'running',
          timeRemainingMs: s.turnDurationMs,
          turnStartedAt: Date.now(),
        };
      }),

    finish: () => set(() => ({ status: 'finished' })),

    tick: (elapsedMs: number) =>
      set((s) => {
        if (s.status !== 'running') return {};
        const next = s.timeRemainingMs - elapsedMs;
        if (next <= 0) return { timeRemainingMs: 0 };
        return { timeRemainingMs: next };
      }),

    reset: () => set(() => ({ ...INITIAL_STATE })),
  };
}

export const useTimerStore = create<TimerState>((set) => ({
  ...(INITIAL_STATE as TimerState),
  ...createActions(set as (fn: (s: TimerState) => Partial<TimerState>) => void),
}));
