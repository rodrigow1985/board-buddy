import { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTimerStore, TimerStatus } from '@src/store/timerStore';
import { useSettingsStore } from '@src/store/settingsStore';
import { useCountdown } from '@src/hooks/useCountdown';
import { useBackgroundTimer } from '@src/hooks/useBackgroundTimer';
import * as Haptics from 'expo-haptics';
import { useHaptics } from '@src/hooks/useHaptics';
import { useVoiceDetection } from '@src/hooks/useVoiceDetection';
import { useAudio } from '@src/hooks/useAudio';
import { isWarnState } from '@src/utils/time';
import { nextPlayerIndex } from '@src/utils/players';
import { Colors, FontWeights, FontSizes, Spacing, Radii, Animations as Anim } from '@src/constants/tokens';
import { TimerDisplay } from '@src/components/timer/TimerDisplay';
import { PlayerChip } from '@src/components/timer/PlayerChip';
import { NextUpRow } from '@src/components/timer/NextUpRow';
import { TimerControls } from '@src/components/timer/TimerControls';
import { VoiceHint } from '@src/components/timer/VoiceHint';
import { VoiceStatusChip } from '@src/components/timer/VoiceStatusChip';
import { PermissionSnackbar } from '@src/components/common/PermissionSnackbar';

// Mapa de status del timer a índice de color de fondo
function bgIndexForStatus(status: TimerStatus, isWarn: boolean): number {
  if (status === 'paused') return 3;
  if (status === 'timeout') return 2;
  if (status === 'running' || status === 'transitioning') {
    return isWarn ? 1 : 0;
  }
  return 0;
}

const BG_COLORS = [Colors.calm, Colors.warn, Colors.alert, Colors.paused];
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TimerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  // Voz habilitada desde settingsStore
  const voiceEnabledSetting = useSettingsStore((s) => s.voice.enabled);
  const [voiceEnabled, setVoiceEnabled] = useState(voiceEnabledSetting);
  const [showPermissionSnackbar, setShowPermissionSnackbar] = useState(false);

  const handlePermissionDenied = useCallback(() => {
    setShowPermissionSnackbar(true);
  }, []);

  // playPass se inicializa después; usamos ref para evitar dependencia circular
  const playPassRef = useRef<(() => void) | null>(null);

  const { state: voiceState, requestPermission } = useVoiceDetection({
    enabled: voiceEnabled,
    triggerWord: 'paso',
    onPermissionDenied: handlePermissionDenied,
    onTrigger: useCallback(() => { playPassRef.current?.(); }, []),
  });

  // Estado reactivo del store (primitivos — referencia estable)
  const status = useTimerStore((s) => s.status);
  const players = useTimerStore((s) => s.players);
  const currentPlayerIndex = useTimerStore((s) => s.currentPlayerIndex);
  const timeRemainingMs = useTimerStore((s) => s.timeRemainingMs);
  const turnDurationMs = useTimerStore((s) => s.turnDurationMs);

  // Acciones: son referencias estables en Zustand, se obtienen con getState()
  // para no crear un nuevo objeto en cada render (evita loop infinito)
  const { pause, resume, passTurn, restartTurn, endTransition, start, initGame } =
    useTimerStore.getState();

  // Activar hooks del timer
  useCountdown();
  useBackgroundTimer();
  const { playPass } = useAudio();

  // Conectar playPass al ref para que onTrigger de voz lo use
  useEffect(() => { playPassRef.current = playPass; }, [playPass]);

  // ── Inicialización rápida con datos de prueba mientras no hay setup screen ──
  useEffect(() => {
    if (status === 'idle' && players.length === 0) {
      const { createPlayer } = require('@src/utils/players');
      // initGame() es estable (getState) — no es dependencia
      useTimerStore.getState().initGame(
        [
          createPlayer(0, 'Rodrigo'),
          createPlayer(1, 'Ana'),
          createPlayer(2, 'Carlos'),
        ],
        120_000,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, players.length]);

  // Ref estable para requestPermission — evita que sea dependencia del effect
  const requestPermissionRef = useRef(requestPermission);
  useEffect(() => { requestPermissionRef.current = requestPermission; }, [requestPermission]);

  useEffect(() => {
    if (status === 'idle' && players.length > 0) {
      start();
      if (voiceEnabled) {
        requestPermissionRef.current();
      }
    }
    // start() es estable (getState). voiceEnabled es primitivo. players.length es primitivo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, players.length, voiceEnabled]);

  // ── Animación del color de fondo ──────────────────────────────────────────
  const isWarn = isWarnState(timeRemainingMs, turnDurationMs);
  const bgAnim = useRef(new Animated.Value(bgIndexForStatus(status, isWarn))).current;
  const prevBgIndex = useRef(bgIndexForStatus(status, isWarn));

  useEffect(() => {
    const targetIndex = bgIndexForStatus(status, isWarn);
    if (targetIndex !== prevBgIndex.current) {
      prevBgIndex.current = targetIndex;
      Animated.timing(bgAnim, {
        toValue: targetIndex,
        duration: Anim.stateTransition,
        useNativeDriver: false,
      }).start();
    }
  }, [status, isWarn, bgAnim]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: BG_COLORS,
  });

  // ── Flash rojo en timeout ──────────────────────────────────────────────────
  const flashAnim = useRef(new Animated.Value(0)).current;
  const prevStatus = useRef(status);

  useEffect(() => {
    if (prevStatus.current !== 'timeout' && status === 'timeout') {
      haptics.notification(Haptics.NotificationFeedbackType.Error);
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: Anim.timeoutFlash / 2,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: Anim.timeoutFlash / 2,
          useNativeDriver: false,
        }),
      ]).start();
    }
    prevStatus.current = status;
  }, [status, flashAnim, haptics]);

  const flashOverlay = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(178,58,31,0)', 'rgba(178,58,31,0.55)'],
  });

  // ── Animación de transición de turno ──────────────────────────────────────
  const outgoingTranslateX = useRef(new Animated.Value(0)).current;
  const outgoingOpacity = useRef(new Animated.Value(0)).current;
  const incomingTranslateX = useRef(new Animated.Value(SCREEN_WIDTH * 0.5)).current;
  const incomingOpacity = useRef(new Animated.Value(0)).current;

  // Guardamos el índice del jugador saliente para renderizarlo durante la transición
  const outgoingPlayerIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'transitioning') {
      // El índice actual en el store ya es el ENTRANTE (passTurn lo avanzó)
      // El saliente es el anterior al actual
      const outgoing = (currentPlayerIndex - 1 + players.length) % players.length;
      outgoingPlayerIndexRef.current = outgoing;

      // Reset animaciones
      outgoingTranslateX.setValue(0);
      outgoingOpacity.setValue(1);
      incomingTranslateX.setValue(SCREEN_WIDTH * 0.4);
      incomingOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(outgoingTranslateX, {
          toValue: -SCREEN_WIDTH * 0.58,
          duration: Anim.turnTransition,
          useNativeDriver: true,
        }),
        Animated.timing(outgoingOpacity, {
          toValue: 0.45,
          duration: Anim.turnTransition,
          useNativeDriver: true,
        }),
        Animated.timing(incomingTranslateX, {
          toValue: SCREEN_WIDTH * 0.08,
          duration: Anim.turnTransition,
          useNativeDriver: true,
        }),
        Animated.timing(incomingOpacity, {
          toValue: 1,
          duration: Anim.turnTransition,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          endTransition();
          // Reset para el próximo ciclo
          outgoingPlayerIndexRef.current = null;
          outgoingTranslateX.setValue(0);
          outgoingOpacity.setValue(0);
          incomingTranslateX.setValue(0);
          incomingOpacity.setValue(1);
        }
      });
    }
  }, [
    status,
    currentPlayerIndex,
    players.length,
    outgoingTranslateX,
    outgoingOpacity,
    incomingTranslateX,
    incomingOpacity,
    endTransition,
  ]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePauseResume = useCallback(() => {
    if (status === 'paused') {
      haptics.impact(Haptics.ImpactFeedbackStyle.Light);
      resume();
    } else if (status === 'running') {
      haptics.impact(Haptics.ImpactFeedbackStyle.Light);
      pause();
    }
  }, [status, pause, resume, haptics]);

  const handlePassTurn = useCallback(() => {
    if (status === 'running' || status === 'paused' || status === 'timeout') {
      haptics.impact(Haptics.ImpactFeedbackStyle.Medium);
      playPass();
      passTurn('button');
    }
  }, [status, passTurn, playPass, haptics]);

  const handleRestart = useCallback(() => {
    if (status === 'running' || status === 'paused') {
      haptics.impact(Haptics.ImpactFeedbackStyle.Light);
      restartTurn();
    }
  }, [status, restartTurn, haptics]);

  // ── Datos para renderizar ─────────────────────────────────────────────────
  const currentPlayer = players[currentPlayerIndex];
  const outgoingPlayer =
    outgoingPlayerIndexRef.current !== null
      ? players[outgoingPlayerIndexRef.current]
      : null;
  const nextIndex = nextPlayerIndex(currentPlayerIndex, players.length);
  const nextPlayer = players.length > 1 ? players[nextIndex] : null;
  const isTransitioning = status === 'transitioning';
  const isPaused = status === 'paused';
  const isTimeout = status === 'timeout';

  // Chip de voz: estado real del reconocedor
  const voiceChipState = isTransitioning
    ? 'transitioning'
    : voiceState === 'listening'
    ? 'listening'
    : 'paused';

  if (!currentPlayer) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="light" />

      {/* Overlay de flash en timeout */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: flashOverlay }]}
        pointerEvents="none"
      />

      {/* Fila superior: chip de voz */}
      <View style={[styles.topRow, { paddingTop: insets.top + 16 }]}>
        <VoiceStatusChip state={voiceChipState} voiceEnabled={voiceEnabled} />
        {isPaused && (
          <View style={styles.pauseBanner}>
            <Text style={styles.pauseLabel}>PARTIDA EN PAUSA</Text>
          </View>
        )}
        {isTimeout && (
          <View style={styles.timeoutBanner}>
            <Text style={styles.timeoutLabel}>TIEMPO AGOTADO</Text>
          </View>
        )}
      </View>

      {/* Centro: jugador actual + timer */}
      <View style={styles.center}>
        {isTransitioning && outgoingPlayer ? (
          // Animación de transición de turno
          <>
            <Animated.View
              style={[
                styles.playerSlot,
                {
                  transform: [{ translateX: outgoingTranslateX }],
                  opacity: outgoingOpacity,
                  position: 'absolute',
                },
              ]}
            >
              <PlayerChip name={outgoingPlayer.name} color={outgoingPlayer.color} />
              <TimerDisplay timeMs={0} paused={false} />
            </Animated.View>
            <Animated.View
              style={[
                styles.playerSlot,
                {
                  transform: [{ translateX: incomingTranslateX }],
                  opacity: incomingOpacity,
                },
              ]}
            >
              <PlayerChip name={currentPlayer.name} color={currentPlayer.color} />
              <TimerDisplay timeMs={turnDurationMs} paused={false} />
            </Animated.View>
          </>
        ) : (
          <View style={styles.playerSlot}>
            <PlayerChip name={currentPlayer.name} color={currentPlayer.color} />
            <TimerDisplay timeMs={timeRemainingMs} paused={isPaused} />
          </View>
        )}
      </View>

      {/* Fila "Sigue": siguiente jugador */}
      {nextPlayer && !isTransitioning && (
        <View style={styles.nextRow}>
          <NextUpRow player={nextPlayer} />
        </View>
      )}

      {/* Botones de control */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + Spacing.screenV }]}>
        <TimerControls
          status={status}
          onPauseResume={handlePauseResume}
          onRestart={handleRestart}
          onPassTurn={handlePassTurn}
          disabled={isTransitioning}
        />
        <View style={styles.bottomRow}>
          <VoiceHint visible={voiceEnabled && voiceState === 'listening'} />
          <Pressable
            style={({ pressed }) => [styles.endBtn, pressed && styles.endBtnPressed]}
            onPress={() => router.push('/games/rummikub/summary')}
            accessibilityLabel="Fin de partida"
          >
            <Text style={styles.endBtnLabel}>Fin de partida</Text>
          </Pressable>
        </View>
      </View>

      {/* Snackbar de permisos denegados */}
      <PermissionSnackbar
        visible={showPermissionSnackbar}
        onDismiss={() => {
          setShowPermissionSnackbar(false);
          setVoiceEnabled(false);
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.calm,
  },
  topRow: {
    paddingHorizontal: Spacing.screenH,
    alignItems: 'center',
    minHeight: 48,
  },
  pauseBanner: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  pauseLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.micro,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  timeoutBanner: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  timeoutLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.micro,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playerSlot: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  nextRow: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingBottom: Spacing.lg,
  },
  controls: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.screenH,
    minHeight: 32,
  },
  endBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  endBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  endBtnLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.captionS,
    color: 'rgba(255,255,255,0.70)',
  },
});
