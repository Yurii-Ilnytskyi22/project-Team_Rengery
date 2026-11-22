import axios from 'axios';
import Accordion from 'accordion-js';
import 'accordion-js/accordion.min.css';
import '/css/modal.css';
export function initModal() {
  // DOM-елементи модального вікна
  const modal = document.querySelector('.modal-window');
  const closeBtn = document.querySelector('#modal-close-btn');

  // DOM-елементи інформації про книгу
  const imageWrapper = document.querySelector('.book-img-wrapper');
  const bookInfo = document.querySelector('.book-content-inform');
  const detailsText = document.querySelector('.details-text');

  // DOM-елементи керування кількістю книг
  const quantityInput = document.querySelector('.book-quantity');
  const minusBtn = document.querySelector('.btn-minus');
  const plusBtn = document.querySelector('.btn-plus');

  // DOM-елементи покупки
  const buyForm = document.querySelector('.modal-bookform-buy');
  const addToCartBtn = document.querySelector('.btm-add-to-card');

  // Список книг
  const booksList = document.querySelector('.books__list');

  // Змінні

  const booksApi = axios.create({
    baseURL: 'https://books-backend-v2.b.goit.study/books/',
  });

  let currentBook;

  // Ініціалізація акордеона
  const accordion = new Accordion('.modal-addit-book-inform', {
    duration: 400,
    showMultiple: false,
  });

  // Відкриття модального вікна
  async function openModal(bookId) {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');

    quantityInput.value = 1;
    currentBook = null;

    // Очищення інформації про попередню книгу
    imageWrapper.innerHTML = '';
    bookInfo.innerHTML = '';
    detailsText.textContent = '';

    try {
      const response = await booksApi.get(`/${bookId}`);
      console.log(response);

      const book = response.data;

      currentBook = book;
      console.log(currentBook);

      renderBook(book);
    } catch (error) {
      console.error('Помилка завантаження книги:', error);
    }
  }

  // Відображення інформації про книгу
  function renderBook(book) {
    // Зображення книги
    const image = document.createElement('img');

    image.src = book.book_image;
    image.alt = book.title;

    imageWrapper.append(image);

    // Назва книги
    const title = document.createElement('h1');

    title.classList.add('modal-book-title');
    title.textContent = book.title;

    // Автор книги
    const author = document.createElement('p');

    author.classList.add('modal-book-author');
    author.textContent = book.author;

    // Ціна книги
    const price = document.createElement('p');

    price.classList.add('modal-book-price');
    price.textContent = `$${book.price}`;

    bookInfo.append(title, author, price);

    // Опис книги
    detailsText.textContent = book.description;
  }

  // Закриття модального вікна
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');

    currentBook = null;
  }

  // Збільшення кількості книг
  function increaseQuantity() {
    console.log(quantityInput);

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
    if (!currentBook) return;

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

    if (!currentBook) return;

    alert('Дякуємо за покупку');

    closeModal();
  }

  // Обробники подій

  // Відкриття модального вікна при натисканні кнопки Learn more
  booksList.addEventListener('click', event => {
    const button = event.target.closest('.books-learn-more');

    if (!button) return;

    const bookId = button.value;

    openModal(bookId);
  });

  // Закриття модального вікна кнопкою
  closeBtn.addEventListener('click', closeModal);

  // Закриття модального вікна при натисканні на затемнений фон
  modal.addEventListener('click', event => {
    if (event.target === modal) {
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
  plusBtn.addEventListener('click', increaseQuantity);
  minusBtn.addEventListener('click', decreaseQuantity);

  // Обробник кнопки додавання до кошика
  addToCartBtn.addEventListener('click', handleAddToCart);

  // Обробник форми покупки
  buyForm.addEventListener('submit', handleBuyNow);
}
