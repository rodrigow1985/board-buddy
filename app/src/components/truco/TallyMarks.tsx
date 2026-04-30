import { View, StyleSheet } from 'react-native';

interface TallyMarksProps {
  score: number;
  color?: string;
}

/**
 * Visualización de puntos con palitos (sistema argentino).
 * Cada grupo de 5: 4 palitos verticales + 1 diagonal.
 */
export function TallyMarks({ score, color = 'rgba(255,255,255,0.85)' }: TallyMarksProps) {
  const fullGroups = Math.floor(score / 5);
  const remainder = score % 5;

  const groups: number[] = [];
  for (let i = 0; i < fullGroups; i++) groups.push(5);
  if (remainder > 0) groups.push(remainder);

  return (
    <View style={styles.container}>
      {groups.map((count, gi) => (
        <View key={gi} style={styles.group}>
          {Array.from({ length: Math.min(count, 4) }, (_, i) => (
            <View key={i} style={[styles.stick, { backgroundColor: color }]} />
          ))}
          {count === 5 && (
            <View style={[styles.diagonal, { backgroundColor: color }]} />
          )}
        </View>
      ))}
    </View>
  );
}

const STICK_HEIGHT = 28;
const STICK_WIDTH = 3;
const GAP = 4;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    minHeight: STICK_HEIGHT + 4,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
    position: 'relative',
  },
  stick: {
    width: STICK_WIDTH,
    height: STICK_HEIGHT,
    borderRadius: 1.5,
  },
  diagonal: {
    position: 'absolute',
    width: STICK_WIDTH,
    height: STICK_HEIGHT + 10,
    borderRadius: 1.5,
    transform: [{ rotate: '-45deg' }],
    left: (4 * STICK_WIDTH + 3 * GAP) / 2 - STICK_WIDTH / 2,
    top: -5,
  },
});
