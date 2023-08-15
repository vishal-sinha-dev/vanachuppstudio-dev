class Cart extends HTMLElement {
    static counts = document.querySelectorAll(".cart--external--total-items");
    static icons = document.querySelectorAll(".cart--external--icon");
    static prices = document.querySelectorAll(".cart--external--total-price");
    static instances = [];
    static basket = {};
    constructor() {
        super()
    }
    connectedCallback() {
        Cart.instances.push(this), this.abort_controllers = {}, this.checkout_button = this.querySelector(".cart--checkout-button button"), this.dynamic_checkout_buttons = this.querySelector(".cart--additional-buttons"), this.note = this.querySelector(".cart--notes--textarea"), this.eventListeners(), this.toggleLoadingOnSubmit(), this.note && this.noteTypingListener(), this.dynamic_checkout_buttons && this.renderDynamicCheckoutButtons()
    }
    eventListeners() {
        this.inputBoxListeners(), this.plusButtonListener(), this.minusButtonListener(), this.removeButtonListener()
    }
    toggleLoadingOnSubmit() {
        this.checkout_button && this.checkout_button.on("click", () => this.checkout_button.setAttribute("data-loading", !0))
    }
    noteTypingListener() {
        this.note.on("input", () => {
            this.updateNote(this.note.value), Cart.instances.not(this).forEach(t => t.note.value = this.note.value)
        })
    }
    async updateNote(t) {
        this.abort_controllers.note && this.abort_controllers.note.abort(), this.abort_controllers.note = new AbortController;
        try {
            await fetch(theme.urls.cart_update + ".js", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    note: t
                }),
                signal: this.abort_controllers.note.signal
            })
        } catch {}
    }
    renderDynamicCheckoutButtons() {
        var t, e;
        window.location.pathname === theme.urls.cart && ((t = theme.drawer.querySelector(".cart--additional-buttons")) && t.remove(), "small" === theme.mqs.current_window) && (e = theme.drawer.querySelector('[data-view="desktop"] .cart--additional-buttons')) && e.remove()
    }
    inputBoxListeners() {
        let i;
        var t = this.querySelectorAll(".cart--quantity--input");
        t.length && (t.on("keydown", t => {
            var e = t["which"];
            (e < 48 || 57 < e) && (e < 37 || 40 < e) && 8 !== e && 9 !== e && t.preventDefault()
        }), t.on("focusin", async ({
            target: t
        }) => i = parseInt(t.value)), t.on("focusout", async ({
            target: t
        }) => {
            var e, a = parseInt(t.value),
                r = t.closest(".cart--item").getAttribute("data-line-num");
            isNaN(a) || a === i ? t.value = i : (t.value = a, this.toggleLoadingDisplay(!1, r), e = await this.updateQuantity(r, a), await Cart.updateAllHtml(), e || this.showQuantityError(r))
        }))
    }
    plusButtonListener() {
        var t = this.querySelectorAll(".cart--plus");
        t.length && t.on("click keydown", t => {
            var e, a, r;
            "keydown" === t.type && "Enter" !== t.key || (t.preventDefault(), e = t.target.previousElementSibling, a = t.target.closest(".cart--item").getAttribute("data-line-num"), r = 0 < parseInt(e.value) ? parseInt(e.value) + 1 : 1, e.value = r, this.toggleLoadingDisplay(!1, a), this.tryToUpdateQuantity(a, r))
        })
    }
    minusButtonListener() {
        var t = this.querySelectorAll(".cart--minus");
        t.length && t.on("click keydown", t => {
            var e, a, r;
            "keydown" === t.type && "Enter" !== t.key || (t.preventDefault(), e = t.target.parentNode.querySelector("input"), 1 !== parseInt(e.value) && (a = t.target.closest(".cart--item").getAttribute("data-line-num"), r = 1 < parseInt(e.value) - 1 ? parseInt(e.value) - 1 : 1, e.value = r, this.toggleLoadingDisplay(!1, a), this.tryToUpdateQuantity(a, r)))
        })
    }
    removeButtonListener() {
        var t = this.querySelectorAll(".cart--item--remove");
        t.length && t.on("click", t => {
            t.preventDefault();
            var e = t.target.closest(".cart--item").getAttribute("data-line-num");
            this.toggleLoadingDisplay(!1, e), this.tryToUpdateQuantity(e, 0)
        })
    }
    toggleLoadingDisplay(t, e) {
        var a;
        !t && e && (a = this.querySelector(`.cart--item[data-line-num='${e}'] input`)) && a.setAttribute("data-loading", !0), this.checkout_button.setAttribute("data-disabled", !t), this.dynamic_checkout_buttons && this.dynamic_checkout_buttons.setAttribute("data-disabled", !t)
    }
    async tryToUpdateQuantity(t, e) {
        try {
            var a = await this.updateQuantity(t, e);
            await Cart.updateAllHtml(), a || 0 === e || this.showQuantityError(t)
                  setTimeout(function() { 
          if(typeof BOLD === 'object' && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function') {
            BOLD.common.eventEmitter.emit("BOLD_COMMON_cart_loaded");
          }
        },800)
        } catch {}
    }
    showQuantityError(t) {
        var e = this.querySelector(`.cart--item[data-line-num='${t}']`);
        e && e.querySelector(".cart--error").removeAttribute("style")
    }
    async updateQuantity(t, e) {
        this.abort_controllers.line_num && this.abort_controllers.line_num.abort(), this.abort_controllers.line_num = new AbortController;
        var {
            management: a,
            policy: r,
            quantity: i
        } = this.querySelector(`.cart--item[data-line-num='${t}']`).dataset, n = e > parseInt(i) && "shopify" === a && "continue" !== r;
        n && (e = parseInt(i));
        try {
            var o = await fetch(theme.urls.cart_change + ".js", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    line: t,
                    quantity: e
                }),
                signal: this.abort_controllers.line_num.signal
            });
            if (o.ok) return Cart.fetchTotals(), !n;
            throw new Error(o.statusText)
        } catch {
            throw new Error("aborted")
        }
        setTimeout(function() { 
          if(typeof BOLD === 'object' && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function') {
            BOLD.common.eventEmitter.emit("BOLD_COMMON_cart_loaded");
          }
        },800)

    }
    static updateAllHtml() {
        var t = Cart.instances.map(t => t.updateHtml());
        return Promise.allSettled(t)
    }
    async updateHtml() {
        var t, e, a = await fetch(theme.urls.cart + "?view=ajax-" + this.dataset.view);
        if (a.ok) return t = await a.text(), e = theme.utils.parseHtml(t, ".cart--form"), this.swapInNewContent(e), this.toggleLoadingDisplay(!0), this.eventListeners(), window.trigger("theme:cart:updated", this), !0;
        throw new Error(a.statusText)
    }
    swapInNewContent(t) {
        var e = this.querySelector(".cart--body"),
            a = t.querySelector(".cart--body"),
            a = this.swapInImages(e, a),
            r = (e && a && e.replaceWith(a), this.querySelector(".cart--total--price")),
            i = t.querySelector(".cart--total--price");
        r && i && r.replaceWith(i)
    }
    swapInImages(r, t) {
        var e = t.querySelectorAll(".cart--item");
        return 0 !== e.length && (e.forEach(t => {
            var e = t.querySelector(".cart--item--image"),
                a = r.querySelector(`[data-variant-id='${t.getAttribute("data-variant-id")}'] .cart--item--image`);
            a && e && e.replaceWith(a)
        }), t)
    }
    static async addItem(t, e) {
        try {
            var formdata = new FormData($('.product-buy-buttons--form')[0])
            var a = await fetch(theme.urls.cart_add + ".js", {
                credentials: "same-origin",
                method: "POST",
                dataType: 'json',
                headers: {
                  contentType: false,
                  processData: false
                },
                body: formdata
            });
            if (!a.ok) throw new Error(a.statusText);
            Cart.fetchTotals(), await Cart.updateAllHtml(), window.trigger("theme:cart:productAdded", t)
        } catch (t) {
            throw new Error(t)
        }
    }
    static async fetchTotals(t = !1) {
        var e = await fetch(theme.urls.cart + ".js");
        if (!e.ok) throw new Error(e.statusText);
        var a = await e.json();
        Cart.fillBasket(a.items), t || Cart.updateTotals(a)
                        setTimeout(function() { 
          if(typeof BOLD === 'object' && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function') {
            BOLD.common.eventEmitter.emit("BOLD_COMMON_cart_loaded");
          }
        },800)
    }
    static fillBasket(t) {
        Cart.basket = {}, t.forEach(({
            id: t,
            quantity: e
        }) => Cart.basket[t] = e)
    }
    static updateTotals({
        item_count: a,
        total_price: e
    }) {
        var {
            counts: t,
            icons: r,
            prices: i,
            instances: n
        } = Cart;
        t.forEach(t => t.textContent = a), r.forEach(t => t.setAttribute("data-item-count", a)), i.forEach(t => t.innerHTML = theme.utils.formatMoney(e)), n.forEach((t, e) => {
            t.setAttribute("data-has-items", 0 < a), 0 === a && (t.note.value = "", 0 === e) && t.updateNote("")
        })
    }
}
theme.cart = Cart, theme.cart.fetchTotals(!0), customElements.define("cart-root", Cart);