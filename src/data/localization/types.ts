import type { ruStrings } from './ru';

export type LocaleCode = 'ru-RU' | 'en-US' | 'de-DE' | 'es-ES';

export type TranslationKey = keyof typeof ruStrings;

/** Новый язык обязан содержать все ключи базового словаря — это проверит TypeScript. */
export type TranslationDict = Record<TranslationKey, string>;

export interface Locale {
  readonly code: LocaleCode;
  readonly name: string;
  readonly strings: TranslationDict;
  readonly loadingPhrases: readonly string[];
}

export type TranslationParams = Readonly<Record<string, string | number>>;
