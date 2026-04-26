import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontWeights, FontSizes, Spacing } from '@src/constants/tokens';

interface Props {
  value: string;
  label: string;
}

export function Stat({ value, label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.value} allowFontScaling={false}>
        {value}
      </Text>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  value: {
    fontFamily: FontWeights.display.regular,
    fontSize: FontSizes.displayS,
    color: Colors.ink,
  },
  label: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.micro,
    color: Colors.ink3,
    letterSpacing: 0.8,
  },
});
