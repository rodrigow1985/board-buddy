import { createPlayer, nextPlayerIndex, playerInitial, voicePassRate, Player } from '@src/utils/players';

describe('createPlayer', () => {
  it('crea jugador con nombre dado', () => {
    const p = createPlayer(0, 'Rodrigo');
    expect(p.name).toBe('Rodrigo');
  });

  it('usa nombre default si no se pasa', () => {
    const p = createPlayer(2);
    expect(p.name).toBe('Jugador 3');
  });

  it('asigna color por índice (rotación circular)', () => {
    const p0 = createPlayer(0);
    const p4 = createPlayer(4); // 4 % 4 = 0, mismo color que índice 0
    expect(p0.color).toBe(p4.color);
  });

  it('inicializa contadores en 0', () => {
    const p = createPlayer(0);
    expect(p.turns).toBe(0);
    expect(p.passesByVoice).toBe(0);
    expect(p.passesByButton).toBe(0);
  });

  it('genera IDs únicos', () => {
    const p1 = createPlayer(0);
    const p2 = createPlayer(0);
    expect(p1.id).not.toBe(p2.id);
  });
});

describe('nextPlayerIndex', () => {
  it('avanza al siguiente jugador', () => {
    expect(nextPlayerIndex(0, 4)).toBe(1);
    expect(nextPlayerIndex(1, 4)).toBe(2);
  });

  it('vuelve al primero desde el último (circular)', () => {
    expect(nextPlayerIndex(3, 4)).toBe(0);
  });

  it('con 2 jugadores alterna', () => {
    expect(nextPlayerIndex(0, 2)).toBe(1);
    expect(nextPlayerIndex(1, 2)).toBe(0);
  });

  it('total 0 retorna 0 (seguro)', () => {
    expect(nextPlayerIndex(0, 0)).toBe(0);
  });
});

describe('playerInitial', () => {
  it('retorna la primera letra en mayúscula', () => {
    expect(playerInitial('rodrigo')).toBe('R');
    expect(playerInitial('Ana')).toBe('A');
  });

  it('maneja string con espacios al inicio', () => {
    expect(playerInitial('  carlos')).toBe('C');
  });

  it('string vacío retorna ?', () => {
    expect(playerInitial('')).toBe('?');
  });
});

describe('voicePassRate', () => {
  const makePlayers = (voice: number, button: number): Player[] => [
    { ...createPlayer(0), passesByVoice: voice, passesByButton: button },
  ];

  it('100% voz', () => {
    expect(voicePassRate(makePlayers(10, 0))).toBe(1);
  });

  it('0% voz', () => {
    expect(voicePassRate(makePlayers(0, 10))).toBe(0);
  });

  it('78% voz redondeado (78 de 100)', () => {
    const players: Player[] = [
      { ...createPlayer(0), passesByVoice: 6, passesByButton: 0 },
      { ...createPlayer(1), passesByVoice: 5, passesByButton: 0 },
      { ...createPlayer(2), passesByVoice: 0, passesByButton: 4 },
      { ...createPlayer(3), passesByVoice: 5, passesByButton: 0 },
    ];
    // 16 voz / 20 total = 0.8
    expect(voicePassRate(players)).toBeCloseTo(0.8);
  });

  it('sin pasos retorna 0 (evita NaN)', () => {
    expect(voicePassRate(makePlayers(0, 0))).toBe(0);
  });

  it('lista vacía retorna 0', () => {
    expect(voicePassRate([])).toBe(0);
  });
});
