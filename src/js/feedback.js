import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const feedbacksSwiper = new Swiper('.feedbacks-slider', {
  modules: [Navigation, Pagination, Keyboard, A11y],

  slidesPerView: 1,
  spaceBetween: 24,

  loop: false,

  grabCursor: true,
  simulateTouch: true,

  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },

  navigation: {
    nextEl: '.feedbacks__btn--next',
    prevEl: '.feedbacks__btn--prev',
  },

  pagination: {
    el: '.feedbacks__pagination',
    clickable: true,
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