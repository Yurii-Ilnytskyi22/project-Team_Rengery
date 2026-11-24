import axios from 'axios';
import Accordion from 'accordion-js';
import 'accordion-js/accordion.min.css';
import '/css/modal.css';

export function initModal() {
  // DOM-елементи модального вікна
  const modal = document.querySelector('.modal');
  const modalWindow = document.querySelector('.modal__window');
  const closeBtn = document.querySelector('#modal-close-btn');

  // DOM-елементи інформації про книгу
  const imageWrapper = document.querySelector('.modal__image');
  const bookInfo = document.querySelector('.modal__book-info');
  const detailsText = document.querySelector('.modal__accordion-text--details');

  // DOM-елементи керування кількістю книг
  const quantityInput = document.querySelector('.modal__quantity-input');
  const minusBtn = document.querySelector('.modal__quantity-btn--minus');
  const plusBtn = document.querySelector('.modal__quantity-btn--plus');

  // DOM-елементи покупки
  const buyForm = document.querySelector('.modal__buy-form');
  const addToCartBtn = document.querySelector('.modal__add-to-cart');
  const buyNowBtn = document.querySelector('.modal__buy-now');

  // Список книг
  const booksList = document.querySelector('.books__list');

  if (!modal || !modalWindow || !closeBtn || !booksList) return;

  // Змінні
  const booksApi = axios.create({
    baseURL: 'https://books-backend-v2.b.goit.study/books/',
  });

  let currentBook = null;
  let isLoading = false;

  // Ініціалізація акордеона
  const accordion = new Accordion('.modal__accordion', {
    duration: 400,
    showMultiple: false,
  });

  // Блокування кнопок під час завантаження
  function setControlsDisabled(disabled) {
    if (addToCartBtn) addToCartBtn.disabled = disabled;
    if (buyNowBtn) buyNowBtn.disabled = disabled;
    if (minusBtn) minusBtn.disabled = disabled;
    if (plusBtn) plusBtn.disabled = disabled;
  }

  // Відкриття модального вікна
  async function openModal(bookId) {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');

    quantityInput.value = 1;
    currentBook = null;
    isLoading = true;
    setControlsDisabled(true);

    // Очищення інформації про попередню книгу
    imageWrapper.replaceChildren();
    bookInfo.replaceChildren();
    detailsText.textContent = '';
    accordion.update();

    try {
      const response = await booksApi.get(`/${bookId}`);
      const book = response.data;

      currentBook = book;
      renderBook(book);
    } catch (error) {
      console.error('Помилка завантаження книги:', error);
    } finally {
      isLoading = false;
      setControlsDisabled(false);
    }
  }

  // Відображення інформації про книгу
  function renderBook(book) {
    // Зображення книги
    const image = document.createElement('img');
    image.src = book.book_image;
    image.alt = book.title;
    image.decoding = 'async';

    imageWrapper.append(image);

    // Назва книги
    const title = document.createElement('h2');
    title.classList.add('modal__book-title');
    title.textContent = book.title;

    // Автор книги
    const author = document.createElement('p');
    author.classList.add('modal__book-author');
    author.textContent = book.author;

    // Ціна книги
    const price = document.createElement('p');
    price.classList.add('modal__book-price');
    price.textContent = `$${book.price}`;

    bookInfo.append(title, author, price);

    // Опис книги
    detailsText.textContent = book.description;
    accordion.update();
  }

  // Закриття модального вікна
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');

    currentBook = null;
  }

  // Збільшення кількості книг
  function increaseQuantity() {
    quantityInput.value = Number(quantityInput.value) + 1;
  }

  // Зменшення кількості книг
  function decreaseQuantity() {
    const quantity = Number(quantityInput.value);

    if (quantity > 1) {
      quantityInput.value = quantity - 1;
    }
  }

  // Додавання книги до кошика
  function handleAddToCart() {
    if (isLoading || !currentBook) return;

    const quantity = Number(quantityInput.value);

    console.log({
      id: currentBook._id,
      title: currentBook.title,
      quantity,
    });

    alert(`Added ${quantity} books to cart`);
  }

  // Оформлення покупки
  function handleBuyNow(event) {
    event.preventDefault();

    if (isLoading || !currentBook) return;

    alert('Дякуємо за покупку');

    closeModal();
  }

  // Обробники подій

  // Відкриття модального вікна при натисканні кнопки Learn more
  booksList.addEventListener('click', event => {
    const button = event.target.closest('.books__learn-more');

    if (!button) return;

    const bookId = button.value;
    if (!bookId) return;

    openModal(bookId);
  });

  // Закриття модального вікна кнопкою
  closeBtn.addEventListener('click', closeModal);

  // Закриття модального вікна при натисканні на затемнений фон
  modal.addEventListener('click', event => {
    if (!modalWindow.contains(event.target)) {
      closeModal();
    }
  });

  // Закриття модального вікна клавішею Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Обробники кнопок зміни кількості книг
  plusBtn?.addEventListener('click', increaseQuantity);
  minusBtn?.addEventListener('click', decreaseQuantity);

  // Обробник кнопки додавання до кошика
  addToCartBtn?.addEventListener('click', handleAddToCart);

  // Обробник форми покупки
  buyForm?.addEventListener('submit', handleBuyNow);
}