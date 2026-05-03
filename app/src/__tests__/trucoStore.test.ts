import { useTrucoStore } from '@src/store/trucoStore';

function resetStore() {
  useTrucoStore.getState().resetGame();
}

function initDefault() {
  useTrucoStore.getState().initGame({
    team1Name: 'Nosotros',
    team2Name: 'Ellos',
    targetScore: 30,
    florEnabled: false,
    voiceEnabled: true,
  });
}

beforeEach(() => {
  resetStore();
});

describe('trucoStore — initGame', () => {
  it('inicia una partida con los equipos configurados', () => {
    initDefault();
    const s = useTrucoStore.getState();
    expect(s.gameStatus).toBe('playing');
    expect(s.teams[0].name).toBe('Nosotros');
    expect(s.teams[1].name).toBe('Ellos');
    expect(s.teams[0].score).toBe(0);
    expect(s.teams[1].score).toBe(0);
    expect(s.handNumber).toBe(1);
    expect(s.currentHand.status).toBe('playing');
  });
});

describe('trucoStore — envido flow', () => {
  beforeEach(initDefault);

  it('registrar envido → canto_pending con puntos correctos', () => {
    useTrucoStore.getState().registerCanto('envido', 'envido', 0);
    const s = useTrucoStore.getState();
    expect(s.currentHand.status).toBe('canto_pending');
    expect(s.currentHand.activeCanto?.level).toBe('envido');
    expect(s.currentHand.activeCanto?.pointsIfAccepted).toBe(2);
    expect(s.currentHand.activeCanto?.pointsIfRejected).toBe(1);
  });

  it('envido no querido → confirming con puntos al que cantó', () => {
    useTrucoStore.getState().registerCanto('envido', 'envido', 0);
    useTrucoStore.getState().respondCanto('rejected');
    const s = useTrucoStore.getState();
    expect(s.currentHand.status).toBe('confirming');
    expect(s.currentHand.pendingPoints?.team).toBe(0);
    expect(s.currentHand.pendingPoints?.amount).toBe(1);
  });

  it('envido querido → resolving (hay que elegir ganador)', () => {
    useTrucoStore.getState().registerCanto('envido', 'envido', 0);
    useTrucoStore.getState().respondCanto('accepted');
    const s = useTrucoStore.getState();
    expect(s.currentHand.status).toBe('resolving');
  });

  it('flujo completo: envido querido → asignar ganador → confirmar', () => {
    useTrucoStore.getState().registerCanto('envido', 'envido', 0);
    useTrucoStore.getState().respondCanto('accepted');
    useTrucoStore.getState().assignWinner(1);
    const s1 = useTrucoStore.getState();
    expect(s1.currentHand.status).toBe('confirming');
    expect(s1.currentHand.pendingPoints?.team).toBe(1);
    expect(s1.currentHand.pendingPoints?.amount).toBe(2);

    useTrucoStore.getState().confirmPoints();
    const s2 = useTrucoStore.getState();
    expect(s2.teams[1].score).toBe(2);
    expect(s2.currentHand.status).toBe('playing');
    expect(s2.currentHand.accumulatedPoints).toHaveLength(1);
  });

  it('cancelar puntos vuelve a playing', () => {
    useTrucoStore.getState().registerCanto('envido', 'envido', 0);
    useTrucoStore.getState().respondCanto('accepted');
    useTrucoStore.getState().cancelPoints();
    const s = useTrucoStore.getState();
    expect(s.currentHand.status).toBe('playing');
    expect(s.currentHand.activeCanto).toBeNull();
    // El envido cancelado se revierte del historial
    expect(s.currentHand.envidoHistory).toHaveLength(0);
  });
});

describe('trucoStore — truco flow', () => {
  beforeEach(initDefault);

  it('registrar truco → canto_pending', () => {
    useTrucoStore.getState().registerCanto('truco', 'truco', 1);
    const s = useTrucoStore.getState();
    expect(s.currentHand.status).toBe('canto_pending');
    expect(s.currentHand.activeCanto?.pointsIfAccepted).toBe(2);
    expect(s.currentHand.activeCanto?.pointsIfRejected).toBe(1);
  });

  it('truco querido → playing con trucoLevel actualizado', () => {
    useTrucoStore.getState().registerCanto('truco', 'truco', 1);
    useTrucoStore.getState().respondCanto('accepted');
    const s = useTrucoStore.getState();
    expect(s.currentHand.status).toBe('playing');
    expect(s.currentHand.trucoLevel).toBe('truco');
    expect(s.currentHand.activeCanto).toBeNull();
  });

  it('truco no querido → confirming con 1 punto al que cantó', () => {
    useTrucoStore.getState().registerCanto('truco', 'truco', 1);
    useTrucoStore.getState().respondCanto('rejected');
    const s = useTrucoStore.getState();
    expect(s.currentHand.status).toBe('confirming');
    expect(s.currentHand.pendingPoints?.team).toBe(1);
    expect(s.currentHand.pendingPoints?.amount).toBe(1);
  });

  it('escalada truco → retruco → vale cuatro', () => {
    useTrucoStore.getState().registerCanto('truco', 'truco', 0);
    useTrucoStore.getState().respondCanto('accepted');

    useTrucoStore.getState().registerCanto('truco', 'retruco', 1);
    useTrucoStore.getState().respondCanto('accepted');
    expect(useTrucoStore.getState().currentHand.trucoLevel).toBe('retruco');

    useTrucoStore.getState().registerCanto('truco', 'vale_cuatro', 0);
    useTrucoStore.getState().respondCanto('accepted');
    expect(useTrucoStore.getState().currentHand.trucoLevel).toBe('vale_cuatro');
  });

  it('no se puede saltar niveles de truco', () => {
    useTrucoStore.getState().registerCanto('truco', 'retruco', 0);
    const s = useTrucoStore.getState();
    // Debe quedar en playing, no canto_pending
    expect(s.currentHand.status).toBe('playing');
    expect(s.currentHand.activeCanto).toBeNull();
  });
});

describe('trucoStore — validaciones de orden', () => {
  beforeEach(initDefault);

  it('no se puede cantar envido después de truco', () => {
    useTrucoStore.getState().registerCanto('truco', 'truco', 0);
    useTrucoStore.getState().respondCanto('accepted');

    useTrucoStore.getState().registerCanto('envido', 'envido', 1);
    const s = useTrucoStore.getState();
    // Debe seguir en playing sin canto pendiente
    expect(s.currentHand.status).toBe('playing');
    expect(s.currentHand.activeCanto).toBeNull();
  });

  it('no se puede cantar mientras hay un canto pendiente (de otro tipo)', () => {
    useTrucoStore.getState().registerCanto('envido', 'envido', 0);
    // Intentar cantar truco mientras envido está pendiente
    useTrucoStore.getState().registerCanto('truco', 'truco', 1);
    const s = useTrucoStore.getState();
    // El envido sigue siendo el canto activo (truco se puede registrar desde canto_pending para subir envido)
    expect(s.currentHand.activeCanto?.type).toBe('envido');
  });
});

describe('trucoStore — puntos manuales', () => {
  beforeEach(initDefault);

  it('addManualPoints suma puntos al equipo correcto', () => {
    useTrucoStore.getState().addManualPoints(0, 3, 'envido manual');
    const s = useTrucoStore.getState();
    expect(s.teams[0].score).toBe(3);
    expect(s.currentHand.accumulatedPoints).toHaveLength(1);
  });

  it('undoLastPoints revierte el último puntaje', () => {
    useTrucoStore.getState().addManualPoints(0, 3, 'envido');
    useTrucoStore.getState().addManualPoints(1, 2, 'truco');
    useTrucoStore.getState().undoLastPoints();
    const s = useTrucoStore.getState();
    expect(s.teams[0].score).toBe(3);
    expect(s.teams[1].score).toBe(0);
    expect(s.currentHand.accumulatedPoints).toHaveLength(1);
  });
});

describe('trucoStore — victoria', () => {
  beforeEach(initDefault);

  it('detecta victoria cuando un equipo llega a targetScore', () => {
    useTrucoStore.getState().addManualPoints(0, 30, 'test');
    const s = useTrucoStore.getState();
    expect(s.winner).toBe(0);
    expect(s.gameStatus).toBe('finished');
  });

  it('no pasa de targetScore', () => {
    useTrucoStore.getState().addManualPoints(1, 50, 'test');
    const s = useTrucoStore.getState();
    expect(s.teams[1].score).toBe(30);
  });

  it('detecta victoria con partida a 15', () => {
    useTrucoStore.getState().initGame({
      team1Name: 'A',
      team2Name: 'B',
      targetScore: 15,
      florEnabled: false,
      voiceEnabled: true,
    });
    useTrucoStore.getState().addManualPoints(1, 15, 'test');
    const s = useTrucoStore.getState();
    expect(s.winner).toBe(1);
    expect(s.gameStatus).toBe('finished');
  });
});

describe('trucoStore — endHand y historial', () => {
  beforeEach(initDefault);

  it('endHand guarda historial y resetea la mano', () => {
    useTrucoStore.getState().addManualPoints(0, 2, 'envido');
    useTrucoStore.getState().endHand();
    const s = useTrucoStore.getState();
    expect(s.history).toHaveLength(1);
    expect(s.history[0].handNumber).toBe(1);
    expect(s.history[0].points).toHaveLength(1);
    expect(s.currentHand.status).toBe('idle');
  });

  it('startHand inicia una nueva mano', () => {
    useTrucoStore.getState().endHand();
    useTrucoStore.getState().startHand();
    const s = useTrucoStore.getState();
    expect(s.handNumber).toBe(2);
    expect(s.currentHand.status).toBe('playing');
  });
});

describe('trucoStore — resetGame', () => {
  it('resetea todo al estado inicial', () => {
    initDefault();
    useTrucoStore.getState().addManualPoints(0, 10, 'test');
    useTrucoStore.getState().resetGame();
    const s = useTrucoStore.getState();
    expect(s.gameStatus).toBe('setup');
    expect(s.teams[0].score).toBe(0);
    expect(s.handNumber).toBe(0);
    expect(s.history).toHaveLength(0);
  });
});
