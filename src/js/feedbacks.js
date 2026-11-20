import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const feedbacksSwiper = new Swiper('.feedbacks-slider', {
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