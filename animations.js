/**
 * GlobalHire — Enhanced animations
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Animate dashboard chart bars when mockup enters view */
  function initChartBars() {
    const bars = document.querySelectorAll(".mockup__bar--animated");
    if (!bars.length) return;

    if (prefersReducedMotion) {
      bars.forEach(function (bar) {
        bar.style.height = bar.style.getPropertyValue("--bar-height") || "50%";
        bar.classList.add("is-animated");
      });
      return;
    }

    const mockup = document.querySelector(".hero__mockup");
    if (!mockup || !("IntersectionObserver" in window)) {
      bars.forEach(function (bar) { bar.classList.add("is-animated"); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            bars.forEach(function (bar) { bar.classList.add("is-animated"); });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(mockup);
  }

  /* Count-up animation for hero stats */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = decimals > 0
        ? current.toFixed(decimals) + suffix
        : Math.floor(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.add("is-counted");
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll(".hero__stat-value[data-count]");
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(function (el) {
        const suffix = el.dataset.suffix || "";
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const val = parseFloat(el.dataset.count);
        el.textContent = decimals > 0 ? val.toFixed(decimals) + suffix : Math.floor(val) + suffix;
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* Stagger scroll reveal for grid children */
  function initStaggerGrids() {
    const grids = document.querySelectorAll(".animate-stagger");
    if (!grids.length || !("IntersectionObserver" in window)) return;

    grids.forEach(function (grid) {
      const items = grid.querySelectorAll(":scope > .animate-on-scroll");
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );

      items.forEach(function (item) { observer.observe(item); });
    });
  }

  initChartBars();
  initCounters();
  initStaggerGrids();
})();
