import type Phaser from 'phaser';
import { BaseCityLayer } from './BaseCityLayer';
import { CityDepth, type CityLayout, type CityOptions } from './types';
import { CSS_COLORS, PALETTE } from '../../config/palette';
import { clamp } from '../../../core/math';

const START_MINUTES = 2 * 60 + 47;
const MS_PER_CITY_MINUTE = 14000;
const GLITCH_CHARS = '0123456789#%:*';

/** Городские часы на фасаде. Иногда с ними что-то не так. */
export class CityClock extends BaseCityLayer {
  private label: Phaser.GameObjects.Text | null = null;

  private minutes = START_MINUTES;

  private elapsed = 0;

  private glitching = false;

  public constructor(scene: Phaser.Scene, options: CityOptions) {
    super(scene, options, CityDepth.Clock, 0.36);
  }

  protected override draw(layout: CityLayout): void {
    const { width, unit, groundY, focusX } = layout;
    const panelWidth = unit * 20;
    const panelHeight = unit * 8.4;
    const x = clamp(focusX + unit * 22, panelWidth * 0.7, width - panelWidth * 0.7);
    const y = Math.max(panelHeight, groundY - unit * 42);

    const panel = this.scene.add.graphics();
    panel.fillStyle(0x090b0f, 0.94);
    panel.fillRect(x - panelWidth / 2, y - panelHeight / 2, panelWidth, panelHeight);
    panel.lineStyle(Math.max(1, unit * 0.2), PALETTE.accent, 0.35);
    panel.strokeRect(x - panelWidth / 2, y - panelHeight / 2, panelWidth, panelHeight);
    panel.fillStyle(PALETTE.accent, 0.28);
    panel.fillRect(x - panelWidth / 2, y - panelHeight / 2, unit * 2.4, unit * 0.5);
    panel.fillRect(
      x + panelWidth / 2 - unit * 2.4,
      y + panelHeight / 2 - unit * 0.5,
      unit * 2.4,
      unit * 0.5,
    );
    panel.fillStyle(PALETTE.silhouette, 1);
    panel.fillRect(x - unit * 0.4, y + panelHeight / 2, unit * 0.8, unit * 3);

    this.container.add(panel);

    const label = this.scene.add.text(x, y, this.formatTime(), {
      fontFamily: 'ui-monospace, "SFMono-Regular", "Roboto Mono", Menlo, Consolas, monospace',
      fontSize: `${Math.round(unit * 4)}px`,
      color: CSS_COLORS.accent,
    });

    label.setOrigin(0.5, 0.5);
    label.setAlpha(0.9);

    this.container.add(label);
    this.label = label;
  }

  public override update(delta: number): void {
    if (!this.label || !this.motionEnabled) {
      return;
    }

    this.elapsed += delta;

    if (this.elapsed < MS_PER_CITY_MINUTE) {
      return;
    }

    this.elapsed -= MS_PER_CITY_MINUTE;
    this.minutes = (this.minutes + 1) % (24 * 60);

    if (!this.glitching) {
      this.label.setText(this.formatTime());
    }
  }

  /** Кратковременный визуальный сбой. Без звука и без объяснений. */
  public glitch(): void {
    const label = this.label;

    if (!label || this.glitching) {
      return;
    }

    this.glitching = true;

    const originalX = label.x;

    label.setText(this.scrambleTime());
    label.setColor(CSS_COLORS.cold);
    label.setX(originalX + 2);

    this.trackTimer(
      this.scene.time.delayedCall(90, () => {
        label.setText(this.scrambleTime());
        label.setX(originalX - 2);
      }),
    );

    this.trackTimer(
      this.scene.time.delayedCall(200, () => {
        label.setText(this.formatTime());
        label.setColor(CSS_COLORS.accent);
        label.setX(originalX);
        this.glitching = false;
      }),
    );
  }

  private formatTime(): string {
    const hours = Math.floor(this.minutes / 60) % 24;
    const minutes = this.minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private scrambleTime(): string {
    let result = '';

    for (let i = 0; i < 5; i += 1) {
      if (i === 2) {
        result += ':';
        continue;
      }

      result += GLITCH_CHARS.charAt(Math.floor(Math.random() * GLITCH_CHARS.length));
    }

    return result;
  }
}
