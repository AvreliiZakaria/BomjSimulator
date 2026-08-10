/**
 * Детерминированный генератор (mulberry32).
 * Нужен, чтобы город выглядел одинаково после resize и не «перестраивался» на глазах.
 */
export class Rng {
  private state: number;

  public constructor(seed: number) {
    this.state = (seed >>> 0) || 1;
  }

  public next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  public int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  public chance(probability: number): boolean {
    return this.next() < probability;
  }

  public pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)] as T;
  }
}
