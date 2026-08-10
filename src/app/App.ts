import Phaser from 'phaser';
import { onSystemMotionPreferenceChange } from '../core/motion';
import { setLocale } from '../data/localization';
import { createGameConfig } from '../game/config/GameConfig';
import { ViewportManager } from '../game/config/ViewportManager';
import { settingsService } from '../services/SettingsService';
import { UIManager } from '../ui/UIManager';
import { applyDomSettings, applyGameSettings } from './applySettings';

/** Точка сборки приложения: интерфейс, движок и настройки. */
export function startApp(): void {
  const gameRoot = document.getElementById('game-root');
  const uiRoot = document.getElementById('ui-root');

  if (!gameRoot || !uiRoot) {
    throw new Error('Не найдены контейнеры #game-root и #ui-root в index.html');
  }

  setLocale('ru-RU');
  applyDomSettings(settingsService.get());

  const ui = new UIManager(uiRoot);
  ui.start();

  const game = new Phaser.Game(createGameConfig(gameRoot, settingsService.get()));
  const viewport = new ViewportManager(game, gameRoot);
  viewport.start();

  game.events.once('ready', () => {
    applyGameSettings(game, settingsService.get());
  });

  settingsService.onChange((settings) => {
    applyDomSettings(settings);
    applyGameSettings(game, settings);
  });

  onSystemMotionPreferenceChange(() => {
    applyDomSettings(settingsService.get());
  });
}
