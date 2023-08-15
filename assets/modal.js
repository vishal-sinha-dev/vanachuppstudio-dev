class Modal extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    (this.fullscreen = 'true' === this.getAttribute('data-modal-fullscreen')),
      (this.custom_close_button = this.getAttribute('data-modal-custom-close')),
      (this.force_view = this.getAttribute('data-force-view')),
      (this.view = this.getAttribute('data-modal-view')),
      (this.main_content = document.querySelector('.layout--main-content')),
      (this.viewport = document.querySelector('.layout--viewport')),
      (this.window = document.querySelector('.modal--window')),
      (this.window_container = this.window.querySelector('.modal--container')),
      (this.mask = this.window.querySelector('.modal--mask')),
      (this.close_button = this.window.querySelector('.modal--close')),
      (this.next_button = this.window.querySelector('.modal--next')),
      (this.prev_button = this.window.querySelector('.modal--prev')),
      (this.nested_content = this.querySelectorAll(
        ':scope .modal--root .modal--content'
      )),
      (this.content = this.querySelectorAll('.modal--content').not(
        this.nested_content
      )),
      (this.slides = null),
      this.updateLinks(),
      this.transitionListeners(),
      (this.modal_state = 'closed'),
      (this.nav_lock = !1);
  }
  updateLinks() {
    (this.nested_links = this.querySelectorAll(
      ':scope .modal--root .modal--link'
    )),
      (this.links = this.querySelectorAll('.modal--link').not(
        this.nested_links
      )),
      this.openListeners();
  }
  openListeners() {
    this.links.off('keypress.Modal click.Modal quick-open.Modal'),
      this.links.on('keypress.Modal click.Modal quick-open.Modal', (s) => {
        if ('keypress' !== s.type || !1 !== theme.a11y.click(s)) {
          const i = s.target;
          this.links.forEach((t, e) => {
            t === i &&
              ('quick-open' === s.type ? this.open(e, !0) : this.open(e));
          }),
            s.preventDefault(),
            s.stopPropagation();
        }
      });
  }
  open(t, e = !1) {
    var s;
    'closed' === this.modal_state &&
      ((this.modal_state = 'opened'),
      this.viewport.setAttribute('data-modal-open', !0),
      window.trigger('theme:modal:opened'),
      this.window.setAttribute('data-modal-fullscreen', this.fullscreen),
      this.window.setAttribute(
        'data-modal-custom-close',
        this.custom_close_button
      ),
      this.window.setAttribute('data-modal-view', this.view),
      (this.viewport.style.overflow = 'hidden'),
      this.closeListeners(),
      this.positionListeners(),
      (s = window.pageYOffset),
      this.main_content.setStyles({ position: 'fixed', top: `-${s}px` }),
      this.moveContentToWindow(),
      1 < this.slides.length &&
        ((this.next_button.style.display = 'block'),
        (this.prev_button.style.display = 'block'),
        this.prevListeners(),
        this.nextListeners()),
      (this.window.style.visibility = 'visible'),
      (this.window_container.style.display = 'block'),
      e
        ? (this.slides[t].classList.add('active'), this.position())
        : (this.mask.setState('forwards'),
          this.loadModal(this.slides[t], () => {
            const t = this.window_container.querySelector('input[type="text"]');
            t && setTimeout(() => t.focus(), 0);
          })));
  }
  moveContentToWindow() {
    var t = this.querySelectorAll('.modal--content').not(this.nested_content);
    t.length && t.forEach((t) => this.window_container.appendChild(t)),
      (this.slides = this.window_container.querySelectorAll('.modal--content'));
  }
  loadModal(t, e) {
    t.classList.add('active'), this.position(), e && e(), (this.nav_lock = !1);
  }
  position() {
    var e = !1;
    if (
      (this.window_container && this.window_container.removeAttribute('style'),
      (e = this.content.find((t) => t.classList.contains('active'))))
    ) {
      this.window.classList.remove('fixed');
      var s = e.offsetHeight;
      let t = s;
      0 < this.window.style.paddingTop &&
        (t += parseInt(this.window.style.paddingTop)),
        0 < this.window.style.paddingBottom &&
          (t += parseInt(this.window.style.paddingBottom)),
        this.fullscreen ||
          (e.classList.contains('type--image') && (t = s),
          window.innerHeight >= t && 'absolute' !== this.force_view
            ? this.window.classList.add('fixed')
            : (document
                .querySelectorAll('html, body')
                .forEach((t) => t.scrollTo(0, 0)),
              this.window.classList.remove('fixed')));
    }
  }
  positionListeners() {
    window.on('resize.Modal', () => this.position());
  }
  nextListeners() {
    window.on('theme:swipe:right.Modal', () => this.next()),
      document.documentElement.on('keydown.Modal', ({ keyCode: t }) => {
        39 === t && this.next();
      }),
      this.next_button.on(
        'click.Modal keydown.Modal',
        ({ type: t, key: e }) => {
          ('keydown' === t && 'Enter' !== e) || this.next();
        }
      );
  }
  next() {
    this.nav_lock || (this.nav_lock = !0);
    var t = [...this.slides].findIndex((t) => t.classList.contains('active')),
      e =
        (this.slides[t].classList.remove('active'),
        t + 1 === this.slides.length ? this.slides[0] : this.slides[t + 1]);
    this.loadModal(e);
  }
  prevListeners() {
    window.on('theme:swipe:left.Modal', () => this.prev()),
      document.documentElement.on('keydown.Modal', ({ keyCode: t }) => {
        37 === t && this.prev();
      }),
      this.prev_button.on(
        'click.Modal keydown.Modal',
        ({ type: t, key: e }) => {
          ('keydown' === t && 'Enter' !== e) || this.prev();
        }
      );
  }
  prev() {
    this.nav_lock || (this.nav_lock = !0);
    var t = [...this.slides].findIndex((t) => t.classList.contains('active')),
      e =
        (this.slides.forEach((t) => t.classList.remove('active')),
        0 === t ? this.slides[this.slides.length - 1] : this.slides[t - 1]);
    this.loadModal(e);
  }
  closeListeners() {
    document.documentElement.on('keydown.Modal', (t) => {
      'Escape' === t.code && this.close();
    }),
      this.close_button.on('click.Modal keydown.Modal', (t) => {
        ('keydown' === t.type && 'Enter' !== t.key) || this.close();
      }),
      [this.mask, this.window_container].on('click.Modal', () => this.close()),
      this.content.on('click.Modal', (t) => t.stopPropagation()),
      window.on('theme:modal:close', () => this.close());
  }
  close(t = !1) {
    var e = -1 * parseInt(this.main_content.style.top);
    this.viewport.setAttribute('data-modal-open', !1),
      window.trigger('theme:modal:closed'),
      this.main_content.setStyles({ top: '0', position: 'relative' }),
      (this.viewport.style.overflow = 'unset'),
      window.scrollTo(0, e),
      this.putBackContent(),
      (this.next_button.style.display = 'none'),
      (this.prev_button.style.display = 'none'),
      (this.window.style.visibility = 'hidden'),
      t
        ? ((this.mask.style.display = 'none'),
          (this.window_container.innerHTML = ''),
          (this.modal_state = 'closed'))
        : this.mask.setState('backwards'),
      this.removeListeners();
  }
  putBackContent() {
    this.slides.forEach((t) => {
      t.classList.remove('active'), this.appendChild(t);
    });
  }
  removeListeners() {
    document.body.off('DOMMouseScroll.Modal mousewheel.Modal touchmove.Modal'),
      window.off('resize.Modal theme:swipe:right.Modal theme:swipe:left.Modal'),
      document.documentElement.off('keydown.Modal'),
      this.mask.off('click.Modal'),
      this.window_container.off('click.Modal'),
      [this.next_button, this.prev_button, this.close_button].off(
        'click.Modal keydown.Modal'
      );
  }
  transitionListeners() {
    this.mask.on('transition:at_start', () => {
      (this.window_container.innerHTML = ''), (this.modal_state = 'closed');
    });
  }
}
customElements.define('modal-root', Modal);
