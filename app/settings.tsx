import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@src/store/settingsStore';
import {
  Colors,
  FontWeights,
  FontSizes,
  Spacing,
  Radii,
  HitTargets,
} from '@src/constants/tokens';
import { ToggleRow } from '@src/components/common/ToggleRow';
import { NavRow } from '@src/components/common/NavRow';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    voice,
    audio,
    ui,
    setVoiceEnabled,
    setSoundOnExpire,
    setVibration,
    setLanguage,
  } = useSettingsStore();

  const LANGUAGE_LABEL: Record<string, string> = {
    es: 'Español',
    en: 'English',
  };

  const handleToggleLanguage = () => {
    setLanguage(ui.language === 'es' ? 'en' : 'es');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + Spacing.screenV },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Voz */}
        <Section title="Reconocimiento de voz">
          <ToggleRow
            icon="mic"
            title="Activar voz"
            subtitle={'Decí "paso" para cambiar el turno'}
            value={voice.enabled}
            onValueChange={setVoiceEnabled}
          />
        </Section>

        {/* Audio */}
        <Section title="Audio y vibración">
          <ToggleRow
            icon="musical-notes"
            title="Sonido al agotar tiempo"
            value={audio.soundOnExpire}
            onValueChange={setSoundOnExpire}
          />
          <View style={styles.divider} />
          <ToggleRow
            icon="phone-portrait"
            title="Vibración"
            value={audio.vibration}
            onValueChange={setVibration}
          />
        </Section>

        {/* Idioma */}
        <Section title="General">
          <NavRow
            label="Idioma"
            value={LANGUAGE_LABEL[ui.language]}
            onPress={handleToggleLanguage}
          />
        </Section>

        {/* Acerca de */}
        <Section title="Acerca de">
          <NavRow label="Versión" value="1.0.0" onPress={() => {}} showChevron={false} />
          <View style={styles.divider} />
          <NavRow label="Licencias" onPress={() => {}} />
        </Section>
      </ScrollView>
    </View>
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
  container: { flex: 1, backgroundColor: Colors.bg },
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
});
