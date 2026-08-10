import Phaser from 'phaser';
import { bus } from '../../core/bus';
import {
  isMotionEnabled,
  resolveQualityLevel,
  settingsService,
} from '../../services/SettingsService';
import { saveService } from '../../services/SaveService';
import { Cityscape } from '../systems/city/Cityscape';
import { SceneKeys } from './SceneKeys';

/**
 * Пока это техническая пустая игровая сцена: только атмосфера и выход в меню.
 * Персонаж, экономика и остальные системы появятся на следующих этапах.
 */
export class GameScene extends Phaser.Scene {
  private cityscape: Cityscape | null = null;

  private readonly subscriptions: Array<() => void> = [];

  private leaving = false;

  public constructor() {
    super(SceneKeys.Game);
  }

  public create(): void {
    this.leaving = false;

    const settings = settingsService.get();
    const motion = isMotionEnabled(settings);

    this.cityscape = new Cityscape(this, {
      variant: 'street',
      quality: resolveQualityLevel(settings.quality),
      motion,
    });
    this.cityscape.build(this.scale.width, this.scale.height, 'street');

    this.cameras.main.fadeIn(motion ? 700 : 0, 0, 0, 0);

    const save = saveService.load();
    bus.emit('game:enter', { day: save?.day ?? 1 });

    this.subscriptions.push(bus.on('ui:exit-to-menu', () => this.leaveToMenu()));

    this.input.keyboard?.on('keydown-ESC', this.leaveToMenu, this);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once('shutdown', () => this.handleShutdown());
  }

  public override update(_time: number, delta: number): void {
    this.cityscape?.update(delta);
  }

  private handleResize(): void {
    this.cityscape?.build(this.scale.width, this.scale.height, 'street');
  }

  private leaveToMenu(): void {
    if (this.leaving) {
      return;
    }

    this.leaving = true;
    bus.emit('game:leave');

    const motion = isMotionEnabled(settingsService.get());

    this.cameras.main.fadeOut(motion ? 420 : 120, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SceneKeys.MainMenu);
    });
  }

  private handleShutdown(): void {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }

    this.subscriptions.length = 0;

    this.input.keyboard?.off('keydown-ESC', this.leaveToMenu, this);
    this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);

    this.cityscape?.destroy();
    this.cityscape = null;
  }
}
