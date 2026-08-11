import * as Phaser from 'phaser';
import type { RoadDefinition } from '../../world/types';
import type { QualityLevel } from '../../../services/SettingsService';

export class TrafficSystem {
  private readonly cars: Phaser.GameObjects.Container[] = [];
  private elapsed = 0;
  private readonly limit: number;
  public constructor(private readonly scene: Phaser.Scene, private readonly roads: RoadDefinition[], quality: QualityLevel) { this.limit = quality === 'low' ? 3 : quality === 'medium' ? 5 : 8; }
  public update(delta: number, multiplier: number): void {
    this.elapsed += delta;
    if (this.elapsed > 1700 / Math.max(0.35, multiplier) && this.cars.length < this.limit) { this.elapsed = 0; this.spawn(); }
    for (const car of [...this.cars]) { car.x += (car.getData('speed') as number) * delta / 1000; if (car.x > 3400) { car.destroy(); this.cars.splice(this.cars.indexOf(car), 1); } }
  }
  public destroy(): void { for (const car of this.cars) car.destroy(); this.cars.length = 0; }
  private spawn(): void {
    const road = this.roads.find((item) => item.direction === 'horizontal'); if (!road) return;
    const car = this.scene.add.container(-100, road.bounds.y + road.bounds.height * (0.35 + Math.random() * 0.3));
    const art = this.scene.add.graphics(); const type = Math.random(); const color = type < 0.33 ? 0x4c5963 : type < 0.66 ? 0x7b4f48 : 0x3f4b42; const width = type < 0.5 ? 70 : 96;
    art.fillStyle(0x05060a, 0.5); art.fillEllipse(0, 14, width + 10, 14); art.fillStyle(color, 1); art.fillRoundedRect(-width / 2, -18, width, 34, 8); art.fillStyle(0x1d2932, 0.9); art.fillRoundedRect(-width * 0.25, -30, width * 0.5, 18, 4); art.fillStyle(0x15181d, 1); art.fillCircle(-width * 0.3, 15, 7); art.fillCircle(width * 0.3, 15, 7); art.fillStyle(0xe2a648, 0.8); art.fillRect(width / 2 - 5, -7, 5, 5);
    car.add(art); car.setDepth(Math.round(car.y)); car.setData('speed', 90 + Math.random() * 45); this.scene.add.existing(car); this.cars.push(car);
  }
}
