import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EnvidoLevel,
  TrucoLevel,
  FlorLevel,
  CantoType,
  envidoPoints,
  trucoPoints,
  florPoints,
  canCallEnvido,
  canAddEnvidoLevel,
  nextTrucoLevel,
  HAND_BASE_POINTS,
} from '@src/utils/truco';

// ─── Tipos ────────────────────────────────────────────────────────

export interface TrucoTeam {
  name: string;
  score: number;
}

export type CantoStatus = 'pending' | 'accepted' | 'rejected';

export interface ActiveCanto {
  type: CantoType;
  level: EnvidoLevel | TrucoLevel | FlorLevel;
  status: CantoStatus;
  calledBy: 0 | 1;
  pointsIfAccepted: number;
  pointsIfRejected: number;
}

export interface PointsRecord {
  team: 0 | 1;
  amount: number;
  reason: string;
}

export type HandStatus =
  | 'idle'
  | 'playing'
  | 'canto_pending'
  | 'resolving'
  | 'confirming'
  | 'hand_complete';

export interface TrucoHand {
  status: HandStatus;
  envidoHistory: EnvidoLevel[];
  trucoLevel: TrucoLevel | null;
  florPlayed: boolean;
  activeCanto: ActiveCanto | null;
  pendingPoints: PointsRecord | null;
  accumulatedPoints: PointsRecord[];
}

export type GameStatus = 'setup' | 'playing' | 'finished';

export interface HandHistoryEntry {
  handNumber: number;
  points: PointsRecord[];
}

interface TrucoState {
  // Configuración
  teams: [TrucoTeam, TrucoTeam];
  targetScore: 15 | 30;
  florEnabled: boolean;
  voiceEnabled: boolean;

  // Estado de la partida
  gameStatus: GameStatus;
  currentHand: TrucoHand;
  handNumber: number;
  winner: 0 | 1 | null;

  // Historial
  history: HandHistoryEntry[];

  // Persistencia
  hydrated: boolean;

  // Acciones
  initGame: (config: TrucoConfig) => void;
  startHand: () => void;
  endHand: () => void;
  registerCanto: (type: CantoType, level: string, calledBy: 0 | 1) => void;
  respondCanto: (response: 'accepted' | 'rejected') => void;
  assignWinner: (team: 0 | 1) => void;
  confirmPoints: () => void;
  cancelPoints: () => void;
  addManualPoints: (team: 0 | 1, amount: number, reason: string) => void;
  undoLastPoints: () => void;
  resetGame: () => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

export interface TrucoConfig {
  team1Name: string;
  team2Name: string;
  targetScore: 15 | 30;
  florEnabled: boolean;
  voiceEnabled: boolean;
}

// ─── Estado inicial ───────────────────────────────────────────────

const INITIAL_HAND: TrucoHand = {
  status: 'idle',
  envidoHistory: [],
  trucoLevel: null,
  florPlayed: false,
  activeCanto: null,
  pendingPoints: null,
  accumulatedPoints: [],
};

const STORAGE_KEY = '@truco_game';

const INITIAL_STATE: Omit<TrucoState, keyof ReturnType<typeof createActions> | 'hydrate' | 'persist'> = {
  teams: [
    { name: 'Nosotros', score: 0 },
    { name: 'Ellos', score: 0 },
  ],
  targetScore: 30,
  florEnabled: false,
  voiceEnabled: true,
  gameStatus: 'setup',
  currentHand: { ...INITIAL_HAND },
  handNumber: 0,
  winner: null,
  history: [],
  hydrated: false,
};

// ─── Helpers internos ─────────────────────────────────────────────

function calcCantoPoints(
  type: CantoType,
  level: string,
  envidoHistory: EnvidoLevel[],
  targetScore: number,
  loserScore: number,
): { accepted: number; rejected: number } {
  if (type === 'envido') {
    const newHistory = [...envidoHistory, level as EnvidoLevel];
    return envidoPoints(newHistory, targetScore, loserScore);
  }
  if (type === 'truco') {
    return trucoPoints(level as TrucoLevel);
  }
  if (type === 'flor') {
    return florPoints(level as FlorLevel, targetScore, loserScore);
  }
  return { accepted: 0, rejected: 0 };
}

function checkVictory(
  teams: [TrucoTeam, TrucoTeam],
  targetScore: number,
): 0 | 1 | null {
  if (teams[0].score >= targetScore) return 0;
  if (teams[1].score >= targetScore) return 1;
  return null;
}

function addScoreToTeam(
  teams: [TrucoTeam, TrucoTeam],
  teamIndex: 0 | 1,
  amount: number,
  targetScore: number,
): [TrucoTeam, TrucoTeam] {
  const updated = [...teams] as [TrucoTeam, TrucoTeam];
  updated[teamIndex] = {
    ...updated[teamIndex],
    score: Math.min(updated[teamIndex].score + amount, targetScore),
  };
  return updated;
}

// ─── Acciones ─────────────────────────────────────────────────────

function createActions(
  set: (fn: (s: TrucoState) => Partial<TrucoState>) => void,
  get: () => TrucoState,
) {
  const persist = async () => {
    const { hydrated, hydrate: _h, persist: _p, ...data } = get();
    // Excluir acciones (funciones) antes de serializar
    const serializable: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (typeof v !== 'function') serializable[k] = v;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  };

  const setAndPersist = (fn: (s: TrucoState) => Partial<TrucoState>) => {
    set(fn);
    persist();
  };

  return {
    persist,

    hydrate: async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          // Solo restaurar si hay una partida en curso
          if (data.gameStatus === 'playing') {
            set(() => ({ ...data, hydrated: true }));
            return;
          }
        }
      } catch {
        // Si falla la lectura, usar estado por defecto
      }
      set(() => ({ hydrated: true }));
    },

    initGame: (config: TrucoConfig) => {
      set(() => ({
        ...INITIAL_STATE,
        teams: [
          { name: config.team1Name, score: 0 },
          { name: config.team2Name, score: 0 },
        ],
        targetScore: config.targetScore,
        florEnabled: config.florEnabled,
        voiceEnabled: config.voiceEnabled,
        gameStatus: 'playing',
        currentHand: { ...INITIAL_HAND, status: 'playing' },
        handNumber: 1,
        hydrated: true,
      } as Partial<TrucoState>));
      persist();
    },

    startHand: () =>
      setAndPersist((s) => {
        if (s.gameStatus !== 'playing') return {};
        return {
          currentHand: { ...INITIAL_HAND, status: 'playing' },
          handNumber: s.handNumber + 1,
        };
      }),

    endHand: () =>
      setAndPersist((s) => {
        if (s.currentHand.status === 'idle') return {};

        const entry: HandHistoryEntry = {
          handNumber: s.handNumber,
          points: s.currentHand.accumulatedPoints,
        };

        return {
          currentHand: { ...INITIAL_HAND },
          history: [...s.history, entry],
        };
      }),

    registerCanto: (type: CantoType, level: string, calledBy: 0 | 1) =>
      setAndPersist((s) => {
        const hand = s.currentHand;
        if (hand.status !== 'playing' && hand.status !== 'canto_pending') return {};

        // Si hay un canto pendiente, solo se puede subir la apuesta del mismo tipo
        if (hand.status === 'canto_pending' && hand.activeCanto) {
          if (type !== hand.activeCanto.type) return {};
        }

        // Validaciones
        if (type === 'envido') {
          if (!canCallEnvido(hand.trucoLevel)) return {};
          if (!canAddEnvidoLevel(hand.envidoHistory, level as EnvidoLevel)) return {};
        }

        if (type === 'truco') {
          const expected = nextTrucoLevel(hand.trucoLevel);
          if (expected === null || expected !== level) return {};
        }

        if (type === 'flor' && !s.florEnabled) return {};

        // Calcular puntos en juego
        // Para "no quiero", los puntos van al que cantó.
        // Para falta envido, usamos el score del equipo que NO cantó.
        const otherTeam = calledBy === 0 ? 1 : 0;
        const loserScore = s.teams[otherTeam].score;

        const points = calcCantoPoints(
          type,
          level,
          type === 'envido' ? hand.envidoHistory : [],
          s.targetScore,
          loserScore,
        );

        const activeCanto: ActiveCanto = {
          type,
          level: level as EnvidoLevel | TrucoLevel | FlorLevel,
          status: 'pending',
          calledBy,
          pointsIfAccepted: points.accepted,
          pointsIfRejected: points.rejected,
        };

        const envidoHistory = type === 'envido'
          ? [...hand.envidoHistory, level as EnvidoLevel]
          : hand.envidoHistory;

        return {
          currentHand: {
            ...hand,
            status: 'canto_pending' as HandStatus,
            activeCanto,
            envidoHistory,
          },
        };
      }),

    respondCanto: (response: 'accepted' | 'rejected') =>
      setAndPersist((s) => {
        const hand = s.currentHand;
        if (hand.status !== 'canto_pending' || !hand.activeCanto) return {};

        const canto = hand.activeCanto;

        if (response === 'rejected') {
          // "No quiero" — los puntos van al que cantó
          const pendingPoints: PointsRecord = {
            team: canto.calledBy,
            amount: canto.pointsIfRejected,
            reason: `${canto.level} no querido`,
          };

          return {
            currentHand: {
              ...hand,
              status: 'confirming' as HandStatus,
              activeCanto: { ...canto, status: 'rejected' as CantoStatus },
              pendingPoints,
            },
          };
        }

        // "Quiero" — depende del tipo de canto
        const updatedCanto = { ...canto, status: 'accepted' as CantoStatus };

        if (canto.type === 'truco') {
          // Truco querido: la mano continúa, puntos se resuelven al final
          return {
            currentHand: {
              ...hand,
              status: 'playing' as HandStatus,
              activeCanto: null,
              trucoLevel: canto.level as TrucoLevel,
            },
          };
        }

        if (canto.type === 'flor' && canto.level === 'flor') {
          // Flor sin contra: 3 puntos directos al que la tiene
          const pendingPoints: PointsRecord = {
            team: canto.calledBy,
            amount: canto.pointsIfAccepted,
            reason: 'flor',
          };
          return {
            currentHand: {
              ...hand,
              status: 'confirming' as HandStatus,
              activeCanto: updatedCanto,
              florPlayed: true,
              pendingPoints,
            },
          };
        }

        // Envido querido, contra flor, contra flor al resto:
        // hay que saber quién ganó
        return {
          currentHand: {
            ...hand,
            status: 'resolving' as HandStatus,
            activeCanto: updatedCanto,
            florPlayed: canto.type === 'flor' ? true : hand.florPlayed,
          },
        };
      }),

    assignWinner: (team: 0 | 1) =>
      setAndPersist((s) => {
        const hand = s.currentHand;
        if (hand.status !== 'resolving' || !hand.activeCanto) return {};

        const canto = hand.activeCanto;
        const pendingPoints: PointsRecord = {
          team,
          amount: canto.pointsIfAccepted,
          reason: `${canto.level} querido`,
        };

        return {
          currentHand: {
            ...hand,
            status: 'confirming' as HandStatus,
            pendingPoints,
          },
        };
      }),

    confirmPoints: () =>
      setAndPersist((s) => {
        const hand = s.currentHand;
        if (hand.status !== 'confirming' || !hand.pendingPoints) return {};

        const { team, amount, reason } = hand.pendingPoints;
        const teams = addScoreToTeam(s.teams, team, amount, s.targetScore);
        const winner = checkVictory(teams, s.targetScore);

        const record: PointsRecord = { team, amount, reason };

        return {
          teams,
          winner,
          gameStatus: winner !== null ? 'finished' : s.gameStatus,
          currentHand: {
            ...hand,
            status: winner !== null ? 'hand_complete' as HandStatus : 'playing' as HandStatus,
            activeCanto: null,
            pendingPoints: null,
            accumulatedPoints: [...hand.accumulatedPoints, record],
          },
        };
      }),

    cancelPoints: () =>
      setAndPersist((s) => {
        const hand = s.currentHand;
        if (hand.status !== 'confirming' && hand.status !== 'resolving') return {};

        // Cancelar: volver a 'playing', descartar el canto activo
        // Si era envido, revertir el historial
        const envidoHistory = hand.activeCanto?.type === 'envido'
          ? hand.envidoHistory.slice(0, -1)
          : hand.envidoHistory;

        return {
          currentHand: {
            ...hand,
            status: 'playing' as HandStatus,
            activeCanto: null,
            pendingPoints: null,
            envidoHistory,
          },
        };
      }),

    addManualPoints: (team: 0 | 1, amount: number, reason: string) =>
      setAndPersist((s) => {
        if (s.gameStatus !== 'playing') return {};

        const teams = addScoreToTeam(s.teams, team, amount, s.targetScore);
        const winner = checkVictory(teams, s.targetScore);

        const record: PointsRecord = { team, amount, reason };

        return {
          teams,
          winner,
          gameStatus: winner !== null ? 'finished' : s.gameStatus,
          currentHand: {
            ...s.currentHand,
            accumulatedPoints: [...s.currentHand.accumulatedPoints, record],
          },
        };
      }),

    undoLastPoints: () =>
      setAndPersist((s) => {
        if (s.gameStatus !== 'playing') return {};

        const accumulated = s.currentHand.accumulatedPoints;
        if (accumulated.length === 0) return {};

        const last = accumulated[accumulated.length - 1];
        const teams = [...s.teams] as [TrucoTeam, TrucoTeam];
        teams[last.team] = {
          ...teams[last.team],
          score: Math.max(0, teams[last.team].score - last.amount),
        };

        return {
          teams,
          currentHand: {
            ...s.currentHand,
            accumulatedPoints: accumulated.slice(0, -1),
          },
        };
      }),

    resetGame: () => {
      set(() => ({ ...INITIAL_STATE, hydrated: true } as Partial<TrucoState>));
      AsyncStorage.removeItem(STORAGE_KEY);
    },
  };
}

// ─── Store ────────────────────────────────────────────────────────

export const useTrucoStore = create<TrucoState>((set, get) => ({
  ...(INITIAL_STATE as TrucoState),
  ...createActions(
    set as (fn: (s: TrucoState) => Partial<TrucoState>) => void,
    get,
  ),
}));
