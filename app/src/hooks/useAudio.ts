import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useTimerStore } from '@src/store/timerStore';
import { useSettingsStore } from '@src/store/settingsStore';

// Archivos de audio (placeholders reemplazables con la versión final)
const SOUNDS: Record<string, number> = {
  mid:    require('../../assets/sounds/tick-mid.mp3') as number,
  warn:   require('../../assets/sounds/tick-warn.mp3') as number,
  second: require('../../assets/sounds/tick-second.mp3') as number,
  end:    require('../../assets/sounds/timer-end.mp3') as number,
  pass:   require('../../assets/sounds/pass.mp3') as number,
};

type SoundMap = Record<string, Audio.Sound | null>;

async function loadSound(source: number): Promise<Audio.Sound | null> {
  try {
    const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
    return sound;
  } catch {
    return null;
  }
}

async function playSound(sound: Audio.Sound | null): Promise<void> {
  if (!sound) return;
  try {
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    // ignorar errores de reproducción
  }
}

/**
 * Reproduce efectos de sonido en los momentos clave del timer:
 *   • 50% del tiempo restante  → tick suave (una vez por turno)
 *   • 20% del tiempo restante  → tono de advertencia (una vez por turno)
 *   • Últimos 10 segundos      → tick por cada segundo
 *   • Tiempo agotado           → sonido de fin
 *   • Turno pasado             → confirmación
 *
 * Respeta el setting `audio.soundOnExpire` del settingsStore.
 * Retorna `playPass()` para ser llamado desde el handler de "Pasar turno".
 */
export function useAudio(): { playPass: () => void } {
  const soundEnabled = useSettingsStore((s) => s.audio.soundOnExpire);
  const status = useTimerStore((s) => s.status);
  const timeRemainingMs = useTimerStore((s) => s.timeRemainingMs);
  const turnDurationMs = useTimerStore((s) => s.turnDurationMs);

  const soundsRef = useRef<SoundMap>({
    mid: null, warn: null, second: null, end: null, pass: null,
  } as SoundMap);

  // Flags one-shot por turno
  const midFiredRef = useRef(false);
  const warnFiredRef = useRef(false);

  // Para detectar cruce de segundo en los últimos 10s
  const lastSecondRef = useRef<number | null>(null);

  const prevStatusRef = useRef(status);

  // ── Carga de sonidos al montar ──────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

      const [mid, warn, second, end, pass] = await Promise.all([
        loadSound(SOUNDS.mid),
        loadSound(SOUNDS.warn),
        loadSound(SOUNDS.second),
        loadSound(SOUNDS.end),
        loadSound(SOUNDS.pass),
      ]);

      if (mounted) {
        soundsRef.current = { mid, warn, second, end, pass };
      }
    })();

    return () => {
      mounted = false;
      // Descargar todos los sonidos al desmontar
      Object.values(soundsRef.current).forEach((s) => {
        if (s) s.unloadAsync().catch(() => {});
      });
    };
  }, []);

  // ── Reset flags cuando empieza un turno nuevo ───────────────────────────
  useEffect(() => {
    const prev = prevStatusRef.current;
    // Nuevo turno: transitioning → running, o idle → running
    if (
      (prev === 'transitioning' || prev === 'idle') &&
      status === 'running'
    ) {
      midFiredRef.current = false;
      warnFiredRef.current = false;
      lastSecondRef.current = null;
    }
    prevStatusRef.current = status;
  }, [status]);

  // ── Sonido de timeout ───────────────────────────────────────────────────
  useEffect(() => {
    if (!soundEnabled) return;
    const prev = prevStatusRef.current;
    if (prev !== 'timeout' && status === 'timeout') {
      playSound(soundsRef.current.end);
    }
    // No actualizamos prevStatusRef aquí, el effect de reset lo hace
  }, [status, soundEnabled]);

  // ── Sonidos basados en tiempo restante ──────────────────────────────────
  useEffect(() => {
    if (!soundEnabled || status !== 'running' || turnDurationMs === 0) return;

    const pct = timeRemainingMs / turnDurationMs;

    // 50% → tick suave (una vez por turno)
    if (!midFiredRef.current && pct <= 0.5 && pct > 0.2) {
      midFiredRef.current = true;
      playSound(soundsRef.current.mid);
    }

    // 20% → advertencia (una vez por turno)
    if (!warnFiredRef.current && pct <= 0.2 && timeRemainingMs > 10_000) {
      warnFiredRef.current = true;
      playSound(soundsRef.current.warn);
    }

    // Últimos 10s → tick por cada segundo
    if (timeRemainingMs <= 10_000 && timeRemainingMs > 0) {
      const currentSecond = Math.ceil(timeRemainingMs / 1000);
      if (lastSecondRef.current === null || currentSecond < lastSecondRef.current) {
        lastSecondRef.current = currentSecond;
        playSound(soundsRef.current.second);
      }
    }
  }, [timeRemainingMs, status, soundEnabled, turnDurationMs]);

  // ── playPass: llamado externamente al pasar turno ──────────────────────
  const playPass = useCallback(() => {
    if (!soundEnabled) return;
    playSound(soundsRef.current.pass);
  }, [soundEnabled]);

  return { playPass };
}
