import { useEffect } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface SplashAnimationProps {
  source: ImageSourcePropType;
  onFinish: () => void;
}

export function SplashAnimation({ source, onFinish }: SplashAnimationProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Escala: aparece con overshoot → se asienta → mantiene → crece suavemente al salir
    scale.value = withSequence(
      withTiming(1.1, { duration: 300, easing: Easing.out(Easing.back(2)) }),
      withTiming(1.0, { duration: 200, easing: Easing.out(Easing.ease) }),
      withTiming(1.0, { duration: 1500 }),
      withTiming(1.06, { duration: 600, easing: Easing.in(Easing.ease) }),
    );

    // Opacidad: fade in → mantiene → fade out; llama a onFinish al terminar
    opacity.value = withSequence(
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 1500 }),
      withTiming(0, { duration: 600, easing: Easing.in(Easing.ease) }, (finished) => {
        if (finished) runOnJS(onFinish)();
      }),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Image source={source} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FAF6F0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logo: {
    width: 160,
    height: 160,
  },
});
