import Accordion from 'accordion-js';
import 'accordion-js/accordion.min.css';
import '/css/modal.css';
const modal = document.querySelector('.modal-window');
const closeBtn = document.querySelector('#modal-close-btn');
export function initModal() {
  if (!modal || !closeBtn) return;

  const accordion = new Accordion('.modal-addit-book-inform', {
    duration: 400,
    showMultiple: false,
  });

  function openModal() {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  closeBtn.addEventListener('click', closeModal);

  if (modal.classList.contains('is-open')) {
    document.body.classList.add('modal-open');
  }
}
