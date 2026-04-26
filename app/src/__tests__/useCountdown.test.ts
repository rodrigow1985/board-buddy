import { renderHook, act } from '@testing-library/react-native';
import { useCountdown } from '@src/hooks/useCountdown';
import { useTimerStore } from '@src/store/timerStore';
import { createPlayer } from '@src/utils/players';

jest.useFakeTimers();

const mockPlayers = [createPlayer(0, 'Rodrigo'), createPlayer(1, 'Ana')];

function setupRunningTimer(turnDurationMs = 10_000) {
  act(() => {
    useTimerStore.getState().reset();
    useTimerStore.getState().initGame(mockPlayers, turnDurationMs);
    useTimerStore.getState().start();
  });
}

describe('useCountdown', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    act(() => { useTimerStore.getState().reset(); });
  });

  it('reduce el tiempo mientras está running', () => {
    setupRunningTimer(10_000);
    renderHook(() => useCountdown());

    act(() => { jest.advanceTimersByTime(1000); }); // 10 ticks de 100ms

    const { timeRemainingMs } = useTimerStore.getState();
    // Debería haber reducido aproximadamente 1000ms (con cierta tolerancia)
    expect(timeRemainingMs).toBeLessThan(10_000);
    expect(timeRemainingMs).toBeGreaterThan(0);
  });

  it('no reduce el tiempo mientras está paused', () => {
    setupRunningTimer(10_000);
    act(() => { useTimerStore.getState().pause(); });
    renderHook(() => useCountdown());

    act(() => { jest.advanceTimersByTime(2000); });

    expect(useTimerStore.getState().timeRemainingMs).toBe(10_000);
  });

  it('dispara onTimeout cuando timeRemainingMs llega a 0', () => {
    setupRunningTimer(500); // 500ms de duración
    renderHook(() => useCountdown());

    act(() => { jest.advanceTimersByTime(1000); }); // suficiente para agotar

    expect(useTimerStore.getState().status).toBe('timeout');
  });

  it('detiene el countdown al pausar', () => {
    setupRunningTimer(10_000);
    const { rerender } = renderHook(() => useCountdown());

    act(() => { jest.advanceTimersByTime(500); });
    act(() => { useTimerStore.getState().pause(); });
    rerender({});

    const timeAfterPause = useTimerStore.getState().timeRemainingMs;
    act(() => { jest.advanceTimersByTime(2000); });

    // El tiempo no debe cambiar tras pausar
    expect(useTimerStore.getState().timeRemainingMs).toBe(timeAfterPause);
  });
});
