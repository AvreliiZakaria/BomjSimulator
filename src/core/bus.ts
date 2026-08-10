import { Emitter } from './Emitter';

/**
 * Общая шина событий между Phaser-сценами и DOM-интерфейсом.
 * Сцены ничего не знают про DOM, интерфейс ничего не знает про Phaser.
 */
export type AppEvents = {
  /** Прогресс загрузки, 0..1 */
  'preload:progress': number;
  'preload:complete': void;

  'menu:enter': void;
  'menu:leave': void;

  'game:enter': { day: number };
  'game:leave': void;

  /** Запросы от интерфейса к сценам */
  'ui:continue': void;
  'ui:new-game': void;
  'ui:exit-to-menu': void;
};

export const bus = new Emitter<AppEvents>();
