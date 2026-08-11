import * as Phaser from 'phaser';
import type { InputState } from './InputState';
export interface MovementVector { x: number; y: number; }
export class PlayerController {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly wasd: Record<string, Phaser.Input.Keyboard.Key>;
  private joystick: MovementVector = { x: 0, y: 0 };
  private state: InputState = 'gameplay';
  public constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is unavailable');
    this.cursors = keyboard.createCursorKeys();
    this.wasd = keyboard.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>;
  }
  public setState(state: InputState): void { this.state = state; if (state !== 'gameplay') this.joystick = { x: 0, y: 0 }; }
  public getState(): InputState { return this.state; }
  public setJoystick(vector: MovementVector): void { if (this.state === 'gameplay') this.joystick = vector; }
  public getVector(): MovementVector {
    if (this.state !== 'gameplay') return { x: 0, y: 0 };
    let x = this.joystick.x; let y = this.joystick.y;
    if (this.cursors.left.isDown || this.wasd.A.isDown) x -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) x += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) y -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) y += 1;
    const length = Math.hypot(x, y);
    return length > 1 ? { x: x / length, y: y / length } : { x, y };
  }
  public destroy(): void { this.joystick = { x: 0, y: 0 }; this.state = 'transition'; }
}
