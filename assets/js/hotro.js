(() => {
  "use strict";

  const FEEDBACK_STORAGE_KEY = "expirycheck_feedback_entries";

  function initTabs() {
    const tabs = Array.from(document.querySelectorAll(".tab-btn[role='tab']"));
    const panels = Array.from(document.querySelectorAll(".tab-panel[role='tabpanel']"));
    if (!tabs.length || !panels.length) return;

    const activateTab = (targetIndex, shouldFocus = false) => {
      tabs.forEach((tab, index) => {
        const selected = index === targetIndex;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && shouldFocus) tab.focus();
      });

      panels.forEach((panel, index) => {
        const selected = index === targetIndex;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(index));
      tab.addEventListener("keydown", (event) => {
        let targetIndex = index;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          targetIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          targetIndex = 0;
        } else if (event.key === "End") {
          targetIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activateTab(targetIndex, true);
      });
    });

    const initialIndex = Math.max(
      0,
      tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"),
    );
    activateTab(initialIndex);
  }

  function initFaq() {
    document.querySelectorAll(".faq-question").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        if (!item) return;

        const expanded = item.classList.toggle("active");
        button.setAttribute("aria-expanded", String(expanded));
        const answerId = button.getAttribute("aria-controls");
        const answer = answerId ? document.getElementById(answerId) : null;
        if (answer) answer.setAttribute("aria-hidden", String(!expanded));
      });
    });
  }

  function initFeedbackForm() {
    const form = document.getElementById("feedbackForm");
    const status = document.getElementById("feedbackStatus");
    if (!form || !status) return;

    const nameInput = document.getElementById("feedbackName");
    const emailInput = document.getElementById("feedbackEmail");
    const topicSelect = document.getElementById("feedbackTopic");
    const messageInput = document.getElementById("feedbackMessage");
    const consentInput = document.getElementById("feedbackConsent");
    const ratingInputs = Array.from(form.querySelectorAll("input[name='rating']"));

    const errors = {
      name: document.getElementById("feedbackNameError"),
      email: document.getElementById("feedbackEmailError"),
      topic: document.getElementById("feedbackTopicError"),
      rating: document.getElementById("feedbackRatingError"),
      message: document.getElementById("feedbackMessageError"),
      consent: document.getElementById("feedbackConsentError"),
    };

    const setError = (controls, errorElement, message) => {
      const controlList = Array.isArray(controls) ? controls : [controls];
      controlList.forEach((control) => {
        if (control) control.setAttribute("aria-invalid", message ? "true" : "false");
      });
      if (errorElement) errorElement.textContent = message;
    };

    const clearStatus = () => {
      status.textContent = "";
      status.classList.remove("is-success", "is-warning");
    };

    const showStatus = (message, type) => {
      status.textContent = message;
      status.classList.remove("is-success", "is-warning");
      if (type) status.classList.add(type);
      status.focus();
    };

    const validateForm = () => {
      const firstInvalid = [];
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const selectedRating = ratingInputs.find((input) => input.checked);

      if (name.length < 2) {
        setError(nameInput, errors.name, "Vui lòng nhập họ tên có ít nhất 2 ký tự.");
        firstInvalid.push(nameInput);
      } else {
        setError(nameInput, errors.name, "");
      }

      if (!email) {
        setError(emailInput, errors.email, "Vui lòng nhập địa chỉ email.");
        firstInvalid.push(emailInput);
      } else if (!emailInput.validity.valid) {
        setError(emailInput, errors.email, "Email chưa đúng định dạng, ví dụ ten@example.com.");
        firstInvalid.push(emailInput);
      } else {
        setError(emailInput, errors.email, "");
      }

      if (!topicSelect.value) {
        setError(topicSelect, errors.topic, "Vui lòng chọn nội dung cần góp ý.");
        firstInvalid.push(topicSelect);
      } else {
        setError(topicSelect, errors.topic, "");
      }

      if (!selectedRating) {
        setError(ratingInputs, errors.rating, "Vui lòng chọn một mức độ hài lòng.");
        firstInvalid.push(ratingInputs[0]);
      } else {
        setError(ratingInputs, errors.rating, "");
      }

      if (message.length < 10) {
        setError(messageInput, errors.message, "Nội dung góp ý cần có ít nhất 10 ký tự.");
        firstInvalid.push(messageInput);
      } else {
        setError(messageInput, errors.message, "");
      }

      if (!consentInput.checked) {
        setError(consentInput, errors.consent, "Bạn cần đồng ý lưu góp ý cục bộ để tiếp tục.");
        firstInvalid.push(consentInput);
      } else {
        setError(consentInput, errors.consent, "");
      }

      if (firstInvalid.length) {
        firstInvalid[0].focus();
        return null;
      }

      return {
        name,
        email,
        topic: topicSelect.value,
        rating: selectedRating.value,
        message,
        submittedAt: new Date().toISOString(),
      };
    };

    const saveFeedbackLocally = (entry) => {
      try {
        const saved = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || "[]");
        const entries = Array.isArray(saved) ? saved : [];
        entries.push(entry);
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(entries.slice(-20)));
        return true;
      } catch {
        return false;
      }
    };

    const clearAllErrors = () => {
      setError(nameInput, errors.name, "");
      setError(emailInput, errors.email, "");
      setError(topicSelect, errors.topic, "");
      setError(ratingInputs, errors.rating, "");
      setError(messageInput, errors.message, "");
      setError(consentInput, errors.consent, "");
    };

    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener("input", () => {
        const errorKey = input === nameInput ? "name" : input === emailInput ? "email" : "message";
        setError(input, errors[errorKey], "");
        clearStatus();
      });
    });

    topicSelect.addEventListener("change", () => {
      setError(topicSelect, errors.topic, "");
      clearStatus();
    });

    ratingInputs.forEach((input) => {
      input.addEventListener("change", () => {
        setError(ratingInputs, errors.rating, "");
        clearStatus();
      });
    });

    consentInput.addEventListener("change", () => {
      setError(consentInput, errors.consent, "");
      clearStatus();
    });

    let resetAfterSubmit = false;

    form.addEventListener("reset", () => {
      if (resetAfterSubmit) {
        resetAfterSubmit = false;
        return;
      }

      window.setTimeout(() => {
        clearAllErrors();
        clearStatus();
      }, 0);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearStatus();

      const entry = validateForm();
      if (!entry) return;

      if (!saveFeedbackLocally(entry)) {
        showStatus(
          "Biểu mẫu hợp lệ nhưng trình duyệt không cho phép lưu cục bộ. Bạn có thể dùng liên kết Gửi email để liên hệ ADK Team.",
          "is-warning",
        );
        return;
      }

      resetAfterSubmit = true;
      form.reset();
      clearAllErrors();
      showStatus(
        "Đã lưu góp ý trên trình duyệt này. Đây là bản demo nên dữ liệu chưa được gửi tới máy chủ.",
        "is-success",
      );
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initFaq();
    initFeedbackForm();
  });
})();
