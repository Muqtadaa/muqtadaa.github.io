(function (global) {
  function initStickyHeader(options) {
    var settings = Object.assign({
      headerSelector: '#fixedNav',
      sentinelSelector: '#intersect',
      hiddenClass: 'hide'
    }, options || {});

    var headerEl = document.querySelector(settings.headerSelector);
    var sentinelEl = document.querySelector(settings.sentinelSelector);
    if (!headerEl || !sentinelEl || !('IntersectionObserver' in window)) {
      return;
    }

    var observer = new window.IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (!entry) {
        return;
      }
      if (!entry.isIntersecting) {
        headerEl.classList.remove(settings.hiddenClass);
      } else {
        headerEl.classList.add(settings.hiddenClass);
      }
    });

    observer.observe(sentinelEl);
  }

  function animateToggle(element) {
    if (!element) {
      return;
    }

    var computedDisplay = window.getComputedStyle(element).display;
    var isHidden = computedDisplay === 'none' || element.classList.contains('hide');

    if (isHidden) {
      element.classList.remove('hide');
      var targetHeight = element.scrollHeight;
      element.style.overflow = 'hidden';
      element.style.maxHeight = '0px';
      requestAnimationFrame(function () {
        element.style.transition = 'max-height 220ms ease';
        element.style.maxHeight = targetHeight + 'px';
      });
      setTimeout(function () {
        element.style.transition = '';
        element.style.maxHeight = '';
        element.style.overflow = '';
      }, 240);
      return;
    }

    element.style.overflow = 'hidden';
    element.style.maxHeight = element.scrollHeight + 'px';
    requestAnimationFrame(function () {
      element.style.transition = 'max-height 220ms ease';
      element.style.maxHeight = '0px';
    });
    setTimeout(function () {
      element.classList.add('hide');
      element.style.transition = '';
      element.style.maxHeight = '';
      element.style.overflow = '';
    }, 240);
  }

  function initDelegatedToggles(root) {
    var scope = root || document;
    scope.addEventListener('click', function (event) {
      var toggle = event.target.closest('[data-toggle-target]');
      if (!toggle) {
        return;
      }

      var targetSelector = toggle.getAttribute('data-toggle-target');
      if (!targetSelector) {
        return;
      }

      targetSelector.split(',').map(function (item) {
        return item.trim();
      }).filter(Boolean).forEach(function (selector) {
        document.querySelectorAll(selector).forEach(animateToggle);
      });

      var iconSelector = toggle.getAttribute('data-toggle-icon');
      if (iconSelector) {
        var classSet = (toggle.getAttribute('data-toggle-icon-classes') || 'fa-chevron-right fa-chevron-down').split(' ').filter(Boolean);
        if (classSet.length >= 2) {
          document.querySelectorAll(iconSelector).forEach(function (icon) {
            icon.classList.toggle(classSet[0]);
            icon.classList.toggle(classSet[1]);
          });
        }
      }
    });
  }

  function initGalleryLayout(options) {
    var settings = Object.assign({
      galleryItemSelector: '.gallery-item',
      minWidth: 0
    }, options || {});

    if (window.innerWidth < settings.minWidth) {
      return;
    }

    var gallery = document.querySelectorAll(settings.galleryItemSelector);
    var galleryMod = gallery.length % 3;
    if (galleryMod === 1 && gallery.length > 0) {
      gallery[gallery.length - 1].style.gridColumn = '1 / -1';
      gallery[gallery.length - 1].style.height = '400px';
    } else if (galleryMod === 2 && gallery.length > 1) {
      gallery[gallery.length - 2].style.gridColumn = '1 / 2';
      gallery[gallery.length - 2].style.height = '400px';
      gallery[gallery.length - 1].style.gridColumn = '2 / -1';
      gallery[gallery.length - 1].style.height = '400px';
    }
  }

  function initGalleryModal(options) {
    var settings = Object.assign({
      modalSelector: '#modal',
      imageSelector: '.gallery-image',
      modalContentSelector: '#modal-content',
      modalCaptionSelector: '#modal-caption',
      closeSelector: '#modal-close',
      hiddenClass: 'hide',
      onChange: null
    }, options || {});

    var modal = document.querySelector(settings.modalSelector);
    var modalContent = document.querySelector(settings.modalContentSelector);
    var modalCaption = document.querySelector(settings.modalCaptionSelector);
    var close = document.querySelector(settings.closeSelector);
    var images = Array.prototype.slice.call(document.querySelectorAll(settings.imageSelector));
    if (!modal || !modalContent || !modalCaption || images.length === 0) {
      return;
    }

    var index = -1;

    function setActive(nextIndex) {
      index = (nextIndex + images.length) % images.length;
      var current = images[index];
      modalContent.setAttribute('src', current.getAttribute('src'));
      modalCaption.textContent = current.getAttribute('alt') || '';
      if (typeof settings.onChange === 'function') {
        settings.onChange(current, { modal: modal, modalContent: modalContent, modalCaption: modalCaption });
      }
    }

    function openAt(nextIndex) {
      setActive(nextIndex);
      modal.classList.remove(settings.hiddenClass);
      modal.style.display = 'block';
    }

    function closeModal() {
      modal.classList.add(settings.hiddenClass);
      modal.style.display = 'none';
    }

    if (close) {
      close.addEventListener('click', closeModal);
    }

    document.addEventListener('click', function (event) {
      var img = event.target.closest(settings.imageSelector);
      if (!img) {
        return;
      }
      var nextIndex = images.indexOf(img);
      if (nextIndex >= 0) {
        openAt(nextIndex);
      }
    });

    function move(delta) {
      if (modal.classList.contains(settings.hiddenClass) && modal.style.display !== 'block') {
        return;
      }
      setActive(index + delta);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        move(-1);
      } else if (event.key === 'ArrowRight') {
        move(1);
      } else if (event.key === 'Escape') {
        closeModal();
      }
    });

    [modal, modalContent].forEach(function (touchEl) {
      if (!touchEl) {
        return;
      }
      var startX = 0;
      var startY = 0;
      var startTime = 0;
      touchEl.addEventListener('touchstart', function (event) {
        var touch = event.changedTouches[0];
        startX = touch.pageX;
        startY = touch.pageY;
        startTime = new Date().getTime();
      }, { passive: true });

      touchEl.addEventListener('touchend', function (event) {
        var touch = event.changedTouches[0];
        var distX = touch.pageX - startX;
        var distY = touch.pageY - startY;
        var elapsed = new Date().getTime() - startTime;
        if (elapsed > 300) {
          return;
        }
        if (Math.abs(distX) >= 50 && Math.abs(distY) <= 200) {
          move(distX < 0 ? 1 : -1);
        } else if (Math.abs(distY) >= 50 && Math.abs(distX) <= 200 && distY > 0) {
          closeModal();
        }
      }, { passive: true });
    });

    return { closeModal: closeModal };
  }

  global.PortfolioShared = {
    initStickyHeader: initStickyHeader,
    initDelegatedToggles: initDelegatedToggles,
    initGalleryLayout: initGalleryLayout,
    initGalleryModal: initGalleryModal
  };
}(window));
