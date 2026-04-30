import { useEffect, useRef, useCallback, useState } from 'react';
import { useTimerStore } from '@src/store/timerStore';

export type VoiceDetectionState = 'idle' | 'requesting' | 'listening' | 'paused' | 'error' | 'unavailable';

// ─── Trigger: palabra clave + aliases + callback ──────────────────

export interface VoiceTrigger {
  word: string;
  aliases?: string[];
  onDetected: () => void;
}

// ─── Opciones: modo single (Rummikub) o multi (Truco) ─────────────

interface UseVoiceDetectionOptionsBase {
  enabled: boolean;
  onPermissionDenied?: () => void;
}

interface SingleTriggerOptions extends UseVoiceDetectionOptionsBase {
  triggerWord?: string;
  onTrigger?: () => void;
  triggers?: never;
  /** Si se pasa, useTimerStore se usa para shouldListen y passTurn */
  useTimer?: boolean;
}

interface MultiTriggerOptions extends UseVoiceDetectionOptionsBase {
  triggers: VoiceTrigger[];
  triggerWord?: never;
  onTrigger?: never;
  useTimer?: never;
}

type UseVoiceDetectionOptions = SingleTriggerOptions | MultiTriggerOptions;

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

// ─── Matching de triggers ─────────────────────────────────────────

/**
 * Busca el trigger que mejor matchea en el transcript.
 * Prioriza frases más largas para evitar falsos positivos
 * (ej: "real envido" antes que "envido", "no quiero" antes que "quiero").
 */
function findBestMatch(
  transcript: string,
  triggers: VoiceTrigger[],
): VoiceTrigger | null {
  const normalized = transcript.toLowerCase().trim();

  // Ordenar por longitud de palabra descendente (priorizar frases más largas)
  const sorted = [...triggers].sort((a, b) => {
    const aMax = Math.max(a.word.length, ...(a.aliases ?? []).map((al) => al.length));
    const bMax = Math.max(b.word.length, ...(b.aliases ?? []).map((al) => al.length));
    return bMax - aMax;
  });

  for (const trigger of sorted) {
    const candidates = [trigger.word, ...(trigger.aliases ?? [])];
    for (const candidate of candidates) {
      if (normalized.includes(candidate.toLowerCase())) {
        return trigger;
      }
    }
  }

  return null;
}

// ─── Hook principal ───────────────────────────────────────────────

export function useVoiceDetection(options: UseVoiceDetectionOptions): UseVoiceDetectionResult {
  const {
    enabled,
    onPermissionDenied,
  } = options;

  // Determinar si es modo timer (Rummikub) o standalone (Truco)
  const isTimerMode = !('triggers' in options && options.triggers);

  // Solo leer del timerStore si estamos en modo timer
  const status = useTimerStore((s) => isTimerMode ? s.status : 'running');
  const passTurn = useTimerStore((s) => s.passTurn);

  const [voiceState, setVoiceState] = useState<VoiceDetectionState>(
    SpeechModule ? 'idle' : 'unavailable'
  );
  const permissionRef = useRef<boolean | null>(null);
  const isRunningRef = useRef(false);
  const lastTriggerRef = useRef<number>(0);

  // Construir la lista de triggers
  const triggersRef = useRef<VoiceTrigger[]>([]);

  // En modo timer: un solo trigger (compat con Rummikub)
  // En modo multi: usar triggers directamente
  if (isTimerMode) {
    const singleOpts = options as SingleTriggerOptions;
    const word = singleOpts.triggerWord ?? DEFAULT_TRIGGER;
    triggersRef.current = [{
      word,
      onDetected: () => {
        singleOpts.onTrigger?.();
        passTurn('voice');
      },
    }];
  } else {
    triggersRef.current = (options as MultiTriggerOptions).triggers;
  }

  // BUG-04: incluir 'timeout' para que la voz siga activa cuando el tiempo se agota
  const shouldListen = isTimerMode
    ? enabled && permissionRef.current === true && (status === 'running' || status === 'timeout')
    : enabled && permissionRef.current === true;

  // BUG-22: ref sincronizada con shouldListen para usarla en closures de event handlers
  const shouldListenRef = useRef(shouldListen);
  useEffect(() => { shouldListenRef.current = shouldListen; }, [shouldListen]);

  // BUG-22: ref para saber si el cierre de sesión fue por error fatal
  const fatalErrorRef = useRef(false);

  // ── Iniciar / detener reconocimiento ──────────────────────────────
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

  // ── Suscripción a eventos nativos ──────────────────────────────────
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
          const match = findBestMatch(result.transcript, triggersRef.current);
          if (match) {
            lastTriggerRef.current = now;
            match.onDetected();
            break;
          }
        }
      }),
    ];

    return () => subs.forEach((s) => s.remove());
  // BUG-22: 'shouldListen' eliminado de deps — los closures usan shouldListenRef.current
  }, [enabled, startListening]);

  // ── Control start/stop según estado ──────────────────────────────
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

  // ── Gestión de permisos ────────────────────────────────────────────
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!SpeechModule) {
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
