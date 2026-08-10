import { el } from '../dom';

export interface SliderOptions {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/** Ползунок 0..1, наружу отдаёт долю, внутри работает с процентами. */
export function createSlider(options: SliderOptions): HTMLElement {
  const percent = Math.round(options.value * 100);
  const output = el('span', { class: 'field__value', text: `${percent}%` });

  const input = el('input', {
    class: 'slider',
    type: 'range',
    min: '0',
    max: '100',
    step: '1',
    value: String(percent),
    'aria-label': options.label,
  });

  input.addEventListener('input', () => {
    const next = Number(input.value);
    output.textContent = `${next}%`;
    options.onChange(next / 100);
  });

  return el('div', { class: 'field' }, [
    el('div', { class: 'field__head' }, [
      el('span', { class: 'field__label', text: options.label }),
      output,
    ]),
    input,
  ]);
}
