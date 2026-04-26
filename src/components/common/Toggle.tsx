import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Colors, Animations, Shadows } from '@src/constants/tokens';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}

const TRACK_W = 46;
const TRACK_H = 28;
const THUMB = 22;
const THUMB_OFFSET = (TRACK_H - THUMB) / 2;
const THUMB_TRAVEL = TRACK_W - THUMB - THUMB_OFFSET * 2;

export function Toggle({ value, onValueChange, disabled = false }: Props) {
  const translateX = useRef(new Animated.Value(value ? THUMB_TRAVEL : 0)).current;
  const bgAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? THUMB_TRAVEL : 0,
      duration: Animations.toggleThumb,
      useNativeDriver: true,
    }).start();
    Animated.timing(bgAnim, {
      toValue: value ? 1 : 0,
      duration: Animations.toggleThumb,
      useNativeDriver: false,
    }).start();
  }, [value, translateX, bgAnim]);

  const trackBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D9D2C5', Colors.terracotta],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      hitSlop={8}
      style={[styles.hitArea, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    padding: 4,
  },
  disabled: {
    opacity: 0.45,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
    paddingHorizontal: THUMB_OFFSET,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    ...Shadows.toggleThumbIOS,
  },
});
