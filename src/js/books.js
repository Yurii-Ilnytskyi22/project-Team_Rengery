import axios from 'axios';

// Налаштування API

const booksApi = axios.create({
  baseURL: 'https://books-backend-v2.b.goit.study',
});

const categoriesList = document.querySelector('.books-categories');

// Завантаження категорій

async function getCategories() {
  const response = await booksApi.get('/books/category-list');
  return response.data;
}

// Створення списку

function renderCategories(categories) {
  categoriesList.innerHTML = '';

  const categoryNames = [
    'All categories',
    ...categories.map(category => category.list_name),
  ];

  categoryNames.forEach((name, index) => {
    const item = document.createElement('li');
    item.classList.add('books-category-item');

    const button = document.createElement('button');
    button.classList.add('books-category-button');
    button.type = 'button';
    button.textContent = name;

    if (index === 0) {
      button.classList.add('is-active');
    }

    item.append(button);
    categoriesList.append(item);
  });
}

const categoriesFilter = document.querySelector('.books-filter');
const categoriesToggle = document.querySelector('.books-filter-toggle');

// Відкриття та закриття списку

categoriesToggle.addEventListener('click', () => {
  categoriesFilter.classList.toggle('is-open');
});


// Запуск

async function initBooks() {
  try {
    const categories = await getCategories();
    renderCategories(categories);
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

initBooks();