let modalController = null;

export function initRegisterModal() {
  if (modalController) {
    return modalController;
  }

  const backdrop = document.querySelector('[data-event-modal]');
  if (!backdrop) {
    modalController = { open: () => {}, close: () => {} };
    return modalController;
  }

  const eventTitleEl = backdrop.querySelector('[data-modal-event-title]');
  const eventInput = backdrop.querySelector('[name="event"]');
  const form = backdrop.querySelector('.modal__form');
  const nameInput = backdrop.querySelector('[name="name"]');
  const emailInput = backdrop.querySelector('[name="email"]');
  const nameError = backdrop.querySelector('[data-error-for="name"]');
  const emailError = backdrop.querySelector('[data-error-for="email"]');

  let lastFocusedElement = null;

  function setFieldError(input, errorEl, message = '') {
    if (input) {
      input.classList.toggle('is-invalid', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearErrors() {
    setFieldError(nameInput, nameError, '');
    setFieldError(emailInput, emailError, '');
  }

  function open(eventName = '') {
    lastFocusedElement = document.activeElement;
    clearErrors();

    const resolvedEvent =
      eventName ||
      eventTitleEl?.textContent?.trim() ||
      '';

    if (resolvedEvent) {
      if (eventTitleEl) {
        eventTitleEl.textContent = resolvedEvent;
      }
      if (eventInput) {
        eventInput.value = resolvedEvent;
      }
    }

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-modal-open');

    requestAnimationFrame(() => {
      nameInput?.focus();
    });
  }

  function close() {
    if (!backdrop.classList.contains('is-open')) return;

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
      lastFocusedElement = null;
    }
  }

  backdrop.addEventListener('click', event => {
    if (event.target === backdrop || event.target.closest('[data-modal-close]')) {
      close();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
      close();
    }
  });

  nameInput?.addEventListener('input', () => {
    if (nameInput.classList.contains('is-invalid')) {
      setFieldError(nameInput, nameError, '');
    }
  });

  emailInput?.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) {
      setFieldError(emailInput, emailError, '');
    }
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();

    const nameValue = nameInput?.value.trim() || '';
    const emailValue = emailInput?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    if (!nameValue) {
      setFieldError(nameInput, nameError, 'Please enter your name.');
      if (isValid) nameInput?.focus();
      isValid = false;
    }

    if (!emailValue) {
      setFieldError(emailInput, emailError, 'Please enter your email.');
      if (isValid) emailInput?.focus();
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      if (isValid) emailInput?.focus();
      isValid = false;
    }

    if (!isValid) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.name = nameValue;
    payload.email = emailValue;

    console.log('Event registration submitted:', payload);

    form.reset();
    clearErrors();
    close();
  });

  modalController = { open, close };
  return modalController;
}

export const initRegister = initRegisterModal;