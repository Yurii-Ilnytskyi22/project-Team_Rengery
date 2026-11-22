(() => {
  const form = document.querySelector('.footer__form');
  if (!form) return;

  const input = form.querySelector('.footer__input');
  const message = form.querySelector('.footer__message');

  const mq = window.matchMedia('(max-width: 991px)');
  const updatePlaceholder = () => {
    input.placeholder = mq.matches ? 'Enter your email' : 'Enter your email*';
  };
  updatePlaceholder();
  mq.addEventListener('change', updatePlaceholder);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const showMessage = (text, type) => {
    message.textContent = text;
    message.classList.remove(
      'footer__message--error',
      'footer__message--success'
    );
    if (type) message.classList.add(`footer__message--${type}`);
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const email = input.value.trim();

    if (!email) {
      input.classList.add('footer__input--error');
      showMessage('Please enter your email', 'error');
      input.focus();
      return;
    }

    if (!emailPattern.test(email)) {
      input.classList.add('footer__input--error');
      showMessage('Enter a valid email', 'error');
      input.focus();
      return;
    }

    input.classList.remove('footer__input--error');
    showMessage('Thanks! You are subscribed.', 'success');
    form.reset();
  });

  input.addEventListener('input', () => {
    input.classList.remove('footer__input--error');
    showMessage('', null);
  });
})();
