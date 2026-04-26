import { Text, StyleSheet } from 'react-native';
import { FontWeights, FontSizes } from '@src/constants/tokens';
import { formatTime } from '@src/utils/time';

interface Props {
  timeMs: number;
  paused: boolean;
}

export function TimerDisplay({ timeMs, paused }: Props) {
  return (
    <Text
      style={[styles.time, paused && styles.dimmed]}
      allowFontScaling={false}
    >
      {formatTime(timeMs)}
    </Text>
  );
}

const styles = StyleSheet.create({
  time: {
    fontFamily: FontWeights.display.regular,
    fontSize: FontSizes.timerXL,
    color: '#FFFFFF',
    letterSpacing: -6,
    fontVariant: ['tabular-nums'],
    lineHeight: FontSizes.timerXL * 1.05,
    textAlign: 'center',
  },
  dimmed: {
    opacity: 0.55,
  },
});
