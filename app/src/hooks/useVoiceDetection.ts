import { useEffect, useRef, useCallback, useState } from 'react';
import { useTimerStore } from '@src/store/timerStore';

export type VoiceDetectionState = 'idle' | 'requesting' | 'listening' | 'paused' | 'error' | 'unavailable';

interface UseVoiceDetectionOptions {
  enabled: boolean;
  triggerWord?: string;
  onPermissionDenied?: () => void;
  onTrigger?: () => void;
}

interface UseVoiceDetectionResult {
  state: VoiceDetectionState;
  permissionGranted: boolean | null;
  requestPermission: () => Promise<boolean>;
}

const DEFAULT_TRIGGER = 'paso';
const RECOGNITION_OPTIONS = {
  lang: 'es-ES',
  continuous: true,
  interimResults: true,
  requiresOnDeviceRecognition: false,
};

// Verifica disponibilidad del módulo nativo una sola vez al cargar.
// En Expo Go, el módulo no existe y esto retorna null silenciosamente.
function getSpeechModule() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-speech-recognition');
    if (typeof mod?.ExpoSpeechRecognitionModule?.start === 'function') {
      return mod.ExpoSpeechRecognitionModule as {
        start: (opts: typeof RECOGNITION_OPTIONS) => void;
        stop: () => void;
        abort: () => void;
        requestPermissionsAsync: () => Promise<{ granted: boolean }>;
        addListener: (event: string, listener: (data: unknown) => void) => { remove: () => void };
      };
    }
    return null;
  } catch {
    return null;
  }
}

const SpeechModule = getSpeechModule();

export function useVoiceDetection({
  enabled,
  triggerWord = DEFAULT_TRIGGER,
  onPermissionDenied,
  onTrigger,
}: UseVoiceDetectionOptions): UseVoiceDetectionResult {
  const status = useTimerStore((s) => s.status);
  const passTurn = useTimerStore((s) => s.passTurn);

  const [voiceState, setVoiceState] = useState<VoiceDetectionState>(
    SpeechModule ? 'idle' : 'unavailable'
  );
  const permissionRef = useRef<boolean | null>(null);
  const isRunningRef = useRef(false);
  const lastTriggerRef = useRef<number>(0);

  // BUG-04: incluir 'timeout' para que la voz siga activa cuando el tiempo se agota
  const shouldListen = enabled && permissionRef.current === true
    && (status === 'running' || status === 'timeout');

  // BUG-22: ref sincronizada con shouldListen para usarla en closures de event handlers
  // sin poner shouldListen en las deps del effect de suscripciones.
  const shouldListenRef = useRef(shouldListen);
  useEffect(() => { shouldListenRef.current = shouldListen; }, [shouldListen]);

  // BUG-22: ref para saber si el cierre de sesión fue por error fatal.
  // El handler de 'end' consulta esta ref para no reiniciar tras un error no-recuperable.
  const fatalErrorRef = useRef(false);

  // ── Iniciar / detener reconocimiento ──────────────────────────────────
  const startListening = useCallback(() => {
    if (!SpeechModule || isRunningRef.current) return;
    try {
      SpeechModule.start(RECOGNITION_OPTIONS);
      isRunningRef.current = true;
      setVoiceState('listening');
    } catch {
      setVoiceState('error');
      isRunningRef.current = false;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!SpeechModule || !isRunningRef.current) return;
    try {
      SpeechModule.abort();
    } catch {
      // ignorar
    }
    isRunningRef.current = false;
    setVoiceState('paused');
  }, []);

  // ── Suscripción a eventos nativos ──────────────────────────────────────
  // BUG-22: los handlers usan shouldListenRef.current en lugar de shouldListen
  // para tener siempre el valor más reciente sin recrear los listeners en cada
  // transición de turno. 'shouldListen' ya no está en las deps de este effect.
  useEffect(() => {
    if (!SpeechModule || !enabled) return;

    const subs = [
      SpeechModule.addListener('start', () => {
        isRunningRef.current = true;
        setVoiceState('listening');
      }),

      SpeechModule.addListener('end', () => {
        isRunningRef.current = false;
        // BUG-22: no reiniciar si el cierre fue por error fatal
        if (fatalErrorRef.current) {
          fatalErrorRef.current = false;
          return;
        }
        if (shouldListenRef.current) {
          setTimeout(() => {
            if (shouldListenRef.current && !isRunningRef.current) startListening();
          }, 300);
        }
      }),

      SpeechModule.addListener('error', (data: unknown) => {
        const event = data as { error: string };
        isRunningRef.current = false;
        const recoverable = ['no-speech', 'speech-timeout', 'aborted', 'network'];
        if (recoverable.includes(event.error) && shouldListenRef.current) {
          setTimeout(() => {
            if (shouldListenRef.current && !isRunningRef.current) startListening();
          }, 500);
        } else {
          // BUG-22: marcar error fatal para que 'end' no reactive el reconocedor
          fatalErrorRef.current = true;
          setVoiceState('error');
        }
      }),

      SpeechModule.addListener('result', (data: unknown) => {
        if (!shouldListenRef.current) return;
        const event = data as { results: Array<{ transcript: string; isFinal?: boolean }> };
        const now = Date.now();
        if (now - lastTriggerRef.current < 800) return;
        for (const result of event.results) {
          if (result.transcript.toLowerCase().trim().includes(triggerWord.toLowerCase())) {
            lastTriggerRef.current = now;
            onTrigger?.();
            passTurn('voice');
            break;
          }
        }
      }),
    ];

    return () => subs.forEach((s) => s.remove());
  // BUG-22: 'shouldListen' eliminado de deps — los closures usan shouldListenRef.current
  }, [enabled, triggerWord, startListening, passTurn, onTrigger]);

  // ── Control start/stop según estado del timer ──────────────────────────
  useEffect(() => {
    if (!SpeechModule || !enabled || permissionRef.current !== true) return;

    if (shouldListen && !isRunningRef.current) {
      startListening();
    } else if (!shouldListen && isRunningRef.current) {
      stopListening();
    }

    return () => {
      if (isRunningRef.current) {
        try { SpeechModule.abort(); } catch { /* ignorar */ }
        isRunningRef.current = false;
      }
    };
  }, [enabled, shouldListen, startListening, stopListening]);

  // ── Gestión de permisos ────────────────────────────────────────────────
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!SpeechModule) {
      // En Expo Go no hay módulo — retornamos false silenciosamente
      permissionRef.current = false;
      return false;
    }
    setVoiceState('requesting');
    try {
      const response = await SpeechModule.requestPermissionsAsync();
      permissionRef.current = response.granted;
      if (!response.granted) {
        setVoiceState('idle');
        onPermissionDenied?.();
      }
      return response.granted;
    } catch {
      setVoiceState('error');
      permissionRef.current = false;
      return false;
    }
  }, [onPermissionDenied]);

  return {
    state: voiceState,
    permissionGranted: permissionRef.current,
    requestPermission,
  };
}
