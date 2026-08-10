import Phaser from 'phaser';
import { bus } from '../../core/bus';
import { isMotionEnabled, settingsService } from '../../services/SettingsService';
import { SceneKeys } from './SceneKeys';

/**
 * Реальных ассетов пока почти нет, но система загрузки уже настоящая:
 * прогресс бара = минимум из «времени показа» и фактического прогресса загрузчика.
 */
export class PreloadScene extends Phaser.Scene {
  private loaderProgress = 1;

  private finished = false;

  public constructor() {
    super(SceneKeys.Preload);
  }

  public preload(): void {
    this.load.on('progress', this.handleLoaderProgress, this);

    // Ассеты добавляются здесь:
    // this.load.image('key', 'assets/images/key.png');
  }

  public create(): void {
    const motion = isMotionEnabled(settingsService.get());
    const duration = motion ? 1500 : 400;
    const state = { value: 0 };

    this.tweens.add({
      targets: state,
      value: 1,
      duration,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        bus.emit('preload:progress', Math.min(state.value, this.loaderProgress));
      },
      onComplete: () => {
        if (this.loaderProgress >= 1) {
          this.finish();
        } else {
          this.load.once('complete', () => this.finish());
        }
      },
    });
  }

  private handleLoaderProgress(value: number): void {
    this.loaderProgress = value;
  }

  private finish(): void {
    if (this.finished) {
      return;
    }

    this.finished = true;
    bus.emit('preload:progress', 1);
    bus.emit('preload:complete');

    this.time.delayedCall(380, () => {
      this.scene.start(SceneKeys.MainMenu);
    });
  }
}
