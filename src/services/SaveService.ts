import { isPlainObject, readJson, removeKey, writeJson } from '../core/storage';

export const SAVE_VERSION = 1;

export interface SaveData {
  version: number;
  createdAt: string;
  playerName: string | null;
  day: number;
  money: number;
}

const STORAGE_KEY = 'nul.save.v1';

const STARTING_MONEY = 17;

function isSaveData(value: unknown): value is SaveData {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.version === 'number' &&
    typeof value.createdAt === 'string' &&
    typeof value.day === 'number' &&
    typeof value.money === 'number' &&
    (value.playerName === null || typeof value.playerName === 'string')
  );
}

/**
 * Временный локальный MVP-сейв.
 * Позже прогресс переедет на сервер — интерфейс сервиса при этом не изменится.
 */
class SaveService {
  public hasSave(): boolean {
    return this.load() !== null;
  }

  public load(): SaveData | null {
    const save = readJson(STORAGE_KEY, isSaveData);

    if (!save || save.version !== SAVE_VERSION) {
      return null;
    }

    return save;
  }

  public createNew(): SaveData {
    const save: SaveData = {
      version: SAVE_VERSION,
      createdAt: new Date().toISOString(),
      playerName: null,
      day: 1,
      money: STARTING_MONEY,
    };

    writeJson(STORAGE_KEY, save);

    return save;
  }

  public clear(): void {
    removeKey(STORAGE_KEY);
  }
}

export const saveService = new SaveService();
