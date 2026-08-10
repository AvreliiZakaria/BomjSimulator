import { bus } from '../../core/bus';
import { t } from '../../data/localization';
import { createButton } from '../components/Button';
import { el, nextFrame, removeAfter } from '../dom';
import { openSettingsModal } from '../modals/SettingsModal';

export class PauseScreen {
  private readonly root: HTMLElement;
  public constructor(private readonly modalLayer: HTMLElement) {
    this.root = el('div', { class: 'screen screen--pause' }, [el('div', { class: 'pause' }, [
      el('div', { class: 'eyebrow', text: 'НУЛЬ / ПАУЗА' }),
      el('h2', { class: 'pause__title', text: t('pause.title') }),
      el('div', { class: 'pause__actions' }, [
        createButton({ label: t('pause.resume'), variant: 'primary', onClick: () => bus.emit('ui:resume') }).element,
        createButton({ label: t('menu.settings'), variant: 'secondary', onClick: () => openSettingsModal(this.modalLayer) }).element,
        createButton({ label: t('pause.menu'), variant: 'ghost', onClick: () => bus.emit('ui:exit-to-menu') }).element,
      ]),
    ])]);
  }
  public mount(parent: HTMLElement): void { parent.append(this.root); nextFrame(() => this.root.classList.add('is-ready')); }
  public unmount(): void { this.root.classList.add('is-leaving'); removeAfter(this.root, 280); }
}
