import type Phaser from 'phaser';
import {
  isMotionEnabled,
  resolveQualityLevel,
  UI_SCALE_FACTORS,
  type GameSettings,
} from '../services/SettingsService';
import { applyFpsLimit } from '../game/utils/applyFpsLimit';

/** Настройки, влияющие на DOM-интерфейс. */
export function applyDomSettings(settings: GameSettings): void {
  const root = document.documentElement;

  root.style.setProperty('--ui-scale', String(UI_SCALE_FACTORS[settings.uiScale]));
  root.dataset.uiScale = settings.uiScale;
  root.dataset.quality = resolveQualityLevel(settings.quality);
  root.dataset.reduceMotion = String(!isMotionEnabled(settings));
}

/** Настройки, влияющие на сам движок. */
export function applyGameSettings(game: Phaser.Game, settings: GameSettings): void {
  game.sound.volume = settings.volumeMaster;
  applyFpsLimit(game, settings.fps);
}
