/**
 * GlobalHire — FAQ accordion
 */

(function () {
  "use strict";

  const faqList = document.getElementById("faq-list");
  if (!faqList) return;

  const items = faqList.querySelectorAll(".faq__item");

  items.forEach(function (item) {
    const button = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      items.forEach(function (other) {
        other.classList.remove("is-open");
        const otherBtn = other.querySelector(".faq__question");
        otherBtn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });

    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        button.click();
      }
    });
  });
})();
