import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

const swiperEvents = new Swiper('.swiper-events', {
  modules: [Navigation, Pagination],

  wrapperClass: 'swiper-wrapper-events',
  slideClass: 'swiper-slide-events',

  speed: 350,
  slidesPerView: 1,
  spaceBetween: 16,
  //   watchOverflow: true,

  navigation: {
    nextEl: '.swiper-events-button-next',
    prevEl: '.swiper-events-button-prev',
  },

  pagination: {
    el: '.slider-controls .swiper-pagination', // всередині секції
    clickable: true,
    bulletClass: 'custom-bullet',
    bulletActiveClass: 'custom-bullet-active',
  },

  breakpoints: {
    768: { slidesPerView: 2, spaceBetween: 24 },
    1440: { slidesPerView: 3, spaceBetween: 24 },
  },
});
