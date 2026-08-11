import { isPlainObject, readJson, removeKey, writeJson } from '../core/storage';
import { isAppearancePreset, isClothingPreset, type PlayerData } from '../data/game/player';
import type { ObjectiveState } from '../game/systems/objectives/ObjectiveSystem';
import type { SurvivalStats } from '../game/systems/survival/SurvivalSystem';

export const SAVE_VERSION = 3;
export interface SaveData { version: number; createdAt: string; updatedAt: string; player: PlayerData; world: { day: number; time: { hour: number; minute: number }; district: string; searchedContainers: string[]; flags: { foundStrangeKey?: boolean } }; economy: { money: number }; position: { x: number; y: number }; survival: SurvivalStats; objectives: ObjectiveState; }
const STORAGE_KEY = 'nul.save.v3';
const DEFAULT_DISTRICT = 'СПАЛЬНЫЙ РАЙОН';
const DEFAULT_SURVIVAL: SurvivalStats = { health: 100, hunger: 65, warmth: 75, hygiene: 55, sanity: 100 };

type SaveTime = { hour: number; minute: number };
function isTime(value: unknown): value is SaveTime { return isPlainObject(value) && typeof value.hour === 'number' && typeof value.minute === 'number'; }
function isStats(value: unknown): value is SurvivalStats { if (!isPlainObject(value)) return false; return ['health', 'hunger', 'warmth', 'hygiene', 'sanity'].every((key) => typeof value[key] === 'number'); }
function isPlayer(value: unknown): value is PlayerData { return isPlainObject(value) && typeof value.id === 'string' && typeof value.name === 'string' && isAppearancePreset(value.appearancePreset) && isClothingPreset(value.clothingPreset) && typeof value.createdAt === 'string'; }
function isSave(value: unknown): value is SaveData {
  if (!isPlainObject(value) || !isPlayer(value.player) || !isPlainObject(value.world) || !isPlainObject(value.economy) || !isPlainObject(value.position) || !isPlainObject(value.objectives)) return false;
  const world = value.world;
  const rawTime = world['time'];
  const rawFlags = world['flags'];
  if (!isTime(rawTime) || !isPlainObject(rawFlags)) return false;
  const time: SaveTime = rawTime;
  const economy = value.economy;
  const position = value.position;
  const searched = world['searchedContainers'];
  return value.version === SAVE_VERSION && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string' && typeof world['day'] === 'number' && typeof time.hour === 'number' && typeof time.minute === 'number' && typeof world['district'] === 'string' && Array.isArray(searched) && searched.every((item) => typeof item === 'string') && typeof economy['money'] === 'number' && typeof position['x'] === 'number' && typeof position['y'] === 'number' && isStats(value.survival) && typeof value.objectives['current'] === 'string' && Array.isArray(value.objectives['completed']) && value.objectives['completed'].every((item) => typeof item === 'string');
}
function migrate(value: unknown): SaveData | null {
  if (!isPlainObject(value) || !isPlayer(value.player) || !isPlainObject(value.world) || !isPlainObject(value.economy) || !isPlainObject(value.position)) return null;
  const world = value.world;
  const rawTime = world['time'];
  if (!isTime(rawTime)) return null;
  const time: SaveTime = rawTime;
  const now = new Date().toISOString();
  const createdAt = typeof value.createdAt === 'string' ? value.createdAt : now;
  const day = typeof world['day'] === 'number' ? world['day'] : 1;
  const district = typeof world['district'] === 'string' ? world['district'] : DEFAULT_DISTRICT;
  const money = typeof value.economy['money'] === 'number' ? value.economy['money'] : 17;
  const x = typeof value.position['x'] === 'number' ? value.position['x'] : 360;
  const y = typeof value.position['y'] === 'number' ? value.position['y'] : 470;
  return { version: SAVE_VERSION, createdAt, updatedAt: now, player: value.player, world: { day, time: { hour: time.hour, minute: time.minute }, district, searchedContainers: [], flags: {} }, economy: { money }, position: { x, y }, survival: { ...DEFAULT_SURVIVAL }, objectives: { current: 'find-food', completed: [] } };
}
class SaveService {
  public hasSave(): boolean { return this.load() !== null; }
  public load(): SaveData | null { const current = readJson(STORAGE_KEY, isSave); if (current) return current; const old = readJson('nul.save.v2', (value): value is SaveData => isPlainObject(value) && typeof value['version'] === 'number'); return old ? migrate(old) : null; }
  public createNew(player: Omit<PlayerData, 'id' | 'createdAt'>): SaveData { const now = new Date().toISOString(); const data: SaveData = { version: SAVE_VERSION, createdAt: now, updatedAt: now, player: { ...player, id: `player-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now }, world: { day: 1, time: { hour: 2, minute: 47 }, district: DEFAULT_DISTRICT, searchedContainers: [], flags: {} }, economy: { money: 17 }, position: { x: 360, y: 470 }, survival: { ...DEFAULT_SURVIVAL }, objectives: { current: 'find-food', completed: [] } }; writeJson(STORAGE_KEY, data); return data; }
  public update(patch: Partial<Pick<SaveData, 'world' | 'economy' | 'position' | 'survival' | 'objectives'>>): SaveData | null { const current = this.load(); if (!current) return null; const next: SaveData = { ...current, ...patch, updatedAt: new Date().toISOString() }; writeJson(STORAGE_KEY, next); return next; }
  public clear(): void { removeKey(STORAGE_KEY); removeKey('nul.save.v2'); removeKey('nul.save.v1'); }
}
export const saveService = new SaveService();
export type { AppearancePreset, ClothingPreset } from '../data/game/player';
