import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

export function initEvents() {
  const sliderEl = document.querySelector('.swiper__events');
  if (sliderEl) {
    new Swiper('.swiper__events', {
      modules: [Navigation, Pagination],
      wrapperClass: 'swiper__wrapper-events',
      slideClass: 'swiper__slide-events',
      speed: 350,
      slidesPerView: 1,
      spaceBetween: 16,
      navigation: {
        nextEl: '.swiper__events-button-next',
        prevEl: '.swiper__events-button-prev',
      },
      pagination: {
        el: '.slider__controls .swiper__pagination',
        clickable: true,
        bulletClass: 'custom__bullet',
        bulletActiveClass: 'custom__bullet-active',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  }

  const eventsSection = document.getElementById('events');
  const backdrop = document.querySelector('[data-event-modal]');
  if (!eventsSection || !backdrop) return;

  const closeBtn = backdrop.querySelector('[data-modal-close]');
  const eventTitleEl = backdrop.querySelector('[data-modal-event-title]');
  const eventInput = backdrop.querySelector('[name="event"]');
  const form = backdrop.querySelector('.modal__form');
  const nameInput = backdrop.querySelector('[name="name"]');
  const emailInput = backdrop.querySelector('[name="email"]');

  let lastFocusedElement = null;

  function openModal(eventName) {
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

  function closeModal() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-modal-open');

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  eventsSection.addEventListener('click', event => {
    const registerBtn = event.target.closest('.event__btn');
    if (!registerBtn) return;

    const eventName =
      registerBtn.dataset.event ||
      registerBtn
        .closest('.swiper__slide-events')
        ?.querySelector('.event__title')
        ?.textContent?.trim() ||
      '';

    openModal(eventName);
  });

  backdrop.addEventListener('click', event => {
    if (event.target === backdrop || event.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  closeBtn?.addEventListener('click', closeModal);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
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
    closeModal();
  });
}