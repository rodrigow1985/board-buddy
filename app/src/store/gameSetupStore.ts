import { create } from 'zustand';
import { createPlayer, Player } from '@src/utils/players';
import { Defaults } from '@src/constants/defaults';

interface GameSetupState {
  turnDurationMs: number;
  players: Player[];
  voiceEnabled: boolean;
  triggerWord: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;

  // Acciones
  setTurnDuration: (ms: number) => void;
  setPlayerCount: (count: number) => void;
  updatePlayerName: (index: number, name: string) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setTriggerWord: (word: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const initialPlayers = Array.from({ length: Defaults.playerCount }, (_, i) =>
  createPlayer(i, Defaults.playerNames[i])
);

const initialState = {
  turnDurationMs: Defaults.turnDurationMs,
  players: initialPlayers,
  voiceEnabled: Defaults.voiceEnabled,
  triggerWord: Defaults.triggerWord,
  soundEnabled: Defaults.soundEnabled,
  vibrationEnabled: Defaults.vibrationEnabled,
};

export const useGameSetupStore = create<GameSetupState>((set) => ({
  ...initialState,

  setTurnDuration: (ms) => set({ turnDurationMs: ms }),

  setPlayerCount: (count) =>
    set((state) => {
      const clamped = Math.max(2, Math.min(8, count));
      if (clamped === state.players.length) return state;

      if (clamped > state.players.length) {
        // Agregar jugadores
        const newPlayers = [...state.players];
        for (let i = state.players.length; i < clamped; i++) {
          newPlayers.push(createPlayer(i));
        }
        return { players: newPlayers };
      } else {
        // Quitar jugadores del final
        return { players: state.players.slice(0, clamped) };
      }
    }),

  updatePlayerName: (index, name) =>
    set((state) => {
      const players = [...state.players];
      if (index < 0 || index >= players.length) return state;
      players[index] = { ...players[index], name: name.trim().slice(0, 20) };
      return { players };
    }),

  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  setTriggerWord: (word) => set({ triggerWord: word }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),

  reset: () => set(initialState),
}));
