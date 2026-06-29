/**
 * GlobalHire — Form validation & API submission
 */

(function () {
  "use strict";

  const API_BASE = "/api";

  const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const PHONE_RE = /^[\d\s+\-().]{7,20}$/;
  const NAME_RE = /^[\w\s\-'.]{1,100}$/u;

  /* ---- Validators ---- */

  function validateRequired(value, label) {
    const trimmed = (value || "").trim();
    if (!trimmed) return label + " is required.";
    return null;
  }

  function validateName(value, label) {
    const err = validateRequired(value, label);
    if (err) return err;
    if (!NAME_RE.test(value.trim())) return label + " contains invalid characters.";
    if (value.trim().length > 100) return label + " must be 100 characters or fewer.";
    return null;
  }

  function validateEmail(value) {
    const err = validateRequired(value, "Email");
    if (err) return err;
    if (!EMAIL_RE.test(value.trim())) return "Please enter a valid email address.";
    return null;
  }

  function validatePhone(value) {
    if (!value || !value.trim()) return null;
    if (!PHONE_RE.test(value.trim())) return "Please enter a valid phone number.";
    return null;
  }

  function validateMessage(value) {
    const err = validateRequired(value, "Message");
    if (err) return err;
    if (value.trim().length > 5000) return "Message must be 5000 characters or fewer.";
    return null;
  }

  /* ---- UI helpers ---- */

  function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const group = input.closest(".form-group");
    const errorEl = document.getElementById(fieldId + "-error");

    if (message) {
      group.classList.add("has-error");
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = message;
    } else {
      group.classList.remove("has-error");
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function clearFormErrors(form) {
    form.querySelectorAll(".form-group").forEach(function (group) {
      group.classList.remove("has-error");
    });
    form.querySelectorAll(".is-invalid").forEach(function (el) {
      el.classList.remove("is-invalid");
      el.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".form-error").forEach(function (el) {
      el.textContent = "";
    });
  }

  function showFormMessage(el, message, type) {
    el.textContent = message;
    el.className = "form-message is-visible form-message--" + type;
  }

  function hideFormMessage(el) {
    el.className = "form-message";
    el.textContent = "";
  }

  function validateDemoForm(form) {
    const data = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      company: form.company.value,
      job_title: form.job_title.value,
      phone: form.phone.value,
      employee_count: form.employee_count.value,
      countries: form.countries.value,
      message: form.message ? form.message.value : "",
    };

    const checks = [
      ["demo-first-name", validateName(data.first_name, "First name")],
      ["demo-last-name", validateName(data.last_name, "Last name")],
      ["demo-email", validateEmail(data.email)],
      ["demo-company", validateRequired(data.company, "Company")],
      ["demo-phone", validatePhone(data.phone)],
    ];

    let firstInvalidId = null;

    checks.forEach(function ([fieldId, error]) {
      setFieldError(fieldId, error);
      if (error && !firstInvalidId) {
        firstInvalidId = fieldId;
      }
    });

    return {
      valid: !firstInvalidId,
      firstInvalidId: firstInvalidId,
      data: data,
    };
  }

  function focusFirstInvalid(fieldId) {
    if (!fieldId) return;
    const input = document.getElementById(fieldId);
    if (input) {
      input.focus({ preventScroll: true });
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function shakeFormPanel(form) {
    const panel = form.closest(".form-panel");
    if (!panel) return;
    panel.classList.remove("form-panel--shake");
    void panel.offsetWidth;
    panel.classList.add("form-panel--shake");
    panel.addEventListener("animationend", function onEnd() {
      panel.classList.remove("form-panel--shake");
      panel.removeEventListener("animationend", onEnd);
    });
  }

  function bindFieldClear(form) {
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid")) {
          setFieldError(input.id, null);
        }
      });
      input.addEventListener("change", function () {
        if (input.classList.contains("is-invalid")) {
          setFieldError(input.id, null);
        }
      });
    });
  }

  async function submitJSON(endpoint, data) {
    const response = await fetch(API_BASE + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      const errors = result.errors || [result.message || "Something went wrong. Please try again."];
      throw new Error(Array.isArray(errors) ? errors.join(" ") : errors);
    }
    return result;
  }

  /* ---- Demo form ---- */

  const demoForm = document.getElementById("demo-form");
  const demoMessage = document.getElementById("demo-form-message");

  if (demoForm) {
    bindFieldClear(demoForm);

    demoForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearFormErrors(demoForm);
      hideFormMessage(demoMessage);

      const result = validateDemoForm(demoForm);

      if (!result.valid) {
        showFormMessage(
          demoMessage,
          "Invalid details. Please fill in all required fields correctly.",
          "error"
        );
        shakeFormPanel(demoForm);
        demoMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
        focusFirstInvalid(result.firstInvalidId);
        return;
      }

      const data = result.data;
      const submitBtn = demoForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";

      try {
        const response = await submitJSON("/demo", data);
        showFormMessage(demoMessage, response.message, "success");
        demoForm.reset();
      } catch (err) {
        showFormMessage(demoMessage, err.message, "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request demo";
      }
    });
  }

  /* ---- Contact form ---- */

  const contactForm = document.getElementById("contact-form");
  const contactMessage = document.getElementById("contact-form-message");

  if (contactForm) {
    bindFieldClear(contactForm);

    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearFormErrors(contactForm);
      hideFormMessage(contactMessage);

      const data = {
        first_name: contactForm.first_name.value,
        last_name: contactForm.last_name.value,
        email: contactForm.email.value,
        company: contactForm.company.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
      };

      let valid = true;

      const checks = [
        ["contact-first-name", validateName(data.first_name, "First name")],
        ["contact-last-name", validateName(data.last_name, "Last name")],
        ["contact-email", validateEmail(data.email)],
        ["contact-subject", validateRequired(data.subject, "Subject")],
        ["contact-message", validateMessage(data.message)],
      ];

      checks.forEach(function ([fieldId, error]) {
        if (error) {
          setFieldError(fieldId, error);
          valid = false;
        }
      });

      if (!valid) {
        showFormMessage(
          contactMessage,
          "Invalid details. Please fill in all required fields correctly.",
          "error"
        );
        shakeFormPanel(contactForm);
        contactMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const firstInvalid = checks.find(function (check) { return check[1]; });
        if (firstInvalid) focusFirstInvalid(firstInvalid[0]);
        return;
      }

      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      try {
        const result = await submitJSON("/contact", data);
        showFormMessage(contactMessage, result.message, "success");
        contactForm.reset();
      } catch (err) {
        showFormMessage(contactMessage, err.message, "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      }
    });
  }

  /* ---- Newsletter ---- */

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterError = document.getElementById("newsletter-error");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      newsletterError.textContent = "";

      const email = newsletterForm.email.value;
      const error = validateEmail(email);

      if (error) {
        newsletterError.textContent = error;
        return;
      }

      const submitBtn = newsletterForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "…";

      try {
        await submitJSON("/newsletter", { email: email.trim() });
        newsletterForm.reset();
        submitBtn.textContent = "Subscribed!";
        setTimeout(function () {
          submitBtn.textContent = "Subscribe";
        }, 3000);
      } catch (err) {
        newsletterError.textContent = err.message;
        submitBtn.textContent = "Subscribe";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---- Form tabs ---- */

  const tabs = document.querySelectorAll(".form-tab");
  const panels = document.querySelectorAll(".form-panel__content");

  function activateTab(tabName) {
    tabs.forEach(function (tab) {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach(function (panel) {
      const isDemo = panel.id === "demo-form-panel";
      const showDemo = tabName === "demo";
      const show = isDemo ? showDemo : !showDemo;
      panel.classList.toggle("is-active", show);
      panel.hidden = !show;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activateTab(tab.dataset.tab);
    });
  });

  document.querySelectorAll("[data-tab]").forEach(function (el) {
    if (el.classList.contains("form-tab")) return;
    el.addEventListener("click", function () {
      const tabName = el.dataset.tab;
      if (tabName) activateTab(tabName);
    });
  });

  window.GlobalHireForms = {
    activateTab: activateTab,
    validateDemoForm: function () {
      if (!demoForm) return false;
      clearFormErrors(demoForm);
      hideFormMessage(demoMessage);
      activateTab("demo");
      const result = validateDemoForm(demoForm);
      if (!result.valid) {
        showFormMessage(
          demoMessage,
          "Invalid details. Please fill in all required fields correctly.",
          "error"
        );
        shakeFormPanel(demoForm);
        focusFirstInvalid(result.firstInvalidId);
      }
      return result.valid;
    },
  };
})();
