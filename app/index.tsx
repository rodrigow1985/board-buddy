import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts, FontSizes, FontWeights, HitTargets, Radii, Spacing } from '@src/constants/tokens';

// Pantalla Home — placeholder hasta Fase 5
export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Board Buddy</Text>
      <Text style={styles.subtitle}>Temporizador por turnos con reconocimiento de voz</Text>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() => router.push('/games/rummikub/timer')}
        accessibilityLabel="Empezar partida de Rummikub"
      >
        <Text style={styles.ctaLabel}>Jugar Rummikub</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenH,
    gap: Spacing.lg,
  },
  title: {
    fontFamily: FontWeights.display.regular,
    fontSize: FontSizes.displayL,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSizes.body,
    color: Colors.ink3,
    textAlign: 'center',
  },
  cta: {
    height: HitTargets.cta,
    paddingHorizontal: Spacing.xxl,
    borderRadius: Radii.pill,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  ctaPressed: {
    backgroundColor: Colors.alert,
  },
  ctaLabel: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
  },
});
