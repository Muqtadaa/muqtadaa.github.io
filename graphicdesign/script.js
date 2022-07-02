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
  
  var gallery = document.querySelectorAll('.gallery-item');
  var galleryMod = gallery.length % 3;
  if (galleryMod == 1) {
    gallery[gallery.length-1].style.gridColumn = '1 / -1';
    gallery[gallery.length-1].style.height = '400px';
  } else if (galleryMod == 2) {
    gallery[gallery.length-2].style.gridColumn = '1 / 2';
    gallery[gallery.length-2].style.height = '400px';
    gallery[gallery.length-1].style.gridColumn = '2 / -1';
    gallery[gallery.length-1].style.height = '400px';
  }

  function captionHandler() {
    if (document.querySelector("#modal-content").getAttribute('src').indexOf("woc.png") !== -1) {
      document.querySelector("#modal a").classList.remove("hide");
    } else {
      document.querySelector("#modal a").classList.add("hide");
    }
  }
  var capObs = new MutationObserver(captionHandler);
  capObs.observe(document.querySelector("#modal-content"), { attributes: true });

  var modal = document.getElementById('modal');
  var modalContent = document.getElementById('modal-content');
  var modalCaption = document.getElementById('modal-caption');
  var modalClose = document.getElementById('modal-close');
  //var modalContent = document.getElementById('modal-content');

  function closeModal() {
    modal.style.display = "none";
  }

  modalClose.addEventListener('click', closeModal);
  //modalContent.addEventListener('click', closeModal());

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

  var imageArr = document.querySelectorAll('.gallery-image');

  function leftHandler() {
    if (document.querySelector('#modal').style.display === 'block') {
      var currentSrc = document.querySelector('#modal-content').getAttribute('src');
      for (var i = 0; i < imageArr.length; i++) {
        var compareSrc = imageArr[i].getAttribute('src').split('./').splice(1);
        if (currentSrc.indexOf(compareSrc) !== -1) {
          if (i === 0) {
            document.querySelector('#modal-content').setAttribute('src', imageArr[imageArr.length - 1].getAttribute('src'));
            document.querySelector('#modal-caption').innerText = imageArr[imageArr.length - 1].getAttribute('alt');
          } else if (0 < i < imageArr.length) {
            document.querySelector('#modal-content').setAttribute('src', imageArr[i - 1].getAttribute('src'));
            document.querySelector('#modal-caption').innerText = imageArr[i - 1].getAttribute('alt');
          }
        }
      }
    }
  }

  function rightHandler() {
    if (document.querySelector('#modal').style.display === 'block') {
      var currentSrc = document.querySelector('#modal-content').getAttribute('src');
      for (var i = 0; i < imageArr.length; i++) {
        var compareSrc = imageArr[i].getAttribute('src').split('./').splice(1);
        if (currentSrc.indexOf(compareSrc) !== -1) {
          if (i === imageArr.length - 1) {
            document.querySelector('#modal-content').setAttribute('src', imageArr[0].getAttribute('src'));
            document.querySelector('#modal-caption').innerText = imageArr[0].getAttribute('alt');
          } else if (0 < i < imageArr.length) {
            document.querySelector('#modal-content').setAttribute('src', imageArr[i + 1].getAttribute('src'));
            document.querySelector('#modal-caption').innerText = imageArr[i + 1].getAttribute('alt');
          }
        }
      }
    }
  }

  document.onkeydown = function (event) {
    switch (event.keyCode) {
      case 37:
        leftHandler();
        break;
      case 39:
        rightHandler();
        break;
      case 27:
        modal.style.display = 'none';
        break;
    }
  };

  function swipedetect(el, callback) {

    var touchsurface = el,
      swipedir,
      startX,
      startY,
      distX,
      distY,
      threshold = 50, //required min distance traveled to be considered swipe
      restraint = 200, // maximum distance allowed at the same time in perpendicular direction
      allowedTime = 300, // maximum time allowed to travel that distance
      elapsedTime,
      startTime,
      handleswipe = callback || function (swipedir) { };

    touchsurface.addEventListener('touchstart', function (e) {
      var touchobj = e.changedTouches[0];
      swipedir = 'none';
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime(); // record time when finger first makes contact with surface
      e.preventDefault();
    }, false);

    touchsurface.addEventListener('touchmove', function (e) {
      e.preventDefault(); // prevent scrolling when inside DIV
    }, false);

    touchsurface.addEventListener('touchend', function (e) {
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime) { // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
          swipedir = (distX < 0) ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
        } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
          swipedir = (distY < 0) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    }, false)
  }

  swipedetect(modalContent, function (swipedir) {
    if (swipedir == 'left') {
      rightHandler();
    } else if (swipedir == 'right') {
      leftHandler();
    }
  });

  swipedetect(modalCaption, function (swipedir) {
    if (swipedir == 'left') {
      rightHandler();
    } else if (swipedir == 'right') {
      leftHandler();
    }
  });

}



$(document).ready(function () {
  $('body').on('contextmenu', 'img', function (e) { return false; });
  $('.nav-link h5').on('click', function () {
    $('.nav-menu').slideToggle();
  });
});
