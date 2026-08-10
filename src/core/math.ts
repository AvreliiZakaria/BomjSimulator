export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/** Плавное приближение, независимое от частоты кадров. */
export function damp(from: number, to: number, smoothing: number, deltaMs: number): number {
  const factor = 1 - Math.pow(1 - smoothing, deltaMs / 16.666);
  return lerp(from, to, clamp(factor, 0, 1));
}
