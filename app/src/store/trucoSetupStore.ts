import { create } from 'zustand';

interface TrucoSetupState {
  team1Name: string;
  team2Name: string;
  targetScore: 15 | 30;
  florEnabled: boolean;
  voiceEnabled: boolean;

  setTeam1Name: (name: string) => void;
  setTeam2Name: (name: string) => void;
  setTargetScore: (score: 15 | 30) => void;
  setFlorEnabled: (enabled: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const initialState = {
  team1Name: 'Nosotros',
  team2Name: 'Ellos',
  targetScore: 30 as 15 | 30,
  florEnabled: false,
  voiceEnabled: true,
};

export const useTrucoSetupStore = create<TrucoSetupState>((set) => ({
  ...initialState,

  setTeam1Name: (name) => set({ team1Name: name.slice(0, 15) }),
  setTeam2Name: (name) => set({ team2Name: name.slice(0, 15) }),
  setTargetScore: (score) => set({ targetScore: score }),
  setFlorEnabled: (enabled) => set({ florEnabled: enabled }),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  reset: () => set(initialState),
}));
