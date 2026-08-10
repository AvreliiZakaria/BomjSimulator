import { t } from '../../data/localization';
import { createButton } from '../components/Button';
import { Modal } from '../components/Modal';
import { el } from '../dom';

/** Честная заглушка для разделов, которых ещё нет. Без фальшивой функциональности. */
export function openComingSoonModal(layer: HTMLElement, sectionTitle: string): void {
  const body = el('div', { class: 'stack' }, [
    el('span', { class: 'badge', text: sectionTitle }),
    el('p', { class: 'text', text: t('wip.text') }),
    el('p', { class: 'text text--dim', text: t('wip.hint') }),
  ]);

  const modal = new Modal({
    title: t('wip.title'),
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
