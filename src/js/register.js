export function initRegisterModal() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const backdrop = document.querySelector('[data-event-modal]');
  if (!backdrop) return;

  const titleEl = backdrop.querySelector('[data-modal-event-title]');
  const eventInput = backdrop.querySelector('[name="event"]');
  const form = backdrop.querySelector('.event-modal__form');
  const nameInput = backdrop.querySelector('[name="name"]');
  const emailInput = backdrop.querySelector('[name="email"]');
  const nameError = backdrop.querySelector('[data-error-for="name"]');
  const emailError = backdrop.querySelector('[data-error-for="email"]');

  function clearErrors() {
    nameInput?.classList.remove('is-invalid');
    emailInput?.classList.remove('is-invalid');
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
  }

  function openModal(eventName) {
    clearErrors();

    const resolvedEvent = eventName || titleEl?.textContent?.trim() || '';

    if (resolvedEvent) {
      if (titleEl) {
        titleEl.textContent = resolvedEvent;
      }
      if (eventInput) {
        eventInput.value = resolvedEvent;
      }
    }

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-event-modal-open');
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-event-modal-open');
  }

  document.getElementById('events')?.addEventListener('click', event => {
    const btn = event.target.closest('.event__btn');
    if (!btn) return;

    const eventName =
      btn.dataset.event ||
      btn.closest('.swiper__slide-events')?.querySelector('.event__title')?.textContent?.trim() ||
      '';

    openModal(eventName);
  });

  backdrop.addEventListener('click', event => {
    if (event.target === backdrop || event.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    let isValid = true;

    if (!name) {
      nameInput?.classList.add('is-invalid');
      if (nameError) nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    if (!email) {
      emailInput?.classList.add('is-invalid');
      if (emailError) emailError.textContent = 'Please enter your email.';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailInput?.classList.add('is-invalid');
      if (emailError) emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!isValid) return;

    console.log('Event registration:', Object.fromEntries(new FormData(form)));
    form.reset();
    closeModal();
  });
}
