import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontWeights,
  FontSizes,
  Spacing,
  Radii,
  HitTargets,
} from '@src/constants/tokens';

interface ManualControlsProps {
  onEnvido: () => void;
  onTruco: () => void;
  onManual: () => void;
  onEndGame: () => void;
  onNewHand: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled: boolean;
}

export function ManualControls({
  onEnvido,
  onTruco,
  onManual,
  onEndGame,
  onNewHand,
  onUndo,
  canUndo,
  disabled,
}: ManualControlsProps) {
  return (
    <View style={styles.container}>
      {/* Fila principal de cantos */}
      <View style={styles.row}>
        <ControlButton
          icon="diamond-outline"
          label="Envido"
          onPress={onEnvido}
          disabled={disabled}
        />
        <ControlButton
          icon="flash-outline"
          label="Truco"
          onPress={onTruco}
          disabled={disabled}
        />
        <ControlButton
          icon="add-circle-outline"
          label="Manual"
          onPress={onManual}
          disabled={disabled}
        />
      </View>

      {/* Fila secundaria */}
      <View style={styles.secondaryRow}>
        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
          onPress={onNewHand}
          disabled={disabled}
          accessibilityLabel="Nueva mano"
        >
          <Ionicons name="refresh" size={16} color="rgba(255,255,255,0.6)" />
          <Text style={styles.secondaryLabel}>Nueva mano</Text>
        </Pressable>

        {canUndo && (
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            onPress={onUndo}
            accessibilityLabel="Deshacer"
          >
            <Ionicons name="arrow-undo" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.secondaryLabel}>Deshacer</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [styles.endBtn, pressed && styles.endBtnPressed]}
          onPress={onEndGame}
          accessibilityLabel="Fin de partida"
        >
          <Text style={styles.endLabel}>Fin de partida</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ControlButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.controlBtn,
        pressed && styles.controlBtnPressed,
        disabled && styles.controlBtnDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={20} color="#FFFFFF" />
      <Text style={styles.controlLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.screenH,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  controlBtn: {
    flex: 1,
    height: HitTargets.actionBtn,
    borderRadius: Radii.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  controlBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  controlBtnDisabled: {
    opacity: 0.4,
  },
  controlLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.captionS,
    color: '#FFFFFF',
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  secondaryBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  secondaryLabel: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.captionS,
    color: 'rgba(255,255,255,0.6)',
  },
  endBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  endBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  endLabel: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.captionS,
    color: 'rgba(255,255,255,0.70)',
  },
});
