import * as Phaser from 'phaser';
import { bus } from '../../core/bus';
import { isMotionEnabled, resolveQualityLevel, settingsService, type GameSettings } from '../../services/SettingsService';
import { saveService } from '../../services/SaveService';
import type { AppearancePreset, ClothingPreset } from '../../data/game/player';
import { Cityscape } from '../systems/city/Cityscape';
import type { CityOptions } from '../systems/city/types';
import { SceneKeys } from './SceneKeys';

const FADE_DURATION = 520;
export class MainMenuScene extends Phaser.Scene {
  private cityscape: Cityscape | null = null;
  private cityOptions: CityOptions | null = null;
  private readonly subscriptions: Array<() => void> = [];
  private leaving = false;
  public constructor() { super(SceneKeys.MainMenu); }
  public create(): void { this.leaving = false; this.buildCity(); const motion = isMotionEnabled(settingsService.get()); this.cameras.main.fadeIn(motion ? 700 : 0, 0, 0, 0); bus.emit('menu:enter'); this.subscriptions.push(bus.on('ui:new-game', () => bus.emit('character:enter'))); this.subscriptions.push(bus.on('ui:character-cancel', () => { bus.emit('character:leave'); bus.emit('menu:enter'); })); this.subscriptions.push(bus.on('ui:character-start', (data) => this.startNewGame(data.name, data.appearancePreset, data.clothingPreset))); this.subscriptions.push(bus.on('ui:continue', () => this.continueGame())); this.subscriptions.push(settingsService.onChange((settings) => this.handleSettings(settings))); this.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this); this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this); this.events.once('shutdown', () => this.handleShutdown()); }
  public override update(_time: number, delta: number): void { this.cityscape?.update(delta); }
  private buildCity(): void { const settings = settingsService.get(); this.cityOptions = { variant: 'menu', quality: resolveQualityLevel(settings.quality), motion: isMotionEnabled(settings) }; this.cityscape?.destroy(); this.cityscape = new Cityscape(this, this.cityOptions); this.cityscape.build(this.scale.width, this.scale.height, 'menu'); }
  private handleSettings(settings: GameSettings): void { const quality = resolveQualityLevel(settings.quality); const motion = isMotionEnabled(settings); if (this.cityOptions && this.cityOptions.quality === quality && this.cityOptions.motion === motion) return; this.buildCity(); }
  private handleResize(): void { this.cityscape?.build(this.scale.width, this.scale.height, 'menu'); }
  private handlePointerMove(pointer: Phaser.Input.Pointer): void { if (!this.cityscape) return; this.cityscape.setParallaxTarget(-((pointer.x / this.scale.width) * 2 - 1), -((pointer.y / this.scale.height) * 2 - 1)); }
  private continueGame(): void { if (saveService.hasSave()) this.leaveToGame(); }
  private startNewGame(name: string, appearancePreset: AppearancePreset, clothingPreset: ClothingPreset): void { saveService.createNew({ name, appearancePreset, clothingPreset }); this.leaveToGame(); }
  private leaveToGame(): void { if (this.leaving) return; this.leaving = true; bus.emit('menu:leave'); const motion = isMotionEnabled(settingsService.get()); this.cameras.main.fadeOut(motion ? FADE_DURATION : 120, 0, 0, 0); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(SceneKeys.Game)); }
  private handleShutdown(): void { for (const unsubscribe of this.subscriptions) unsubscribe(); this.subscriptions.length = 0; this.input.off(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this); this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this); this.cityscape?.destroy(); this.cityscape = null; }
}
