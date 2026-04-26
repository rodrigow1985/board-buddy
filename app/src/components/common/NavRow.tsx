import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontWeights, FontSizes, Spacing } from '@src/constants/tokens';

interface Props {
  label: string;
  value?: string;
  onPress: () => void;
  showChevron?: boolean;
}

export function NavRow({ label, value, onPress, showChevron = true }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color={Colors.ink3} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  pressed: {
    backgroundColor: Colors.cream,
    borderRadius: 10,
    marginHorizontal: -Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  label: {
    flex: 1,
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.bodyS,
    color: Colors.ink3,
  },
});
