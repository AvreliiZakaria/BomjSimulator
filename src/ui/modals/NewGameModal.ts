import { t } from '../../data/localization';
import { createButton } from '../components/Button';
import { Modal } from '../components/Modal';
import { el } from '../dom';

export function openNewGameModal(layer: HTMLElement, onConfirm: () => void): void {
  const body = el('div', { class: 'stack' }, [el('p', { class: 'text', text: t('newGame.text') })]);

  const modal = new Modal({
    title: t('newGame.title'),
    body,
    actions: [
      createButton({
        label: t('common.cancel'),
        variant: 'ghost',
        onClick: () => modal.close(),
      }).element,
      createButton({
        label: t('newGame.confirm'),
        variant: 'primary',
        onClick: () => {
          modal.close();
          onConfirm();
        },
      }).element,
    ],
  });

  modal.open(layer);
}
