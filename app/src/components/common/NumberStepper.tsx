import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, FontWeights, FontSizes, Radii, HitTargets } from '@src/constants/tokens';

interface Props {
  value: number;
  min: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
  suffix?: string;
}

export function NumberStepper({ value, min, max, onDecrement, onIncrement, suffix }: Props) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.row}>
      {/* Botón − outline */}
      <Pressable
        style={({ pressed }) => [
          styles.btn,
          styles.btnOutline,
          !canDecrement && styles.btnDisabled,
          pressed && canDecrement && styles.btnOutlinePressed,
        ]}
        onPress={onDecrement}
        disabled={!canDecrement}
        accessibilityLabel="Reducir"
        hitSlop={8}
      >
        <Text style={[styles.btnIcon, !canDecrement && styles.iconDisabled]}>−</Text>
      </Pressable>

      {/* Valor */}
      <View style={styles.valueWrap}>
        <Text style={styles.value} allowFontScaling={false}>
          {value}
          {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
        </Text>
      </View>

      {/* Botón + filled */}
      <Pressable
        style={({ pressed }) => [
          styles.btn,
          styles.btnFilled,
          !canIncrement && styles.btnDisabled,
          pressed && canIncrement && styles.btnFilledPressed,
        ]}
        onPress={onIncrement}
        disabled={!canIncrement}
        accessibilityLabel="Aumentar"
        hitSlop={8}
      >
        <Text style={[styles.btnIconFilled, !canIncrement && styles.iconDisabled]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btn: {
    width: HitTargets.stepper,
    height: HitTargets.stepper,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.hairline,
    backgroundColor: Colors.surface,
  },
  btnOutlinePressed: {
    backgroundColor: Colors.cream,
  },
  btnFilled: {
    backgroundColor: Colors.terracotta,
  },
  btnFilledPressed: {
    backgroundColor: Colors.alert,
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btnIcon: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: 22,
    color: Colors.ink,
    lineHeight: 26,
  },
  btnIconFilled: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: 22,
    color: '#FFFFFF',
    lineHeight: 26,
  },
  iconDisabled: {
    opacity: 0.5,
  },
  valueWrap: {
    minWidth: 64,
    alignItems: 'center',
  },
  value: {
    fontFamily: FontWeights.mono.semibold,
    fontSize: 30,
    color: Colors.ink,
    fontVariant: ['tabular-nums'],
  },
  suffix: {
    fontFamily: FontWeights.mono.regular,
    fontSize: FontSizes.caption,
    color: Colors.ink3,
  },
});
