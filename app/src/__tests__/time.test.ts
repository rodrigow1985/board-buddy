import { formatTime, calcProgress, isWarnState, toMs, toSeconds } from '@src/utils/time';

describe('formatTime', () => {
  it('formatea 2 minutos exactos', () => {
    expect(formatTime(120_000)).toBe('2:00');
  });

  it('formatea 1 minuto 30 segundos', () => {
    expect(formatTime(90_000)).toBe('1:30');
  });

  it('formatea 0 segundos', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('formatea valores negativos como 0:00', () => {
    expect(formatTime(-5000)).toBe('0:00');
  });

  it('formatea segundos con padding', () => {
    expect(formatTime(65_000)).toBe('1:05');
  });

  it('redondea hacia arriba (999ms = 1s)', () => {
    expect(formatTime(999)).toBe('0:01');
  });

  it('1ms exacto = 0:01', () => {
    expect(formatTime(1)).toBe('0:01');
  });
});

describe('calcProgress', () => {
  it('turno lleno = 1.0', () => {
    expect(calcProgress(120_000, 120_000)).toBe(1);
  });

  it('turno a mitad = 0.5', () => {
    expect(calcProgress(60_000, 120_000)).toBe(0.5);
  });

  it('turno agotado = 0.0', () => {
    expect(calcProgress(0, 120_000)).toBe(0);
  });

  it('no supera 1.0', () => {
    expect(calcProgress(200_000, 120_000)).toBe(1);
  });

  it('no es negativo', () => {
    expect(calcProgress(-1000, 120_000)).toBe(0);
  });

  it('turnDuration 0 retorna 0 (evita división por cero)', () => {
    expect(calcProgress(1000, 0)).toBe(0);
  });
});

describe('isWarnState', () => {
  it('exactamente 20% = warn', () => {
    expect(isWarnState(24_000, 120_000)).toBe(true); // 24/120 = 0.2
  });

  it('bajo 20% = warn', () => {
    expect(isWarnState(10_000, 120_000)).toBe(true);
  });

  it('sobre 20% = no warn', () => {
    expect(isWarnState(25_000, 120_000)).toBe(false);
  });

  it('tiempo lleno = no warn', () => {
    expect(isWarnState(120_000, 120_000)).toBe(false);
  });

  it('0ms = warn', () => {
    expect(isWarnState(0, 120_000)).toBe(true);
  });
});

describe('toMs', () => {
  it('convierte 2 minutos a 120_000ms', () => {
    expect(toMs(2)).toBe(120_000);
  });

  it('convierte 1 minuto 30 segundos a 90_000ms', () => {
    expect(toMs(1, 30)).toBe(90_000);
  });

  it('solo segundos', () => {
    expect(toMs(0, 45)).toBe(45_000);
  });
});

describe('toSeconds', () => {
  it('convierte 1500ms a 2 (redondeo hacia arriba)', () => {
    expect(toSeconds(1500)).toBe(2);
  });

  it('convierte exactamente 1000ms a 1', () => {
    expect(toSeconds(1000)).toBe(1);
  });

  it('convierte 1ms a 1', () => {
    expect(toSeconds(1)).toBe(1);
  });
});
