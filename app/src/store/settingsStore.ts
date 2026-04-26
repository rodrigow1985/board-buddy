import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Defaults } from '@src/constants/defaults';

const STORAGE_KEY = '@board_buddy_settings';

interface SettingsState {
  voice: {
    enabled: boolean;
    triggerWord: string;
    sensitivity: number;
  };
  audio: {
    soundOnExpire: boolean;
    vibration: boolean;
  };
  ui: {
    theme: 'system' | 'light' | 'dark';
    language: 'es' | 'en';
    textSize: 'sm' | 'md' | 'lg';
  };
  hydrated: boolean;

  // Acciones
  setVoiceEnabled: (enabled: boolean) => void;
  setTriggerWord: (word: string) => void;
  setVoiceSensitivity: (value: number) => void;
  setSoundOnExpire: (enabled: boolean) => void;
  setVibration: (enabled: boolean) => void;
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  setLanguage: (lang: 'es' | 'en') => void;
  setTextSize: (size: 'sm' | 'md' | 'lg') => void;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const DEFAULT_SETTINGS: Omit<SettingsState, 'hydrated' | keyof ReturnType<typeof buildActions>> = {
  voice: {
    enabled: Defaults.voiceEnabled,
    triggerWord: Defaults.triggerWord,
    sensitivity: Defaults.voiceSensitivity,
  },
  audio: {
    soundOnExpire: Defaults.soundEnabled,
    vibration: Defaults.vibrationEnabled,
  },
  ui: {
    theme: 'system',
    language: 'es',
    textSize: 'md',
  },
};

function buildActions(
  set: (fn: (s: SettingsState) => Partial<SettingsState>) => void,
  get: () => SettingsState
) {
  const persist = async () => {
    const { hydrated, hydrate, persist: _p, ...data } = get();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    setVoiceEnabled: (enabled: boolean) => {
      set((s) => ({ voice: { ...s.voice, enabled } }));
      persist();
    },
    setTriggerWord: (triggerWord: string) => {
      set((s) => ({ voice: { ...s.voice, triggerWord } }));
      persist();
    },
    setVoiceSensitivity: (sensitivity: number) => {
      set((s) => ({ voice: { ...s.voice, sensitivity } }));
      persist();
    },
    setSoundOnExpire: (soundOnExpire: boolean) => {
      set((s) => ({ audio: { ...s.audio, soundOnExpire } }));
      persist();
    },
    setVibration: (vibration: boolean) => {
      set((s) => ({ audio: { ...s.audio, vibration } }));
      persist();
    },
    setTheme: (theme: 'system' | 'light' | 'dark') => {
      set((s) => ({ ui: { ...s.ui, theme } }));
      persist();
    },
    setLanguage: (language: 'es' | 'en') => {
      set((s) => ({ ui: { ...s.ui, language } }));
      persist();
    },
    setTextSize: (textSize: 'sm' | 'md' | 'lg') => {
      set((s) => ({ ui: { ...s.ui, textSize } }));
      persist();
    },
    hydrate: async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          set(() => ({ ...saved, hydrated: true }));
        } else {
          set(() => ({ hydrated: true }));
        }
      } catch {
        set(() => ({ hydrated: true }));
      }
    },
    persist,
  };
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,
  ...buildActions(
    set as (fn: (s: SettingsState) => Partial<SettingsState>) => void,
    get
  ),
}));
