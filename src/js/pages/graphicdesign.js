window.addEventListener('DOMContentLoaded', function () {
  window.PortfolioShared.initStickyHeader();
  window.PortfolioShared.initDelegatedToggles();
  window.PortfolioShared.initGalleryLayout();
  window.PortfolioShared.initGalleryModal({
    onChange: function (currentImage) {
      var portfolioLink = document.querySelector('#modal a');
      if (!portfolioLink) {
        return;
      }
      if ((currentImage.getAttribute('src') || '').indexOf('woc.png') !== -1) {
        portfolioLink.classList.remove('hide');
      } else {
        portfolioLink.classList.add('hide');
      }
    }
  });

  document.body.addEventListener('contextmenu', function (event) {
    if (event.target.closest('img')) {
      event.preventDefault();
    }
  });
});
