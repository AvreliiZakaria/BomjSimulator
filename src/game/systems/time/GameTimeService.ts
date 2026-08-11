export interface GameTime { day: number; hour: number; minute: number; }
export type DayPhase = 'morning' | 'day' | 'evening' | 'night' | 'lateNight';
export class GameTimeService {
  private state: GameTime;
  private elapsed = 0;
  public constructor(initial: GameTime) { this.state = { ...initial }; }
  public get(): GameTime { return { ...this.state }; }
  public update(deltaMs: number): number {
    this.elapsed += deltaMs;
    const gameMinutes = Math.floor(this.elapsed / 625);
    if (gameMinutes < 1) return 0;
    this.elapsed -= gameMinutes * 625;
    const before = this.state.day * 1440 + this.state.hour * 60 + this.state.minute;
    const total = before + gameMinutes;
    this.state.day = Math.floor(total / 1440);
    const within = total % 1440;
    this.state.hour = Math.floor(within / 60);
    this.state.minute = within % 60;
    return gameMinutes;
  }
  public phase(): DayPhase { const minutes = this.state.hour * 60 + this.state.minute; if (minutes < 360) return 'lateNight'; if (minutes < 600) return 'morning'; if (minutes < 1080) return 'day'; if (minutes < 1320) return 'evening'; return 'night'; }
  public isNight(): boolean { return this.phase() === 'night' || this.phase() === 'lateNight'; }
  public setMorning(): void { this.state.day += 1; this.state.hour = 7; this.state.minute = 0; this.elapsed = 0; }
  public advanceHours(hours: number): void { this.update(hours * 60 * 625); }
  public formatTime(): string { return `${String(this.state.hour).padStart(2, '0')}:${String(this.state.minute).padStart(2, '0')}`; }
}
