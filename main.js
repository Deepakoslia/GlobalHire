/**
 * GlobalHire — Main initialization
 */

(function () {
  "use strict";

  /* Scroll-triggered animations */
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Handle hash navigation to contact with tab selection */
  if (window.location.hash === "#contact" && window.GlobalHireForms) {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") || "demo";
    window.GlobalHireForms.activateTab(tab);
  }
})();
