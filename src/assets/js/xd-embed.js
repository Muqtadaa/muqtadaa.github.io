// Click-to-load Adobe XD prototypes (partials/xd-embed.njk). The iframe is
// only created on request so the page never blocks on Adobe's servers, and
// the poster / typographic placeholder stays in place until then.
(function () {
  var embeds = document.querySelectorAll('.xd-embed[data-xd-url]');

  Array.prototype.forEach.call(embeds, function (embed) {
    var button = embed.querySelector('.xd-embed__load');
    var frame = embed.querySelector('.xd-embed__frame');
    if (!button || !frame) return;

    button.hidden = false;

    button.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = embed.getAttribute('data-xd-url');
      iframe.title = embed.getAttribute('data-xd-title') || 'Adobe XD prototype';
      iframe.loading = 'lazy';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'fullscreen');
      iframe.setAttribute('referrerpolicy', 'no-referrer');
      frame.replaceChildren(iframe);
      embed.setAttribute('data-loaded', 'true');
      button.remove();
      iframe.focus();
    });
  });
})();
