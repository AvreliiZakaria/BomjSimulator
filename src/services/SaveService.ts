import { isPlainObject, readJson, removeKey, writeJson } from '../core/storage';
import {
  isAppearancePreset,
  isClothingPreset,
  type AppearancePreset,
  type ClothingPreset,
  type PlayerData,
} from '../data/game/player';

export const SAVE_VERSION = 2;

export interface SaveData {
  version: number;
  createdAt: string;
  updatedAt: string;
  player: PlayerData;
  world: { day: number; time: { hour: number; minute: number }; district: string };
  economy: { money: number };
  position: { x: number; y: number };
}

const STORAGE_KEY = 'nul.save.v2';
const STARTING_MONEY = 17;
const DEFAULT_DISTRICT = 'СПАЛЬНЫЙ РАЙОН';

function isPlayer(value: unknown): value is PlayerData {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.id === 'string' && typeof value.name === 'string' &&
    isAppearancePreset(value.appearancePreset) && isClothingPreset(value.clothingPreset) &&
    typeof value.createdAt === 'string'
  );
}

function isSaveData(value: unknown): value is SaveData {
  if (!isPlainObject(value) || !isPlainObject(value.player) || !isPlainObject(value.world) ||
      !isPlainObject(value.economy) || !isPlainObject(value.position) || !isPlainObject(value.world.time)) return false;
  return (
    value.version === SAVE_VERSION && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string' &&
    isPlayer(value.player) && typeof value.world.day === 'number' && typeof value.world.time.hour === 'number' &&
    typeof value.world.time.minute === 'number' && typeof value.world.district === 'string' &&
    typeof value.economy.money === 'number' && typeof value.position.x === 'number' && typeof value.position.y === 'number'
  );
}

function isLegacySave(value: unknown): value is { createdAt: string; playerName: string | null; day: number; money: number } {
  if (!isPlainObject(value)) return false;
  return typeof value.createdAt === 'string' && (value.playerName === null || typeof value.playerName === 'string') &&
    typeof value.day === 'number' && typeof value.money === 'number';
}

function migrateLegacy(value: { createdAt: string; playerName: string | null; day: number; money: number }): SaveData {
  const now = new Date().toISOString();
  return {
    version: SAVE_VERSION,
    createdAt: value.createdAt,
    updatedAt: now,
    player: {
      id: `legacy-${Date.now().toString(36)}`,
      name: value.playerName?.trim() || 'Безымянный',
      appearancePreset: 'night-owl',
      clothingPreset: 'old-jacket',
      createdAt: value.createdAt,
    },
    world: { day: value.day, time: { hour: 2, minute: 47 }, district: DEFAULT_DISTRICT },
    economy: { money: value.money },
    position: { x: 360, y: 470 },
  };
}

class SaveService {
  public hasSave(): boolean { return this.load() !== null; }

  public load(): SaveData | null {
    const current = readJson(STORAGE_KEY, isSaveData);
    if (current) return current;
    const legacy = readJson('nul.save.v1', isLegacySave);
    return legacy ? migrateLegacy(legacy) : null;
  }

  public createNew(player: Omit<PlayerData, 'id' | 'createdAt'>): SaveData {
    const now = new Date().toISOString();
    const data: SaveData = {
      version: SAVE_VERSION,
      createdAt: now,
      updatedAt: now,
      player: { ...player, id: `player-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now },
      world: { day: 1, time: { hour: 2, minute: 47 }, district: DEFAULT_DISTRICT },
      economy: { money: STARTING_MONEY },
      position: { x: 360, y: 470 },
    };
    writeJson(STORAGE_KEY, data);
    return data;
  }

  public update(patch: Partial<Pick<SaveData, 'world' | 'economy' | 'position'>>): SaveData | null {
    const current = this.load();
    if (!current) return null;
    const next: SaveData = { ...current, ...patch, updatedAt: new Date().toISOString() };
    writeJson(STORAGE_KEY, next);
    return next;
  }

  public clear(): void { removeKey(STORAGE_KEY); removeKey('nul.save.v1'); }
}

export const saveService = new SaveService();
export type { AppearancePreset, ClothingPreset };
