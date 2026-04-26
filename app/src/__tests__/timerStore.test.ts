import { act } from '@testing-library/react-native';
import { useTimerStore } from '@src/store/timerStore';
import { createPlayer } from '@src/utils/players';

// Helper: resetea el store entre tests
function resetStore() {
  useTimerStore.getState().reset();
}

const mockPlayers = [
  createPlayer(0, 'Rodrigo'),
  createPlayer(1, 'Ana'),
  createPlayer(2, 'Carlos'),
];

describe('timerStore — initGame', () => {
  beforeEach(resetStore);

  it('inicializa con los jugadores y duración correctos', () => {
    act(() => {
      useTimerStore.getState().initGame(mockPlayers, 120_000);
    });
    const s = useTimerStore.getState();
    expect(s.players).toHaveLength(3);
    expect(s.turnDurationMs).toBe(120_000);
    expect(s.timeRemainingMs).toBe(120_000);
    expect(s.status).toBe('idle');
  });
});

describe('timerStore — start / pause / resume', () => {
  beforeEach(() => {
    resetStore();
    act(() => {
      useTimerStore.getState().initGame(mockPlayers, 120_000);
    });
  });

  it('start cambia status a running', () => {
    act(() => { useTimerStore.getState().start(); });
    expect(useTimerStore.getState().status).toBe('running');
  });

  it('start no hace nada si no está idle', () => {
    act(() => { useTimerStore.getState().start(); });
    act(() => { useTimerStore.getState().start(); }); // segunda llamada
    expect(useTimerStore.getState().status).toBe('running');
  });

  it('pause cambia running → paused', () => {
    act(() => { useTimerStore.getState().start(); });
    act(() => { useTimerStore.getState().pause(); });
    expect(useTimerStore.getState().status).toBe('paused');
  });

  it('pause no afecta si no está running', () => {
    act(() => { useTimerStore.getState().pause(); }); // status = idle
    expect(useTimerStore.getState().status).toBe('idle');
  });

  it('resume cambia paused → running', () => {
    act(() => { useTimerStore.getState().start(); });
    act(() => { useTimerStore.getState().pause(); });
    act(() => { useTimerStore.getState().resume(); });
    expect(useTimerStore.getState().status).toBe('running');
  });
});

describe('timerStore — tick', () => {
  beforeEach(() => {
    resetStore();
    act(() => {
      useTimerStore.getState().initGame(mockPlayers, 120_000);
      useTimerStore.getState().start();
    });
  });

  it('reduce timeRemainingMs correctamente', () => {
    act(() => { useTimerStore.getState().tick(1000); });
    expect(useTimerStore.getState().timeRemainingMs).toBe(119_000);
  });

  it('no va por debajo de 0', () => {
    act(() => { useTimerStore.getState().tick(200_000); });
    expect(useTimerStore.getState().timeRemainingMs).toBe(0);
  });

  it('no hace nada si status !== running', () => {
    act(() => { useTimerStore.getState().pause(); });
    act(() => { useTimerStore.getState().tick(5000); });
    expect(useTimerStore.getState().timeRemainingMs).toBe(120_000);
  });
});

describe('timerStore — passTurn', () => {
  beforeEach(() => {
    resetStore();
    act(() => {
      useTimerStore.getState().initGame(mockPlayers, 120_000);
      useTimerStore.getState().start();
      useTimerStore.getState().tick(30_000); // 30s transcurridos
    });
  });

  it('avanza al siguiente jugador', () => {
    act(() => { useTimerStore.getState().passTurn('button'); });
    expect(useTimerStore.getState().currentPlayerIndex).toBe(1);
  });

  it('rota circularmente al pasar el último jugador', () => {
    // passTurn pone status=transitioning; endTransition vuelve a running
    act(() => { useTimerStore.getState().passTurn('button'); });    // 0→1
    act(() => { useTimerStore.getState().endTransition(); });
    act(() => { useTimerStore.getState().passTurn('button'); });    // 1→2
    act(() => { useTimerStore.getState().endTransition(); });
    act(() => { useTimerStore.getState().passTurn('button'); });    // 2→0
    expect(useTimerStore.getState().currentPlayerIndex).toBe(0);
  });

  it('reinicia el tiempo al pasar turno', () => {
    act(() => { useTimerStore.getState().passTurn('button'); });
    expect(useTimerStore.getState().timeRemainingMs).toBe(120_000);
  });

  it('registra passesByButton correctamente', () => {
    act(() => { useTimerStore.getState().passTurn('button'); });
    expect(useTimerStore.getState().players[0].passesByButton).toBe(1);
    expect(useTimerStore.getState().players[0].passesByVoice).toBe(0);
  });

  it('registra passesByVoice correctamente', () => {
    act(() => { useTimerStore.getState().passTurn('voice'); });
    expect(useTimerStore.getState().players[0].passesByVoice).toBe(1);
    expect(useTimerStore.getState().players[0].passesByButton).toBe(0);
  });

  it('cambia status a transitioning', () => {
    act(() => { useTimerStore.getState().passTurn('button'); });
    expect(useTimerStore.getState().status).toBe('transitioning');
  });

  it('agrega registro al turnHistory', () => {
    act(() => { useTimerStore.getState().passTurn('button'); });
    expect(useTimerStore.getState().turnHistory).toHaveLength(1);
    expect(useTimerStore.getState().turnHistory[0].endReason).toBe('button');
  });
});

describe('timerStore — onTimeout', () => {
  beforeEach(() => {
    resetStore();
    act(() => {
      useTimerStore.getState().initGame(mockPlayers, 120_000);
      useTimerStore.getState().start();
    });
  });

  it('cambia status a timeout', () => {
    act(() => { useTimerStore.getState().onTimeout(); });
    expect(useTimerStore.getState().status).toBe('timeout');
  });

  it('fija timeRemainingMs en 0', () => {
    act(() => { useTimerStore.getState().onTimeout(); });
    expect(useTimerStore.getState().timeRemainingMs).toBe(0);
  });

  it('agrega registro con endReason timeout', () => {
    act(() => { useTimerStore.getState().onTimeout(); });
    const record = useTimerStore.getState().turnHistory[0];
    expect(record.endReason).toBe('timeout');
  });

  it('NO avanza al siguiente jugador (mismo jugador mantiene el turno)', () => {
    act(() => { useTimerStore.getState().onTimeout(); });
    expect(useTimerStore.getState().currentPlayerIndex).toBe(0);
  });
});

describe('timerStore — endTransition', () => {
  beforeEach(() => {
    resetStore();
    act(() => {
      useTimerStore.getState().initGame(mockPlayers, 120_000);
      useTimerStore.getState().start();
      useTimerStore.getState().passTurn('button'); // → transitioning
    });
  });

  it('transitioning → running', () => {
    act(() => { useTimerStore.getState().endTransition(); });
    expect(useTimerStore.getState().status).toBe('running');
  });

  it('reinicia el tiempo', () => {
    act(() => { useTimerStore.getState().endTransition(); });
    expect(useTimerStore.getState().timeRemainingMs).toBe(120_000);
  });
});

describe('timerStore — restartTurn', () => {
  beforeEach(() => {
    resetStore();
    act(() => {
      useTimerStore.getState().initGame(mockPlayers, 120_000);
      useTimerStore.getState().start();
      useTimerStore.getState().tick(60_000); // mitad del tiempo
    });
  });

  it('resetea el tiempo al máximo', () => {
    act(() => { useTimerStore.getState().restartTurn(); });
    expect(useTimerStore.getState().timeRemainingMs).toBe(120_000);
  });

  it('mantiene el jugador actual', () => {
    act(() => { useTimerStore.getState().restartTurn(); });
    expect(useTimerStore.getState().currentPlayerIndex).toBe(0);
  });

  it('mantiene el status running', () => {
    act(() => { useTimerStore.getState().restartTurn(); });
    expect(useTimerStore.getState().status).toBe('running');
  });
});
