export function initHeader() {
  const openBtn = document.querySelector('.header__menu-btn');
  const closeBtn = document.querySelector('.mobile-menu__close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu__nav-link');

  if (!openBtn || !closeBtn || !mobileMenu) return;

  function openMenu() {
    mobileMenu.inert = false;
    mobileMenu.classList.add('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'false');

    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');

    closeBtn.focus();
  }

  function closeMenu(restoreFocus = true) {
    if (restoreFocus) {
      openBtn.focus();
    }

    mobileMenu.classList.remove('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.inert = true;

    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  openBtn.addEventListener('click', openMenu);

  closeBtn.addEventListener('click', () => closeMenu());

  menuLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu(false));
  });

  document.addEventListener('keydown', event => {
    if (!mobileMenu.classList.contains('mobile-menu--open')) return;

    if (event.key === 'Escape') {
      closeMenu();
    }

    if (event.key === 'Tab') {
      const focusable = [
        ...mobileMenu.querySelectorAll(
          'a[href], button:not(:disabled)'
        ),
      ];

      if (focusable.length === 0) return;  

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

  window
    .matchMedia('(min-width: 768px)')
    .addEventListener('change', event => {
      if (
        event.matches &&
        mobileMenu.classList.contains('mobile-menu--open')
      ) {
        closeMenu(false);
      }
    });
}
