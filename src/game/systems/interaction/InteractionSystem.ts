export interface Interactable { id: string; kind: 'container' | 'bench' | 'shelter'; x: number; y: number; radius: number; label: string; }
export class InteractionSystem {
  private readonly items: Interactable[];
  public constructor(items: Interactable[]) { this.items = items; }
  public nearest(x: number, y: number): Interactable | null { let best: Interactable | null = null; let distance = Infinity; for (const item of this.items) { const next = Math.hypot(item.x - x, item.y - y); if (next <= item.radius && next < distance) { best = item; distance = next; } } return best; }
  public all(): readonly Interactable[] { return this.items; }
}
