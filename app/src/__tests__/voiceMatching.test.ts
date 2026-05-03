// Test de la lógica de matching de triggers de voz
// Importamos indirectamente ya que findBestMatch no está exportada.
// Testeamos con transcripts simulados contra la lista de triggers de Truco.

import type { VoiceTrigger } from '@src/hooks/useVoiceDetection';

// Reimplementación local para testear (misma lógica que el hook)
function findBestMatch(
  transcript: string,
  triggers: VoiceTrigger[],
): VoiceTrigger | null {
  const normalized = transcript.toLowerCase().trim();
  const sorted = [...triggers].sort((a, b) => {
    const aMax = Math.max(a.word.length, ...(a.aliases ?? []).map((al) => al.length));
    const bMax = Math.max(b.word.length, ...(b.aliases ?? []).map((al) => al.length));
    return bMax - aMax;
  });
  for (const trigger of sorted) {
    const candidates = [trigger.word, ...(trigger.aliases ?? [])];
    for (const candidate of candidates) {
      if (normalized.includes(candidate.toLowerCase())) {
        return trigger;
      }
    }
  }
  return null;
}

// Triggers simplificados (sin callbacks reales)
const noop = () => {};
const TRIGGERS: VoiceTrigger[] = [
  { word: 'falta envido', aliases: ['falta embido'], onDetected: noop },
  { word: 'real envido', aliases: ['real embido'], onDetected: noop },
  { word: 'envido', aliases: ['embido', 'en vido'], onDetected: noop },
  { word: 'vale cuatro', aliases: ['vale 4'], onDetected: noop },
  { word: 'retruco', aliases: ['re truco'], onDetected: noop },
  { word: 'truco', onDetected: noop },
  { word: 'no quiero', aliases: ['me voy al mazo', 'mazo'], onDetected: noop },
  { word: 'quiero', onDetected: noop },
  { word: 'contra flor', aliases: ['contraflor'], onDetected: noop },
  { word: 'flor', onDetected: noop },
];

describe('findBestMatch — prioridad de frases', () => {
  it('"real envido" matchea con real_envido, no con envido', () => {
    const match = findBestMatch('real envido', TRIGGERS);
    expect(match?.word).toBe('real envido');
  });

  it('"falta envido" matchea con falta_envido, no con envido', () => {
    const match = findBestMatch('falta envido', TRIGGERS);
    expect(match?.word).toBe('falta envido');
  });

  it('"no quiero" matchea con no_quiero, no con quiero', () => {
    const match = findBestMatch('no quiero', TRIGGERS);
    expect(match?.word).toBe('no quiero');
  });

  it('"vale cuatro" matchea con vale_cuatro, no con truco', () => {
    const match = findBestMatch('vale cuatro', TRIGGERS);
    expect(match?.word).toBe('vale cuatro');
  });

  it('"contra flor" matchea con contra_flor, no con flor', () => {
    const match = findBestMatch('contra flor', TRIGGERS);
    expect(match?.word).toBe('contra flor');
  });

  it('"retruco" matchea con retruco, no con truco', () => {
    const match = findBestMatch('retruco', TRIGGERS);
    expect(match?.word).toBe('retruco');
  });
});

describe('findBestMatch — aliases', () => {
  it('"embido" matchea con envido (alias)', () => {
    const match = findBestMatch('embido', TRIGGERS);
    expect(match?.word).toBe('envido');
  });

  it('"falta embido" matchea con falta envido (alias)', () => {
    const match = findBestMatch('falta embido', TRIGGERS);
    expect(match?.word).toBe('falta envido');
  });

  it('"me voy al mazo" matchea con no quiero (alias)', () => {
    const match = findBestMatch('me voy al mazo', TRIGGERS);
    expect(match?.word).toBe('no quiero');
  });

  it('"vale 4" matchea con vale cuatro (alias)', () => {
    const match = findBestMatch('vale 4', TRIGGERS);
    expect(match?.word).toBe('vale cuatro');
  });

  it('"contraflor" matchea con contra flor (alias)', () => {
    const match = findBestMatch('contraflor', TRIGGERS);
    expect(match?.word).toBe('contra flor');
  });

  it('"re truco" matchea con retruco (alias)', () => {
    const match = findBestMatch('re truco', TRIGGERS);
    expect(match?.word).toBe('retruco');
  });
});

describe('findBestMatch — simples', () => {
  it('"envido" matchea exacto', () => {
    const match = findBestMatch('envido', TRIGGERS);
    expect(match?.word).toBe('envido');
  });

  it('"truco" matchea exacto', () => {
    const match = findBestMatch('truco', TRIGGERS);
    expect(match?.word).toBe('truco');
  });

  it('"quiero" matchea exacto', () => {
    const match = findBestMatch('quiero', TRIGGERS);
    expect(match?.word).toBe('quiero');
  });

  it('"flor" matchea exacto', () => {
    const match = findBestMatch('flor', TRIGGERS);
    expect(match?.word).toBe('flor');
  });

  it('texto sin match → null', () => {
    const match = findBestMatch('hola que tal', TRIGGERS);
    expect(match).toBeNull();
  });
});

describe('findBestMatch — case insensitive', () => {
  it('"TRUCO" matchea', () => {
    const match = findBestMatch('TRUCO', TRIGGERS);
    expect(match?.word).toBe('truco');
  });

  it('"Real Envido" matchea', () => {
    const match = findBestMatch('Real Envido', TRIGGERS);
    expect(match?.word).toBe('real envido');
  });
});

describe('findBestMatch — transcript con ruido', () => {
  it('"yo canto envido" matchea envido', () => {
    const match = findBestMatch('yo canto envido', TRIGGERS);
    expect(match?.word).toBe('envido');
  });

  it('"dale truco nomás" matchea truco', () => {
    const match = findBestMatch('dale truco nomás', TRIGGERS);
    expect(match?.word).toBe('truco');
  });
});
