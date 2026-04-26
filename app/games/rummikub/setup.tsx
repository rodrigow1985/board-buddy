import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useGameSetupStore } from '@src/store/gameSetupStore';
import { useTimerStore } from '@src/store/timerStore';
import { toMs } from '@src/utils/time';
import {
  Colors,
  FontWeights,
  FontSizes,
  Spacing,
  Radii,
  HitTargets,
} from '@src/constants/tokens';
import { NumberStepper } from '@src/components/common/NumberStepper';
import { PlayerRow } from '@src/components/common/PlayerRow';
import { ToggleRow } from '@src/components/common/ToggleRow';

const DURATION_OPTIONS = [
  { label: '1 min', ms: toMs(1) },
  { label: '2 min', ms: toMs(2) },
  { label: '3 min', ms: toMs(3) },
  { label: '5 min', ms: toMs(5) },
];

export default function SetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    turnDurationMs,
    players,
    voiceEnabled,
    setTurnDuration,
    setPlayerCount,
    updatePlayerName,
    setVoiceEnabled,
  } = useGameSetupStore();

  const { initGame } = useTimerStore();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartGame = () => {
    const names = players.map((p) => p.name.trim());
    const hasDuplicates = new Set(names).size !== names.length;
    if (hasDuplicates) {
      Alert.alert('Nombres duplicados', 'Cada jugador debe tener un nombre distinto.');
      return;
    }
    initGame(players, turnDurationMs);
    router.replace('/games/rummikub/timer');
  };

  const handleEditPress = (index: number) => {
    setEditingIndex(index);
    setEditingName(players[index].name);
  };

  const handleEditDone = () => {
    if (editingIndex !== null) {
      updatePlayerName(editingIndex, editingName || players[editingIndex].name);
      setEditingIndex(null);
      setEditingName('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Nueva partida</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + Spacing.screenV + HitTargets.cta + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Duración del turno */}
        <Section title="Tiempo por turno">
          <View style={styles.durationRow}>
            {DURATION_OPTIONS.map((opt) => (
              <Pressable
                key={opt.ms}
                style={[
                  styles.durationChip,
                  turnDurationMs === opt.ms && styles.durationChipActive,
                ]}
                onPress={() => setTurnDuration(opt.ms)}
                accessibilityLabel={opt.label}
              >
                <Text
                  style={[
                    styles.durationLabel,
                    turnDurationMs === opt.ms && styles.durationLabelActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* Jugadores */}
        <Section title="Jugadores">
          <View style={styles.stepperRow}>
            <Text style={styles.stepperLabel}>Cantidad</Text>
            <NumberStepper
              value={players.length}
              min={2}
              max={8}
              onDecrement={() => setPlayerCount(players.length - 1)}
              onIncrement={() => setPlayerCount(players.length + 1)}
            />
          </View>
          <View style={styles.divider} />
          {players.map((player, index) =>
            editingIndex === index ? (
              <View key={player.id} style={styles.editRow}>
                <View style={[styles.editAvatar, { backgroundColor: player.color }]}>
                  <Text style={styles.editInitial}>
                    {(editingName || player.name).trim().charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
                <TextInput
                  style={styles.editInput}
                  value={editingName}
                  onChangeText={(t) => setEditingName(t.slice(0, 20))}
                  onSubmitEditing={handleEditDone}
                  onBlur={handleEditDone}
                  autoFocus
                  returnKeyType="done"
                  maxLength={20}
                  placeholder={player.name}
                  placeholderTextColor={Colors.ink3}
                />
              </View>
            ) : (
              <PlayerRow
                key={player.id}
                name={player.name}
                color={player.color}
                onEditPress={() => handleEditPress(index)}
              />
            )
          )}
        </Section>

        {/* Opciones */}
        <Section title="Opciones">
          <ToggleRow
            icon="mic"
            title="Reconocimiento de voz"
            subtitle={'Decí "paso" para cambiar el turno'}
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
          />
        </Section>
      </ScrollView>

      {/* CTA fijo */}
      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + Spacing.screenV }]}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={handleStartGame}
          accessibilityLabel="Iniciar partida"
        >
          <Ionicons name="play" size={18} color="#FFFFFF" />
          <Text style={styles.ctaLabel}>Iniciar partida</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { gap: Spacing.sm, marginBottom: Spacing.xl },
  title: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.captionS,
    color: Colors.ink3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
});

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenH,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: HitTargets.topNav,
    height: HitTargets.topNav,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontWeights.display.medium,
    fontSize: FontSizes.displayM,
    color: Colors.ink,
  },
  scroll: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.xl,
  },
  durationRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    flexWrap: 'wrap',
  },
  durationChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1.5,
    borderColor: Colors.hairline,
    backgroundColor: Colors.surface,
  },
  durationChipActive: {
    borderColor: Colors.terracotta,
    backgroundColor: Colors.terracottaSoft,
  },
  durationLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink2,
  },
  durationLabelActive: {
    color: Colors.terracotta,
    fontFamily: FontWeights.sans.semibold,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  stepperLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.hairline,
    marginVertical: Spacing.xs,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  editAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  editInitial: {
    fontFamily: FontWeights.sans.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  editInput: {
    flex: 1,
    height: 40,
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.terracotta,
    paddingBottom: 4,
  },
  ctaWrap: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.md,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.hairline,
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
});
