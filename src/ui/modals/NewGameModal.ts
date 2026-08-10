import { t } from '../../data/localization';
import { saveService } from '../../services/SaveService';
import { createButton } from '../components/Button';
import { Modal } from '../components/Modal';
import { el } from '../dom';

export function openNewGameModal(layer: HTMLElement, onConfirm: () => void): void {
  const hasSave = saveService.hasSave();
  const title = hasSave ? t('newGame.replaceTitle') : t('newGame.title');
  const text = hasSave ? t('newGame.replaceText') : t('newGame.text');
  const confirm = hasSave ? t('newGame.restart') : t('newGame.confirm');
  const body = el('div', { class: 'stack' }, [el('p', { class: 'text', text })]);
  const modal = new Modal({
    title,
    body,
    actions: [
      createButton({ label: t('common.cancel'), variant: 'ghost', onClick: () => modal.close() }).element,
      createButton({ label: confirm, variant: 'primary', onClick: () => { modal.close(); onConfirm(); } }).element,
    ],
  });
  modal.open(layer);
}
