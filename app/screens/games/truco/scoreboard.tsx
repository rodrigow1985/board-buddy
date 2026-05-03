import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useTrucoStore } from '@src/store/trucoStore';
import { useTrucoVoice } from '@src/hooks/useTrucoVoice';
import { Colors, FontWeights, FontSizes, Spacing } from '@src/constants/tokens';
import { VoiceStatusChip } from '@src/components/timer/VoiceStatusChip';
import { ScorePanel } from '@src/components/truco/ScorePanel';
import { CantoZone } from '@src/components/truco/CantoZone';
import { ManualControls } from '@src/components/truco/ManualControls';

const BG_COLOR = Colors.calm;

export default function ScoreboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const teams = useTrucoStore((s) => s.teams);
  const targetScore = useTrucoStore((s) => s.targetScore);
  const gameStatus = useTrucoStore((s) => s.gameStatus);
  const handNumber = useTrucoStore((s) => s.handNumber);
  const currentHand = useTrucoStore((s) => s.currentHand);
  const voiceEnabled = useTrucoStore((s) => s.voiceEnabled);

  const { registerCanto, startHand, endHand, undoLastPoints } =
    useTrucoStore.getState();

  // Voz
  const [voiceReady, setVoiceReady] = useState(false);
  const { state: voiceState, requestPermission } = useTrucoVoice({
    enabled: voiceEnabled && voiceReady,
    onPermissionDenied: () => {},
  });

  // Pedir permisos de voz al montar
  useEffect(() => {
    if (voiceEnabled) {
      requestPermission().then((granted) => {
        if (granted) setVoiceReady(true);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled]);

  // Sincronizar nav bar de Android
  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync(BG_COLOR);
    NavigationBar.setButtonStyleAsync('light');
  }

  const canUndo = currentHand.accumulatedPoints.length > 0;
  const isCantoActive = currentHand.status !== 'playing' && currentHand.status !== 'idle';

  const handleEnvido = useCallback(() => {
    // Determinar qué nivel de envido se puede cantar
    const hand = useTrucoStore.getState().currentHand;
    if (hand.envidoHistory.length === 0) {
      registerCanto('envido', 'envido', 0);
    } else if (hand.envidoHistory.length === 1 && hand.envidoHistory[0] === 'envido') {
      // Segundo envido o real envido
      registerCanto('envido', 'real_envido', 0);
    } else {
      registerCanto('envido', 'falta_envido', 0);
    }
  }, [registerCanto]);

  const handleTruco = useCallback(() => {
    const hand = useTrucoStore.getState().currentHand;
    if (!hand.trucoLevel) {
      registerCanto('truco', 'truco', 0);
    } else if (hand.trucoLevel === 'truco') {
      registerCanto('truco', 'retruco', 1);
    } else if (hand.trucoLevel === 'retruco') {
      registerCanto('truco', 'vale_cuatro', 0);
    }
  }, [registerCanto]);

  const handleManual = useCallback(() => {
    Alert.alert(
      'Puntos manuales',
      '¿A qué equipo?',
      [
        {
          text: teams[0].name,
          onPress: () => {
            Alert.prompt
              ? Alert.prompt('Puntos', `Puntos para ${teams[0].name}`, (text) => {
                  const n = parseInt(text, 10);
                  if (n > 0) useTrucoStore.getState().addManualPoints(0, n, 'manual');
                })
              : useTrucoStore.getState().addManualPoints(0, 1, 'manual');
          },
        },
        {
          text: teams[1].name,
          onPress: () => {
            Alert.prompt
              ? Alert.prompt('Puntos', `Puntos para ${teams[1].name}`, (text) => {
                  const n = parseInt(text, 10);
                  if (n > 0) useTrucoStore.getState().addManualPoints(1, n, 'manual');
                })
              : useTrucoStore.getState().addManualPoints(1, 1, 'manual');
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  }, [teams]);

  const handleNewHand = useCallback(() => {
    endHand();
    startHand();
  }, [endHand, startHand]);

  const handleEndGame = useCallback(() => {
    Alert.alert(
      'Fin de partida',
      '¿Seguro que querés terminar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Terminar',
          style: 'destructive',
          onPress: () => {
            useTrucoStore.getState().resetGame();
            router.replace('/');
          },
        },
      ],
    );
  }, [router]);

  // Navegar al resumen cuando termina la partida
  useEffect(() => {
    if (gameStatus === 'finished') {
      router.replace('/games/truco/summary');
    }
  }, [gameStatus, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + Spacing.screenV }]}>
      <StatusBar style="light" />

      {/* Header: voz + número de mano */}
      <View style={styles.header}>
        <VoiceStatusChip
          state={voiceState === 'listening' ? 'listening' : 'paused'}
          voiceEnabled={voiceEnabled}
        />
        <Text style={styles.handLabel}>Mano {handNumber}</Text>
      </View>

      {/* Marcador: dos paneles */}
      <View style={styles.scoreRow}>
        <ScorePanel
          name={teams[0].name}
          score={teams[0].score}
          color={Colors.terracotta}
          targetScore={targetScore}
        />
        <View style={styles.divider} />
        <ScorePanel
          name={teams[1].name}
          score={teams[1].score}
          color={Colors.calm}
          targetScore={targetScore}
        />
      </View>

      {/* Zona de cantos */}
      <View style={styles.cantoSection}>
        <CantoZone />
      </View>

      {/* Controles manuales */}
      <ManualControls
        onEnvido={handleEnvido}
        onTruco={handleTruco}
        onManual={handleManual}
        onEndGame={handleEndGame}
        onNewHand={handleNewHand}
        onUndo={undoLastPoints}
        canUndo={canUndo}
        disabled={isCantoActive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    minHeight: 40,
  },
  handLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  scoreRow: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: Spacing.screenH,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: Spacing.xxl,
  },
  cantoSection: {
    minHeight: 140,
    justifyContent: 'center',
  },
});
