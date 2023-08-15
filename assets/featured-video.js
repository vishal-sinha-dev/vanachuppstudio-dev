class FeaturedVideo extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    (this.api = this.getAttribute('data-api')),
      (this.play_button = this.querySelector('.featured-video--play')),
      (this.id = this.getAttribute('data-id')),
      (this.thumbnail = 'true' === this.getAttribute('data-thumbnail')),
      (this.video_id = this.getAttribute('data-video-id')),
      (this.video_wrapper = this.querySelector('.featured-video--wrapper')),
      this.thumbnail ? this.playButtonListeners() : this.loadLibraries(),
      Shopify.designMode && this.sectionListeners();
  }
  loadLibraries() {
    switch (this.api) {
      case 'youtube':
        window.on('theme:youtube:apiReady', () => this.insertYoutubePlayer()),
          'loaded' === theme.scripts.youtube
            ? this.insertYoutubePlayer()
            : theme.utils.libraryLoader(
                'youtube',
                theme.libraries.youtube,
                window.onYouTubeIframeAPIReady
              );
        break;
      case 'vimeo':
        theme.utils.libraryLoader('vimeo', theme.libraries.vimeo, () =>
          this.insertVimeoPlayer()
        );
        break;
      case 'plyr':
        theme.utils.stylesheetLoader('plyr', theme.libraries.plyr + '.css'),
          theme.utils.libraryLoader(
            'plyr',
            theme.libraries.plyr + '.en.js',
            () => {
              this.insertPlyrPlayer();
            }
          );
    }
  }
  insertVimeoPlayer() {
    void 0 === Vimeo.Player ||
      this.player ||
      ((this.player = new Vimeo.Player('player-' + this.id, {
        id: this.video_id,
        autopause: 0,
        playsinline: this.thumbnail ? 0 : 1,
        muted: this.thumbnail ? 0 : 1,
        background: this.thumbnail ? 0 : 1,
        loop: this.thumbnail ? 0 : 1,
        title: 0,
      })),
      this.player.ready().then(() => {
        this.showPlayer(),
          this.thumbnail ? this.vimeoEvents() : this.disablePlayerFocus();
      }),
      Promise.all([
        this.player.getVideoWidth(),
        this.player.getVideoHeight(),
      ]).then(([e, t]) => this.setAspectRatio(t, e)),
      this.player.play());
  }
  vimeoEvents() {
    this.player.getDuration().then((e) => {
      this.player.addCuePoint(e - 0.3, {});
    }),
      this.player.on('cuepoint', () => {
        this.player.setCurrentTime(0), this.player.pause();
      });
  }
  insertYoutubePlayer() {
    var e, t;
    void 0 === YT.Player ||
      this.player ||
      ((this.player = new YT.Player('player-' + this.id, {
        videoId: this.video_id,
        playerVars: {
          enablejsapi: 1,
          host: 'https://www.youtube.com',
          origin: location.origin,
        },
        events: {
          onReady: ({ target: e }) => this.youtubeReady(e),
          onStateChange: (e) => this.youtubeEvents(e),
        },
      })),
      ({ height: e, width: t } = this.player.getIframe()),
      this.setAspectRatio(e, t));
  }
  youtubeReady(e) {
    this.thumbnail || (e.mute(), this.disablePlayerFocus()),
      this.showPlayer(),
      e.playVideo();
  }
  youtubeEvents(e) {
    const t = e.target;
    var i;
    this.thumbnail && 0 === e.data
      ? (t.seekTo(0), t.pauseVideo())
      : this.thumbnail ||
        1 !== e.data ||
        ((i = t.getDuration() - t.getCurrentTime()),
        this.rewindTO && clearTimeout(this.rewindTO),
        (this.rewindTO = setTimeout(() => {
          t.seekTo(0);
        }, 1e3 * (i - 0.01))));
  }
  insertPlyrPlayer() {
    var e;
    void 0 === Shopify.Video ||
      this.player ||
      ((e = this.video_wrapper.querySelector('video')).on('ready', () =>
        this.showPlayer()
      ),
      (this.player = new Shopify.Video(e, {
        autoplay: !0,
        hideControls: !0,
        muted: !this.thumbnail,
        loop: this.thumbnail ? { active: !1 } : { active: !0 },
        controls: !!this.thumbnail && [
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'pip',
          'airplay',
          'fullscreen',
        ],
      })));
  }
  setAspectRatio(e, t) {
    this.video_wrapper.style.setProperty('--natural-aspect-ratio', t / e);
  }
  showPlayer() {
    setTimeout(
      () => this.video_wrapper.setAttribute('data-transition', 'fade-in'),
      50
    );
  }
  disablePlayerFocus() {
    this.querySelector('iframe').setAttribute('tabindex', '-1');
  }
  playButtonListeners() {
    this.play_button.on('click keydown', (e) => {
      ('keydown' === e.type && 'Enter' !== e.key) ||
        (e.preventDefault(), this.loadLibraries(), this.hideThumbnail());
    }),
      this.play_button.on(
        'mousedown touchstart',
        () => (this.play_button.dataset.state = 'pressed')
      ),
      window.on(
        'mouseup touchend',
        () => (this.play_button.dataset.state = 'released')
      );
  }
  hideThumbnail() {
    const e = this.querySelectorAll(
      '.featured-video--header, .featured-video--thumbnail'
    );
    setTimeout(() => e.forEach((e) => e.remove()), 400);
  }
  sectionListeners() {
    this.closest('[data-section-id]').on('theme:section:load', () => {
      (this.player = null), this.loadLibraries();
    });
  }
}
const featuredVideoEl = customElements.get('featured-video');
featuredVideoEl || customElements.define('featured-video', FeaturedVideo);
