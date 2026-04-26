import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontWeights, FontSizes, Radii, Spacing, Shadows } from '@src/constants/tokens';

interface Props {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  active?: boolean;
  onPress: () => void;
}

export function GameCard({ title, subtitle, icon, active = false, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        active ? styles.cardActive : styles.cardInactive,
        pressed && active && styles.cardPressed,
      ]}
      onPress={onPress}
      disabled={!active}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <View style={[styles.iconWrap, active ? styles.iconWrapActive : styles.iconWrapInactive]}>
        <Ionicons
          name={icon}
          size={28}
          color={active ? Colors.terracotta : Colors.ink3}
        />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.title, !active && styles.textDim]}>{title}</Text>
        <Text style={[styles.subtitle, !active && styles.textDim]}>{subtitle}</Text>
      </View>
      {active && (
        <Ionicons name="chevron-forward" size={18} color={Colors.ink3} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.cardPad,
    borderRadius: Radii.lg,
    gap: Spacing.md,
  },
  cardActive: {
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  cardInactive: {
    backgroundColor: Colors.cream,
    opacity: 0.55,
  },
  cardPressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconWrapActive: {
    backgroundColor: Colors.terracottaSoft,
  },
  iconWrapInactive: {
    backgroundColor: Colors.hairline,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.body,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: Colors.ink3,
  },
  textDim: {
    color: Colors.ink2,
  },
});
