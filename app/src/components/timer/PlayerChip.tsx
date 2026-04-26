import { View, Text, StyleSheet } from 'react-native';
import { FontWeights, FontSizes, Radii, Spacing } from '@src/constants/tokens';

interface Props {
  name: string;
}

export function PlayerChip({ name }: Props) {
  return (
    <View style={styles.pill}>
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
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    maxWidth: 260,
  },
  name: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.bodyS,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
});
