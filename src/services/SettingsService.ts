import { Emitter } from '../core/Emitter';
import { isPlainObject, readJson, writeJson } from '../core/storage';
import { isProbablyLowEndDevice, isTouchDevice } from '../core/device';
import { prefersReducedMotion } from '../core/motion';

export type QualitySetting = 'auto' | 'low' | 'medium' | 'high';
export type QualityLevel = 'low' | 'medium' | 'high';
export type FpsSetting = 30 | 60;
export type UiScaleSetting = 'small' | 'normal' | 'large';

export interface GameSettings {
  quality: QualitySetting;
  fps: FpsSetting;
  volumeMaster: number;
  volumeMusic: number;
  volumeSfx: number;
  uiScale: UiScaleSetting;
  reduceMotion: boolean;
}

const STORAGE_KEY = 'nul.settings.v1';

const DEFAULT_SETTINGS: GameSettings = {
  quality: 'auto',
  fps: 60,
  volumeMaster: 0.8,
  volumeMusic: 0.6,
  volumeSfx: 0.8,
  uiScale: 'normal',
  reduceMotion: false,
};

const QUALITY_VALUES: readonly QualitySetting[] = ['auto', 'low', 'medium', 'high'];
const UI_SCALE_VALUES: readonly UiScaleSetting[] = ['small', 'normal', 'large'];

export const UI_SCALE_FACTORS: Record<UiScaleSetting, number> = {
  small: 0.88,
  normal: 1,
  large: 1.16,
};

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function isStoredSettings(value: unknown): value is Partial<GameSettings> {
  return isPlainObject(value);
}

function sanitize(stored: Partial<GameSettings>): GameSettings {
  const quality = QUALITY_VALUES.includes(stored.quality as QualitySetting)
    ? (stored.quality as QualitySetting)
    : DEFAULT_SETTINGS.quality;

  const uiScale = UI_SCALE_VALUES.includes(stored.uiScale as UiScaleSetting)
    ? (stored.uiScale as UiScaleSetting)
    : DEFAULT_SETTINGS.uiScale;

  return {
    quality,
    fps: stored.fps === 30 ? 30 : 60,
    volumeMaster: clamp01(Number(stored.volumeMaster ?? DEFAULT_SETTINGS.volumeMaster)),
    volumeMusic: clamp01(Number(stored.volumeMusic ?? DEFAULT_SETTINGS.volumeMusic)),
    volumeSfx: clamp01(Number(stored.volumeSfx ?? DEFAULT_SETTINGS.volumeSfx)),
    uiScale,
    reduceMotion: stored.reduceMotion === true,
  };
}

/**
 * Единая точка правды по настройкам.
 * UI-компоненты не трогают localStorage напрямую — только этот сервис.
 */
class SettingsService {
  private settings: GameSettings;

  private readonly emitter = new Emitter<{ change: GameSettings }>();

  public constructor() {
    const stored = readJson(STORAGE_KEY, isStoredSettings);
    this.settings = stored ? sanitize(stored) : { ...DEFAULT_SETTINGS };
  }

  public get(): GameSettings {
    return { ...this.settings };
  }

  public set(patch: Partial<GameSettings>): void {
    const next = sanitize({ ...this.settings, ...patch });

    this.settings = next;
    writeJson(STORAGE_KEY, next);
    this.emitter.emit('change', this.get());
  }

  public reset(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    writeJson(STORAGE_KEY, this.settings);
    this.emitter.emit('change', this.get());
  }

  public onChange(handler: (settings: GameSettings) => void): () => void {
    return this.emitter.on('change', handler);
  }
}

export const settingsService = new SettingsService();

/** Превращает настройку качества (включая «Авто») в конкретный уровень. */
export function resolveQualityLevel(setting: QualitySetting): QualityLevel {
  if (setting !== 'auto') {
    return setting;
  }

  if (isProbablyLowEndDevice()) {
    return 'low';
  }

  return isTouchDevice() ? 'medium' : 'high';
}

/** Анимации выключены, если так решил игрок или система. */
export function isMotionEnabled(settings: GameSettings): boolean {
  return !settings.reduceMotion && !prefersReducedMotion();
}
