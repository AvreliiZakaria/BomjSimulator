import { getRandomLoadingPhrase, t } from '../../data/localization';
import { clamp } from '../../core/math';
import { el, removeAfter } from '../dom';

/** Загрузочный экран. Живёт в DOM, поэтому текст всегда чёткий на любом экране. */
export class LoadingScreen {
  private readonly root: HTMLElement;

  private readonly barFill: HTMLElement;

  public constructor() {
    this.barFill = el('div', { class: 'loading__bar-fill' });

    this.root = el('div', { class: 'screen screen--loading' }, [
      el('div', { class: 'loading' }, [
        el('h1', { class: 'loading__title', text: t('brand.title') }),
        el('div', { class: 'loading__bar' }, [this.barFill]),
        el('p', { class: 'loading__status', text: t('loading.status') }),
        el('p', { class: 'loading__phrase', text: getRandomLoadingPhrase() }),
      ]),
    ]);

    this.setProgress(0);
  }

  public mount(parent: HTMLElement): void {
    parent.append(this.root);
  }

  public setProgress(value: number): void {
    this.barFill.style.transform = `scaleX(${clamp(value, 0, 1)})`;
  }

  public hide(): void {
    this.root.classList.add('is-leaving');
    removeAfter(this.root, 520);
  }
}
