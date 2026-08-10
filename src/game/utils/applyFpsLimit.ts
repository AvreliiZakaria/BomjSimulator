import type Phaser from 'phaser';

/**
 * TimeStep выбирает шаг с ограничением FPS на старте игры, поэтому лимит
 * задаётся в конфиге. Здесь мы обновляем то, что можно поменять на лету;
 * полное применение происходит после перезапуска (об этом сказано в настройках).
 */
interface FpsLimitedTimeStep {
  fpsLimit: number;
  hasFpsLimit: boolean;
  targetFps: number;
  _limitRate?: number;
}

export function applyFpsLimit(game: Phaser.Game, fps: number): void {
  const loop = game.loop as unknown as FpsLimitedTimeStep;

  loop.fpsLimit = fps;
  loop.hasFpsLimit = fps > 0;
  loop.targetFps = fps;

  if (typeof loop._limitRate === 'number') {
    loop._limitRate = fps > 0 ? 1000 / fps : 0;
  }

  game.loop.resetDelta();
}
