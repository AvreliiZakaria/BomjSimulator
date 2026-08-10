import type Phaser from 'phaser';
import { BaseCityLayer } from '../BaseCityLayer';
import { CityDepth, type CityLayout, type CityOptions } from '../types';
import { PALETTE } from '../../../config/palette';

/** Тёмный передний план: даёт глубину и «съедает» края канваса при параллаксе. */
export class ForegroundLayer extends BaseCityLayer {
  public constructor(scene: Phaser.Scene, options: CityOptions) {
    super(scene, options, CityDepth.Foreground, 1);
  }

  protected override draw(layout: CityLayout): void {
    const { width, height, unit } = layout;
    const graphics = this.scene.add.graphics();

    // Нижняя кромка кадра
    graphics.fillStyle(PALETTE.silhouette, 0.92);
    graphics.fillRect(-width * 0.2, height - unit * 4.5, width * 1.4, unit * 6);

    // Размытый столб слева и обрывок ограждения справа
    graphics.fillStyle(PALETTE.silhouette, 0.8);
    graphics.fillRect(-unit * 2, height - unit * 46, unit * 4.6, unit * 46);

    graphics.fillStyle(PALETTE.silhouette, 0.7);
    for (let i = 0; i < 5; i += 1) {
      graphics.fillRect(width - unit * (9 - i * 2.2), height - unit * 12, unit * 0.7, unit * 12);
    }
    graphics.fillRect(width - unit * 10, height - unit * 12, unit * 12, unit * 0.7);

    this.container.add(graphics);
  }
}
