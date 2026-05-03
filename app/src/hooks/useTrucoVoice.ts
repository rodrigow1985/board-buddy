import { useMemo, useCallback } from 'react';
import { useVoiceDetection, VoiceTrigger } from './useVoiceDetection';
import { useTrucoStore } from '@src/store/trucoStore';

interface UseTrucoVoiceOptions {
  enabled: boolean;
  onPermissionDenied?: () => void;
}

/**
 * Hook de reconocimiento de voz para Truco.
 * Detecta cantos (envido, truco, flor), respuestas (quiero/no quiero)
 * y acciones (mazo). Conecta directamente con el trucoStore.
 */
export function useTrucoVoice({ enabled, onPermissionDenied }: UseTrucoVoiceOptions) {
  const { registerCanto, respondCanto } = useTrucoStore.getState();

  const handleEnvido = useCallback(() => {
    registerCanto('envido', 'envido', 0);
  }, [registerCanto]);

  const handleRealEnvido = useCallback(() => {
    registerCanto('envido', 'real_envido', 0);
  }, [registerCanto]);

  const handleFaltaEnvido = useCallback(() => {
    registerCanto('envido', 'falta_envido', 0);
  }, [registerCanto]);

  const handleTruco = useCallback(() => {
    const hand = useTrucoStore.getState().currentHand;
    if (!hand.trucoLevel) {
      registerCanto('truco', 'truco', 0);
    }
  }, [registerCanto]);

  const handleRetruco = useCallback(() => {
    registerCanto('truco', 'retruco', 1);
  }, [registerCanto]);

  const handleValeCuatro = useCallback(() => {
    registerCanto('truco', 'vale_cuatro', 0);
  }, [registerCanto]);

  const handleQuiero = useCallback(() => {
    respondCanto('accepted');
  }, [respondCanto]);

  const handleNoQuiero = useCallback(() => {
    respondCanto('rejected');
  }, [respondCanto]);

  const handleFlor = useCallback(() => {
    registerCanto('flor', 'flor', 0);
  }, [registerCanto]);

  const handleContraFlor = useCallback(() => {
    registerCanto('flor', 'contra_flor', 1);
  }, [registerCanto]);

  // Triggers ordenados por prioridad (frases más largas primero en findBestMatch)
  const triggers: VoiceTrigger[] = useMemo(() => [
    // Envido — frases compuestas primero
    {
      word: 'falta envido',
      aliases: ['falta embido', 'falta en vido'],
      onDetected: handleFaltaEnvido,
    },
    {
      word: 'real envido',
      aliases: ['real embido', 'real en vido'],
      onDetected: handleRealEnvido,
    },
    {
      word: 'envido',
      aliases: ['embido', 'en vido', 'emvido'],
      onDetected: handleEnvido,
    },
    // Truco — frases compuestas primero
    {
      word: 'vale cuatro',
      aliases: ['vale 4', 'balecuatro'],
      onDetected: handleValeCuatro,
    },
    {
      word: 'retruco',
      aliases: ['re truco'],
      onDetected: handleRetruco,
    },
    {
      word: 'truco',
      onDetected: handleTruco,
    },
    // Respuestas — "no quiero" antes que "quiero"
    {
      word: 'no quiero',
      aliases: ['me voy al mazo', 'mazo'],
      onDetected: handleNoQuiero,
    },
    {
      word: 'quiero',
      onDetected: handleQuiero,
    },
    // Flor
    {
      word: 'contra flor',
      aliases: ['contraflor'],
      onDetected: handleContraFlor,
    },
    {
      word: 'flor',
      onDetected: handleFlor,
    },
  ], [
    handleEnvido, handleRealEnvido, handleFaltaEnvido,
    handleTruco, handleRetruco, handleValeCuatro,
    handleQuiero, handleNoQuiero, handleFlor, handleContraFlor,
  ]);

  return useVoiceDetection({
    enabled,
    triggers,
    onPermissionDenied,
  });
}
