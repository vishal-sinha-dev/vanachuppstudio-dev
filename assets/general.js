class General {
  constructor() {
    this.loadSwipeLibrary(),
      this.configureLinks(),
      this.checkFlexBoxGap(),
      'loading' === document.readyState
        ? window.on('DOMContentLoaded', () => this.load())
        : this.load();
  }
  load() {
    document.body.setAttribute('data-assets-loaded', !0),
      (document.documentElement.className =
        document.documentElement.className.replace('no-js', 'js')),
      window.trigger('theme:loaded');
  }
  loadSwipeLibrary() {
    theme.utils.libraryLoader('swipe', theme.libraries.swipe, () => {
      (theme.utils.disable_prevent_scroll = !1),
        (theme.utils.disable_swipe_listener = !1);
      var e = document.querySelectorAll('input, textarea');
      e.on('focus', () => (theme.utils.disable_prevent_scroll = !0)),
        e.on('blur', () => (theme.utils.disable_prevent_scroll = !1)),
        SwipeListener(document, {
          preventScroll: (e) => {
            var t;
            if (!theme.utils.disable_prevent_scroll)
              return (
                (t = Math.abs(e.detail.x[0] - e.detail.x[1])),
                2 * Math.abs(e.detail.y[0] - e.detail.y[1]) < t
              );
          },
        }),
        document.addEventListener('swipe', (e) => {
          var t, i, l, o;
          theme.utils.disable_swipe_listener ||
            (({ left: t, right: i, top: l, bottom: o } = e.detail.directions),
            t && window.trigger('theme:swipe:left'),
            i && window.trigger('theme:swipe:right'),
            l && window.trigger('theme:swipe:top'),
            o && window.trigger('theme:swipe:bottom'));
        });
    });
  }
  configureLinks() {
    document
      .querySelectorAll('[data-item="hidden-text"] a')
      .forEach((e) => e.setAttribute('tabindex', '-1'));
  }
  checkFlexBoxGap() {
    var e = document.createElement('div'),
      t =
        (e.setStyles({
          display: 'flex',
          flexDirection: 'column',
          rowGap: '1px',
        }),
        e.appendChild(document.createElement('div')),
        e.appendChild(document.createElement('div')),
        document.body.appendChild(e),
        0 < e.scrollHeight);
    e.remove(),
      t ||
        (document.documentElement.classList.remove('flexbox-gap'),
        document.documentElement.classList.add('no-flexbox-gap'));
  }
}
new General();
