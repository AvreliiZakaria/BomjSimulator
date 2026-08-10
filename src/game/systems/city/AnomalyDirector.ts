import type Phaser from 'phaser';
import type { CityOptions } from './types';

export interface AnomalyActions {
  flickerLamp(): void;
  glitchClock(): void;
  spawnStranger(): void;
}

const CHECK_INTERVAL = 7000;
const ANOMALY_CHANCE = 0.08;

/**
 * Редкие странности города. Никаких скримеров и громких звуков:
 * моргнул фонарь, дёрнулись часы, кто-то прошёл мимо.
 */
export class AnomalyDirector {
  private timer: Phaser.Time.TimerEvent | null = null;

  public constructor(
    private readonly scene: Phaser.Scene,
    private readonly options: CityOptions,
    private readonly actions: AnomalyActions,
  ) {}

  public start(): void {
    if (this.timer || !this.options.motion) {
      return;
    }

    this.timer = this.scene.time.addEvent({
      delay: CHECK_INTERVAL,
      loop: true,
      callback: this.tick,
      callbackScope: this,
    });
  }

  public destroy(): void {
    this.timer?.remove(false);
    this.timer = null;
  }

  private tick(): void {
    if (Math.random() > ANOMALY_CHANCE) {
      return;
    }

    const roll = Math.random();

    if (roll < 0.45) {
      this.actions.flickerLamp();
    } else if (roll < 0.8) {
      this.actions.glitchClock();
    } else {
      this.actions.spawnStranger();
    }
  }
}
