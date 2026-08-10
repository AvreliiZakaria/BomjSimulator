import { t } from '../../data/localization';
import { el, nextFrame, removeAfter } from '../dom';
import { icons } from '../icons';

export interface ModalOptions {
  title: string;
  body: HTMLElement;
  actions?: HTMLElement[];
  onClose?: () => void;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openModalCount = 0;

/**
 * Модальное окно: закрывается по X, по Escape и по клику на подложку,
 * блокирует фон и удерживает фокус внутри себя.
 */
export class Modal {
  private readonly overlay: HTMLElement;

  private readonly dialog: HTMLElement;

  private previouslyFocused: HTMLElement | null = null;

  private closed = false;

  public constructor(private readonly options: ModalOptions) {
    const closeButton = el('button', {
      class: 'modal__close',
      type: 'button',
      'aria-label': t('common.close'),
      html: icons.close,
    });

    closeButton.addEventListener('click', () => this.close());

    this.dialog = el(
      'div',
      {
        class: 'modal__dialog',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': options.title,
        tabindex: '-1',
      },
      [
        el('header', { class: 'modal__header' }, [
          el('h2', { class: 'modal__title', text: options.title }),
          closeButton,
        ]),
        el('div', { class: 'modal__body' }, [options.body]),
      ],
    );

    if (options.actions && options.actions.length > 0) {
      this.dialog.append(el('footer', { class: 'modal__footer' }, options.actions));
    }

    this.overlay = el('div', { class: 'modal' }, [this.dialog]);

    this.overlay.addEventListener('pointerdown', (event) => {
      if (event.target === this.overlay) {
        this.close();
      }
    });
  }

  public open(parent: HTMLElement): void {
    this.previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    parent.append(this.overlay);

    openModalCount += 1;
    document.body.classList.add('is-modal-open');
    document.addEventListener('keydown', this.handleKeydown, true);

    nextFrame(() => {
      this.overlay.classList.add('is-open');
    });

    const focusable = this.getFocusable();
    (focusable[0] ?? this.dialog).focus();
  }

  public close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    document.removeEventListener('keydown', this.handleKeydown, true);

    openModalCount = Math.max(0, openModalCount - 1);

    if (openModalCount === 0) {
      document.body.classList.remove('is-modal-open');
    }

    this.overlay.classList.remove('is-open');
    removeAfter(this.overlay, 220);

    this.previouslyFocused?.focus();
    this.options.onClose?.();
  }

  private getFocusable(): HTMLElement[] {
    return Array.from(this.dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
  }

  private readonly handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = this.getFocusable();

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === this.dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };
}
