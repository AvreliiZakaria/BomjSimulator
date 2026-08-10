/**
 * Безопасная обёртка над localStorage.
 * Safari в приватном режиме и часть встроенных браузеров бросают исключение,
 * поэтому при недоступности хранилища молча переходим на память процесса.
 */
const memoryStorage = new Map<string, string>();

let storageAvailable: boolean | null = null;

function isStorageAvailable(): boolean {
  if (storageAvailable !== null) {
    return storageAvailable;
  }

  try {
    const probeKey = '__nul_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }

  return storageAvailable;
}

function readRaw(key: string): string | null {
  if (!isStorageAvailable()) {
    return memoryStorage.get(key) ?? null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  if (!isStorageAvailable()) {
    memoryStorage.set(key, value);
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    memoryStorage.set(key, value);
  }
}

export function readJson<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  const raw = readRaw(key);

  if (raw === null || raw === '') {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    writeRaw(key, JSON.stringify(value));
  } catch {
    /* значение не сериализуется — молча игнорируем, это не критично для игрока */
  }
}

export function removeKey(key: string): void {
  if (!isStorageAvailable()) {
    memoryStorage.delete(key);
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    memoryStorage.delete(key);
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
