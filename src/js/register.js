export function initRegisterModal() {
  const backdrop = document.querySelector('[data-event-modal]');
  if (!backdrop) return { open: () => {}, close: () => {} };

  const closeBtn = backdrop.querySelector('[data-modal-close]');
  const eventTitleEl = backdrop.querySelector('[data-modal-event-title]');
  const eventInput = backdrop.querySelector('[name="event"]');
  const form = backdrop.querySelector('.modal__form');
  const nameInput = backdrop.querySelector('[name="name"]');
  const emailInput = backdrop.querySelector('[name="email"]');

  let lastFocusedElement = null;

  function open(eventName = '') {
    lastFocusedElement = document.activeElement;

    if (eventName) {
      if (eventTitleEl) {
        eventTitleEl.textContent = eventName;
      }
      if (eventInput) {
        eventInput.value = eventName;
      }
    }

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-modal-open');

    nameInput?.focus();
  }

  function close() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');

    const hasOtherOpenModal = document.querySelector(
      '.backdrop.is-open, [data-modal].is-open, .modal-backdrop.is-open'
    );
    if (!hasOtherOpenModal) {
      document.body.classList.remove('is-modal-open');
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  backdrop.addEventListener('click', event => {
    if (event.target === backdrop || event.target.closest('[data-modal-close]')) {
      close();
    }
  });

  closeBtn?.addEventListener('click', close);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
      close();
    }
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();

    const nameValue = nameInput?.value.trim() || '';
    const emailValue = emailInput?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameValue) {
      nameInput?.focus();
      return;
    }

    if (!emailValue || !emailPattern.test(emailValue)) {
      emailInput?.focus();
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    console.log('Event registration submitted:', payload);

    form.reset();
    close();
  });

  return { open, close };
}

export const initRegister = initRegisterModal;