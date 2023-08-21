window.theme = window.theme || {};

jQuery(document).ready(function ($) {
  console.log('theme.js');

  theme.BoldProduct;

  $(document).ready(function () {
    $('ul.tabs').each(function () {
      var active,
        content,
        links = $(this).find('a');
      active = links.first().addClass('active');
      content = $(active.attr('href'));
      links.not(':first').each(function () {
        $($(this).attr('href')).hide();
      });
      $(this)
        .find('a')
        .click(function (e) {
          active.removeClass('active');
          content.hide();
          active = $(this);
          content = $($(this).attr('href'));
          active.addClass('active');
          content.show();
          return false;
        });
    });
  });
});

/**
 * Bold Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Bold Options in the Product template.
 *
 * @namespace product
 */

theme.BoldProduct = (function () {
  var selectors = {
    boldAddToCart: '.product-buy-buttons--cta-text-addon',
    startingPrice: '[data-itemprop="price"]',
  };

  // Update the pricing everywhere
  var recalculateTotal = function (extras) {
    return (
      parseFloat($(selectors.startingPrice).attr('content')) +
      parseFloat(extras)
    );
  };

  var updateBtnTotal = function (data) {
    // Check when an add-on is selected that changes the total price
    var newTotal = recalculateTotal(
      data.data.option_product.priceHandler.total
    );
    $(selectors.boldAddToCart).text(' - $' + (newTotal / 100).toFixed(2));
  };

  var registerBoldEventsWhenReady = function () {
    if (!window.BOLD) {
      setTimeout(registerBoldEventsWhenReady, 500);
    } else {
      window.BOLD.options.app.on('total_changed', updateBtnTotal);
    }
  };

  /**
   * wait until BOLD is registered in the DOM to register events
   */
  registerBoldEventsWhenReady();

  /**
   * public
   */
  return {
    recalculateTotal: recalculateTotal,
  };
})();
