import { View, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HitTargets, Radii, Spacing } from '@src/constants/tokens';
import { TimerStatus } from '@src/store/timerStore';

interface Props {
  status: TimerStatus;
  onPauseResume: () => void;
  onRestart: () => void;
  onPassTurn: () => void;
  disabled?: boolean;
}

export function TimerControls({
  status,
  onPauseResume,
  onRestart,
  onPassTurn,
  disabled = false,
}: Props) {
  const isPaused = status === 'paused';
  const isTimeout = status === 'timeout';
  const isTransitioning = status === 'transitioning';
  const controlsDisabled = disabled || isTransitioning;

  return (
    <View style={[styles.row, controlsDisabled && styles.dimmed]}>
      {/* Reiniciar turno */}
      <Pressable
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        onPress={onRestart}
        accessibilityLabel="Reiniciar turno"
        disabled={controlsDisabled || isTimeout}
        hitSlop={8}
      >
        <Ionicons name="refresh" size={26} color="#FFFFFF" />
      </Pressable>

      {/* Pausar / Reanudar (botón primario) */}
      <Pressable
        style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
        onPress={onPauseResume}
        accessibilityLabel={isPaused ? 'Reanudar' : 'Pausar'}
        disabled={controlsDisabled}
        hitSlop={8}
      >
        <Ionicons
          name={isPaused ? 'play' : 'pause'}
          size={28}
          color="#1F1A16"
        />
      </Pressable>

      {/* Pasar turno */}
      <Pressable
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        onPress={onPassTurn}
        accessibilityLabel="Pasar turno"
        disabled={controlsDisabled}
        hitSlop={8}
      >
        <Ionicons name="play-skip-forward" size={26} color="#FFFFFF" />
        <Text style={styles.passLabel}>Paso</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.screenH,
  },
  dimmed: {
    opacity: 0.6,
  },
  secondary: {
    height: HitTargets.actionBtn,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radii.lg,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.xs,
    minWidth: HitTargets.actionBtn,
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  primary: {
    height: HitTargets.actionBtn,
    width: HitTargets.actionBtn + 16,
    borderRadius: Radii.lg,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPressed: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  passLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
