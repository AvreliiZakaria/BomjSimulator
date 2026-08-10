import * as Phaser from 'phaser';
import { bus } from '../../core/bus';
import { isMotionEnabled, settingsService } from '../../services/SettingsService';
import { saveService } from '../../services/SaveService';
import { Player } from '../entities/Player';
import { PlayerController } from '../systems/player/PlayerController';
import { StreetSlice } from '../systems/street/StreetSlice';
import { GameTimeService } from '../systems/time/GameTimeService';
import { SceneKeys } from './SceneKeys';

const SPEED = 170;
export class GameScene extends Phaser.Scene {
  private street: StreetSlice | null = null;
  private player: Player | null = null;
  private controller: PlayerController | null = null;
  private gameTime: GameTimeService | null = null;
  private paused = false;
  private leaving = false;
  private lastTimeKey = '';
  private readonly subscriptions: Array<() => void> = [];
  public constructor() { super(SceneKeys.Game); }

  public create(): void {
    const save = saveService.load();
    if (!save) { this.scene.start(SceneKeys.MainMenu); return; }
    this.paused = false; this.leaving = false;
    const motion = isMotionEnabled(settingsService.get());
    this.street = new StreetSlice(this, this.scale.width, this.scale.height);
    this.player = new Player(this, save.player.appearancePreset, save.player.clothingPreset);
    this.player.setPosition(save.position.x, save.position.y);
    this.controller = new PlayerController(this);
    this.gameTime = new GameTimeService({ day: save.world.day, hour: save.world.time.hour, minute: save.world.time.minute });
    this.lastTimeKey = `${save.world.day}:${save.world.time.hour}:${save.world.time.minute}`;
    this.cameras.main.setBounds(0, 0, this.street.worldWidth, this.scale.height);
    this.cameras.main.setScroll(this.clampCameraX(save.position.x - this.scale.width * 0.45), 0);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(this.scale.width * 0.22, this.scale.height * 0.18);
    this.cameras.main.fadeIn(motion ? 600 : 0, 0, 0, 0);
    bus.emit('game:enter', { day: save.world.day, money: save.economy.money, time: save.world.time, district: save.world.district, name: save.player.name });
    this.subscriptions.push(bus.on('ui:pause', () => { this.paused = true; }));
    this.subscriptions.push(bus.on('ui:resume', () => { this.paused = false; }));
    this.subscriptions.push(bus.on('ui:joystick', (vector) => this.controller?.setJoystick(vector)));
    this.input.keyboard?.on('keydown-ESC', this.togglePause, this);
    this.subscriptions.push(bus.on('ui:exit-to-menu', () => this.leaveToMenu()));
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once('shutdown', () => this.handleShutdown());
  }

  public override update(_time: number, delta: number): void {
    if (!this.player || !this.controller || !this.street || !this.gameTime || this.paused) return;
    const vector = this.controller.getVector(); const moving = vector.x !== 0 || vector.y !== 0;
    this.player.setMoving(moving); this.player.x = Phaser.Math.Clamp(this.player.x + vector.x * SPEED * delta / 1000, 30, this.street.worldWidth - 30); this.player.y = Phaser.Math.Clamp(this.player.y + vector.y * SPEED * delta / 1000, this.street.walkTop, this.street.walkBottom); this.player.updateVisual(delta); this.gameTime.update(delta); this.street.update();
    const time = this.gameTime.get(); const timeKey = `${time.day}:${time.hour}:${time.minute}`;
    if (timeKey !== this.lastTimeKey) { this.lastTimeKey = timeKey; bus.emit('game:time', time); }
  }

  private togglePause(): void { if (!this.paused) bus.emit('ui:pause'); else bus.emit('ui:resume'); }
  private clampCameraX(value: number): number { return Phaser.Math.Clamp(value, 0, Math.max(0, (this.street?.worldWidth ?? this.scale.width) - this.scale.width)); }
  private handleResize(): void { if (!this.street || !this.player) return; this.cameras.main.setBounds(0, 0, this.street.worldWidth, this.scale.height); }
  private leaveToMenu(): void { if (this.leaving || !this.player || !this.gameTime) return; this.leaving = true; const save = saveService.load(); const time = this.gameTime.get(); if (save) saveService.update({ position: this.player.getPosition(), world: { ...save.world, day: time.day, time: { hour: time.hour, minute: time.minute } } }); bus.emit('game:leave'); const motion = isMotionEnabled(settingsService.get()); this.cameras.main.fadeOut(motion ? 420 : 120, 0, 0, 0); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(SceneKeys.MainMenu)); }
  private handleShutdown(): void { for (const unsubscribe of this.subscriptions) unsubscribe(); this.subscriptions.length = 0; this.input.keyboard?.off('keydown-ESC', this.togglePause, this); this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this); this.street?.destroy(); this.street = null; this.player?.destroy(); this.player = null; }
}
