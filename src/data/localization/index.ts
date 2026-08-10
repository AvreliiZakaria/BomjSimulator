import { ruLoadingPhrases, ruStrings } from './ru';
import type { Locale, LocaleCode, TranslationKey, TranslationParams } from './types';

const ruLocale: Locale = {
  code: 'ru-RU',
  name: 'Русский',
  strings: ruStrings,
  loadingPhrases: ruLoadingPhrases,
};

/** Позже сюда добавляются en-US, de-DE, es-ES и т.д. */
const locales: Partial<Record<LocaleCode, Locale>> = {
  'ru-RU': ruLocale,
};

let activeLocale: Locale = ruLocale;

export function setLocale(code: LocaleCode): void {
  const locale = locales[code];

  if (locale) {
    activeLocale = locale;
    document.documentElement.lang = locale.code.slice(0, 2);
  }
}

export function getLocale(): Locale {
  return activeLocale;
}

export function t(key: TranslationKey, params?: TranslationParams): string {
  let value: string = activeLocale.strings[key] ?? ruStrings[key];

  if (params) {
    for (const [name, replacement] of Object.entries(params)) {
      value = value.split(`{${name}}`).join(String(replacement));
    }
  }

  return value;
}

export function getRandomLoadingPhrase(): string {
  const phrases = activeLocale.loadingPhrases;
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index] ?? '';
}
