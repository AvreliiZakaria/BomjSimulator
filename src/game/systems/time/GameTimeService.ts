export interface GameTime { day: number; hour: number; minute: number; }

export class GameTimeService {
  private state: GameTime;
  private elapsed = 0;

  public constructor(initial: GameTime) { this.state = { ...initial }; }
  public get(): GameTime { return { ...this.state }; }

  public update(deltaMs: number): void {
    this.elapsed += deltaMs;
    if (this.elapsed < 14000) return;
    const minutes = Math.floor(this.elapsed / 14000);
    this.elapsed -= minutes * 14000;
    this.state.minute += minutes;
    while (this.state.minute >= 60) { this.state.minute -= 60; this.state.hour += 1; }
    while (this.state.hour >= 24) { this.state.hour -= 24; this.state.day += 1; }
  }

  public formatTime(): string { return `${String(this.state.hour).padStart(2, '0')}:${String(this.state.minute).padStart(2, '0')}`; }
}
