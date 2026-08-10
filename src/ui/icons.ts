const wrap = (content: string): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${content}</svg>`;

/** Свой минимальный набор иконок вместо иконочного фреймворка. */
export const icons = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.2v13.6L19 12z" fill="currentColor"/></svg>',
  character: wrap('<circle cx="12" cy="8" r="3.4"/><path d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6"/>'),
  rating: wrap('<path d="M8 4h8v4a4 4 0 0 1-8 0z"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3"/><path d="M12 12v4M9 20h6M10 16h4"/>'),
  collection: wrap('<path d="M6 8h12l-1 11H7z"/><path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/>'),
  shop: wrap('<path d="M4 7h16l-1.3 12H5.3z"/><path d="M4 7l1.4-3h13.2L20 7"/><path d="M9.5 11.5a2.5 2.5 0 0 0 5 0"/>'),
  news: wrap('<path d="M4 6h12v13H5.5A1.5 1.5 0 0 1 4 17.5z"/><path d="M16 9h3.2A.8.8 0 0 1 20 9.8v7.7a1.5 1.5 0 0 1-3 0V9"/><path d="M7 9.5h6M7 12.5h6M7 15.5h4"/>'),
  settings: wrap('<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5"/>'),
  close: wrap('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  back: wrap('<path d="M14.5 5.5L8 12l6.5 6.5"/>'),
} as const;

export type IconName = keyof typeof icons;
