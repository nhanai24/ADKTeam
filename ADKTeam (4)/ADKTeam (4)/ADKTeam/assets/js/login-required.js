(function () {
  const modal = document.getElementById("loginRequiredModal");
  if (!modal) return;

  const closeButton = document.getElementById("closeLoginModal");
  const loginLink = modal.querySelector(".btn-login");
  let lastTrigger = null;

  function getFocusableElements() {
    return Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hidden);
  }

  function hideModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    modal.inert = true;
    lastTrigger?.focus();
  }

  function showModal(trigger) {
    lastTrigger = trigger;
    const destination = (trigger.getAttribute("href") || "index.html").split(
      /[?#]/,
    )[0];
    if (loginLink) {
      loginLink.href = `dangnhap.html?next=${encodeURIComponent(destination)}`;
    }
    modal.inert = false;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    window.setTimeout(() => closeButton?.focus(), 50);
  }

  document.querySelectorAll("a.require-login").forEach((link) => {
    link.addEventListener("click", (event) => {
      const user =
        typeof getCurrentUser === "function" ? getCurrentUser() : null;
      if (user) return;
      event.preventDefault();
      showModal(link);
    });
  });

  closeButton?.addEventListener("click", hideModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("show")) return;
    if (event.key === "Escape") {
      hideModal();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!modal.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
