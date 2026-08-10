import { bus } from '../../core/bus';
import type { GameTime } from '../../game/systems/time/GameTimeService';
import { t } from '../../data/localization';
import { createButton } from '../components/Button';
import { el, nextFrame, removeAfter } from '../dom';
import { icons } from '../icons';

export class GameHudScreen {
  private readonly root: HTMLElement;
  private readonly money: HTMLElement;
  private readonly time: HTMLElement;
  private readonly day: HTMLElement;
  private readonly joystick: HTMLElement | null;
  private joystickPointer: number | null = null;
  public constructor(data: { day: number; money: number; time: GameTime; district: string; name: string }) {
    this.money = el('span', { class: 'hud__money', text: `${data.money} ₽` });
    this.time = el('span', { class: 'hud__time', text: `${String(data.time.hour).padStart(2, '0')}:${String(data.time.minute).padStart(2, '0')}` });
    this.day = el('span', { class: 'hud__day-value', text: t('game.day', { day: data.day }) });
    const pauseButton = createButton({ label: '≡', variant: 'ghost', hint: 'ESC', onClick: () => bus.emit('ui:pause') });
    this.joystick = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0 ? this.createJoystick() : null;
    this.root = el('div', { class: 'screen screen--game' }, [
      el('div', { class: 'hud__top' }, [pauseButton.element]),
      el('div', { class: 'hud__info' }, [this.day, el('span', { class: 'hud__district', text: data.district })]),
      el('div', { class: 'hud__stats' }, [this.money, this.time]),
      el('p', { class: 'hud__name', text: data.name }),
      ...(this.joystick ? [this.joystick] : []),
    ]);
  }
  public mount(parent: HTMLElement): void { parent.append(this.root); nextFrame(() => this.root.classList.add('is-ready')); }
  public unmount(): void { this.root.classList.add('is-leaving'); removeAfter(this.root, 340); bus.emit('ui:joystick', { x: 0, y: 0 }); }

  private createJoystick(): HTMLElement {
    const base = el('div', { class: 'joystick' });
    const knob = el('div', { class: 'joystick__knob' });
    base.append(knob);
    const radius = 46;
    const update = (event: PointerEvent): void => {
      const rect = base.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const length = Math.hypot(dx, dy);
      const scale = length > radius ? radius / length : 1;
      const x = (dx * scale) / radius;
      const y = (dy * scale) / radius;
      if (Math.hypot(x, y) < 0.16) { bus.emit('ui:joystick', { x: 0, y: 0 }); knob.style.transform = 'translate(-50%, -50%)'; return; }
      knob.style.transform = `translate(calc(-50% + ${x * radius}px), calc(-50% + ${y * radius}px))`;
      bus.emit('ui:joystick', { x, y });
    };
    base.addEventListener('pointerdown', (event) => { this.joystickPointer = event.pointerId; base.setPointerCapture(event.pointerId); update(event); });
    base.addEventListener('pointermove', (event) => { if (event.pointerId === this.joystickPointer) update(event); });
    const release = (event: PointerEvent): void => { if (event.pointerId !== this.joystickPointer) return; this.joystickPointer = null; knob.style.transform = 'translate(-50%, -50%)'; bus.emit('ui:joystick', { x: 0, y: 0 }); };
    base.addEventListener('pointerup', release); base.addEventListener('pointercancel', release);
    return base;
  }
}
