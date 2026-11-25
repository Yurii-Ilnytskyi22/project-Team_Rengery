import {
  initBooksyLoader,
  showBooksyLoader,
  hideBooksyLoader,
  initBooksyAnimationPreview,
} from './booksy-loader.js';
import axios from 'axios';

const booksApi = axios.create({
  baseURL: 'https://books-backend-v2.b.goit.study',
});

const categoriesList = document.querySelector('.books__categories');
const categoriesFilter = document.querySelector('.books__filter');
const categoriesToggle = document.querySelector('.books__filter-toggle');
const booksList = document.querySelector('.books__list');
const shownCounter = document.querySelector('.books__shown');
const totalCounter = document.querySelector('.books__total');
const showMoreButton = document.querySelector('.books__show-more');

let allBooks = [];
let currentBooks = [];
let shownCount = 0;
let isLoading = false;

// Екранування тексту
function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Перевірка адреси зображення
function getImageUrl(value) {
  try {
    const url = new URL(value);

    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return escapeHTML(url.href);
    }
  } catch {
    return '';
  }

  return '';
}

// Видалення повторів за ID
function removeDuplicateBooks(books) {
  const uniqueIds = new Set();

  return books.filter(book => {
    if (uniqueIds.has(book._id)) {
      return false;
    }

    uniqueIds.add(book._id);
    return true;
  });
}

// Список категорій
async function getCategories() {
  const response = await booksApi.get('/books/category-list');
  return response.data;
}

// Початкова добірка
async function getTopBooks() {
  const response = await booksApi.get('/books/top-books');
  const books = response.data.flatMap(category => category.books);

  return removeDuplicateBooks(books);
}

// Книги вибраної категорії
async function getBooksByCategory(category) {
  const response = await booksApi.get('/books/category', {
    params: {
      category,
    },
  });

  return removeDuplicateBooks(response.data);
}

// Стан завантаження
function setLoading(loading) {
  isLoading = loading;
  categoriesToggle.disabled = loading;
  showMoreButton.disabled = loading;

  categoriesList
    .querySelectorAll('.books__category-button')
    .forEach(button => {
      button.disabled = loading;
    });

  if (loading) {
    showBooksyLoader();
  } else {
    hideBooksyLoader();
  }
}

// Розмітка категорій
function renderCategories(categories) {
  const categoryNames = categories
    .map(category => category.list_name)
    .filter(name => typeof name === 'string' && name.trim() !== '');

  const names = ['All categories', ...categoryNames];

  const markup = names
    .map(
      (name, index) => `
        <li class="books__category-item">
          <button
            class="books__category-button${index === 0 ? ' is-active' : ''}"
            type="button"
            ${isLoading ? 'disabled' : ''}
          >
            ${escapeHTML(name)}
          </button>
        </li>
      `
    )
    .join('');

  categoriesList.innerHTML = '';
  categoriesList.insertAdjacentHTML('beforeend', markup);
}

// Розмітка картки
function createBookMarkup(book) {
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  const id = escapeHTML(book._id);
  const imageUrl = getImageUrl(book.book_image);

  const priceValue = Number(book.price);
  const price =
    book.price !== null &&
    book.price !== undefined &&
    book.price !== '' &&
    Number.isFinite(priceValue)
      ? `$${priceValue.toFixed(2)}`
      : 'Price unavailable';

  return `
    <li class="books__item">
      ${
        imageUrl
          ? `<img
              class="books__image"
              src="${imageUrl}"
              alt="${title}"
              loading="lazy"
            >`
          : ''
      }

      <div class="books__info">
        <div class="books__description">
          <h4 class="books__name" title="${title}">${title}</h4>
          <p class="books__author">${author}</p>
        </div>

        <p class="books__price">${price}</p>
      </div>

      <button
        class="books__learn-more"
        type="button"
        value="${id}"
      >
        Learn More
      </button>
    </li>
  `;
}

// Лічильник і Show More
function updateBooksState() {
  shownCounter.textContent = shownCount;
  totalCounter.textContent = currentBooks.length;

  if (shownCount >= currentBooks.length) {
    showMoreButton.classList.add('is-hidden');
  } else {
    showMoreButton.classList.remove('is-hidden');
  }
}

// Очищення списку
function clearBooks() {
  currentBooks = [];
  shownCount = 0;
  booksList.innerHTML = '';

  updateBooksState();
}

// Наступна порція
function appendBooks(amount) {
  const nextBooks = currentBooks.slice(
    shownCount,
    shownCount + amount
  );

  const markup = nextBooks.map(createBookMarkup).join('');

  booksList.insertAdjacentHTML('beforeend', markup);

  shownCount += nextBooks.length;
  updateBooksState();
}

// Показ списку книг
function displayBooks(books) {
  clearBooks();
  currentBooks = books;

  const initialCount = window.innerWidth >= 1440 ? 24 : 10;
  appendBooks(initialCount);

  if (currentBooks.length === 0) {
    booksList.insertAdjacentHTML(
      'beforeend',
      '<li class="books__empty">No books found.</li>'
    );
  }
}

// Прибирання повідомлення
function removeBooksWarning() {
  categoriesFilter
    .closest('.books')
    .querySelector('.books__load-warning')
    ?.remove();
}

// Повідомлення без видалення карток
function showBooksWarning(error) {
  removeBooksWarning();

  const status = error.response?.status;
  const serverMessage = error.response?.data?.message;

  const isRateLimit =
    status === 429 ||
    (typeof serverMessage === 'string' &&
      serverMessage.includes('429'));

  const message = isRateLimit
    ? 'Too many requests. Please try again later.'
    : 'Failed to load this category. Please try again later.';

  booksList.insertAdjacentHTML(
    'beforebegin',
    `<p class="books__load-warning" role="alert">
      ${message}
    </p>`
  );
}

// Активна категорія
function setActiveCategory(button) {
  const activeButton = categoriesList.querySelector('.is-active');

  activeButton?.classList.remove('is-active');
  button.classList.add('is-active');
}

// Початок списку
function scrollToBooks() {
  booksList.scrollIntoView({
    block: 'start',
    behavior: 'instant',
  });
}

// Вибір категорії
async function handleCategoryClick(event) {
  const button = event.target.closest('.books__category-button');

  if (!button || button.disabled || isLoading) {
    return;
  }

  const categoryName = button.textContent.trim();
  const activeButton = categoriesList.querySelector('.is-active');

  categoriesFilter.classList.remove('is-open');
  removeBooksWarning();

  if (button === activeButton) {
    return;
  }

  // Повернення до початкової добірки
  if (categoryName === 'All categories') {
    setActiveCategory(button);
    displayBooks(allBooks);
    scrollToBooks();
    return;
  }

  // Старі картки залишаються під завантажувачем
  setLoading(true);

  try {
    const books = await getBooksByCategory(categoryName);

    setActiveCategory(button);
    displayBooks(books);
    scrollToBooks();
  } catch (error) {
    console.error('Failed to load category:', error);

    // Залишаємо попередній список і категорію
    showBooksWarning(error);
  } finally {
    setLoading(false);
  }
}

// Ініціалізація секції
export async function initBooks() {
  categoriesToggle.addEventListener('click', () => {
    categoriesFilter.classList.toggle('is-open');
  });

  categoriesList.addEventListener('click', handleCategoryClick);

  showMoreButton.addEventListener('click', () => {
    if (isLoading) {
      return;
    }

    appendBooks(4);
  });

  document.addEventListener('click', event => {
    if (!categoriesFilter.contains(event.target)) {
      categoriesFilter.classList.remove('is-open');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      categoriesFilter.classList.remove('is-open');
    }
  });

  initBooksyLoader();
  initBooksyAnimationPreview();

  clearBooks();
  setLoading(true);

  try {
    const [categories, books] = await Promise.all([
      getCategories(),
      getTopBooks(),
    ]);

    allBooks = books;

    renderCategories(categories);
    displayBooks(allBooks);
  } catch (error) {
    console.error('Failed to load books:', error);

    clearBooks();

    booksList.insertAdjacentHTML(
      'beforeend',
      `<li class="books__empty">
        Failed to load books. Please refresh the page.
      </li>`
    );
  } finally {
    setLoading(false);
  }
}