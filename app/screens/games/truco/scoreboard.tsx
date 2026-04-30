import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTrucoStore } from '@src/store/trucoStore';
import { Colors, FontWeights, FontSizes, Spacing } from '@src/constants/tokens';

export default function ScoreboardScreen() {
  const insets = useSafeAreaInsets();
  const teams = useTrucoStore((s) => s.teams);
  const gameStatus = useTrucoStore((s) => s.gameStatus);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar style="light" />
      <Text style={styles.title}>Marcador</Text>
      <Text style={styles.score}>
        {teams[0].name}: {teams[0].score} — {teams[1].name}: {teams[1].score}
      </Text>
      <Text style={styles.status}>Estado: {gameStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.calm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  title: {
    fontFamily: FontWeights.display.semibold,
    fontSize: FontSizes.displayL,
    color: '#FFFFFF',
  },
  score: {
    fontFamily: FontWeights.mono.medium,
    fontSize: FontSizes.displayM,
    color: '#FFFFFF',
  },
  status: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.body,
    color: 'rgba(255,255,255,0.6)',
  },
});
