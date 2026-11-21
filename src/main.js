//import {initHeader} from './js/header.js';
//import {initHero} from './js/hero.js';
//import {initBooks} from './js/books.js';
import {initFeedback} from './js/feedbacks.js';
//import {initEvents} from './js/events.js';
//import {initFooter} from './js/footer.js';
//import {initModal} from './js/modal.js';

function safeInit(initFn, name) {
  if (typeof initFn !== 'function') {
    console.warn(`[${name}] init function is not a function`);
    return;
  }
  try {
    initFn();
  } catch (error) {
    console.error(`Error in ${name}:`, error);
  }
}

document.addEventListener('DOMContentLoaded',() => {
    //safeInit(initHeader, 'header');
    //safeInit(initHero, 'hero');
    //safeInit(initBooks, 'books');
    safeInit(initFeedback, 'feedback');
    //safeInit(initEvents, 'events');
    //safeInit(initFooter, 'footer');
    //safeInit(initModal, 'modal');
})