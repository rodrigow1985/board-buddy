import { View, Text, StyleSheet } from 'react-native';
import { FontWeights, FontSizes, Radii, Spacing } from '@src/constants/tokens';

type VoiceState = 'listening' | 'paused' | 'transitioning';

interface Props {
  state: VoiceState;
  voiceEnabled: boolean;
}

const LABEL: Record<VoiceState, string> = {
  listening: 'Escuchando',
  paused: 'Pausado',
  transitioning: 'Cambiando turno',
};

export function VoiceStatusChip({ state, voiceEnabled }: Props) {
  if (!voiceEnabled) return null;

  const isListening = state === 'listening';

  return (
    <View style={styles.pill}>
      <View style={[styles.dot, isListening ? styles.dotActive : styles.dotInactive]} />
      <Text style={styles.label}>{LABEL[state]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#5CBF82',
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  label: {
    fontFamily: FontWeights.mono.regular,
    fontSize: FontSizes.micro,
    color: 'rgba(255,255,255,0.80)',
  },
});
