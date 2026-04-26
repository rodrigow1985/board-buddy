import { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@src/store/settingsStore';
import { useTimerStore } from '@src/store/timerStore';
import { formatTime } from '@src/utils/time';
import {
  Colors,
  FontWeights,
  FontSizes,
  Spacing,
  Radii,
  HitTargets,
  Shadows,
} from '@src/constants/tokens';
import { GameCard } from '@src/components/common/GameCard';
import { Stat } from '@src/components/common/Stat';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { hydrated, hydrate } = useSettingsStore();

  // Hidratat settings desde AsyncStorage al montar
  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  // Estado de partida en curso
  const timerStatus = useTimerStore((s) => s.status);
  const timerPlayers = useTimerStore((s) => s.players);
  const timerCurrentIndex = useTimerStore((s) => s.currentPlayerIndex);
  const timerRemaining = useTimerStore((s) => s.timeRemainingMs);

  const hasActiveGame =
    (timerStatus === 'running' ||
      timerStatus === 'paused' ||
      timerStatus === 'timeout') &&
    timerPlayers.length > 0;

  const currentPlayer = timerPlayers[timerCurrentIndex];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Board Buddy</Text>
        <Pressable
          style={({ pressed }) => [styles.settingsBtn, pressed && styles.settingsBtnPressed]}
          onPress={() => router.push('/settings')}
          accessibilityLabel="Ajustes"
          hitSlop={8}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.ink2} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + Spacing.screenV }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Resume banner */}
        {hasActiveGame && currentPlayer && (
          <Pressable
            style={({ pressed }) => [styles.resumeCard, pressed && styles.resumeCardPressed]}
            onPress={() => router.push('/games/rummikub/timer')}
            accessibilityLabel="Continuar partida"
          >
            <View style={styles.resumeRow}>
              <View style={[styles.resumeAvatar, { backgroundColor: currentPlayer.color }]}>
                <Text style={styles.resumeInitial}>
                  {currentPlayer.name.trim().charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.resumeText}>
                <Text style={styles.resumeLabel}>Continuar partida</Text>
                <Text style={styles.resumeSub}>
                  Turno de {currentPlayer.name} · {formatTime(timerRemaining)} restantes
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.terracotta} />
            </View>
          </Pressable>
        )}

        {/* Juegos disponibles */}
        <Text style={styles.sectionTitle}>JUEGOS</Text>

        <GameCard
          title="Rummikub"
          subtitle="Temporizador con reconocimiento de voz"
          icon="timer-outline"
          active
          onPress={() => router.push('/games/rummikub/setup')}
        />

        <GameCard
          title="Próximamente"
          subtitle="Más juegos en camino"
          icon="add-circle-outline"
          active={false}
          onPress={() => {}}
        />

        {/* Footer stats */}
        <View style={styles.statsRow}>
          <Stat value="—" label="Partidas" />
          <View style={styles.statDivider} />
          <Stat value="—" label="Horas" />
          <View style={styles.statDivider} />
          <Stat value="—" label="Voz %" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.lg,
  },
  title: {
    fontFamily: FontWeights.display.regular,
    fontSize: FontSizes.displayL,
    color: Colors.ink,
  },
  settingsBtn: {
    width: HitTargets.topNav,
    height: HitTargets.topNav,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.sm,
  },
  settingsBtnPressed: {
    backgroundColor: Colors.cream,
  },
  scroll: {
    paddingHorizontal: Spacing.screenH,
    gap: Spacing.cardGap,
    paddingTop: Spacing.sm,
  },
  resumeCard: {
    backgroundColor: Colors.terracottaSoft,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  resumeCardPressed: {
    opacity: 0.85,
  },
  resumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  resumeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resumeInitial: {
    fontFamily: FontWeights.sans.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  resumeText: { flex: 1, gap: 2 },
  resumeLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.bodyS,
    color: Colors.terracotta,
  },
  resumeSub: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: Colors.ink2,
  },
  sectionTitle: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.captionS,
    color: Colors.ink3,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.xl,
    marginTop: Spacing.xl,
    ...Shadows.card,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.hairline,
  },
});
