import type Phaser from 'phaser';
import { clamp, damp } from '../../../core/math';
import { SkyLayer } from './layers/SkyLayer';
import { FAR_SKYLINE, MID_SKYLINE, SkylineLayer } from './layers/SkylineLayer';
import { StreetLayer } from './layers/StreetLayer';
import { FogLayer } from './layers/FogLayer';
import { ForegroundLayer } from './layers/ForegroundLayer';
import { CityClock } from './CityClock';
import { AnomalyDirector } from './AnomalyDirector';
import type { CityLayer, CityLayout, CityOptions, CityVariant } from './types';

const PARALLAX_SMOOTHING = 0.08;

/**
 * Временный процедурный город: собирается из простых фигур, без картинок и видео.
 * Позже слои заменяются на настоящую графику по одному, не трогая остальные.
 */
export class Cityscape {
  private readonly sky: SkyLayer;

  private readonly farSkyline: SkylineLayer;

  private readonly midSkyline: SkylineLayer;

  private readonly clock: CityClock;

  private readonly street: StreetLayer;

  private readonly fog: FogLayer;

  private readonly foreground: ForegroundLayer;

  private readonly layers: CityLayer[];

  private readonly anomalies: AnomalyDirector;

  private layout: CityLayout | null = null;

  private targetX = 0;

  private targetY = 0;

  private currentX = 0;

  private currentY = 0;

  public constructor(scene: Phaser.Scene, options: CityOptions) {
    this.sky = new SkyLayer(scene, options);
    this.farSkyline = new SkylineLayer(scene, options, FAR_SKYLINE);
    this.midSkyline = new SkylineLayer(scene, options, MID_SKYLINE);
    this.clock = new CityClock(scene, options);
    this.street = new StreetLayer(scene, options);
    this.fog = new FogLayer(scene, options);
    this.foreground = new ForegroundLayer(scene, options);

    this.layers = [
      this.sky,
      this.farSkyline,
      this.midSkyline,
      this.clock,
      this.street,
      this.fog,
      this.foreground,
    ];

    this.anomalies = new AnomalyDirector(scene, options, {
      flickerLamp: () => this.street.flickerLamp(),
      glitchClock: () => this.clock.glitch(),
      spawnStranger: () => this.street.spawnStranger(),
    });
  }

  public build(width: number, height: number, variant: CityVariant): void {
    const unit = height / 100;
    const isStreet = variant === 'street';
    const isWide = width / height >= 1.35;
    const groundY = height * (isStreet ? 0.74 : 0.84);
    const streetTop = groundY + Math.max(unit * 4, (height - groundY) * 0.34);

    this.layout = {
      width,
      height,
      unit,
      groundY,
      streetTop,
      focusX: isWide ? width * 0.62 : width * 0.5,
      buildingScale: isStreet ? 1.25 : 1,
    };

    for (const layer of this.layers) {
      layer.build(this.layout);
    }

    this.anomalies.start();
  }

  /** Значения в диапазоне -1..1. На тач-устройствах остаётся 0. */
  public setParallaxTarget(x: number, y: number): void {
    this.targetX = clamp(x, -1, 1);
    this.targetY = clamp(y, -1, 1);
  }

  public update(delta: number): void {
    this.currentX = damp(this.currentX, this.targetX, PARALLAX_SMOOTHING, delta);
    this.currentY = damp(this.currentY, this.targetY, PARALLAX_SMOOTHING, delta);

    for (const layer of this.layers) {
      layer.setParallax(this.currentX, this.currentY);
      layer.update(delta);
    }
  }

  public destroy(): void {
    this.anomalies.destroy();

    for (const layer of this.layers) {
      layer.destroy();
    }
  }
}
