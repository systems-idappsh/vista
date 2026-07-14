/**
 * service-carousel.js
 * Franja horizontal de servicios basada en scroll nativo y scroll-snap.
 * Mantiene varias tarjetas visibles en móvil y muestra todas en una sola fila
 * cuando el contenedor dispone de espacio suficiente.
 */
(function () {
  "use strict";

  var SELECTORS = {
    root: "[data-service-carousel]",
    viewport: "[data-service-viewport]",
    track: "[data-service-track]",
    card: "[data-service-card]",
    prev: "[data-service-prev]",
    next: "[data-service-next]",
    dots: "[data-service-dots]",
    status: "[data-service-status]",
  };

  function ServiceCarousel(root) {
    this.root = root;
    this.viewport = root.querySelector(SELECTORS.viewport);
    this.track = root.querySelector(SELECTORS.track);
    this.cards = Array.prototype.slice.call(root.querySelectorAll(SELECTORS.card));
    this.prevBtn = root.querySelector(SELECTORS.prev);
    this.nextBtn = root.querySelector(SELECTORS.next);
    this.dotsWrap = root.parentElement.querySelector(SELECTORS.dots);
    this.status = root.parentElement.querySelector(SELECTORS.status);
    this.snapPoints = [];
    this.activePoint = 0;
    this.scrollRaf = 0;
    this.pointerStartX = 0;
    this.pointerStartY = 0;
    this.pointerMoved = false;

    if (!this.viewport || !this.track || this.cards.length === 0) return;

    this._bindEvents();
    this._measure();
  }

  ServiceCarousel.prototype._measure = function () {
    var maxScroll = Math.max(0, this.viewport.scrollWidth - this.viewport.clientWidth);
    var rawPoints = this.cards.map(function (card) {
      return Math.min(maxScroll, Math.max(0, card.offsetLeft));
    });

    this.snapPoints = rawPoints.filter(function (point, index, points) {
      return index === 0 || Math.abs(point - points[index - 1]) > 8;
    });

    if (this.snapPoints.length === 0) this.snapPoints = [0];
    this._buildDots();
    this._updateFromScroll(false);

    var hasOverflow = maxScroll > 4;
    if (this.prevBtn) this.prevBtn.classList.toggle("is-hidden", !hasOverflow);
    if (this.nextBtn) this.nextBtn.classList.toggle("is-hidden", !hasOverflow);
    if (this.dotsWrap) this.dotsWrap.classList.toggle("is-hidden", !hasOverflow || this.snapPoints.length < 2);
  };

  ServiceCarousel.prototype._buildDots = function () {
    if (!this.dotsWrap) return;
    var self = this;
    this.dotsWrap.innerHTML = "";
    this.dots = this.snapPoints.map(function (point, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "service-showcase__dot";
      dot.setAttribute("aria-label", "Mostrar grupo de servicios " + (index + 1));
      dot.addEventListener("click", function () {
        self._scrollToPoint(index, true);
      });
      self.dotsWrap.appendChild(dot);
      return dot;
    });
  };

  ServiceCarousel.prototype._nearestPointIndex = function () {
    var left = this.viewport.scrollLeft;
    var nearest = 0;
    var distance = Infinity;
    this.snapPoints.forEach(function (point, index) {
      var current = Math.abs(point - left);
      if (current < distance) {
        distance = current;
        nearest = index;
      }
    });
    return nearest;
  };

  ServiceCarousel.prototype._updateFromScroll = function (announce) {
    this.activePoint = this._nearestPointIndex();
    var maxScroll = Math.max(0, this.viewport.scrollWidth - this.viewport.clientWidth);
    var atStart = this.viewport.scrollLeft <= 4;
    var atEnd = this.viewport.scrollLeft >= maxScroll - 4;

    if (this.prevBtn) this.prevBtn.disabled = atStart;
    if (this.nextBtn) this.nextBtn.disabled = atEnd;

    var self = this;
    if (this.dots) {
      this.dots.forEach(function (dot, index) {
        var active = index === self.activePoint;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    if (announce && this.status) {
      this.status.textContent = "Grupo de servicios " + (this.activePoint + 1) + " de " + this.snapPoints.length;
    }
  };

  ServiceCarousel.prototype._scrollToPoint = function (index, announce) {
    var clamped = Math.max(0, Math.min(this.snapPoints.length - 1, index));
    this.viewport.scrollTo({ left: this.snapPoints[clamped], behavior: "smooth" });
    this.activePoint = clamped;
    this._updateFromScroll(Boolean(announce));
  };

  ServiceCarousel.prototype.next = function () {
    this._scrollToPoint(this._nearestPointIndex() + 1, true);
  };

  ServiceCarousel.prototype.prev = function () {
    this._scrollToPoint(this._nearestPointIndex() - 1, true);
  };

  ServiceCarousel.prototype._bindEvents = function () {
    var self = this;

    if (this.prevBtn) this.prevBtn.addEventListener("click", function () { self.prev(); });
    if (this.nextBtn) this.nextBtn.addEventListener("click", function () { self.next(); });

    this.viewport.addEventListener("scroll", function () {
      if (self.scrollRaf) cancelAnimationFrame(self.scrollRaf);
      self.scrollRaf = requestAnimationFrame(function () {
        self._updateFromScroll(false);
      });
    }, { passive: true });

    this.viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        self.next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        self.prev();
      } else if (event.key === "Home") {
        event.preventDefault();
        self._scrollToPoint(0, true);
      } else if (event.key === "End") {
        event.preventDefault();
        self._scrollToPoint(self.snapPoints.length - 1, true);
      }
    });

    this.viewport.addEventListener("pointerdown", function (event) {
      self.pointerStartX = event.clientX;
      self.pointerStartY = event.clientY;
      self.pointerMoved = false;
    }, { passive: true });

    this.viewport.addEventListener("pointermove", function (event) {
      if (Math.abs(event.clientX - self.pointerStartX) > 8 || Math.abs(event.clientY - self.pointerStartY) > 8) {
        self.pointerMoved = true;
      }
    }, { passive: true });

    this.cards.forEach(function (card) {
      var link = card.querySelector("a");
      if (!link) return;
      link.addEventListener("click", function (event) {
        if (self.pointerMoved) event.preventDefault();
      });
    });

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(function () {
        window.requestAnimationFrame(function () { self._measure(); });
      });
      this.resizeObserver.observe(this.root);
    } else {
      window.addEventListener("resize", function () { self._measure(); });
    }
  };

  function init() {
    document.querySelectorAll(SELECTORS.root).forEach(function (root) {
      if (root.dataset.serviceCarouselReady === "true") return;
      root.dataset.serviceCarouselReady = "true";
      new ServiceCarousel(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("sagmt:layout-ready", init);

  window.SAGMT = window.SAGMT || {};
  window.SAGMT.ServiceCarousel = ServiceCarousel;
})();
