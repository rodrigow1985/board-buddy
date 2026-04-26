import * as Haptics from 'expo-haptics';

/**
 * Wrapper simple para feedback háptico.
 * Falla silenciosamente en dispositivos sin soporte.
 */
export function useHaptics() {
  const impact = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    try {
      await Haptics.impactAsync(style);
    } catch {
      // Sin soporte — ignorar
    }
  };

  const notification = async (type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Warning) => {
    try {
      await Haptics.notificationAsync(type);
    } catch {
      // Sin soporte — ignorar
    }
  };

  return { impact, notification };
}
