import { SURVIVAL_CONFIG } from '../../config/survival.config';

export interface SurvivalStats { health: number; hunger: number; warmth: number; hygiene: number; sanity: number; }
export type SurvivalKey = keyof SurvivalStats;
const clamp = (value: number): number => Math.min(100, Math.max(0, value));

export class SurvivalSystem {
  private stats: SurvivalStats;
  public constructor(initial: SurvivalStats) { this.stats = { ...initial }; }
  public get(): SurvivalStats { return { ...this.stats }; }
  public set(patch: Partial<SurvivalStats>): SurvivalStats { this.stats = { ...this.stats, ...Object.fromEntries(Object.entries(patch).map(([key, value]) => [key, clamp(Number(value))])) } as SurvivalStats; return this.get(); }
  public change(patch: Partial<Record<SurvivalKey, number>>): SurvivalStats { const next = { ...this.stats }; for (const [key, value] of Object.entries(patch)) next[key as SurvivalKey] = clamp(next[key as SurvivalKey] + Number(value)); this.stats = next; return this.get(); }
  public advanceGameHours(hours: number, isNight: boolean): SurvivalStats {
    const multiplier = Math.max(0, hours);
    this.change({ hunger: -SURVIVAL_CONFIG.hungerDrainPerGameHour * multiplier, hygiene: -SURVIVAL_CONFIG.hygieneDrainPerGameHour * multiplier, sanity: -SURVIVAL_CONFIG.sanityDrainPerGameHour * multiplier });
    if (isNight) this.change({ warmth: -SURVIVAL_CONFIG.warmthDrainPerGameHour * multiplier });
    if (this.stats.hunger < SURVIVAL_CONFIG.starvationThreshold) this.change({ health: -SURVIVAL_CONFIG.starvationHealthDamagePerHour * multiplier });
    if (this.stats.warmth < SURVIVAL_CONFIG.coldThreshold) this.change({ health: -SURVIVAL_CONFIG.coldHealthDamagePerHour * multiplier });
    return this.get();
  }
  public rest(): SurvivalStats { return this.change({ sanity: SURVIVAL_CONFIG.restSanityGain, health: SURVIVAL_CONFIG.restHealthGain }); }
  public sleep(): SurvivalStats { return this.change(SURVIVAL_CONFIG.sleep); }
  public isUnconscious(): boolean { return this.stats.health <= 0; }
}

export const DEFAULT_SURVIVAL: SurvivalStats = { health: 100, hunger: 65, warmth: 75, hygiene: 55, sanity: 100 };
