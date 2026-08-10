import { bus } from '../core/bus';
import { el } from './dom';
import { GameHudScreen } from './screens/GameHudScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { MainMenuScreen } from './screens/MainMenuScreen';

/**
 * Единственное место, где DOM-интерфейс подписан на события игры.
 * Экраны создаются и уничтожаются целиком, без ручного скрытия узлов.
 */
export class UIManager {
  private readonly screenLayer = el('div', { class: 'ui-layer ui-layer--screens' });

  private readonly modalLayer = el('div', { class: 'ui-layer ui-layer--modals' });

  private loading: LoadingScreen | null = null;

  private menu: MainMenuScreen | null = null;

  private hud: GameHudScreen | null = null;

  public constructor(private readonly root: HTMLElement) {}

  public start(): void {
    this.root.append(this.screenLayer, this.modalLayer, el('div', { class: 'fx fx--vignette' }));

    this.loading = new LoadingScreen();
    this.loading.mount(this.screenLayer);

    bus.on('preload:progress', (value) => this.loading?.setProgress(value));

    bus.on('preload:complete', () => {
      this.loading?.hide();
      this.loading = null;
    });

    bus.on('menu:enter', () => {
      this.menu?.unmount();
      this.menu = new MainMenuScreen(this.modalLayer);
      this.menu.mount(this.screenLayer);
    });

    bus.on('menu:leave', () => {
      this.menu?.unmount();
      this.menu = null;
    });

    bus.on('game:enter', ({ day }) => {
      this.hud?.unmount();
      this.hud = new GameHudScreen(day);
      this.hud.mount(this.screenLayer);
    });

    bus.on('game:leave', () => {
      this.hud?.unmount();
      this.hud = null;
    });
  }
}
