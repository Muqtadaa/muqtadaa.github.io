// Mobile navigation toggle: aria-expanded / aria-controls, Escape closes and
// returns focus to the button, choosing a link closes the menu.
(function () {
  var nav = document.querySelector('.nav');
  var toggle = nav && nav.querySelector('.nav__toggle');
  if (!nav || !toggle) return;

  var menu = document.getElementById(toggle.getAttribute('aria-controls'));

  function setOpen(open) {
    nav.setAttribute('data-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setOpen(nav.getAttribute('data-open') !== 'true');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  if (menu) {
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
  }
})();
