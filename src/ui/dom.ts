export type ElementAttributes = Record<string, string | number | boolean | undefined>;

/**
 * Мини-хелпер для создания DOM без шаблонных движков и фреймворков.
 * Ключи `text` и `html` — служебные, остальное уходит в setAttribute.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: ElementAttributes = {},
  children: ReadonlyArray<Node | string> = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined || value === false) {
      continue;
    }

    if (name === 'class') {
      node.className = String(value);
    } else if (name === 'text') {
      node.textContent = String(value);
    } else if (name === 'html') {
      // Используется только для собственных inline-SVG иконок из icons.ts.
      node.innerHTML = String(value);
    } else {
      node.setAttribute(name, value === true ? '' : String(value));
    }
  }

  for (const child of children) {
    node.append(child);
  }

  return node;
}

/** Двойной rAF: даёт браузеру применить начальные стили до старта перехода. */
export function nextFrame(callback: () => void): void {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(callback);
  });
}

export function removeAfter(node: HTMLElement, delay: number): void {
  window.setTimeout(() => {
    node.remove();
  }, delay);
}
