import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTrucoSetupStore } from '@src/store/trucoSetupStore';
import { useTrucoStore } from '@src/store/trucoStore';
import {
  Colors,
  FontWeights,
  FontSizes,
  Spacing,
  Radii,
  HitTargets,
} from '@src/constants/tokens';
import { ToggleRow } from '@src/components/common/ToggleRow';

const SCORE_OPTIONS: Array<{ label: string; value: 15 | 30 }> = [
  { label: '15 pts', value: 15 },
  { label: '30 pts', value: 30 },
];

export default function TrucoSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    team1Name,
    team2Name,
    targetScore,
    florEnabled,
    voiceEnabled,
    setTeam1Name,
    setTeam2Name,
    setTargetScore,
    setFlorEnabled,
    setVoiceEnabled,
  } = useTrucoSetupStore();

  const { initGame } = useTrucoStore();
  const gameStatus = useTrucoStore((s) => s.gameStatus);
  const hydrated = useTrucoStore((s) => s.hydrated);

  const hasSavedGame = hydrated && gameStatus === 'playing';

  const [editingField, setEditingField] = useState<'team1' | 'team2' | null>(null);

  // Hidratar estado guardado al montar
  useEffect(() => {
    useTrucoStore.getState().hydrate();
  }, []);

  const handleStartGame = () => {
    initGame({
      team1Name: team1Name.trim() || 'Nosotros',
      team2Name: team2Name.trim() || 'Ellos',
      targetScore,
      florEnabled,
      voiceEnabled,
    });
    router.replace('/games/truco/scoreboard');
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
        <Text style={styles.headerTitle}>Truco</Text>
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
        {/* Equipos */}
        <Section title="Equipos">
          <TeamInput
            label="Equipo 1"
            value={team1Name}
            editing={editingField === 'team1'}
            onPress={() => setEditingField('team1')}
            onChangeText={setTeam1Name}
            onDone={() => setEditingField(null)}
            color={Colors.terracotta}
          />
          <View style={styles.divider} />
          <TeamInput
            label="Equipo 2"
            value={team2Name}
            editing={editingField === 'team2'}
            onPress={() => setEditingField('team2')}
            onChangeText={setTeam2Name}
            onDone={() => setEditingField(null)}
            color={Colors.calm}
          />
        </Section>

        {/* Puntos para ganar */}
        <Section title="Puntos para ganar">
          <View style={styles.chipRow}>
            {SCORE_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                style={[
                  styles.chip,
                  targetScore === opt.value && styles.chipActive,
                ]}
                onPress={() => setTargetScore(opt.value)}
                accessibilityLabel={opt.label}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    targetScore === opt.value && styles.chipLabelActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* Opciones */}
        <Section title="Opciones">
          <ToggleRow
            icon="flower-outline"
            title="Flor"
            subtitle="Habilitar el canto de flor"
            value={florEnabled}
            onValueChange={setFlorEnabled}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="mic"
            title="Reconocimiento de voz"
            subtitle="Detecta cantos por voz"
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
          />
        </Section>
      </ScrollView>

      {/* CTA fijo */}
      <View style={[styles.ctaWrap, { paddingBottom: insets.bottom + Spacing.screenV }]}>
        {hasSavedGame && (
          <Pressable
            style={({ pressed }) => [styles.cta, styles.ctaResume, pressed && styles.ctaPressed]}
            onPress={() => router.replace('/games/truco/scoreboard')}
            accessibilityLabel="Continuar partida"
          >
            <Ionicons name="play-forward" size={18} color="#FFFFFF" />
            <Text style={styles.ctaLabel}>Continuar partida</Text>
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={handleStartGame}
          accessibilityLabel="Iniciar partida"
        >
          <Ionicons name="play" size={18} color="#FFFFFF" />
          <Text style={styles.ctaLabel}>{hasSavedGame ? 'Nueva partida' : 'Iniciar partida'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Componentes internos ─────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

interface TeamInputProps {
  label: string;
  value: string;
  editing: boolean;
  onPress: () => void;
  onChangeText: (text: string) => void;
  onDone: () => void;
  color: string;
}

function TeamInput({ label, value, editing, onPress, onChangeText, onDone, color }: TeamInputProps) {
  if (editing) {
    return (
      <View style={styles.teamRow}>
        <View style={[styles.teamDot, { backgroundColor: color }]} />
        <TextInput
          style={styles.teamInput}
          value={value}
          onChangeText={(t) => onChangeText(t.slice(0, 15))}
          onSubmitEditing={onDone}
          onBlur={onDone}
          autoFocus
          returnKeyType="done"
          maxLength={15}
          placeholder={label}
          placeholderTextColor={Colors.ink3}
        />
      </View>
    );
  }

  return (
    <Pressable style={styles.teamRow} onPress={onPress}>
      <View style={[styles.teamDot, { backgroundColor: color }]} />
      <View style={styles.teamTextWrap}>
        <Text style={styles.teamLabel}>{label}</Text>
        <Text style={styles.teamName}>{value}</Text>
      </View>
      <Ionicons name="pencil" size={16} color={Colors.ink3} />
    </Pressable>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────

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
  divider: {
    height: 1,
    backgroundColor: Colors.hairline,
    marginVertical: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radii.pill,
    borderWidth: 1.5,
    borderColor: Colors.hairline,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: Colors.terracotta,
    backgroundColor: Colors.terracottaSoft,
  },
  chipLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink2,
  },
  chipLabelActive: {
    color: Colors.terracotta,
    fontFamily: FontWeights.sans.semibold,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: HitTargets.min,
  },
  teamDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
  },
  teamTextWrap: {
    flex: 1,
    gap: 2,
  },
  teamLabel: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: Colors.ink3,
  },
  teamName: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
  },
  teamInput: {
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
  ctaResume: {
    backgroundColor: Colors.calm,
    marginBottom: Spacing.sm,
  },
  ctaPressed: { opacity: 0.8 },
  ctaLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
  },
});
