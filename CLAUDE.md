# Temporizador Juegos — CLAUDE.md

## Descripción del proyecto

App móvil en React Native para facilitar juegos de mesa. El MVP es un temporizador por turno con reconocimiento de voz para detectar la palabra "paso" y cambiar de jugador automáticamente.

## Stack tecnológico

- **Framework:** React Native con Expo (managed workflow)
- **Navegación:** Expo Router (file-based routing)
- **Estado global:** Zustand
- **Estilos:** StyleSheet nativo de React Native (sin librerías externas de UI)
- **Voz:** `expo-speech-recognition` o `@react-native-voice/voice`
- **Animaciones:** React Native Animated API / Reanimated 2
- **Tests:** Jest + React Native Testing Library

## Estructura del proyecto

```
temporizador-juegos/
├── app/                    # Rutas (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx       # Pantalla principal: temporizador
│   │   └── settings.tsx    # Configuración
│   └── _layout.tsx
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── store/              # Estado global (Zustand)
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilidades
│   └── constants/          # Colores, tamaños, etc.
├── docs/                   # Documentación funcional
├── assets/                 # Imágenes, fuentes, iconos
└── CLAUDE.md
```

## Convenciones de código

- TypeScript estricto en todos los archivos
- Componentes funcionales con hooks
- Nombres en inglés para código, español para comentarios de negocio
- Un componente por archivo
- Props tipadas con `interface`, no `type`

## Principios de UX

- La pantalla del temporizador debe ser **inmersiva**: ocupa toda la pantalla
- Feedback visual inmediato para cada interacción
- Botones grandes y fáciles de tocar (mínimo 48×48 dp)
- Colores con significado: verde = corriendo, amarillo = poco tiempo, rojo = agotado
- El reconocimiento de voz debe ser silencioso (sin interrupciones sonoras al jugador)

## Escalabilidad

Cada juego nuevo se incorpora como un módulo independiente dentro de `app/(tabs)/` con su propia configuración en el store de Zustand. La configuración global (tiempo por turno, número de jugadores, etc.) se persiste con `AsyncStorage`.

## Comandos útiles

```bash
npx expo start          # Servidor de desarrollo
npx expo start --ios    # Simulador iOS
npx expo start --android # Emulador Android
npx jest                # Tests
```
