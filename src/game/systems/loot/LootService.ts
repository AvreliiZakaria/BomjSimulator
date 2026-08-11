import { SURVIVAL_CONFIG } from '../../config/survival.config';
import type { SurvivalStats } from '../survival/SurvivalSystem';

export type LootKind = 'nothing' | 'money' | 'food' | 'yogurt' | 'can' | 'key';
export interface LootResult { kind: LootKind; title: string; description: string; money?: number; foodGain?: number; hygieneChange?: number; healthChange?: number; strangeKey?: boolean; }
const events = ['Здесь пахнет хуже, чем выглядит.','Кто-то аккуратно сложил пустые банки в пакет.','На секунду тебе кажется, что внутри что-то шевельнулось.','Ты слышишь звон монет.','Ничего полезного.'];
const table: Array<{ kind: LootKind; weight: number }> = [{ kind: 'nothing', weight: 34 }, { kind: 'money', weight: 27 }, { kind: 'food', weight: 18 }, { kind: 'yogurt', weight: 10 }, { kind: 'can', weight: 9 }, { kind: 'key', weight: 2 }];
export class LootService {
  public roll(): LootResult { let roll = Math.random() * table.reduce((sum, item) => sum + item.weight, 0); const kind = table.find((item) => (roll -= item.weight) < 0)?.kind ?? 'nothing'; const event = events[Math.floor(Math.random() * events.length)] ?? events[0];
    if (kind === 'money') return { kind, title: 'МЕЛОЧЬ', description: `${event} Ты находишь немного денег.`, money: 3 + Math.floor(Math.random() * 13) };
    if (kind === 'food') return { kind, title: 'ПОЛБУЛКИ', description: 'Сухая. Но это всё ещё еда.', foodGain: 18, hygieneChange: -3 };
    if (kind === 'yogurt') return { kind, title: 'ПРОСРОЧЕННЫЙ ЙОГУРТ', description: 'Выглядит подозрительно. Шанс неприятных последствий есть.', foodGain: 25, hygieneChange: -2, healthChange: Math.random() < 0.25 ? -5 : 0 };
    if (kind === 'can') return { kind, title: 'ЗАКРЫТАЯ БАНКА КОНСЕРВОВ', description: 'Кажется полезным. Но тебе пока некуда это положить.' };
    if (kind === 'key') return { kind, title: 'СТРАННЫЙ КЛЮЧ', description: 'Ты не знаешь, от чего он.', strangeKey: true };
    return { kind: 'nothing', title: 'НИЧЕГО', description: 'Пусто. Кто-то был здесь раньше.' };
  }
  public applyFood(result: LootResult, stats: SurvivalStats): SurvivalStats { void stats; return { ...stats, hunger: Math.min(100, stats.hunger + (result.foodGain ?? 0)), hygiene: Math.max(0, stats.hygiene + (result.hygieneChange ?? 0)), health: Math.max(0, stats.health + (result.healthChange ?? 0)) }; }
  public hygieneCost(stats: SurvivalStats): SurvivalStats { return { ...stats, hygiene: Math.max(0, stats.hygiene - SURVIVAL_CONFIG.searchHygieneCost) }; }
}
