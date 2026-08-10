export const APPEARANCE_PRESETS = ['night-owl', 'red-cap', 'quiet-one', 'street-poet', 'winter-kid', 'lucky-scarf'] as const;
export type AppearancePreset = (typeof APPEARANCE_PRESETS)[number];

export const CLOTHING_PRESETS = ['old-jacket', 'hoodie', 'worn-sweatshirt', 'long-coat'] as const;
export type ClothingPreset = (typeof CLOTHING_PRESETS)[number];

export interface PlayerData {
  id: string;
  name: string;
  appearancePreset: AppearancePreset;
  clothingPreset: ClothingPreset;
  createdAt: string;
}

export const APPEARANCE_LABELS: Record<AppearancePreset, string> = {
  'night-owl': 'НОЧНОЙ СОВ',
  'red-cap': 'КРАСНАЯ КЕПКА',
  'quiet-one': 'ТИХИЙ',
  'street-poet': 'УЛИЧНЫЙ ПОЭТ',
  'winter-kid': 'ЗИМНИЙ',
  'lucky-scarf': 'С ШАРФОМ',
};

export const CLOTHING_LABELS: Record<ClothingPreset, string> = {
  'old-jacket': 'СТАРАЯ КУРТКА',
  hoodie: 'ХУДИ',
  'worn-sweatshirt': 'ПОТРЁПАННАЯ ТОЛСТОВКА',
  'long-coat': 'ДЛИННАЯ КУРТКА',
};

export function createPlayerId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `player-${Date.now().toString(36)}-${random}`;
}

export function isAppearancePreset(value: unknown): value is AppearancePreset {
  return typeof value === 'string' && (APPEARANCE_PRESETS as readonly string[]).includes(value);
}

export function isClothingPreset(value: unknown): value is ClothingPreset {
  return typeof value === 'string' && (CLOTHING_PRESETS as readonly string[]).includes(value);
}
