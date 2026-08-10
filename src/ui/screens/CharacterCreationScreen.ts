import { bus } from '../../core/bus';
import { APPEARANCE_LABELS, APPEARANCE_PRESETS, CLOTHING_LABELS, CLOTHING_PRESETS, type AppearancePreset, type ClothingPreset } from '../../data/game/player';
import { t } from '../../data/localization';
import { createButton } from '../components/Button';
import { el, nextFrame, removeAfter } from '../dom';

const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё0-9 _-]+$/;

function previewSvg(appearance: AppearancePreset, clothing: ClothingPreset): string {
  const skin = { 'night-owl': '#b67e63', 'red-cap': '#d6a07c', 'quiet-one': '#8f604d', 'street-poet': '#c28f70', 'winter-kid': '#e0ad89', 'lucky-scarf': '#a97058' }[appearance];
  const hair = { 'night-owl': '#171922', 'red-cap': '#6e3628', 'quiet-one': '#2a2223', 'street-poet': '#d6b18a', 'winter-kid': '#aeb5bd', 'lucky-scarf': '#20191a' }[appearance];
  const coat = { 'old-jacket': '#4a4d50', hoodie: '#5d4650', 'worn-sweatshirt': '#394a4b', 'long-coat': '#252c39' }[clothing];
  const detail = clothing === 'long-coat' ? '#c98f36' : clothing === 'hoodie' ? '#16191f' : '#d1a26b';
  return `<svg viewBox="0 0 260 360" role="img" aria-label="${APPEARANCE_LABELS[appearance]}"><defs><linearGradient id="coat" x1="0" x2="1"><stop stop-color="${coat}"/><stop offset="1" stop-color="#171a21"/></linearGradient></defs><ellipse cx="130" cy="326" rx="78" ry="14" fill="#05060a" opacity=".55"/><path d="M73 307c5-65 18-106 57-113 39 7 52 48 57 113z" fill="url(#coat)" stroke="#9d927f" stroke-opacity=".24"/><path d="M93 226l-7 73M167 226l7 73" stroke="#e2a648" stroke-opacity=".22"/><circle cx="130" cy="132" r="53" fill="${skin}"/><path d="M78 129c2-55 28-78 54-78 34 0 55 28 51 77-14-17-29-26-49-27-20-1-37 9-56 28z" fill="${hair}"/><path d="M101 144h8M151 144h8" stroke="#161318" stroke-width="5" stroke-linecap="round"/><path d="M113 169c11 7 23 7 34 0" stroke="#4e2b27" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M99 214l31 21 31-21" fill="none" stroke="${detail}" stroke-width="8"/><path d="M99 213c-8-20-4-38 2-53M161 213c8-20 4-38-2-53" stroke="#e8e5de" stroke-opacity=".18" stroke-width="2"/><circle cx="190" cy="104" r="6" fill="#e2a648" opacity=".8"/></svg>`;
}

export class CharacterCreationScreen {
  private readonly root: HTMLElement;
  private readonly nameInput: HTMLInputElement;
  private readonly count: HTMLElement;
  private readonly startButton: HTMLButtonElement;
  private appearance: AppearancePreset = APPEARANCE_PRESETS[0];
  private clothing: ClothingPreset = CLOTHING_PRESETS[0];
  private readonly preview: HTMLElement;

  public constructor() {
    this.preview = el('div', { class: 'character__preview-art', html: previewSvg(this.appearance, this.clothing) });
    this.nameInput = el('input', { class: 'character__input', type: 'text', maxlength: '16', autocomplete: 'off', placeholder: t('character.namePlaceholder'), 'aria-label': t('character.name') });
    this.count = el('span', { class: 'field__value', text: '0/16' });
    this.startButton = createButton({ label: t('character.start'), variant: 'primary', disabled: true, onClick: () => this.start() }).element;
    this.nameInput.addEventListener('input', () => this.validate());
    const appearanceGrid = el('div', { class: 'choice-grid choice-grid--appearance' }, APPEARANCE_PRESETS.map((preset, index) => this.choiceButton(APPEARANCE_LABELS[preset], preset, index === 0, 'appearance')));
    const clothingGrid = el('div', { class: 'choice-grid' }, CLOTHING_PRESETS.map((preset, index) => this.choiceButton(CLOTHING_LABELS[preset], preset, index === 0, 'clothing')));
    const cancel = createButton({ label: t('common.cancel'), variant: 'ghost', onClick: () => bus.emit('ui:character-cancel') }).element;
    this.root = el('div', { class: 'screen screen--character' }, [
      el('div', { class: 'character' }, [
        el('header', { class: 'character__header' }, [el('div', { class: 'eyebrow', text: 'НУЛЬ / ПЕРВЫЙ ШАГ' }), el('h1', { class: 'character__title', text: t('character.title') })]),
        el('div', { class: 'character__layout' }, [
          el('section', { class: 'character__preview' }, [this.preview, el('p', { class: 'character__preview-note', text: t('character.previewNote') })]),
          el('section', { class: 'character__form' }, [
            el('label', { class: 'field character__name-field' }, [el('span', { class: 'field__label', text: t('character.name') }), this.nameInput, el('span', { class: 'character__hint', text: t('character.nameHint') }), this.count]),
            el('div', { class: 'field' }, [el('span', { class: 'field__label', text: t('character.appearance') }), appearanceGrid]),
            el('div', { class: 'field' }, [el('span', { class: 'field__label', text: t('character.clothing') }), clothingGrid]),
            el('div', { class: 'character__actions' }, [cancel, this.startButton]),
          ]),
        ]),
      ]),
    ]);
  }

  public mount(parent: HTMLElement): void { parent.append(this.root); nextFrame(() => { this.root.classList.add('is-ready'); this.nameInput.focus(); }); }
  public unmount(): void { this.root.classList.add('is-leaving'); removeAfter(this.root, 300); }

  private choiceButton(label: string, value: AppearancePreset | ClothingPreset, active: boolean, kind: 'appearance' | 'clothing'): HTMLElement {
    const button = el('button', { class: `choice ${active ? 'is-active' : ''}`, type: 'button', text: label });
    button.addEventListener('click', () => {
      if (kind === 'appearance') this.appearance = value as AppearancePreset; else this.clothing = value as ClothingPreset;
      button.parentElement?.querySelectorAll('.choice').forEach((node) => node.classList.remove('is-active'));
      button.classList.add('is-active');
      this.preview.innerHTML = previewSvg(this.appearance, this.clothing);
    });
    return button;
  }

  private validate(): void {
    const clean = this.nameInput.value.trim();
    this.nameInput.value = this.nameInput.value.replace(/[^A-Za-zА-Яа-яЁё0-9 _-]/g, '');
    this.count.textContent = `${clean.length}/16`;
    const valid = clean.length >= 2 && clean.length <= 16 && NAME_PATTERN.test(clean);
    this.startButton.disabled = !valid;
    this.nameInput.setAttribute('aria-invalid', String(!valid && clean.length > 0));
  }

  private start(): void {
    const name = this.nameInput.value.trim();
    if (name.length < 2 || name.length > 16 || !NAME_PATTERN.test(name)) return;
    bus.emit('ui:character-start', { name, appearancePreset: this.appearance, clothingPreset: this.clothing });
  }
}
