import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes } from '@src/constants/tokens';

// Configuración de partida — placeholder hasta Fase 5
export default function SetupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva partida</Text>
      <Text style={styles.subtitle}>Setup — Fase 5</Text>
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
    fontSize: FontSizes.displayM,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSizes.body,
    color: Colors.ink3,
    marginTop: 8,
  },
});
