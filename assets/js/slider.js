/**
 * slider.js
 * Carrusel del banner principal. Cambio automático configurable, transición
 * cruzada, navegación manual, gesto táctil y pausa cuando la pestaña no está
 * visible. Se inicializa solo sobre `[data-hero-carousel]`.
 */
(function () {
  "use strict";

  var SELECTORS = {
    root: "[data-hero-carousel]",
    slide: "[data-hero-slide]",
    prev: "[data-hero-prev]",
    next: "[data-hero-next]",
    dots: "[data-hero-dots]",
    status: "[data-hero-status]",
  };

  function HeroCarousel(root) {
    this.root = root;
    this.slides = Array.prototype.slice.call(root.querySelectorAll(SELECTORS.slide));
    this.prevBtn = root.querySelector(SELECTORS.prev);
    this.nextBtn = root.querySelector(SELECTORS.next);
    this.dotsWrap = root.querySelector(SELECTORS.dots);
    this.status = root.querySelector(SELECTORS.status);
    this.interval = Math.max(1000, parseInt(root.getAttribute("data-hero-interval"), 10) || 1000);
    this.index = Math.max(0, this.slides.findIndex(function (slide) { return slide.classList.contains("is-active"); }));
    this.timer = null;
    this.pauseReasons = new Set();
    this.pointerStartX = 0;
    this.pointerStartY = 0;
    this.pointerActive = false;
    this.suppressClick = false;

    if (this.slides.length < 2) return;

    this._buildDots();
    this._preloadImages();
    this._bindEvents();
    this._render(false);
    this._start();
  }

  HeroCarousel.prototype._preloadImages = function () {
    this.slides.forEach(function (slide) {
      var img = slide.querySelector("img");
      if (!img) return;
      var preload = new Image();
      preload.decoding = "async";
      preload.src = img.currentSrc || img.src;
    });
  };

  HeroCarousel.prototype._buildDots = function () {
    if (!this.dotsWrap) return;
    var self = this;
    this.dotsWrap.innerHTML = "";
    this.dots = this.slides.map(function (slide, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero-carousel__dot";
      dot.setAttribute("aria-label", "Mostrar banner " + (index + 1));
      dot.addEventListener("click", function () {
        self.goTo(index, true);
      });
      self.dotsWrap.appendChild(dot);
      return dot;
    });
  };

  HeroCarousel.prototype._render = function (announce) {
    var self = this;
    this.slides.forEach(function (slide, index) {
      var active = index === self.index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      slide.setAttribute("tabindex", active ? "0" : "-1");
    });

    if (this.dots) {
      this.dots.forEach(function (dot, index) {
        var active = index === self.index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    if (announce && this.status) {
      var img = this.slides[this.index].querySelector("img");
      this.status.textContent = "Banner " + (this.index + 1) + " de " + this.slides.length + (img && img.alt ? ": " + img.alt : "");
    }
  };

  HeroCarousel.prototype.goTo = function (index, manual) {
    this.index = (index + this.slides.length) % this.slides.length;
    this._render(Boolean(manual));
    if (manual) this._restart();
  };

  HeroCarousel.prototype.next = function (manual) {
    this.goTo(this.index + 1, manual);
  };

  HeroCarousel.prototype.prev = function (manual) {
    this.goTo(this.index - 1, manual);
  };

  HeroCarousel.prototype._start = function () {
    var self = this;
    if (this.timer || this.pauseReasons.size > 0 || document.hidden) return;
    this.timer = window.setInterval(function () {
      self.next(false);
    }, this.interval);
  };

  HeroCarousel.prototype._stop = function () {
    if (!this.timer) return;
    window.clearInterval(this.timer);
    this.timer = null;
  };

  HeroCarousel.prototype._restart = function () {
    this._stop();
    this._start();
  };

  HeroCarousel.prototype._pause = function (reason) {
    this.pauseReasons.add(reason);
    this._stop();
  };

  HeroCarousel.prototype._resume = function (reason) {
    this.pauseReasons.delete(reason);
    this._start();
  };

  HeroCarousel.prototype._bindEvents = function () {
    var self = this;

    if (this.prevBtn) this.prevBtn.addEventListener("click", function () { self.prev(true); });
    if (this.nextBtn) this.nextBtn.addEventListener("click", function () { self.next(true); });

    this.root.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse") self._pause("hover");
    });
    this.root.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse") self._resume("hover");
    });
    this.root.addEventListener("focusin", function () { self._pause("focus"); });
    this.root.addEventListener("focusout", function (event) {
      if (!self.root.contains(event.relatedTarget)) self._resume("focus");
    });

    this.root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        self.next(true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        self.prev(true);
      } else if (event.key === "Home") {
        event.preventDefault();
        self.goTo(0, true);
      } else if (event.key === "End") {
        event.preventDefault();
        self.goTo(self.slides.length - 1, true);
      }
    });

    this.root.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      self.pointerActive = true;
      self.pointerStartX = event.clientX;
      self.pointerStartY = event.clientY;
      self._pause("pointer");
    });

    this.root.addEventListener("pointerup", function (event) {
      if (!self.pointerActive) return;
      self.pointerActive = false;
      var deltaX = event.clientX - self.pointerStartX;
      var deltaY = event.clientY - self.pointerStartY;
      if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY)) {
        self.suppressClick = true;
        if (deltaX < 0) self.next(true);
        else self.prev(true);
      }
      self._resume("pointer");
    });

    this.root.addEventListener("pointercancel", function () {
      self.pointerActive = false;
      self.suppressClick = false;
      self._resume("pointer");
    });

    this.root.addEventListener("click", function (event) {
      if (!self.suppressClick || !event.target.closest(SELECTORS.slide)) return;
      event.preventDefault();
      event.stopPropagation();
      self.suppressClick = false;
    }, true);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) self._pause("visibility");
      else self._resume("visibility");
    });
  };

  function init() {
    document.querySelectorAll(SELECTORS.root).forEach(function (root) {
      if (root.dataset.heroCarouselReady === "true") return;
      root.dataset.heroCarouselReady = "true";
      new HeroCarousel(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("sagmt:layout-ready", init);

  window.SAGMT = window.SAGMT || {};
  window.SAGMT.HeroCarousel = HeroCarousel;
})();
