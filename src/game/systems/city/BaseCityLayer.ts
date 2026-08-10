import type Phaser from 'phaser';
import type { CityLayer, CityLayout, CityOptions } from './types';

/**
 * Общая механика слоя города: контейнер, параллакс, аккуратная очистка
 * твинов и таймеров при пересборке (например, после поворота экрана).
 */
export abstract class BaseCityLayer implements CityLayer {
  protected readonly container: Phaser.GameObjects.Container;

  protected layout: CityLayout | null = null;

  private readonly tweens: Phaser.Tweens.Tween[] = [];

  private readonly timers: Phaser.Time.TimerEvent[] = [];

  protected constructor(
    protected readonly scene: Phaser.Scene,
    protected readonly options: CityOptions,
    depth: number,
    private readonly parallaxFactor: number,
  ) {
    this.container = scene.add.container(0, 0);
    this.container.setDepth(depth);
  }

  public build(layout: CityLayout): void {
    this.reset();
    this.layout = layout;
    this.container.setPosition(0, 0);
    this.draw(layout);
  }

  public setParallax(x: number, y: number): void {
    if (!this.layout) {
      return;
    }

    this.container.x = x * this.parallaxFactor * this.layout.unit * 8;
    this.container.y = y * this.parallaxFactor * this.layout.unit * 2.5;
  }

  public update(_delta: number): void {
    /* по умолчанию слой статичен */
  }

  public destroy(): void {
    this.reset();
    this.container.destroy(true);
  }

  protected abstract draw(layout: CityLayout): void;

  protected get motionEnabled(): boolean {
    return this.options.motion;
  }

  protected track(tween: Phaser.Tweens.Tween): Phaser.Tweens.Tween {
    this.tweens.push(tween);
    return tween;
  }

  protected trackTimer(timer: Phaser.Time.TimerEvent): Phaser.Time.TimerEvent {
    this.timers.push(timer);
    return timer;
  }

  private reset(): void {
    for (const tween of this.tweens) {
      tween.remove();
    }
    this.tweens.length = 0;

    for (const timer of this.timers) {
      timer.remove(false);
    }
    this.timers.length = 0;

    this.container.removeAll(true);
  }
}
