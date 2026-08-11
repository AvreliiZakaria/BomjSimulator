import { bus } from '../core/bus';
import { el } from './dom';
import { CharacterCreationScreen } from './screens/CharacterCreationScreen';
import { GameHudScreen } from './screens/GameHudScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { MainMenuScreen } from './screens/MainMenuScreen';
import { PauseScreen } from './screens/PauseScreen';

export class UIManager {
  private readonly screenLayer = el('div', { class: 'ui-layer ui-layer--screens' });
  private readonly modalLayer = el('div', { class: 'ui-layer ui-layer--modals' });
  private loading: LoadingScreen | null = null;
  private menu: MainMenuScreen | null = null;
  private character: CharacterCreationScreen | null = null;
  private hud: GameHudScreen | null = null;
  private pause: PauseScreen | null = null;
  public constructor(private readonly root: HTMLElement) {}

  public start(): void {
    this.root.append(this.screenLayer, this.modalLayer, el('div', { class: 'fx fx--vignette' }));
    this.loading = new LoadingScreen(); this.loading.mount(this.screenLayer);
    bus.on('preload:progress', (value) => this.loading?.setProgress(value));
    bus.on('preload:complete', () => { this.loading?.hide(); this.loading = null; });
    bus.on('menu:enter', () => { this.character?.unmount(); this.character = null; this.menu?.unmount(); this.menu = new MainMenuScreen(this.modalLayer); this.menu.mount(this.screenLayer); });
    bus.on('menu:leave', () => { this.menu?.unmount(); this.menu = null; this.character?.unmount(); this.character = null; this.pause?.unmount(); this.pause = null; });
    bus.on('character:enter', () => { this.menu?.unmount(); this.menu = null; this.character?.unmount(); this.character = new CharacterCreationScreen(); this.character.mount(this.screenLayer); });
    bus.on('character:leave', () => { this.character?.unmount(); this.character = null; });
    bus.on('game:enter', (data) => { this.character?.unmount(); this.character = null; this.hud?.unmount(); this.hud = new GameHudScreen({ ...data, time: { ...data.time, day: data.day } }); this.hud.mount(this.screenLayer); });
    bus.on('game:time', (time) => this.hud?.updateTime(time));
    bus.on('game:leave', () => { this.hud?.unmount(); this.hud = null; this.pause?.unmount(); this.pause = null; });
    bus.on('ui:pause', () => { if (!this.pause) { this.pause = new PauseScreen(this.modalLayer); this.pause.mount(this.screenLayer); } });
    bus.on('ui:resume', () => { this.pause?.unmount(); this.pause = null; });
  }
}
