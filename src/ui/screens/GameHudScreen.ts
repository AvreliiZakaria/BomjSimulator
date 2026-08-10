import { bus } from '../../core/bus';
import { t } from '../../data/localization';
import { createButton } from '../components/Button';
import { el, nextFrame, removeAfter } from '../dom';
import { icons } from '../icons';

/** Временный HUD пустой сцены: день, выход в меню и подсказка про ESC. */
export class GameHudScreen {
  private readonly root: HTMLElement;

  public constructor(day: number) {
    const backButton = createButton({
      label: t('game.backToMenu'),
      variant: 'ghost',
      icon: icons.back,
      hint: t('game.escHint'),
      onClick: () => bus.emit('ui:exit-to-menu'),
    });

    this.root = el('div', { class: 'screen screen--game' }, [
      el('div', { class: 'hud__top' }, [backButton.element]),
      el('div', { class: 'hud__day' }, [
        el('span', { class: 'hud__day-value', text: t('game.day', { day }) }),
      ]),
      el('p', { class: 'hud__stub', text: t('game.stub') }),
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
