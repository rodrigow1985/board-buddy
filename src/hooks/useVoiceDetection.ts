import { useEffect, useRef, useCallback } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useTimerStore } from '@src/store/timerStore';

export type VoiceDetectionState = 'idle' | 'requesting' | 'listening' | 'paused' | 'error';

interface UseVoiceDetectionOptions {
  enabled: boolean;
  triggerWord?: string;
  onPermissionDenied?: () => void;
}

interface UseVoiceDetectionResult {
  state: VoiceDetectionState;
  permissionGranted: boolean | null;
  requestPermission: () => Promise<boolean>;
}

const DEFAULT_TRIGGER = 'paso';
const RECOGNITION_OPTIONS = {
  lang: 'es-AR',
  continuous: true,
  interimResults: true,
  requiresOnDeviceRecognition: false,
} as const;

export function useVoiceDetection({
  enabled,
  triggerWord = DEFAULT_TRIGGER,
  onPermissionDenied,
}: UseVoiceDetectionOptions): UseVoiceDetectionResult {
  const status = useTimerStore((s) => s.status);
  const passTurn = useTimerStore((s) => s.passTurn);

  const stateRef = useRef<VoiceDetectionState>('idle');
  const permissionRef = useRef<boolean | null>(null);
  const isRunningRef = useRef(false);
  // Previene múltiples passTurn por la misma detección
  const lastTriggerRef = useRef<number>(0);

  const shouldListen =
    enabled &&
    permissionRef.current === true &&
    (status === 'running');

  // ── Iniciar reconocimiento ──────────────────────────────��───────────────
  const startListening = useCallback(() => {
    if (isRunningRef.current) return;
    try {
      ExpoSpeechRecognitionModule.start(RECOGNITION_OPTIONS);
      isRunningRef.current = true;
      stateRef.current = 'listening';
    } catch {
      stateRef.current = 'error';
      isRunningRef.current = false;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!isRunningRef.current) return;
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch {
      // ignorar
    }
    isRunningRef.current = false;
    stateRef.current = 'paused';
  }, []);

  // ── Eventos del reconocedor ─────────────────────────────────────────────

  useSpeechRecognitionEvent('start', () => {
    isRunningRef.current = true;
    stateRef.current = 'listening';
  });

  useSpeechRecognitionEvent('end', () => {
    isRunningRef.current = false;
    // Reiniciar automáticamente si sigue siendo necesario
    if (shouldListen) {
      setTimeout(() => {
        if (shouldListen && !isRunningRef.current) {
          startListening();
        }
      }, 300);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    isRunningRef.current = false;
    const recoverable = ['no-speech', 'speech-timeout', 'aborted', 'network'];
    if (recoverable.includes(event.error) && shouldListen) {
      setTimeout(() => {
        if (shouldListen && !isRunningRef.current) {
          startListening();
        }
      }, 500);
    } else {
      stateRef.current = 'error';
    }
  });

  useSpeechRecognitionEvent('result', (event) => {
    if (!shouldListen) return;

    const now = Date.now();
    // Debounce: ignorar si ya se disparó en los últimos 1500ms
    if (now - lastTriggerRef.current < 1500) return;

    for (const result of event.results) {
      const transcript = result.transcript.toLowerCase().trim();
      if (transcript.includes(triggerWord.toLowerCase())) {
        lastTriggerRef.current = now;
        passTurn('voice');
        break;
      }
    }
  });

  // ── Efectos de control ────────────────────────��────────────────────────

  useEffect(() => {
    if (!enabled || permissionRef.current !== true) return;

    if (shouldListen && !isRunningRef.current) {
      startListening();
    } else if (!shouldListen && isRunningRef.current) {
      stopListening();
    }

    return () => {
      if (isRunningRef.current) {
        try { ExpoSpeechRecognitionModule.abort(); } catch { /* ignorar */ }
        isRunningRef.current = false;
      }
    };
  }, [enabled, shouldListen, startListening, stopListening]);

  // ── Gestión de permisos ────────────────────────────────────────────────

  const requestPermission = useCallback(async (): Promise<boolean> => {
    stateRef.current = 'requesting';
    try {
      const response = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      const granted = response.granted;
      permissionRef.current = granted;
      if (!granted) {
        stateRef.current = 'idle';
        onPermissionDenied?.();
      }
      return granted;
    } catch {
      stateRef.current = 'error';
      permissionRef.current = false;
      return false;
    }
  }, [onPermissionDenied]);

  return {
    state: stateRef.current,
    permissionGranted: permissionRef.current,
    requestPermission,
  };
}
