let loader;

// Книга з крилами-сторінками
function createBook(index) {
  const directions = [
    'northwest',
    'northeast',
    'southwest',
    'southeast',
  ];

  const x =
    index < 4
      ? [0, 65, 125, 180][index]
      : 25 + ((index - 4) % 4) * 57;

  const y =
    index < 4
      ? [-24, 30, -38, 14][index]
      : -76 +
        Math.floor((index - 4) / 4) * 94 +
        ((index - 4) % 3) * 13;

  const lines = '<i></i>'.repeat(3);

  return `
    <div
      class="flock-flight ${directions[index % 4]}"
      style="--bx: ${x}px; --by: ${y}px"
      aria-hidden="true"
    >
      <div
        class="flock-bird"
        style="animation-delay: ${-index * 0.11}s"
      >
        <div class="wing left">${lines}</div>
        <div class="wing right">${lines}</div>
        <div class="bird-spine"></div>
        <div class="bookmark"></div>
      </div>
    </div>
  `;
}

// П'ять хлопців і п'ять дівчат
function createStudent(index) {
  const glasses = [0, 3, 6].includes(index)
    ? '<span class="student-glasses"></span>'
    : '';

  const scarf = [2, 7].includes(index)
    ? ' student-scarf'
    : '';

  const actions = {
    3: ' student-tumble',
    6: ' student-stumble',
    8: ' student-skid',
  };

  const action = actions[index] || '';
  const gender = index % 2 ? 'girl' : 'boy';

  return `
    <div
      class="catcher student-${gender}${scarf}${action}"
      style="--n: ${index}"
    >
      <div class="person">
        <b></b>
        <i></i>
        <em></em>

        <span class="net">
          <u></u>
        </span>

        <span class="student-hair"></span>
        ${glasses}
      </div>
    </div>
  `;
}

// Створення анімації
export function initBooksyLoader() {
  const root = document.getElementById('booksy-flock');

  if (!root || root === loader) {
    return;
  }

  loader = root;

  const booksMarkup = Array.from(
    { length: 12 },
    (_, index) => createBook(index)
  ).join('');

  root
    .querySelector('.flock-stage')
    .insertAdjacentHTML('afterbegin', booksMarkup);

  const studentsMarkup = Array.from(
    { length: 10 },
    (_, index) => createStudent(index)
  ).join('');

  root
    .querySelector('.flock-catchers')
    .insertAdjacentHTML('beforeend', studentsMarkup);

  const rescueMarkup = ['one', 'two']
    .map(
      side => `
        <div class="fallen fallen-${side}">
          <div class="rescue-person">
            <b></b>
            <i></i>
            <em></em>
          </div>

          <span class="rescue-sign">
            Almost there…
          </span>
        </div>
      `
    )
    .join('');

  root
    .querySelector('.flock-rescue')
    .insertAdjacentHTML(
      'beforeend',
      rescueMarkup +
        `
          <div class="rescue-message">
            Nobody gets left behind!
          </div>
        `
    );
}

// Показ
export function showBooksyLoader() {
  if (loader) {
    loader.hidden = false;
  }
}

// Приховування
export function hideBooksyLoader() {
  if (loader) {
    loader.hidden = true;
  }
}

// Перегляд анімації за кнопкою
export function initBooksyAnimationPreview() {
  const button = document.querySelector('.books__animation-button');
  const dialog = document.querySelector('.books__animation-dialog');
  const closeButton = document.querySelector('.books__animation-close');
  const content = document.querySelector('.books__animation-content');

  if (!button || !dialog || !closeButton || !content || !loader) {
    return;
  }

  // Місце повернення завантажувача
  const originalParent = loader.parentNode;
  const originalNextElement = loader.nextSibling;

  function openPreview() {
    // Під час завантаження каталогу анімація зайнята
    if (!loader.hidden || dialog.open) {
      return;
    }

    content.append(loader);
    showBooksyLoader();

    dialog.showModal();
    document.body.classList.add('books-animation-open');
  }

  function closePreview() {
    dialog.close();
  }

  // Повернення анімації в секцію Books
  dialog.addEventListener('close', () => {
    hideBooksyLoader();
    originalParent.insertBefore(loader, originalNextElement);
    document.body.classList.remove('books-animation-open');
  });

  button.addEventListener('click', openPreview);
  closeButton.addEventListener('click', closePreview);

  // Закриття натисканням поза вікном
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) {
      return;
    }

    const rect = dialog.getBoundingClientRect();

    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) {
      closePreview();
    }
  });
}