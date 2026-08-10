import { Emitter } from './Emitter';
import type { AppearancePreset, ClothingPreset } from '../data/game/player';
import type { GameTime } from '../game/systems/time/GameTimeService';

export type AppEvents = {
  'preload:progress': number;
  'preload:complete': void;
  'menu:enter': void;
  'menu:leave': void;
  'character:enter': void;
  'character:leave': void;
  'game:enter': { day: number; money: number; time: { hour: number; minute: number }; district: string; name: string };
  'game:time': GameTime;
  'game:leave': void;
  'ui:continue': void;
  'ui:new-game': void;
  'ui:character-start': { name: string; appearancePreset: AppearancePreset; clothingPreset: ClothingPreset };
  'ui:character-cancel': void;
  'ui:pause': void;
  'ui:resume': void;
  'ui:exit-to-menu': void;
  'ui:joystick': { x: number; y: number };
};

export const bus = new Emitter<AppEvents>();
