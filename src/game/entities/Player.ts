import * as Phaser from 'phaser';
import type { AppearancePreset, ClothingPreset } from '../../data/game/player';

const SKIN: Record<AppearancePreset, number> = { 'night-owl': 0xb67e63, 'red-cap': 0xd6a07c, 'quiet-one': 0x8f604d, 'street-poet': 0xc28f70, 'winter-kid': 0xe0ad89, 'lucky-scarf': 0xa97058 };
const HAIR: Record<AppearancePreset, number> = { 'night-owl': 0x171922, 'red-cap': 0x6e3628, 'quiet-one': 0x2a2223, 'street-poet': 0xd6b18a, 'winter-kid': 0xaeb5bd, 'lucky-scarf': 0x20191a };
const COAT: Record<ClothingPreset, number> = { 'old-jacket': 0x4a4d50, hoodie: 0x5d4650, 'worn-sweatshirt': 0x394a4b, 'long-coat': 0x252c39 };

export class Player extends Phaser.GameObjects.Container {
  private readonly art: Phaser.GameObjects.Graphics;
  private readonly shadow: Phaser.GameObjects.Ellipse;
  private bob = 0;
  private moving = false;

  public constructor(scene: Phaser.Scene, appearance: AppearancePreset, clothing: ClothingPreset) {
    super(scene, 0, 0);
    this.art = scene.add.graphics();
    this.shadow = scene.add.ellipse(0, 4, 34, 9, 0x05060a, 0.5);
    this.add([this.shadow, this.art]);
    this.draw(appearance, clothing);
    this.setSize(34, 78);
    this.setDepth(500);
    scene.add.existing(this);
  }

  public setMoving(value: boolean): void { this.moving = value; }
  public updateVisual(delta: number): void {
    this.bob += delta * (this.moving ? 0.018 : 0.004);
    const amount = this.moving ? Math.sin(this.bob) * 1.5 : Math.sin(this.bob) * 0.5;
    this.art.y = amount;
    this.shadow.scaleX = this.moving ? 1 + Math.abs(amount) * 0.018 : 1;
    this.setDepth(Math.round(this.y));
  }
  public getPosition(): { x: number; y: number } { return { x: this.x, y: this.y }; }

  private draw(appearance: AppearancePreset, clothing: ClothingPreset): void {
    const skin = SKIN[appearance];
    const hair = HAIR[appearance];
    const coat = COAT[clothing];
    this.art.fillStyle(coat, 1); this.art.fillRoundedRect(-18, -68, 36, 56, 7);
    this.art.fillStyle(skin, 1); this.art.fillCircle(0, -83, 14);
    this.art.fillStyle(hair, 1); this.art.fillEllipse(0, -94, 28, 14);
    this.art.fillStyle(0x14151b, 1); this.art.fillCircle(-5, -83, 1.5); this.art.fillCircle(5, -83, 1.5);
    this.art.lineStyle(2, 0x4e2b27, 1); this.art.beginPath(); this.art.arc(0, -79, 5, 0.25, 2.9, false); this.art.strokePath();
    this.art.fillStyle(0xe2a648, 0.85); this.art.fillRect(-12, -60, 24, 4);
    if (appearance === 'red-cap') { this.art.fillStyle(0xb5483f, 1); this.art.fillEllipse(0, -98, 30, 9); }
    if (appearance === 'lucky-scarf') { this.art.fillStyle(0xc98f36, 1); this.art.fillRect(-15, -59, 30, 6); }
    if (clothing === 'hoodie') { this.art.lineStyle(2, 0x15171d, 0.8); this.art.strokeCircle(0, -83, 17); }
  }
}
