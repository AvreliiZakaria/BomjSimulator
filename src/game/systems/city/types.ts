import type { QualityLevel } from '../../../services/SettingsService';

export type CityVariant = 'menu' | 'street';

export interface CityOptions {
  variant: CityVariant;
  quality: QualityLevel;
  motion: boolean;
}

export interface CityLayout {
  /** Размеры канваса в физических пикселях. */
  width: number;
  height: number;
  /** Базовая единица размера: 1% высоты экрана. */
  unit: number;
  /** Линия тротуара, на которой стоят здания. */
  groundY: number;
  /** Верхняя граница проезжей части. */
  streetTop: number;
  /** Смысловой центр сцены: на широких экранах смещён вправо от меню. */
  focusX: number;
  /** Множитель высоты застройки для разных вариантов сцены. */
  buildingScale: number;
}

export interface CityLayer {
  build(layout: CityLayout): void;
  setParallax(x: number, y: number): void;
  update(delta: number): void;
  destroy(): void;
}

export const CityDepth = {
  Sky: 0,
  FarSkyline: 10,
  MidSkyline: 20,
  Clock: 25,
  Street: 30,
  Fog: 40,
  Foreground: 50,
} as const;

export const QUALITY_FACTOR: Record<QualityLevel, number> = {
  low: 0.45,
  medium: 0.75,
  high: 1,
};
