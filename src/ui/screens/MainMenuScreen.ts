import { bus } from '../../core/bus';
import { APP_VERSION } from '../../data/game/appInfo';
import { t } from '../../data/localization';
import { saveService } from '../../services/SaveService';
import { createButton, type ButtonHandle } from '../components/Button';
import { el, nextFrame, removeAfter } from '../dom';
import { icons } from '../icons';
import { openComingSoonModal } from '../modals/ComingSoonModal';
import { openNewGameModal } from '../modals/NewGameModal';
import { openSettingsModal } from '../modals/SettingsModal';

interface TileConfig {
  label: string;
  icon: string;
}

/** Главное меню. Слева на десктопе, снизу на телефоне. */
export class MainMenuScreen {
  private readonly root: HTMLElement;

  private readonly continueButton: ButtonHandle;

  public constructor(private readonly modalLayer: HTMLElement) {
    const hasSave = saveService.hasSave();

    this.continueButton = createButton({
      label: t('menu.continue'),
      variant: 'primary',
      icon: icons.play,
      disabled: !hasSave,
      onClick: () => bus.emit('ui:continue'),
    });

    const newGameButton = createButton({
      label: t('menu.newGame'),
      variant: 'secondary',
      onClick: () => openNewGameModal(this.modalLayer, () => bus.emit('ui:new-game')),
    });

    const settingsButton = createButton({
      label: t('menu.settings'),
      variant: 'ghost',
      icon: icons.settings,
      onClick: () => openSettingsModal(this.modalLayer),
    });

    const tiles: TileConfig[] = [
      { label: t('menu.character'), icon: icons.character },
      { label: t('menu.rating'), icon: icons.rating },
      { label: t('menu.collection'), icon: icons.collection },
      { label: t('menu.shop'), icon: icons.shop },
      { label: t('menu.news'), icon: icons.news },
    ];

    const grid = el(
      'nav',
      { class: 'menu__grid', 'aria-label': t('brand.title') },
      tiles.map(
        (tile) =>
          createButton({
            label: tile.label,
            variant: 'tile',
            icon: tile.icon,
            onClick: () => openComingSoonModal(this.modalLayer, tile.label),
          }).element,
      ),
    );

    const primary = el('div', { class: 'menu__primary' }, [
      this.continueButton.element,
      newGameButton.element,
    ]);

    if (!hasSave) {
      primary.append(el('p', { class: 'menu__note', text: t('menu.continue.empty') }));
    }

    this.root = el('div', { class: 'screen screen--menu' }, [
      el('div', { class: 'menu' }, [
        el('header', { class: 'menu__brand' }, [
          el('h1', { class: 'menu__logo', text: t('brand.title') }),
          el('p', { class: 'menu__tagline', text: t('brand.tagline') }),
        ]),
        primary,
        grid,
        el('footer', { class: 'menu__footer' }, [
          settingsButton.element,
          el('span', {
            class: 'menu__version',
            text: t('menu.version', { version: APP_VERSION }),
          }),
        ]),
      ]),
    ]);
  }

  public mount(parent: HTMLElement): void {
    parent.append(this.root);
    nextFrame(() => this.root.classList.add('is-ready'));
  }

  public unmount(): void {
    this.root.classList.add('is-leaving');
    removeAfter(this.root, 340);
  }
}
