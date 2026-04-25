import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes } from '@src/constants/tokens';

// Pantalla Home — placeholder hasta Fase 5
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Board Buddy</Text>
      <Text style={styles.subtitle}>Home — Fase 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.displayL,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSizes.body,
    color: Colors.ink3,
    marginTop: 8,
  },
});
