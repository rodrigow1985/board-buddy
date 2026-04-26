import { View, Text, StyleSheet } from 'react-native';
import { FontWeights, FontSizes, Spacing } from '@src/constants/tokens';
import { Player, playerInitial } from '@src/utils/players';

interface Props {
  player: Player;
}

export function NextUpRow({ player }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Sigue</Text>
      <View style={[styles.avatar, { backgroundColor: player.color }]}>
        <Text style={styles.initial}>{playerInitial(player.name)}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {player.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.60)',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: FontWeights.sans.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  name: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.90)',
    flexShrink: 1,
  },
});
