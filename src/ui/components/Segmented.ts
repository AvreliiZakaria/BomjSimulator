import { el } from '../dom';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
}

export interface SegmentedConfig<T extends string | number> {
  label: string;
  value: T;
  options: ReadonlyArray<SegmentedOption<T>>;
  onChange: (value: T) => void;
}

/** Переключатель вариантов вместо тяжёлых select-ов. */
export function createSegmented<T extends string | number>(config: SegmentedConfig<T>): HTMLElement {
  const group = el('div', { class: 'segmented', role: 'group', 'aria-label': config.label });
  const buttons = new Map<T, HTMLButtonElement>();

  const select = (value: T): void => {
    for (const [key, button] of buttons) {
      const active = key === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  };

  for (const option of config.options) {
    const button = el('button', {
      class: 'segmented__item',
      type: 'button',
      text: option.label,
    });

    button.addEventListener('click', () => {
      select(option.value);
      config.onChange(option.value);
    });

    buttons.set(option.value, button);
    group.append(button);
  }

  select(config.value);

  return el('div', { class: 'field field--stacked' }, [
    el('span', { class: 'field__label', text: config.label }),
    group,
  ]);
}
