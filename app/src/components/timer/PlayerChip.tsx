import { View, Text, StyleSheet } from 'react-native';
import { FontWeights, FontSizes, Radii, Spacing } from '@src/constants/tokens';

interface Props {
  name: string;
  color: string;
}

export function PlayerChip({ name, color }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={styles.name} numberOfLines={1}>
        {name.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    maxWidth: 260,
  },
  name: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.bodyS,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
});
