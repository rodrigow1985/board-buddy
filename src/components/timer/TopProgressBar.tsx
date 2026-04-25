import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Animations } from '@src/constants/tokens';

interface Props {
  progress: number; // 0.0 a 1.0 (1 = tiempo completo, 0 = agotado)
  isWarn: boolean;
}

export function TopProgressBar({ progress, isWarn }: Props) {
  const widthAnim = useRef(new Animated.Value(progress)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Anima el ancho de la barra con cada cambio de progreso
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);

  // Pulso suave en estado warn
  useEffect(() => {
    if (isWarn) {
      pulseLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.85,
            duration: Animations.warnPulse / 2,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: Animations.warnPulse / 2,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseLoopRef.current.start();
    } else {
      pulseLoopRef.current?.stop();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
    return () => pulseLoopRef.current?.stop();
  }, [isWarn, pulseAnim]);

  return (
    <View style={styles.track} pointerEvents="none">
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
            opacity: pulseAnim,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 10,
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});
