import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

export function initEvents() {
  const sliderEl = document.querySelector('.swiper__events');
  if (!sliderEl) return;

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
      768: { slidesPerView: 2, spaceBetween: 24 },
      1440: { slidesPerView: 3, spaceBetween: 24 },
    },
  });

  const eventsSection = document.getElementById('events');
  if (!eventsSection) return;

  eventsSection.addEventListener('click', event => {
    const registerBtn = event.target.closest('.event__btn');
    if (!registerBtn) return;

    const eventName = registerBtn.dataset.event || '';
    const modalBackdrop = document.querySelector('[data-event-modal]');
    const eventInput = modalBackdrop?.querySelector('[name="event"]);

    if (eventInput) {
      eventInput.value = eventName;
    }

    if (modalBackdrop) {
      modalBackdrop.classList.add('is-open');
    }
  });
}
