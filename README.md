# НУЛЬ

Браузерная игра — симулятор уличного выживания с экономической прогрессией, абсурдным юмором
и лёгкой криповой атмосферой. Путь игрока: бездомность → выживание → работа → торговля →
жильё → бизнес → богатство.

**Текущий этап (1):** технический фундамент, загрузочный экран, главное меню, настройки,
сохранение-заглушка и пустая игровая сцена. Персонажа, экономики, NPC и прочих систем
пока нет — это следующие этапы.

## Стек

- TypeScript (strict)
- Phaser 4.2.1 — игровой мир внутри canvas
- Vite — dev-сервер и production-сборка
- HTML5 + CSS — экраны интерфейса поверх canvas (без React/Vue и UI-библиотек)

## Установка

```bash
npm install
```

Нужен Node.js 20 или новее.

## Запуск в разработке

```bash
npm run dev
```

Vite поднимет сервер на `http://localhost:5173` (доступен и с телефона в той же сети).

## Проверка типов и production-сборка

```bash
npm run typecheck   # tsc --noEmit
npm run build       # typecheck + vite build → dist/
npm run preview     # локальный просмотр собранной версии
```

## Структура проекта

```
src/
  main.ts                  точка входа
  app/                     сборка приложения и применение настроек
  core/                    базовые утилиты: события, storage, device, motion, math
  services/                SettingsService, SaveService
  data/
    localization/          словари (ru.ts) и функция t()
    game/                  игровые константы
  game/
    config/                конфиг Phaser, палитра, ViewportManager
    scenes/                Boot / Preload / MainMenu / Game
    systems/city/          процедурный городской фон (слои, часы, аномалии)
    utils/                 rng, лимит FPS, работа с цветом
  ui/
    screens/               загрузка, главное меню, HUD
    components/            кнопки, модалка, слайдер, сегментированный переключатель
    modals/                новая игра, настройки, «в разработке»
    icons.ts               собственные inline-SVG иконки
  styles/                  токены, база, компоненты, модалки
public/assets/             картинки, звуки, шрифты (пока пусто)
```

## Куда что добавлять

- **Новая сцена:** файл в `src/game/scenes/`, ключ в `SceneKeys.ts`, регистрация в списке
  `scene` внутри `src/game/config/GameConfig.ts`.
- **Интерфейс:** экраны в `src/ui/screens/`, переиспользуемые элементы в `src/ui/components/`,
  модальные окна в `src/ui/modals/`. Монтированием управляет `src/ui/UIManager.ts`.
- **Связь сцен и UI:** только через шину событий `src/core/bus.ts` — сцены не знают про DOM,
  интерфейс не знает про Phaser.
- **Настройки:** `src/services/SettingsService.ts` (единственное место работы с localStorage
  для настроек), применение — в `src/app/applySettings.ts`.
- **Сохранения:** `src/services/SaveService.ts`. Сейчас это временный локальный MVP-сейв
  (`version`, `createdAt`, `playerName`, `day`, `money`), позже переедет на сервер.
- **Тексты:** только через `t()` из `src/data/localization`. Новый язык — новый файл рядом
  с `ru.ts` и регистрация в `index.ts`.

## Заметки

- Фон главного меню полностью процедурный (силуэты домов, фонари, туман, машины, голуби) —
  временный прототип до появления настоящей графики.
- Учитываются `prefers-reduced-motion`, safe-area на iPhone, смена ориентации и DPR.
