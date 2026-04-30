import {
  envidoPoints,
  trucoPoints,
  florPoints,
  canCallEnvido,
  canAddEnvidoLevel,
  nextTrucoLevel,
  getPhase,
  HAND_BASE_POINTS,
} from '@src/utils/truco';

// ─── envidoPoints ─────────────────────────────────────────────────

describe('envidoPoints', () => {
  it('envido solo → 2 aceptado, 1 rechazado', () => {
    expect(envidoPoints(['envido'], 30, 10)).toEqual({ accepted: 2, rejected: 1 });
  });

  it('envido + envido → 4 aceptado, 2 rechazado', () => {
    expect(envidoPoints(['envido', 'envido'], 30, 10)).toEqual({ accepted: 4, rejected: 2 });
  });

  it('real envido solo → 3 aceptado, 1 rechazado', () => {
    expect(envidoPoints(['real_envido'], 30, 10)).toEqual({ accepted: 3, rejected: 1 });
  });

  it('envido + real envido → 5 aceptado, 2 rechazado', () => {
    expect(envidoPoints(['envido', 'real_envido'], 30, 10)).toEqual({ accepted: 5, rejected: 2 });
  });

  it('envido + envido + real envido → 7 aceptado, 4 rechazado', () => {
    expect(envidoPoints(['envido', 'envido', 'real_envido'], 30, 10)).toEqual({ accepted: 7, rejected: 4 });
  });

  it('falta envido solo → (30-10)=20 aceptado, 1 rechazado', () => {
    expect(envidoPoints(['falta_envido'], 30, 10)).toEqual({ accepted: 20, rejected: 1 });
  });

  it('envido + falta envido → (30-10)=20 aceptado, 2 rechazado', () => {
    expect(envidoPoints(['envido', 'falta_envido'], 30, 10)).toEqual({ accepted: 20, rejected: 2 });
  });

  it('falta envido con target 15 y loser en 12 → 3 aceptado', () => {
    expect(envidoPoints(['falta_envido'], 15, 12)).toEqual({ accepted: 3, rejected: 1 });
  });

  it('historial vacío → 0 puntos', () => {
    expect(envidoPoints([], 30, 0)).toEqual({ accepted: 0, rejected: 0 });
  });
});

// ─── trucoPoints ──────────────────────────────────────────────────

describe('trucoPoints', () => {
  it('truco → 2 aceptado, 1 rechazado', () => {
    expect(trucoPoints('truco')).toEqual({ accepted: 2, rejected: 1 });
  });

  it('retruco → 3 aceptado, 2 rechazado', () => {
    expect(trucoPoints('retruco')).toEqual({ accepted: 3, rejected: 2 });
  });

  it('vale cuatro → 4 aceptado, 3 rechazado', () => {
    expect(trucoPoints('vale_cuatro')).toEqual({ accepted: 4, rejected: 3 });
  });
});

// ─── florPoints ───────────────────────────────────────────────────

describe('florPoints', () => {
  it('flor → 3 directos, 0 rechazado', () => {
    expect(florPoints('flor', 30, 10)).toEqual({ accepted: 3, rejected: 0 });
  });

  it('contra flor → 6 aceptado, 3 rechazado', () => {
    expect(florPoints('contra_flor', 30, 10)).toEqual({ accepted: 6, rejected: 3 });
  });

  it('contra flor al resto → puntos restantes, 6 rechazado', () => {
    expect(florPoints('contra_flor_al_resto', 30, 22)).toEqual({ accepted: 8, rejected: 6 });
  });
});

// ─── canCallEnvido ────────────────────────────────────────────────

describe('canCallEnvido', () => {
  it('puede cantar envido si no se cantó truco', () => {
    expect(canCallEnvido(null)).toBe(true);
  });

  it('no puede cantar envido si ya se cantó truco', () => {
    expect(canCallEnvido('truco')).toBe(false);
  });

  it('no puede cantar envido si hay retruco', () => {
    expect(canCallEnvido('retruco')).toBe(false);
  });
});

// ─── canAddEnvidoLevel ────────────────────────────────────────────

describe('canAddEnvidoLevel', () => {
  it('puede cantar envido con historial vacío', () => {
    expect(canAddEnvidoLevel([], 'envido')).toBe(true);
  });

  it('puede cantar envido dos veces', () => {
    expect(canAddEnvidoLevel(['envido'], 'envido')).toBe(true);
  });

  it('no puede cantar envido tres veces', () => {
    expect(canAddEnvidoLevel(['envido', 'envido'], 'envido')).toBe(false);
  });

  it('puede cantar real envido una vez', () => {
    expect(canAddEnvidoLevel(['envido'], 'real_envido')).toBe(true);
  });

  it('no puede cantar real envido dos veces', () => {
    expect(canAddEnvidoLevel(['real_envido'], 'real_envido')).toBe(false);
  });

  it('siempre puede cantar falta envido', () => {
    expect(canAddEnvidoLevel(['envido', 'envido'], 'falta_envido')).toBe(true);
  });

  it('no puede cantar nada después de falta envido', () => {
    expect(canAddEnvidoLevel(['falta_envido'], 'envido')).toBe(false);
    expect(canAddEnvidoLevel(['falta_envido'], 'real_envido')).toBe(false);
    expect(canAddEnvidoLevel(['falta_envido'], 'falta_envido')).toBe(false);
  });
});

// ─── nextTrucoLevel ──────────────────────────────────────────────

describe('nextTrucoLevel', () => {
  it('null → truco', () => {
    expect(nextTrucoLevel(null)).toBe('truco');
  });

  it('truco → retruco', () => {
    expect(nextTrucoLevel('truco')).toBe('retruco');
  });

  it('retruco → vale_cuatro', () => {
    expect(nextTrucoLevel('retruco')).toBe('vale_cuatro');
  });

  it('vale_cuatro → null (no se puede subir más)', () => {
    expect(nextTrucoLevel('vale_cuatro')).toBeNull();
  });
});

// ─── getPhase ────────────────────────────────────────────────────

describe('getPhase', () => {
  it('0 a 14 → malas', () => {
    expect(getPhase(0)).toBe('malas');
    expect(getPhase(14)).toBe('malas');
  });

  it('15 a 30 → buenas', () => {
    expect(getPhase(15)).toBe('buenas');
    expect(getPhase(29)).toBe('buenas');
  });
});

// ─── HAND_BASE_POINTS ────────────────────────────────────────────

describe('HAND_BASE_POINTS', () => {
  it('mano sin cantos vale 1 punto', () => {
    expect(HAND_BASE_POINTS).toBe(1);
  });
});
