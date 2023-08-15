class ProductTabs {
  constructor() {
    this.headers = document.querySelectorAll('.product-tabs--header');
    this.bodies = document.querySelectorAll('.product-tabs--body');

    this.handleClick(0);

    this.headers.forEach((header, index) => {
      header.addEventListener('click', () => this.handleClick(index));
    });
  }

  handleClick(current) {
    this.headers.forEach((header, index) => {
      if (current !== index) {
        header.classList.remove('active');
      } else {
        header.classList.add('active');
      }
    });

    this.bodies.forEach((body, index) => {
      if (current !== index) {
        body.classList.remove('active');
      } else {
        body.classList.add('active');
      }
    });
  }
}

const productTabsHandler = new ProductTabs();
