/** Линейная интерполяция двух 24-битных цветов без обращения к Phaser. */
export function mixColor(from: number, to: number, amount: number): number {
  const t = Math.min(Math.max(amount, 0), 1);

  const fromR = (from >> 16) & 0xff;
  const fromG = (from >> 8) & 0xff;
  const fromB = from & 0xff;

  const toR = (to >> 16) & 0xff;
  const toG = (to >> 8) & 0xff;
  const toB = to & 0xff;

  const r = Math.round(fromR + (toR - fromR) * t);
  const g = Math.round(fromG + (toG - fromG) * t);
  const b = Math.round(fromB + (toB - fromB) * t);

  return (r << 16) | (g << 8) | b;
}
