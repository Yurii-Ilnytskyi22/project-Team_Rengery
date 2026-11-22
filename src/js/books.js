import axios from 'axios';

// Налаштування API
const booksApi = axios.create({
  baseURL: 'https://books-backend-v2.b.goit.study',
});

// Елементи секції
const categoriesList = document.querySelector('.books-categories');
const categoriesFilter = document.querySelector('.books-filter');
const categoriesToggle = document.querySelector('.books-filter-toggle');
const booksList = document.querySelector('.books-list');
const shownCounter = document.querySelector('.books-shown');
const totalCounter = document.querySelector('.books-total');
const showMoreButton = document.querySelector('.books-show-more');

// Стан секції
let allBooks = [];
let currentBooks = [];
let shownCount = 0;

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

// Завантаження категорій
async function getCategories() {
  const response = await booksApi.get('/books/category-list');
  return response.data;
}

// Завантаження книг категорії
async function getBooksByCategory(category) {
  const response = await booksApi.get('/books/category', {
    params: {
      category: category,
    },
  });

  return response.data;
}

// Обробка результатів усіх запитів
async function getAllBooks(categories) {
  const requests = categories.map(category =>
    getBooksByCategory(category.list_name)
  );

  const results = await Promise.allSettled(requests);

  const loadedBooks = [];
  const loadedCategories = [];
  const failedCategories = [];

  results.forEach((result, index) => {
    const categoryName = categories[index].list_name;

    if (result.status === 'fulfilled') {
      loadedBooks.push(...result.value);
      loadedCategories.push(categoryName);
    } else {
      failedCategories.push(categoryName);

      console.error(
        `Failed to load category: ${categoryName}`,
        result.reason
      );
    }
  });

  // Видалення повторів
  const uniqueIds = new Set();

  const books = loadedBooks.filter(book => {
    if (uniqueIds.has(book._id)) {
      return false;
    }

    uniqueIds.add(book._id);
    return true;
  });

  return {
    books,
    loadedCategories,
    failedCategories,
  };
}

// Відображення категорій
function renderCategories(categories) {
  const names = [
    'All categories',
    ...categories.map(category => category.list_name),
  ];

  const markup = names
    .map(
      (name, index) => `
        <li class="books-category-item">
          <button
            class="books-category-button${index === 0 ? ' is-active' : ''}"
            type="button"
            disabled
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
    <li class="books-item">
      ${
        imageUrl
          ? `<img
              class="books-image"
              src="${imageUrl}"
              alt="${title}"
              loading="lazy"
            >`
          : ''
      }

      <div class="books-info">
        <div class="books-description">
          <h4 class="books-name" title="${title}">${title}</h4>
          <p class="books-author">${author}</p>
        </div>

        <p class="books-price">${price}</p>
      </div>

      <button
        class="books-learn-more"
        type="button"
        value="${id}"
      >
        Learn More
      </button>
    </li>
  `;
}

// Оновлення лічильника та кнопки
function updateBooksState() {
  shownCounter.textContent = shownCount;
  totalCounter.textContent = currentBooks.length;

  if (shownCount >= currentBooks.length) {
    showMoreButton.classList.add('is-hidden');
  } else {
    showMoreButton.classList.remove('is-hidden');
  }
}

// Додавання порції книг
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

// Початкове відображення
function displayBooks(books) {
  currentBooks = books;
  shownCount = 0;
  booksList.innerHTML = '';

  const initialCount = window.innerWidth >= 1440 ? 24 : 10;
  appendBooks(initialCount);

  if (currentBooks.length === 0) {
    booksList.insertAdjacentHTML(
      'beforeend',
      '<li class="books-empty">No books found.</li>'
    );
  }
}

// Вибір категорії
function handleCategoryClick(event) {
  const button = event.target.closest('.books-category-button');

  if (!button || button.disabled) {
    return;
  }

  const activeButton = categoriesList.querySelector('.is-active');

  if (activeButton) {
    activeButton.classList.remove('is-active');
  }

  button.classList.add('is-active');

  const categoryName = button.textContent.trim();

  const filteredBooks =
    categoryName === 'All categories'
      ? allBooks
      : allBooks.filter(book => book.list_name === categoryName);

  displayBooks(filteredBooks);
  categoriesFilter.classList.remove('is-open');
}

// Ініціалізація секції
export async function initBooks() {
  categoriesToggle.addEventListener('click', () => {
    categoriesFilter.classList.toggle('is-open');
  });

  categoriesList.addEventListener('click', handleCategoryClick);

  showMoreButton.addEventListener('click', () => {
    appendBooks(4);
  });

  // Закриття кліком поза фільтром
  document.addEventListener('click', event => {
    if (!categoriesFilter.contains(event.target)) {
      categoriesFilter.classList.remove('is-open');
    }
  });

  // Закриття клавішею Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      categoriesFilter.classList.remove('is-open');
    }
  });

  try {
    const categories = await getCategories();
    renderCategories(categories);

    const result = await getAllBooks(categories);

    if (result.loadedCategories.length === 0) {
      throw new Error('No categories could be loaded.');
    }

    allBooks = result.books;
    displayBooks(allBooks);

    // Розблокування завантажених категорій
    categoriesList
      .querySelectorAll('.books-category-button')
      .forEach(button => {
        const name = button.textContent.trim();

        button.disabled =
          name !== 'All categories' &&
          !result.loadedCategories.includes(name);
      });

    // Повідомлення про часткове завантаження
    if (result.failedCategories.length > 0) {
      booksList.insertAdjacentHTML(
        'beforebegin',
        `<p class="books-load-warning">
          Some categories failed to load. Please refresh the page.
        </p>`
      );
    }
  } catch (error) {
    console.error('Failed to load books:', error);

    booksList.innerHTML = '';
    booksList.insertAdjacentHTML(
      'beforeend',
      `<li class="books-empty">
        Failed to load books. Please refresh the page.
      </li>`
    );

    showMoreButton.classList.add('is-hidden');
  }
}