import type Phaser from 'phaser';
import { BaseCityLayer } from '../BaseCityLayer';
import { CityDepth, type CityLayout, type CityOptions } from '../types';
import { PALETTE } from '../../../config/palette';
import { Rng } from '../../../utils/Rng';
import type { QualityLevel } from '../../../../services/SettingsService';

/** Phaser.BlendModes.ADD. Числом, чтобы не тянуть рантайм Phaser в слой. */
const BLEND_ADD = 1;

const MAX_CARS: Record<QualityLevel, number> = {
  low: 1,
  medium: 1,
  high: 2,
};

/** Уровень улицы: асфальт, тротуар, фонари, голуби, редкие машины и прохожие. */
export class StreetLayer extends BaseCityLayer {
  private readonly lampGlows: Phaser.GameObjects.Container[] = [];

  private readonly rng = new Rng(4242);

  private activeCars = 0;

  public constructor(scene: Phaser.Scene, options: CityOptions) {
    super(scene, options, CityDepth.Street, 0.62);
  }

  protected override draw(layout: CityLayout): void {
    this.lampGlows.length = 0;
    this.activeCars = 0;

    const { width, height, unit, groundY, streetTop, focusX } = layout;
    const left = -width * 0.2;
    const spread = width * 1.4;

    const graphics = this.scene.add.graphics();

    graphics.fillStyle(PALETTE.sidewalk, 1);
    graphics.fillRect(left, groundY, spread, streetTop - groundY);

    for (let x = left; x < left + spread; x += unit * 7) {
      graphics.fillStyle(PALETTE.silhouette, 0.3);
      graphics.fillRect(x, groundY, Math.max(1, unit * 0.18), streetTop - groundY);
    }

    graphics.fillStyle(PALETTE.curb, 1);
    graphics.fillRect(left, streetTop - unit * 1.1, spread, unit * 1.1);

    graphics.fillStyle(PALETTE.road, 1);
    graphics.fillRect(left, streetTop, spread, height - streetTop + unit * 3);

    for (let i = 0; i < 4; i += 1) {
      graphics.fillStyle(PALETTE.roadLight, 0.04);
      graphics.fillRect(left, streetTop + (height - streetTop) * (0.18 + i * 0.2), spread, unit * 0.9);
    }

    const dashY = streetTop + (height - streetTop) * 0.52;
    for (let x = left; x < left + spread; x += unit * 13) {
      graphics.fillStyle(0x6a6559, 0.2);
      graphics.fillRect(x, dashY, unit * 6, unit * 0.6);
    }

    this.container.add(graphics);

    this.drawProps(layout);

    const lampPositions = [
      focusX - unit * 74,
      focusX - unit * 28,
      focusX + unit * 18,
      focusX + unit * 64,
    ].filter((x) => x > -unit * 12 && x < width + unit * 12);

    for (const x of lampPositions) {
      this.createLamp(x, layout);
    }

    this.createPigeons(layout);

    if (this.motionEnabled) {
      this.trackTimer(
        this.scene.time.addEvent({
          delay: 5200,
          loop: true,
          callback: this.maybeSpawnCar,
          callbackScope: this,
        }),
      );
    }
  }

  /** Резкое мигание случайного фонаря. Вызывается очень редко. */
  public flickerLamp(): void {
    if (this.lampGlows.length === 0) {
      return;
    }

    const glow = this.rng.pick(this.lampGlows);

    this.track(
      this.scene.tweens.add({
        targets: glow,
        alpha: 0.12,
        duration: 70,
        yoyo: true,
        repeat: 3,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          glow.setAlpha(1);
        },
      }),
    );
  }

  /** Странный силуэт на тротуаре. Появляется и уходит, ничего не объясняя. */
  public spawnStranger(): void {
    const layout = this.layout;

    if (!layout || !this.motionEnabled) {
      return;
    }

    const { unit, groundY, focusX, width } = layout;
    const direction = this.rng.chance(0.5) ? 1 : -1;
    const startX = Math.min(
      Math.max(focusX + this.rng.range(-30, 30) * unit, unit * 8),
      width - unit * 8,
    );

    const figure = this.scene.add.container(startX, groundY);
    const body = this.scene.add.graphics();

    body.fillStyle(PALETTE.silhouette, 1);
    body.fillRect(-unit * 1.5, -unit * 8.4, unit * 3, unit * 8.4);
    body.fillCircle(0, -unit * 9.6, unit * 1.5);
    body.fillRect(-unit * 2.6, -unit * 7.6, unit * 5.2, unit * 2.2);

    figure.add(body);
    figure.setAlpha(0);
    this.container.add(figure);

    this.track(
      this.scene.tweens.add({
        targets: figure,
        alpha: 0.85,
        duration: 900,
        ease: 'Sine.easeOut',
      }),
    );

    this.track(
      this.scene.tweens.add({
        targets: figure,
        x: startX + direction * unit * 14,
        duration: 7000,
        ease: 'Linear',
      }),
    );

    this.track(
      this.scene.tweens.add({
        targets: figure,
        alpha: 0,
        delay: 4200,
        duration: 1400,
        ease: 'Sine.easeIn',
        onComplete: () => {
          figure.destroy();
        },
      }),
    );
  }

  private drawProps(layout: CityLayout): void {
    const { unit, groundY, focusX } = layout;
    const graphics = this.scene.add.graphics();

    const binX = focusX + unit * 26;
    graphics.fillStyle(PALETTE.silhouette, 0.95);
    graphics.fillRect(binX, groundY - unit * 5.4, unit * 3.4, unit * 5.4);
    graphics.fillRect(binX - unit * 0.4, groundY - unit * 6, unit * 4.2, unit * 0.7);

    const boxX = focusX - unit * 40;
    graphics.fillStyle(0x14100c, 1);
    graphics.fillRect(boxX, groundY - unit * 3.2, unit * 9, unit * 3.2);
    graphics.fillStyle(0x1a1510, 1);
    graphics.fillRect(boxX + unit * 1.2, groundY - unit * 4.4, unit * 6, unit * 1.3);

    const benchX = focusX - unit * 12;
    graphics.fillStyle(PALETTE.silhouette, 0.9);
    graphics.fillRect(benchX, groundY - unit * 3.4, unit * 14, unit * 0.9);
    graphics.fillRect(benchX + unit * 0.8, groundY - unit * 3.4, unit * 0.8, unit * 3.4);
    graphics.fillRect(benchX + unit * 12.4, groundY - unit * 3.4, unit * 0.8, unit * 3.4);

    this.container.add(graphics);
  }

  private createLamp(x: number, layout: CityLayout): void {
    const { unit, groundY } = layout;
    const poleHeight = unit * 34;
    const bulbX = unit * 4.6;
    const bulbY = -poleHeight + unit * 1.2;

    const lamp = this.scene.add.container(x, groundY);

    const pole = this.scene.add.graphics();
    pole.fillStyle(PALETTE.silhouette, 1);
    pole.fillRect(-unit * 0.45, -poleHeight, unit * 0.9, poleHeight);
    pole.fillRect(-unit * 0.45, -poleHeight, unit * 5.4, unit * 0.7);
    pole.fillRect(-unit * 1.6, -unit * 1.1, unit * 3.2, unit * 1.1);
    pole.fillRect(bulbX - unit * 1.4, bulbY - unit * 0.6, unit * 2.8, unit * 0.9);

    const glow = this.scene.add.container(0, 0);

    const cone = this.scene.add.graphics();
    cone.fillStyle(PALETTE.lampGlow, 0.05);
    cone.fillTriangle(bulbX - unit * 1.3, bulbY, bulbX + unit * 1.3, bulbY, bulbX + unit * 9, 0);
    cone.fillTriangle(bulbX - unit * 1.3, bulbY, bulbX + unit * 9, 0, bulbX - unit * 9, 0);

    const halo = this.scene.add.graphics();
    halo.setBlendMode(BLEND_ADD);
    halo.fillStyle(PALETTE.lampGlow, 0.05);
    halo.fillEllipse(bulbX, bulbY, unit * 22, unit * 22);
    halo.fillStyle(PALETTE.lampGlow, 0.07);
    halo.fillEllipse(bulbX, bulbY, unit * 12, unit * 12);
    halo.fillStyle(PALETTE.lamp, 0.5);
    halo.fillEllipse(bulbX, bulbY, unit * 2.6, unit * 1.6);
    halo.fillStyle(PALETTE.lampGlow, 0.09);
    halo.fillEllipse(bulbX, unit * 0.4, unit * 15, unit * 2.6);

    glow.add([cone, halo]);
    lamp.add([pole, glow]);
    this.container.add(lamp);
    this.lampGlows.push(glow);

    if (this.motionEnabled && this.options.quality !== 'low' && this.rng.chance(0.5)) {
      this.track(
        this.scene.tweens.add({
          targets: glow,
          alpha: this.rng.range(0.82, 0.9),
          duration: this.rng.range(1800, 3600),
          delay: this.rng.range(0, 2500),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        }),
      );
    }
  }

  private createPigeons(layout: CityLayout): void {
    const { unit, groundY, focusX } = layout;
    const count = this.options.quality === 'low' ? 1 : this.options.quality === 'medium' ? 2 : 3;

    for (let i = 0; i < count; i += 1) {
      const x = focusX + this.rng.range(-8, 34) * unit;
      const pigeon = this.scene.add.container(x, groundY - unit * 0.6);
      const body = this.scene.add.graphics();

      body.fillStyle(PALETTE.silhouette, 0.92);
      body.fillEllipse(0, -unit * 0.9, unit * 2.2, unit * 1.4);
      body.fillCircle(unit * 1, -unit * 1.7, unit * 0.5);
      body.fillRect(unit * 1.4, -unit * 1.8, unit * 0.7, unit * 0.2);

      pigeon.add(body);
      this.container.add(pigeon);

      if (!this.motionEnabled) {
        continue;
      }

      this.trackTimer(
        this.scene.time.addEvent({
          delay: this.rng.range(2400, 4200),
          loop: true,
          callback: () => {
            if (!this.rng.chance(0.55)) {
              return;
            }

            this.track(
              this.scene.tweens.add({
                targets: pigeon,
                y: pigeon.y - unit * 1.4,
                x: pigeon.x + this.rng.range(-2.5, 2.5) * unit,
                duration: 190,
                yoyo: true,
                ease: 'Quad.easeOut',
              }),
            );
          },
        }),
      );
    }
  }

  private maybeSpawnCar(): void {
    const layout = this.layout;

    if (!layout || this.activeCars >= MAX_CARS[this.options.quality]) {
      return;
    }

    if (!this.rng.chance(0.45)) {
      return;
    }

    this.spawnCar(layout);
  }

  private spawnCar(layout: CityLayout): void {
    const { width, height, unit, streetTop } = layout;
    const toRight = this.rng.chance(0.5);
    const scale = toRight ? 1 : 0.84;
    const lane = toRight ? 0.74 : 0.34;
    const y = streetTop + (height - streetTop) * lane;
    const carWidth = unit * 15 * scale;
    const carHeight = unit * 4.2 * scale;
    const startX = toRight ? -carWidth * 1.6 : width + carWidth * 1.6;
    const endX = toRight ? width + carWidth * 1.6 : -carWidth * 1.6;
    const direction = toRight ? 1 : -1;

    const car = this.scene.add.container(startX, y);
    const body = this.scene.add.graphics();

    body.fillStyle(0x0a0b0f, 1);
    body.fillRect(-carWidth / 2, -carHeight, carWidth, carHeight);
    body.fillRect(-carWidth * 0.28, -carHeight * 1.7, carWidth * 0.56, carHeight * 0.8);
    body.fillStyle(0x2b3038, 0.55);
    body.fillRect(-carWidth * 0.24, -carHeight * 1.6, carWidth * 0.2, carHeight * 0.55);
    body.fillRect(carWidth * 0.04, -carHeight * 1.6, carWidth * 0.2, carHeight * 0.55);

    const lights = this.scene.add.graphics();
    lights.setBlendMode(BLEND_ADD);
    lights.fillStyle(PALETTE.lamp, 0.5);
    lights.fillEllipse(direction * carWidth * 0.5, -carHeight * 0.55, unit * 1.6, unit * 1.1);
    lights.fillStyle(PALETTE.lampGlow, 0.08);
    lights.fillEllipse(direction * carWidth * 0.95, -carHeight * 0.5, unit * 16, unit * 3.4);
    lights.fillStyle(0xc4453a, 0.45);
    lights.fillEllipse(-direction * carWidth * 0.5, -carHeight * 0.55, unit * 1.1, unit * 0.9);

    car.add([lights, body]);
    this.container.add(car);
    this.activeCars += 1;

    this.track(
      this.scene.tweens.add({
        targets: car,
        x: endX,
        duration: this.rng.range(3600, 6200),
        ease: 'Linear',
        onComplete: () => {
          this.activeCars = Math.max(0, this.activeCars - 1);
          car.destroy();
        },
      }),
    );
  }
}
