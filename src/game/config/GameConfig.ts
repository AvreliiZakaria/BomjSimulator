import Phaser from 'phaser';
import { getDevicePixelRatio } from '../../core/device';
import type { GameSettings } from '../../services/SettingsService';
import { PALETTE } from './palette';
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { GameScene } from '../scenes/GameScene';

/**
 * Канвас живёт в физических пикселях (размер * DPR), а на экране показывается
 * через zoom = 1 / DPR. Так картинка не мылится на retina и телефонах.
 */
export function createGameConfig(
  parent: HTMLElement,
  settings: GameSettings,
): Phaser.Types.Core.GameConfig {
  const ratio = getDevicePixelRatio();
  const width = Math.max(1, Math.round(parent.clientWidth * ratio));
  const height = Math.max(1, Math.round(parent.clientHeight * ratio));

  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: PALETTE.night,
    disableContextMenu: true,
    banner: false,
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER,
      width,
      height,
      zoom: 1 / ratio,
      autoRound: true,
    },
    render: {
      antialias: true,
      roundPixels: false,
    },
    fps: {
      target: settings.fps,
      limit: settings.fps,
      smoothStep: true,
    },
    scene: [BootScene, PreloadScene, MainMenuScene, GameScene],
  };
}
