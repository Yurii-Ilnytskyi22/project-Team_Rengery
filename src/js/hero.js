
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

export function initHero() {
  const slider = document.querySelector('.hero__slider');
  const prevBtn = document.querySelector('.hero__arrow--prev');
  const nextBtn = document.querySelector('.hero__arrow--next');

  if (!slider || !prevBtn || !nextBtn) return;

  const updateButtons = swiper => {
    prevBtn.disabled = swiper.isBeginning || swiper.isLocked;
    nextBtn.disabled = swiper.isEnd || swiper.isLocked;
  };

  new Swiper(slider, {
    modules: [Navigation],
    slidesPerView: 1,
    speed: 450,
    loop: false,
    watchOverflow: true,

    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },

    on: {
      init: updateButtons,
      slideChange: updateButtons,
      resize: updateButtons,
    },
  });
}