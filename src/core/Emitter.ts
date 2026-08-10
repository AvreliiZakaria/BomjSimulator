/**
 * Минимальный типобезопасный эмиттер событий.
 * Используется вместо внешних библиотек: нам нужно ровно три метода.
 */
export type EventPayloadMap = Record<string, unknown>;

type Handler<T> = (payload: T) => void;

export class Emitter<E extends EventPayloadMap> {
  private readonly handlers: { [K in keyof E]?: Set<Handler<E[K]>> } = {};

  public on<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
    let listeners = this.handlers[event];

    if (!listeners) {
      listeners = new Set<Handler<E[K]>>();
      this.handlers[event] = listeners;
    }

    listeners.add(handler);

    return () => this.off(event, handler);
  }

  public once<K extends keyof E>(event: K, handler: Handler<E[K]>): () => void {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe();
      handler(payload);
    });

    return unsubscribe;
  }

  public off<K extends keyof E>(event: K, handler: Handler<E[K]>): void {
    this.handlers[event]?.delete(handler);
  }

  public emit<K extends keyof E>(
    event: K,
    ...args: E[K] extends void ? [] : [E[K]]
  ): void {
    const listeners = this.handlers[event];

    if (!listeners || listeners.size === 0) {
      return;
    }

    const payload = (args as unknown[])[0] as E[K];

    for (const handler of [...listeners]) {
      handler(payload);
    }
  }

  public clear(): void {
    for (const key of Object.keys(this.handlers)) {
      delete this.handlers[key as keyof E];
    }
  }
}
