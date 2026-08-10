import type Phaser from 'phaser';
import { BaseCityLayer } from '../BaseCityLayer';
import { CityDepth, type CityLayout, type CityOptions } from '../types';
import { PALETTE } from '../../../config/palette';
import { mixColor } from '../../../utils/color';
import { Rng } from '../../../utils/Rng';

const GRADIENT_BANDS = 28;

/** Небо: мягкий градиент, редкие звёзды, световое загрязнение над городом. */
export class SkyLayer extends BaseCityLayer {
  public constructor(scene: Phaser.Scene, options: CityOptions) {
    super(scene, options, CityDepth.Sky, 0.06);
  }

  protected override draw(layout: CityLayout): void {
    const { width, height, unit, groundY, focusX } = layout;
    const rng = new Rng(90210);

    const sky = this.scene.add.graphics();
    const bandHeight = Math.ceil(groundY / GRADIENT_BANDS) + 1;

    for (let i = 0; i < GRADIENT_BANDS; i += 1) {
      const t = i / (GRADIENT_BANDS - 1);
      const color =
        t < 0.55
          ? mixColor(PALETTE.skyTop, PALETTE.skyMid, t / 0.55)
          : mixColor(PALETTE.skyMid, PALETTE.skyHorizon, (t - 0.55) / 0.45);

      sky.fillStyle(color, 1);
      sky.fillRect(-width * 0.2, Math.floor(t * groundY), width * 1.4, bandHeight);
    }

    sky.fillStyle(PALETTE.skyHorizon, 1);
    sky.fillRect(-width * 0.2, groundY - 1, width * 1.4, height - groundY + 2);

    this.container.add(sky);

    const starCount = this.options.quality === 'low' ? 24 : 60;
    const stars = this.scene.add.graphics();

    for (let i = 0; i < starCount; i += 1) {
      const x = rng.range(-width * 0.1, width * 1.1);
      const y = rng.range(0, groundY * 0.5);
      const alpha = rng.range(0.08, 0.34);
      const size = rng.range(0.1, 0.24) * unit;

      stars.fillStyle(PALETTE.star, alpha);
      stars.fillRect(x, y, size, size);
    }

    this.container.add(stars);

    // Луна за дымкой
    const moon = this.scene.add.graphics();
    const moonX = focusX - width * 0.22;
    const moonY = groundY * 0.22;
    moon.fillStyle(0xd9d3c4, 0.1);
    moon.fillCircle(moonX, moonY, unit * 5.4);
    moon.fillStyle(0xe8e2d3, 0.42);
    moon.fillCircle(moonX, moonY, unit * 2.4);
    this.container.add(moon);

    // Световое загрязнение над центром города
    const glow = this.scene.add.graphics();
    glow.setBlendMode(0);

    for (let i = 6; i >= 1; i -= 1) {
      glow.fillStyle(PALETTE.skyGlow, 0.028);
      glow.fillEllipse(focusX, groundY + unit * 2, unit * 26 * i, unit * 9 * i);
    }

    this.container.add(glow);
  }
}
