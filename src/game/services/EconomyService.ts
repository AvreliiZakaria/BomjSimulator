import { bus } from '../../core/bus';
import { saveService } from '../../services/SaveService';

export class EconomyService {
  public getMoney(): number { return saveService.load()?.economy.money ?? 0; }
  public addMoney(amount: number): number {
    const current = this.getMoney();
    const next = Math.max(0, current + amount);
    saveService.update({ economy: { money: next } });
    bus.emit('money:changed', next);
    return next;
  }
}
export const economyService = new EconomyService();
