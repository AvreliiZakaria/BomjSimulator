/**
 * Определение возможностей устройства. Без внешних библиотек и без user-agent сниффинга там,
 * где хватает нормальных браузерных API.
 */
const MAX_PIXEL_RATIO = 2;

export function getDevicePixelRatio(): number {
  const ratio = window.devicePixelRatio || 1;
  return Math.min(Math.max(ratio, 1), MAX_PIXEL_RATIO);
}

export function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

export function isSmallScreen(): boolean {
  return Math.min(window.innerWidth, window.innerHeight) <= 520;
}

/**
 * Грубая эвристика «слабого» устройства: мало ядер, высокий DPR на маленьком экране
 * или тач-устройство без запаса по памяти.
 */
export function isProbablyLowEndDevice(): boolean {
  const cores = navigator.hardwareConcurrency ?? 4;

  if (cores <= 4 && isTouchDevice()) {
    return true;
  }

  return cores <= 2;
}
