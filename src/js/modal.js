import Accordion from 'accordion-js';
import 'accordion-js/accordion.min.css';
import '/css/modal.css';

const modal = document.querySelector('.modal-window');
const closeBtn = document.querySelector('#modal-close-btn');

const imageWrapper = document.querySelector('.book-img-wrapper');
const bookInfo = document.querySelector('.book-content-inform');

const detailsText = document.querySelector('.details-text');

const quantityInput = document.querySelector('.book-quantity');
const minusBtn = document.querySelector('.btn-minus');
const plusBtn = document.querySelector('.btn-plus');

const buyForm = document.querySelector('.modal-bookform-buy');
const addToCartBtn = document.querySelector('.btm-add-to-card');

let currentBook;

const API_BOOK_ID = 'https://books-backend-v2.b.goit.study/books/';

const accordion = new Accordion('.modal-addit-book-inform', {
  duration: 400,
  showMultiple: false,
});

export async function openModal(bookId) {
  modal.classList.add('is-open');
  document.body.classList.add('modal-open');

  quantityInput.value = 1;
  currentBook = null;

  imageWrapper.innerHTML = '';
  bookInfo.innerHTML = '';
  detailsText.textContent = '';

  try {
    const response = await fetch(`${API_BOOK_ID}${bookId}`);

    if (!response.ok) {
      throw new Error('Failed to retrieve book information');
    }

    const book = await response.json();

    currentBook = book;

    renderBook(book);
  } catch (error) {
    console.error('Error loading book:', error);
    bookInfo.textContent = 'Failed to load book information';
  }
}

function renderBook(book) {
  // Зображення
  const image = document.createElement('img');

  image.src = book.book_image;
  image.alt = book.title;

  imageWrapper.append(image);

  // Назва
  const title = document.createElement('h1');

  title.classList.add('modal-book-title');
  title.textContent = book.title;

  // Автор
  const author = document.createElement('p');

  author.classList.add('modal-book-author');
  author.textContent = book.author;

  // Ціна
  const price = document.createElement('p');

  price.classList.add('modal-book-price');
  price.textContent = `$${book.price}`;

  bookInfo.append(title, author, price);

  // Details
  detailsText.textContent = book.description;
}

function closeModal() {
  modal.classList.remove('is-open');
  document.body.classList.remove('modal-open');

  currentBook = null;
}

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', event => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

function increaseQuantity() {
  quantityInput.value += 1;
}

function decreaseQuantity() {
  if (quantityInput.value > 1) {
    quantityInput.value -= 1;
  }
}

plusBtn.addEventListener('click', increaseQuantity);
minusBtn.addEventListener('click', decreaseQuantity);

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

addToCartBtn.addEventListener('click', handleAddToCart);

function handleBuyNow(event) {
  event.preventDefault();

  if (!currentBook) return;

  alert('Дякуємо за покупку');

  closeModal();
}

buyForm.addEventListener('submit', handleBuyNow);
