window.addEventListener('DOMContentLoaded', function () {
  if (!window.PortfolioShared) {
    return;
  }
  window.PortfolioShared.initStickyHeader();
  window.PortfolioShared.initDelegatedToggles();
});
