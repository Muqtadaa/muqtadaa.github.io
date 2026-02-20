window.addEventListener('DOMContentLoaded', function () {
  window.PortfolioShared.initStickyHeader();
  window.PortfolioShared.initDelegatedToggles();
  window.PortfolioShared.initGalleryLayout({ minWidth: 768 });
  window.PortfolioShared.initGalleryModal({
    onChange: function (currentImage) {
      var src = currentImage.getAttribute('src') || '';
      var modalImage = document.querySelector('#modal-content');
      var video0 = document.querySelector('#modal-video-0');
      var video1 = document.querySelector('#modal-video-1');
      if (!modalImage || !video0 || !video1) {
        return;
      }

      function hideVideos() {
        [video0, video1].forEach(function (videoEl) {
          videoEl.classList.add('hide');
          videoEl.pause();
        });
      }

      if (src.indexOf('Blue_Dragon') !== -1) {
        hideVideos();
        modalImage.classList.add('hide');
        video0.classList.remove('hide');
      } else if (src.indexOf('Eye_To_Eye') !== -1) {
        hideVideos();
        modalImage.classList.add('hide');
        video1.classList.remove('hide');
      } else {
        hideVideos();
        modalImage.classList.remove('hide');
      }
    }
  });

  document.body.addEventListener('contextmenu', function (event) {
    if (event.target.closest('img')) {
      event.preventDefault();
    }
  });
});
