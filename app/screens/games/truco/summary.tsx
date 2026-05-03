import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTrucoStore } from '@src/store/trucoStore';
import {
  Colors,
  FontWeights,
  FontSizes,
  Spacing,
  Radii,
  HitTargets,
} from '@src/constants/tokens';

const BG_COLOR = Colors.calm;

export default function TrucoSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const teams = useTrucoStore((s) => s.teams);
  const winner = useTrucoStore((s) => s.winner);
  const handNumber = useTrucoStore((s) => s.handNumber);
  const history = useTrucoStore((s) => s.history);
  const targetScore = useTrucoStore((s) => s.targetScore);

  const winnerName = winner !== null ? teams[winner].name : '—';
  const loserIndex = winner === 0 ? 1 : 0;

  // Estadísticas básicas
  const totalHands = history.length;
  const team0Points = history.reduce(
    (sum, h) => sum + h.points.filter((p) => p.team === 0).reduce((s, p) => s + p.amount, 0),
    0,
  );
  const team1Points = history.reduce(
    (sum, h) => sum + h.points.filter((p) => p.team === 1).reduce((s, p) => s + p.amount, 0),
    0,
  );

  // Sincronizar nav bar
  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync(BG_COLOR);
    NavigationBar.setButtonStyleAsync('light');
  }

  const handleRevancha = () => {
    const config = {
      team1Name: teams[0].name,
      team2Name: teams[1].name,
      targetScore,
      florEnabled: useTrucoStore.getState().florEnabled,
      voiceEnabled: useTrucoStore.getState().voiceEnabled,
    };
    useTrucoStore.getState().initGame(config);
    router.replace('/games/truco/scoreboard');
  };

  const handleNewGame = () => {
    useTrucoStore.getState().resetGame();
    router.replace('/games/truco/setup');
  };

  const handleHome = () => {
    useTrucoStore.getState().resetGame();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + Spacing.screenV }]}>
      <StatusBar style="light" />

      {/* Trofeo */}
      <Ionicons name="trophy" size={48} color={Colors.terracotta} style={styles.trophy} />

      {/* Ganador */}
      <Text style={styles.subtitle}>Ganó</Text>
      <Text style={styles.winnerName}>{winnerName}</Text>

      {/* Puntaje final */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <View style={styles.teamScore}>
            <View style={[styles.dot, { backgroundColor: Colors.terracotta }]} />
            <Text style={styles.teamName}>{teams[0].name}</Text>
            <Text style={styles.teamPoints}>{teams[0].score}</Text>
          </View>
          <Text style={styles.dash}>—</Text>
          <View style={styles.teamScore}>
            <Text style={styles.teamPoints}>{teams[1].score}</Text>
            <Text style={styles.teamName}>{teams[1].name}</Text>
            <View style={[styles.dot, { backgroundColor: Colors.calm }]} />
          </View>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsCard}>
        <StatRow label="Manos jugadas" value={String(totalHands)} />
        <StatRow label={`Pts ${teams[0].name}`} value={String(team0Points)} />
        <StatRow label={`Pts ${teams[1].name}`} value={String(team1Points)} />
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          onPress={handleRevancha}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.primaryLabel}>Revancha</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
          onPress={handleNewGame}
        >
          <Text style={styles.secondaryLabel}>Nueva partida</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.textBtn, pressed && styles.btnPressed]}
          onPress={handleHome}
        >
          <Text style={styles.textBtnLabel}>Volver al inicio</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
  },
  trophy: {
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.body,
    color: 'rgba(255,255,255,0.6)',
  },
  winnerName: {
    fontFamily: FontWeights.display.semibold,
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  teamScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teamName: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: 'rgba(255,255,255,0.7)',
  },
  teamPoints: {
    fontFamily: FontWeights.display.semibold,
    fontSize: FontSizes.displayL,
    color: '#FFFFFF',
  },
  dash: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.displayM,
    color: 'rgba(255,255,255,0.3)',
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.xxl,
    gap: Spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  statLabel: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  statValue: {
    fontFamily: FontWeights.mono.medium,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  actions: {
    width: '100%',
    gap: Spacing.sm,
    marginTop: 'auto',
  },
  primaryBtn: {
    height: HitTargets.cta,
    borderRadius: Radii.pill,
    backgroundColor: Colors.terracotta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: HitTargets.cta,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
  },
  textBtn: {
    height: HitTargets.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBtnLabel: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  btnPressed: {
    opacity: 0.7,
  },
});
