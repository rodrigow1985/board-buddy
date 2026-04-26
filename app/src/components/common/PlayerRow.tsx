import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontWeights, FontSizes, Spacing } from '@src/constants/tokens';
import { playerInitial } from '@src/utils/players';

interface Props {
  name: string;
  color: string;
  onEditPress: () => void;
}

export function PlayerRow({ name, color, onEditPress }: Props) {
  return (
    <View style={styles.row}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.initial}>{playerInitial(name)}</Text>
      </View>

      {/* Nombre */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {/* Botón editar */}
      <Pressable
        style={({ pressed }) => [styles.editBtn, pressed && styles.editBtnPressed]}
        onPress={onEditPress}
        accessibilityLabel={`Editar nombre de ${name}`}
        hitSlop={8}
      >
        <Ionicons name="pencil" size={16} color={Colors.ink3} />
      </Pressable>
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initial: {
    fontFamily: FontWeights.sans.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  name: {
    flex: 1,
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.bodyS,
    color: Colors.ink,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnPressed: {
    backgroundColor: Colors.cream,
  },
});
