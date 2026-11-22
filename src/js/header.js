
export function initHeader() {
  const openBtn = document.querySelector('.menu-btn');
  const closeBtn = document.querySelector('.menu-close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.menu-nav-link');

  if (!openBtn || !closeBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.inert = false;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');

    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    closeBtn.focus();
  }

  function closeMenu(restoreFocus = true) {
    if (restoreFocus) {
      openBtn.focus();
    }

    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.inert = true;

    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  // Открытие меню
  openBtn.addEventListener('click', openMenu);

  // Закрытие по крестику
  closeBtn.addEventListener('click', () => closeMenu());

  // Закрытие при переходе к секции
  menuLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu(false));
  });

  // Закрытие по Escape
  document.addEventListener('keydown', event => {
    if (!mobileMenu.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeMenu();
    }

    // Удерживаем фокус внутри открытого меню
    if (event.key === 'Tab') {
      const focusable = [
        ...mobileMenu.querySelectorAll(
          'a[href], button:not(:disabled)'
        ),
      ];

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Закрытие меню при переходе на планшетную ширину
  window
    .matchMedia('(min-width: 768px)')
    .addEventListener('change', event => {
      if (
        event.matches &&
        mobileMenu.classList.contains('is-open')
      ) {
        closeMenu(false);
      }
    });
}
