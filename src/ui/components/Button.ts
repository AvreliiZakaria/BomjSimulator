import { el } from '../dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'tile';

export interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  icon?: string;
  hint?: string;
  disabled?: boolean;
  onClick: () => void;
}

export interface ButtonHandle {
  readonly element: HTMLButtonElement;
  setDisabled(disabled: boolean): void;
}

export function createButton(options: ButtonOptions): ButtonHandle {
  const variant = options.variant ?? 'secondary';
  const button = el('button', { class: `btn btn--${variant}`, type: 'button' });

  if (options.icon) {
    button.append(el('span', { class: 'btn__icon', html: options.icon }));
  }

  button.append(el('span', { class: 'btn__label', text: options.label }));

  if (options.hint) {
    button.append(el('span', { class: 'btn__hint', text: options.hint }));
  }

  button.addEventListener('click', () => {
    if (!button.disabled) {
      options.onClick();
    }
  });

  const setDisabled = (disabled: boolean): void => {
    button.disabled = disabled;
    button.setAttribute('aria-disabled', String(disabled));
  };

  setDisabled(options.disabled ?? false);

  return { element: button, setDisabled };
}
