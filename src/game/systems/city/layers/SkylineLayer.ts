import type Phaser from 'phaser';
import { BaseCityLayer } from '../BaseCityLayer';
import { CityDepth, QUALITY_FACTOR, type CityLayout, type CityOptions } from '../types';
import { PALETTE } from '../../../config/palette';
import { Rng } from '../../../utils/Rng';

export interface SkylineConfig {
  seed: number;
  color: number;
  /** На сколько единиц выше линии тротуара стоит основание застройки. */
  baseOffset: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  gapMin: number;
  gapMax: number;
  windowStepX: number;
  windowStepY: number;
  windowWidth: number;
  windowHeight: number;
  litChance: number;
  maxWindows: number;
  flickerCount: number;
  roofDetails: boolean;
  depth: number;
  parallax: number;
}

export const FAR_SKYLINE: SkylineConfig = {
  seed: 1337,
  color: PALETTE.buildingFar,
  baseOffset: 5,
  minWidth: 8,
  maxWidth: 17,
  minHeight: 20,
  maxHeight: 48,
  gapMin: 0.6,
  gapMax: 2.6,
  windowStepX: 2.6,
  windowStepY: 3.2,
  windowWidth: 0.9,
  windowHeight: 1.2,
  litChance: 0.26,
  maxWindows: 260,
  flickerCount: 3,
  roofDetails: false,
  depth: CityDepth.FarSkyline,
  parallax: 0.18,
};

export const MID_SKYLINE: SkylineConfig = {
  seed: 24680,
  color: PALETTE.buildingMid,
  baseOffset: 0,
  minWidth: 13,
  maxWidth: 26,
  minHeight: 28,
  maxHeight: 66,
  gapMin: 1,
  gapMax: 3.4,
  windowStepX: 3.6,
  windowStepY: 4.4,
  windowWidth: 1.4,
  windowHeight: 1.9,
  litChance: 0.22,
  maxWindows: 200,
  flickerCount: 4,
  roofDetails: true,
  depth: CityDepth.MidSkyline,
  parallax: 0.36,
};

interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Силуэты домов с окнами. Вся геометрия рисуется один раз в один Graphics. */
export class SkylineLayer extends BaseCityLayer {
  public constructor(
    scene: Phaser.Scene,
    options: CityOptions,
    private readonly config: SkylineConfig,
  ) {
    super(scene, options, config.depth, config.parallax);
  }

  protected override draw(layout: CityLayout): void {
    const { width, unit, groundY, buildingScale } = layout;
    const config = this.config;
    const rng = new Rng(config.seed);
    const quality = QUALITY_FACTOR[this.options.quality];

    const graphics = this.scene.add.graphics();
    const baseY = groundY - config.baseOffset * unit;
    const startX = -width * 0.18;
    const endX = width * 1.18;
    const windowBudget = Math.round(config.maxWindows * quality);
    const litWindows: WindowRect[] = [];

    let x = startX;
    let windowsDrawn = 0;

    while (x < endX) {
      const buildingWidth = rng.range(config.minWidth, config.maxWidth) * unit;
      const buildingHeight =
        rng.range(config.minHeight, config.maxHeight) * unit * buildingScale;
      const top = baseY - buildingHeight;

      graphics.fillStyle(config.color, 1);
      graphics.fillRect(Math.round(x), Math.round(top), Math.ceil(buildingWidth) + 1, Math.ceil(baseY - top));

      if (config.roofDetails) {
        if (rng.chance(0.45)) {
          const boxWidth = buildingWidth * rng.range(0.18, 0.38);
          const boxHeight = unit * rng.range(1.4, 3.2);
          graphics.fillStyle(PALETTE.roofDetail, 1);
          graphics.fillRect(x + buildingWidth * 0.2, top - boxHeight, boxWidth, boxHeight);
        }

        if (rng.chance(0.35)) {
          const antennaX = x + buildingWidth * rng.range(0.5, 0.85);
          const antennaHeight = unit * rng.range(3, 8);
          graphics.fillStyle(config.color, 1);
          graphics.fillRect(antennaX, top - antennaHeight, Math.max(1, unit * 0.22), antennaHeight);
          graphics.fillStyle(0xc4453a, 0.75);
          graphics.fillCircle(antennaX + unit * 0.11, top - antennaHeight, unit * 0.32);
        }
      }

      // Окна
      const insetX = unit * 1.1;
      const insetTop = unit * 1.6;

      for (
        let wy = top + insetTop;
        wy < baseY - unit * 1.6 && windowsDrawn < windowBudget;
        wy += config.windowStepY * unit
      ) {
        for (
          let wx = x + insetX;
          wx < x + buildingWidth - insetX && windowsDrawn < windowBudget;
          wx += config.windowStepX * unit
        ) {
          const windowWidth = config.windowWidth * unit;
          const windowHeight = config.windowHeight * unit;
          const isLit = rng.chance(config.litChance);

          if (isLit) {
            const cold = rng.chance(0.12);
            graphics.fillStyle(cold ? PALETTE.windowCold : PALETTE.windowWarm, rng.range(0.35, 0.9));
            litWindows.push({ x: wx, y: wy, width: windowWidth, height: windowHeight });
          } else {
            graphics.fillStyle(PALETTE.windowDark, 0.55);
          }

          graphics.fillRect(wx, wy, windowWidth, windowHeight);
          windowsDrawn += 1;
        }
      }

      x += buildingWidth + rng.range(config.gapMin, config.gapMax) * unit;
    }

    this.container.add(graphics);

    this.addFlickeringWindows(litWindows, rng);
  }

  private addFlickeringWindows(candidates: WindowRect[], rng: Rng): void {
    if (!this.motionEnabled || this.options.quality === 'low' || candidates.length === 0) {
      return;
    }

    const count = Math.min(this.config.flickerCount, candidates.length);

    for (let i = 0; i < count; i += 1) {
      const rect = rng.pick(candidates);
      const window = this.scene.add.rectangle(
        rect.x + rect.width / 2,
        rect.y + rect.height / 2,
        rect.width,
        rect.height,
        PALETTE.windowWarm,
        0.85,
      );

      this.container.add(window);

      this.track(
        this.scene.tweens.add({
          targets: window,
          alpha: rng.range(0.1, 0.3),
          duration: rng.range(2400, 5200),
          delay: rng.range(0, 6000),
          hold: rng.range(400, 2600),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        }),
      );
    }
  }
}
