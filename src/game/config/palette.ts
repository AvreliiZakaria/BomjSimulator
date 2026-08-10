/** Единая палитра игрового мира. CSS-двойники лежат в src/styles/tokens.css. */
export const PALETTE = {
  night: 0x0b0c0f,
  skyTop: 0x090b11,
  skyMid: 0x131922,
  skyHorizon: 0x2c2a2b,
  skyGlow: 0x6b4a24,
  star: 0xcdd6e0,

  buildingFar: 0x171b23,
  buildingMid: 0x101319,
  buildingNear: 0x090b0f,
  roofDetail: 0x1d2129,

  windowWarm: 0xe0a13c,
  windowCold: 0x8ea6bd,
  windowDark: 0x1b2029,

  road: 0x0d0e12,
  roadLight: 0x2a2c33,
  sidewalk: 0x14161b,
  curb: 0x1f222a,

  lamp: 0xffd18f,
  lampGlow: 0xd79a3f,

  fog: 0x2d3440,
  silhouette: 0x05060a,
  accent: 0xe2a648,
} as const;

export const CSS_COLORS = {
  accent: '#f0b75c',
  accentDim: '#c98f36',
  cold: '#9fb4c7',
} as const;
