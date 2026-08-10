import type Phaser from 'phaser';
import { BaseCityLayer } from '../BaseCityLayer';
import { CityDepth, type CityLayout, type CityOptions } from '../types';
import { PALETTE } from '../../../config/palette';
import { Rng } from '../../../utils/Rng';

/** Медленно ползущая дымка над улицей. Несколько крупных эллипсов, без шейдеров. */
export class FogLayer extends BaseCityLayer {
  public constructor(scene: Phaser.Scene, options: CityOptions) {
    super(scene, options, CityDepth.Fog, 0.45);
  }

  protected override draw(layout: CityLayout): void {
    const { width, unit, groundY, streetTop } = layout;
    const rng = new Rng(5150);
    const bands = this.options.quality === 'low' ? 1 : this.options.quality === 'medium' ? 2 : 3;

    for (let i = 0; i < bands; i += 1) {
      const y = rng.range(groundY - unit * 6, streetTop + unit * 4);
      const fog = this.scene.add.ellipse(
        width * rng.range(0.25, 0.75),
        y,
        width * rng.range(0.7, 1.1),
        unit * rng.range(10, 18),
        PALETTE.fog,
        rng.range(0.05, 0.09),
      );

      this.container.add(fog);

      if (!this.motionEnabled) {
        continue;
      }

      this.track(
        this.scene.tweens.add({
          targets: fog,
          x: fog.x + width * rng.range(0.12, 0.26) * (rng.chance(0.5) ? 1 : -1),
          duration: rng.range(26000, 48000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        }),
      );
    }
  }
}
