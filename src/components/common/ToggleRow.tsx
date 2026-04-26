import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontWeights, FontSizes, Spacing, Radii } from '@src/constants/tokens';
import { Toggle } from './Toggle';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({ icon, title, subtitle, value, onValueChange, disabled }: Props) {
  return (
    <View style={styles.row}>
      {/* Ícono */}
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={Colors.ink2} />
      </View>

      {/* Textos */}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {/* Toggle */}
      <Toggle value={value} onValueChange={onValueChange} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: Colors.ink3,
  },
});
