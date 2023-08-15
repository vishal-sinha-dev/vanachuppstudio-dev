class FeaturedPopup extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.triggerElements = document.querySelectorAll(
      '.featured-popup--trigger'
    );

    this.closeEle = this.querySelector('.featured-popup--close');

    this.triggerElements.forEach((element) => {
      element.addEventListener('click', () => {
        const title = element.dataset['title'];
        const subtitle = element.dataset['subtitle'];
        const text = element.dataset['text'];

        this.titleEle = this.querySelector('.featured-popup--title');
        this.subtitleEle = this.querySelector('.featured-popup--subtitle');
        this.textEle = this.querySelector('.featured-popup--text');

        this.titleEle.textContent = title;
        this.subtitleEle.textContent = subtitle;
        this.textEle.innerHTML = text;

        this.classList.add('show');
      });

      this.closeEle.addEventListener('click', () => {
        this.classList.remove('show');
      });
    });
  }
}

const featuredPopupEl = customElements.get('featured-popup');
featuredPopupEl || customElements.define('featured-popup', FeaturedPopup);
