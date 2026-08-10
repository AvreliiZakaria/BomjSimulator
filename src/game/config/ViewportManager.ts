import type Phaser from 'phaser';
import { getDevicePixelRatio } from '../../core/device';

/**
 * Следит за размером контейнера, ориентацией и сменой DPR.
 * Ресайз пропускается через requestAnimationFrame, чтобы не дёргать
 * ScaleManager десятки раз за один поворот телефона.
 */
export class ViewportManager {
  private frameId = 0;

  private lastRatio = 0;

  public constructor(
    private readonly game: Phaser.Game,
    private readonly parent: HTMLElement,
  ) {}

  public start(): void {
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleResize, { passive: true });
    window.visualViewport?.addEventListener('resize', this.handleResize, { passive: true });

    this.game.events.once('ready', () => this.apply());
  }

  public destroy(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    window.visualViewport?.removeEventListener('resize', this.handleResize);

    if (this.frameId !== 0) {
      window.cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
  }

  private readonly handleResize = (): void => {
    if (this.frameId !== 0) {
      window.cancelAnimationFrame(this.frameId);
    }

    this.frameId = window.requestAnimationFrame(() => {
      this.frameId = 0;
      this.apply();
    });
  };

  private apply(): void {
    const ratio = getDevicePixelRatio();
    const width = Math.max(1, Math.round(this.parent.clientWidth * ratio));
    const height = Math.max(1, Math.round(this.parent.clientHeight * ratio));

    if (ratio !== this.lastRatio) {
      this.lastRatio = ratio;
      this.game.scale.setZoom(1 / ratio);
    }

    this.game.scale.resize(width, height);
  }
}
