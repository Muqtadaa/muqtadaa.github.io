// Gallery lightbox on the native <dialog> (plan WS-E step 4). Progressive
// enhancement: every tile is a plain link to the full-size file; with
// JavaScript the click opens the dialog instead. Wrap-around navigation and
// the swipe thresholds (300 ms, 50 px, 200 px) are ported from the previous
// site's gallery modal (src/js/shared.js in git history before P4).
(function () {
  var dialog = document.getElementById('lightbox');
  var dataNode = document.getElementById('gallery-data');
  if (!dialog || !dataNode || typeof dialog.showModal !== 'function') return;

  var items;
  try {
    items = JSON.parse(dataNode.textContent);
  } catch (error) {
    return;
  }
  if (!items.length) return;

  var links = Array.prototype.slice.call(document.querySelectorAll('[data-lb-index]'));
  var stage = dialog.querySelector('[data-lb-stage]');
  var counter = document.getElementById('lb-counter');
  var title = document.getElementById('lb-caption');
  var text = dialog.querySelector('[data-lb-text]');
  var cta = dialog.querySelector('[data-lb-cta]');
  var index = -1;
  var opener = null;

  function pauseVideo() {
    var video = stage.querySelector('video');
    if (video) video.pause();
  }

  function preload(i) {
    var item = items[(i + items.length) % items.length];
    if (item.type === 'image' || item.type === 'document') {
      var img = new Image();
      img.src = item.full;
    }
  }

  function render(nextIndex) {
    pauseVideo();
    index = (nextIndex + items.length) % items.length;
    var item = items[index];

    stage.textContent = '';
    if (item.type === 'video') {
      var video = document.createElement('video');
      video.controls = true;
      video.preload = 'none';
      video.playsInline = true;
      video.poster = item.video.poster;
      video.src = item.video.src;
      video.setAttribute('aria-label', item.alt);
      stage.appendChild(video);
    } else {
      var picture = document.createElement('picture');
      if (item.fullWebp) {
        var source = document.createElement('source');
        source.type = 'image/webp';
        source.srcset = item.fullWebp;
        picture.appendChild(source);
      }
      var img = document.createElement('img');
      img.src = item.full;
      img.alt = item.alt;
      if (item.width && item.height && item.type !== 'animated') {
        img.width = item.width;
        img.height = item.height;
      }
      img.decoding = 'async';
      picture.appendChild(img);
      stage.appendChild(picture);
    }

    counter.textContent = 'Image ' + (index + 1) + ' of ' + items.length;
    title.textContent = item.title;
    text.textContent = item.caption;

    if (item.type === 'document') {
      cta.href = item.document.url;
      cta.textContent = item.document.label;
      cta.hidden = false;
    } else if (item.type === 'video') {
      cta.href = item.video.src;
      cta.textContent = 'Open the video file';
      cta.hidden = false;
    } else {
      cta.hidden = true;
      cta.removeAttribute('href');
    }

    if (history.replaceState) {
      history.replaceState(null, '', '#' + item.slug);
    }
    preload(index + 1);
    preload(index - 1);
  }

  function open(nextIndex, fromLink) {
    opener = fromLink || links[nextIndex] || null;
    render(nextIndex);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  function move(delta) {
    if (dialog.open) render(index + delta);
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(i, link);
    });
  });

  dialog.querySelector('[data-lb-close]').addEventListener('click', function () {
    dialog.close();
  });
  dialog.querySelector('[data-lb-prev]').addEventListener('click', function () {
    move(-1);
  });
  dialog.querySelector('[data-lb-next]').addEventListener('click', function () {
    move(1);
  });

  // The dialog fills the viewport, so a click on its empty stage (beside the
  // image) closes it, like a backdrop click would.
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog || event.target === stage) dialog.close();
  });

  dialog.addEventListener('keydown', function (event) {
    // Arrow keys inside a focused <video> seek and change volume; leave
    // them to the native controls.
    if (event.target.closest && event.target.closest('video')) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        move(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        move(1);
        break;
      case 'Home':
        event.preventDefault();
        render(0);
        break;
      case 'End':
        event.preventDefault();
        render(items.length - 1);
        break;
      default:
    }
  });

  // Escape fires the dialog's own cancel → close; this runs for every close.
  dialog.addEventListener('close', function () {
    pauseVideo();
    stage.textContent = '';
    if (history.replaceState) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    var target = opener;
    opener = null;
    index = -1;
    if (target && typeof target.focus === 'function') target.focus();
  });

  // Swipe: left/right moves, a downward swipe closes.
  var startX = 0;
  var startY = 0;
  var startTime = 0;
  dialog.addEventListener('touchstart', function (event) {
    var touch = event.changedTouches[0];
    startX = touch.pageX;
    startY = touch.pageY;
    startTime = Date.now();
  }, { passive: true });

  dialog.addEventListener('touchend', function (event) {
    if (event.target.closest('video, button, a')) return;
    var touch = event.changedTouches[0];
    var distX = touch.pageX - startX;
    var distY = touch.pageY - startY;
    if (Date.now() - startTime > 300) return;
    if (Math.abs(distX) >= 50 && Math.abs(distY) <= 200) {
      move(distX < 0 ? 1 : -1);
    } else if (distY >= 50 && Math.abs(distX) <= 200) {
      dialog.close();
    }
  }, { passive: true });

  // Deep links: /art/#wally-the-bugbear opens on that item.
  function openFromHash() {
    var slug = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!slug) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].slug === slug) {
        open(i, links[i]);
        return;
      }
    }
  }

  openFromHash();
  window.addEventListener('hashchange', function () {
    if (!dialog.open) openFromHash();
  });
})();
