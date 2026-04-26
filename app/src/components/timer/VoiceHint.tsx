import { View, Text, StyleSheet } from 'react-native';
import { FontWeights, FontSizes, Radii, Spacing } from '@src/constants/tokens';

interface Props {
  visible: boolean;
}

export function VoiceHint({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.pill}>
      <Text style={styles.text}>
        {'decí '}
        <Text style={styles.keyword}>"paso"</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  text: {
    fontFamily: FontWeights.mono.regular,
    fontSize: FontSizes.micro,
    color: 'rgba(255,255,255,0.70)',
  },
  keyword: {
    color: '#FFFFFF',
  },
});
