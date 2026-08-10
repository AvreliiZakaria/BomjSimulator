import * as Phaser from 'phaser';
import { SceneKeys } from './SceneKeys';

/** Первичная инициализация. Ничего тяжёлого здесь быть не должно. */
export class BootScene extends Phaser.Scene {
  public constructor() {
    super(SceneKeys.Boot);
  }

  public create(): void {
    this.scene.start(SceneKeys.Preload);
  }
}
