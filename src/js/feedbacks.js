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

function updateButtonsState(swiper) {
    const prevBtn = document.querySelector('.feedbacks__btn--prev');
    const nextBtn = document.querySelector('.feedbacks__btn--next');
    const noScrollNeeded = swiper.isBeginning && swiper.isEnd;

    if (prevBtn) {
        prevBtn.disabled = noScrollNeeded || swiper.isBeginning;
    }

    if (nextBtn) {
        nextBtn.disabled = noScrollNeeded || swiper.isEnd;
    }
}