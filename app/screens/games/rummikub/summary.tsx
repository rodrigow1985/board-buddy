import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTimerStore } from '@src/store/timerStore';
import { useCallback } from 'react';
import { voicePassRate, playerInitial } from '@src/utils/players';
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

export default function SummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const players = useTimerStore((s) => s.players);
  const turnHistory = useTimerStore((s) => s.turnHistory);
  const turnDurationMs = useTimerStore((s) => s.turnDurationMs);
  const winnerId = useTimerStore((s) => s.winnerId);
  const reset = useTimerStore((s) => s.reset);
  const setWinner = useTimerStore((s) => s.setWinner);

  const handleSelectWinner = useCallback((playerId: string) => {
    // Toggle: tocar al mismo jugador lo deselecciona
    setWinner(winnerId === playerId ? null : playerId);
  }, [winnerId, setWinner]);

  // Estadísticas globales
  const totalTurns = players.reduce((sum, p) => sum + p.turns, 0);
  const totalTimeMs = totalTurns * turnDurationMs;
  const voiceRate = voicePassRate(players);
  const voicePct = Math.round(voiceRate * 100);

  // Jugador MVP: más pasos por voz
  const mvpPlayer = [...players].sort((a, b) => b.passesByVoice - a.passesByVoice)[0];

  const handleNewGame = () => {
    reset();
    router.replace('/games/rummikub/setup');
  };

  const handleHome = () => {
    reset();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fin de partida</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ¿Quién ganó? */}
        <View style={styles.winnerSection}>
          <Text style={styles.sectionTitle}>¿QUIÉN GANÓ?</Text>
          <View style={styles.winnerChips}>
            {players.map((player) => {
              const isWinner = winnerId === player.id;
              return (
                <Pressable
                  key={player.id}
                  style={({ pressed }) => [
                    styles.winnerChip,
                    { borderColor: player.color },
                    isWinner && { backgroundColor: player.color },
                    pressed && styles.winnerChipPressed,
                  ]}
                  onPress={() => handleSelectWinner(player.id)}
                  accessibilityLabel={`Marcar a ${player.name} como ganador`}
                >
                  {isWinner && (
                    <Ionicons name="trophy" size={14} color="#FFFFFF" />
                  )}
                  <Text style={[
                    styles.winnerChipLabel,
                    isWinner && styles.winnerChipLabelSelected,
                    !isWinner && { color: player.color },
                  ]}>
                    {player.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Card stats globales */}
        <View style={styles.statsCard}>
          <StatBlock value={String(totalTurns)} label="Turnos" />
          <View style={styles.statDivider} />
          <StatBlock value={formatTime(totalTimeMs)} label="Tiempo total" />
          <View style={styles.statDivider} />
          <StatBlock value={`${voicePct}%`} label="Por voz" />
        </View>

        {/* MVP card */}
        {mvpPlayer && mvpPlayer.passesByVoice > 0 && (
          <View style={styles.mvpCard}>
            <View style={[styles.mvpAvatar, { backgroundColor: mvpPlayer.color }]}>
              <Text style={styles.mvpInitial}>{playerInitial(mvpPlayer.name)}</Text>
            </View>
            <View style={styles.mvpText}>
              <Text style={styles.mvpLabel}>MVP de voz</Text>
              <Text style={styles.mvpName}>{mvpPlayer.name}</Text>
              <Text style={styles.mvpSub}>
                {mvpPlayer.passesByVoice} pasos por voz
              </Text>
            </View>
            <Ionicons name="mic" size={22} color={Colors.terracotta} />
          </View>
        )}

        {/* Tabla de jugadores */}
        <Text style={styles.sectionTitle}>JUGADORES</Text>
        <View style={styles.table}>
          {/* Encabezado */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableCellName, styles.tableHeaderText]}>
              Jugador
            </Text>
            <Text style={[styles.tableCell, styles.tableCellNum, styles.tableHeaderText]}>
              Turnos
            </Text>
            <Text style={[styles.tableCell, styles.tableCellNum, styles.tableHeaderText]}>
              Botón
            </Text>
            <Text style={[styles.tableCell, styles.tableCellNum, styles.tableHeaderText]}>
              Voz
            </Text>
          </View>

          {/* Filas de jugadores */}
          {players.map((player, idx) => {
            const isWinner = winnerId === player.id;
            return (
            <View
              key={player.id}
              style={[
                styles.tableRow,
                idx < players.length - 1 && styles.tableRowBorder,
                isWinner && { backgroundColor: player.color + '18' },
              ]}
            >
              <View style={[styles.tableCell, styles.tableCellName, styles.playerCell]}>
                {isWinner
                  ? <Ionicons name="trophy" size={14} color={player.color} />
                  : <View style={[styles.dot, { backgroundColor: player.color }]} />
                }
                <Text style={[styles.playerName, isWinner && { color: player.color, fontFamily: FontWeights.sans.semibold }]} numberOfLines={1}>
                  {player.name}
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.tableCellNum, styles.tableValue]}>
                {player.turns}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellNum, styles.tableValue]}>
                {player.passesByButton}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellNum, styles.tableValueVoice]}>
                {player.passesByVoice}
              </Text>
            </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Acciones */}
      <View style={[styles.actions, { paddingBottom: insets.bottom + Spacing.screenV }]}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={handleNewGame}
          accessibilityLabel="Nueva partida"
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.ctaLabel}>Nueva partida</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
          onPress={handleHome}
          accessibilityLabel="Ir al inicio"
        >
          <Text style={styles.secondaryLabel}>Inicio</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <View style={statStyles.container}>
      <Text style={statStyles.value} allowFontScaling={false}>
        {value}
      </Text>
      <Text style={statStyles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', gap: 4 },
  value: {
    fontFamily: FontWeights.display.regular,
    fontSize: FontSizes.displayS,
    color: Colors.ink,
  },
  label: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.micro,
    color: Colors.ink3,
    letterSpacing: 0.6,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontWeights.display.medium,
    fontSize: FontSizes.displayM,
    color: Colors.ink,
  },
  scroll: {
    paddingHorizontal: Spacing.screenH,
    gap: Spacing.xl,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.card,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.hairline,
    marginVertical: 4,
  },
  mvpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.terracottaSoft,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
  },
  mvpAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvpInitial: {
    fontFamily: FontWeights.sans.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  mvpText: { flex: 1, gap: 2 },
  mvpLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.micro,
    color: Colors.terracotta,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  mvpName: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: Colors.ink,
  },
  mvpSub: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: Colors.ink2,
  },
  winnerSection: {
    gap: Spacing.md,
  },
  winnerChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  winnerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  winnerChipPressed: {
    opacity: 0.75,
  },
  winnerChipLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.bodyS,
  },
  winnerChipLabelSelected: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.captionS,
    color: Colors.ink3,
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.sm,
  },
  table: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.card,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  tableHeader: {
    backgroundColor: Colors.cream,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.hairline,
  },
  tableCell: { paddingHorizontal: 4 },
  tableCellName: { flex: 2 },
  tableCellNum: { flex: 1, alignItems: 'center' },
  tableHeaderText: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.micro,
    color: Colors.ink3,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  playerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  playerName: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
    flex: 1,
  },
  tableValue: {
    fontFamily: FontWeights.mono.regular,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  tableValueVoice: {
    fontFamily: FontWeights.mono.semibold,
    fontSize: FontSizes.bodyS,
    color: Colors.terracotta,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.md,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.hairline,
    gap: Spacing.sm,
  },
  cta: {
    height: HitTargets.cta,
    borderRadius: Radii.pill,
    backgroundColor: Colors.terracotta,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaPressed: { backgroundColor: Colors.alert },
  ctaLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
  },
  secondaryBtn: {
    height: 44,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnPressed: { backgroundColor: Colors.cream },
  secondaryLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.body,
    color: Colors.ink2,
  },
});
