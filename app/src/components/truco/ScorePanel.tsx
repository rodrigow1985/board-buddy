import { View, Text, StyleSheet } from 'react-native';
import { FontWeights, FontSizes, Spacing } from '@src/constants/tokens';
import { getPhase } from '@src/utils/truco';
import { TallyMarks } from './TallyMarks';

interface ScorePanelProps {
  name: string;
  score: number;
  color: string;
  targetScore: number;
}

export function ScorePanel({ name, score, color, targetScore }: ScorePanelProps) {
  const phase = getPhase(score);
  const phaseLabel = targetScore === 15 ? '' : phase === 'malas' ? 'malas' : 'buenas';

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.score}>{score}</Text>
      <TallyMarks score={score} />
      {phaseLabel !== '' && (
        <Text style={styles.phase}>{phaseLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.captionS,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  score: {
    fontFamily: FontWeights.display.semibold,
    fontSize: 64,
    color: '#FFFFFF',
    lineHeight: 70,
  },
  phase: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.micro,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
});
