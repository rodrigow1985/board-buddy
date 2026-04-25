import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, FontWeights } from '@src/constants/tokens';

// Pantalla del temporizador — placeholder hasta Fase 3
export default function TimerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>2:00</Text>
      <Text style={styles.subtitle}>Timer — Fase 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.calm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontFamily: FontWeights.display.regular,
    fontSize: FontSizes.timerXL,
    color: '#FFFFFF',
    letterSpacing: -6,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSizes.body,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 16,
  },
});
