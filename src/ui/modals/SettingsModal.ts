import { t } from '../../data/localization';
import {
  settingsService,
  type FpsSetting,
  type QualitySetting,
  type UiScaleSetting,
} from '../../services/SettingsService';
import { createButton } from '../components/Button';
import { Modal } from '../components/Modal';
import { createSegmented } from '../components/Segmented';
import { createSlider } from '../components/Slider';
import { el } from '../dom';

function section(title: string, children: HTMLElement[]): HTMLElement {
  return el('section', { class: 'settings__section' }, [
    el('h3', { class: 'settings__title', text: title }),
    ...children,
  ]);
}

function note(text: string): HTMLElement {
  return el('p', { class: 'text text--note', text });
}

export function openSettingsModal(layer: HTMLElement): void {
  const settings = settingsService.get();

  const body = el('div', { class: 'settings' }, [
    section(t('settings.section.graphics'), [
      createSegmented<QualitySetting>({
        label: t('settings.quality'),
        value: settings.quality,
        options: [
          { value: 'auto', label: t('settings.quality.auto') },
          { value: 'low', label: t('settings.quality.low') },
          { value: 'medium', label: t('settings.quality.medium') },
          { value: 'high', label: t('settings.quality.high') },
        ],
        onChange: (quality) => settingsService.set({ quality }),
      }),
      createSegmented<FpsSetting>({
        label: t('settings.fps'),
        value: settings.fps,
        options: [
          { value: 30, label: t('settings.fps.30') },
          { value: 60, label: t('settings.fps.60') },
        ],
        onChange: (fps) => settingsService.set({ fps }),
      }),
      note(t('settings.fps.note')),
    ]),

    section(t('settings.section.sound'), [
      createSlider({
        label: t('settings.volume.master'),
        value: settings.volumeMaster,
        onChange: (volumeMaster) => settingsService.set({ volumeMaster }),
      }),
      createSlider({
        label: t('settings.volume.music'),
        value: settings.volumeMusic,
        onChange: (volumeMusic) => settingsService.set({ volumeMusic }),
      }),
      createSlider({
        label: t('settings.volume.sfx'),
        value: settings.volumeSfx,
        onChange: (volumeSfx) => settingsService.set({ volumeSfx }),
      }),
      note(t('settings.sound.note')),
    ]),

    section(t('settings.section.interface'), [
      createSegmented<UiScaleSetting>({
        label: t('settings.uiScale'),
        value: settings.uiScale,
        options: [
          { value: 'small', label: t('settings.uiScale.small') },
          { value: 'normal', label: t('settings.uiScale.normal') },
          { value: 'large', label: t('settings.uiScale.large') },
        ],
        onChange: (uiScale) => settingsService.set({ uiScale }),
      }),
    ]),

    section(t('settings.section.accessibility'), [
      createSegmented<'on' | 'off'>({
        label: t('settings.reduceMotion'),
        value: settings.reduceMotion ? 'on' : 'off',
        options: [
          { value: 'on', label: t('common.on') },
          { value: 'off', label: t('common.off') },
        ],
        onChange: (value) => settingsService.set({ reduceMotion: value === 'on' }),
      }),
      note(t('settings.reduceMotion.note')),
    ]),
  ]);

  const modal = new Modal({
    title: t('settings.title'),
    body,
    actions: [
      createButton({
        label: t('common.close'),
        variant: 'secondary',
        onClick: () => modal.close(),
      }).element,
    ],
  });

  modal.open(layer);
}
