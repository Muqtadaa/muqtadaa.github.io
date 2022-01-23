const images = [
  './art/batman.jpg',
  './art/dragonborn.png',
  './art/eyepencil.jpg',
  './art/galaxy.jpg',
  './art/greenlantern.jpg',
  './art/joker.png',
  './art/obama.png',
  './art/robot.jpg',
  './art/selfportrait.jpg',
  './art/spiderman.png',
  './art/superman.png',
  './art/theflash.jpg',
  './art/womanpencil.jpg'
];

window.onload = function () {
  var headerEl = document.querySelector("#fixedNav");
  var sentinalEl = document.querySelector("#intersect");

  function handler(entries) {
    // entries is an array of observed dom nodes
    // we're only interested in the first one at [0]
    // because that's our .sentinal node.
    // Here observe whether or not that node is in the viewport
    if (!entries[0].isIntersecting) {
      headerEl.classList.remove('hide');
    } else {
      headerEl.classList.add('hide');
    }
  }

  // create the observer
  var observer = new window.IntersectionObserver(handler);
  // give the observer some dom nodes to keep an eye on
  observer.observe(sentinalEl);

  var modal = document.getElementById('modal');

  var modalClose = document.getElementById('modal-close');
  modalClose.addEventListener('click', function () {
    modal.style.display = "none";
  });

  document.addEventListener('click', function (e) {
    if (e.target.className.indexOf('gallery-image') !== -1) {
      var img = e.target;
      var modalImg = document.getElementById("modal-content");
      var captionText = document.getElementById("modal-caption");
      modal.style.display = "block";
      modalImg.src = img.src;
      captionText.innerHTML = img.alt;
    }
  });
}



$(document).ready(function () {
  $('body').on('contextmenu', 'img', function (e) { return false; });
});