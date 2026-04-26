import { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Linking } from 'react-native';
import { Colors, FontWeights, FontSizes, Radii, Spacing, Shadows } from '@src/constants/tokens';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function PermissionSnackbar({ visible, onDismiss }: Props) {
  const slideAnim = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 120,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const handleOpenSettings = () => {
    Linking.openSettings();
    onDismiss();
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.card}>
        <Text style={styles.message}>
          Sin acceso al micrófono. Podés usar los botones para pasar turno.
        </Text>
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={handleOpenSettings}
            accessibilityLabel="Ir a ajustes"
          >
            <Text style={styles.actionPrimary}>Ir a ajustes</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={onDismiss}
            accessibilityLabel="Continuar sin voz"
          >
            <Text style={styles.actionSecondary}>Continuar</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.screenH,
    zIndex: 100,
  },
  card: {
    backgroundColor: Colors.ink,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  message: {
    fontFamily: FontWeights.sans.regular,
    fontSize: FontSizes.bodyS,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.sm,
  },
  actionBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionPrimary: {
    fontFamily: FontWeights.sans.semibold,
    fontSize: FontSizes.caption,
    color: Colors.terracottaSoft,
  },
  actionSecondary: {
    fontFamily: FontWeights.sans.medium,
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.65)',
  },
});
