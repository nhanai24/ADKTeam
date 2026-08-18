(function () {
  const allowedNextPages = new Set([
    "index.html",
    "kiemtrahsd.html",
    "tinhnang.html",
    "huongdan.html",
    "gioithieu.html",
    "hotro.html",
    "caidat.html",
  ]);

  function getNextPage() {
    const requestedNext = new URLSearchParams(window.location.search).get(
      "next",
    );
    return allowedNextPages.has(requestedNext) ? requestedNext : "index.html";
  }

  function setLinkedPage(link, page, nextPage) {
    if (!link || nextPage === "index.html") return;
    link.href = `${page}?next=${encodeURIComponent(nextPage)}`;
  }

  function initializeLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const nextPage = getNextPage();
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorElement = document.getElementById("errorMsg");
    const submitButton = document.getElementById("loginSubmit");

    setLinkedPage(
      document.getElementById("registerLink"),
      "dangky.html",
      nextPage,
    );

    function clearError() {
      errorElement.textContent = "";
      usernameInput.removeAttribute("aria-invalid");
      passwordInput.removeAttribute("aria-invalid");
    }

    function showError(message) {
      errorElement.textContent = message;
      usernameInput.setAttribute("aria-invalid", "true");
      passwordInput.setAttribute("aria-invalid", "true");
    }

    form.addEventListener("input", clearError);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearError();

      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      if (!username || !password) {
        showError("Vui lòng nhập tên đăng nhập và mật khẩu.");
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      try {
        const result = await loginUser(username, password);
        if (!result.success) {
          showError(result.message);
          passwordInput.select();
          return;
        }
        window.location.replace(nextPage);
      } catch (error) {
        console.error("Không thể đăng nhập:", error);
        showError("Đã xảy ra lỗi. Vui lòng thử lại.");
      } finally {
        submitButton.disabled = false;
        submitButton.setAttribute("aria-busy", "false");
      }
    });
  }

  function initializeRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const nextPage = getNextPage();
    const fields = Array.from(form.querySelectorAll("input"));
    const fullNameInput = document.getElementById("fullName");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const errorElement = document.getElementById("errorMsg");
    const submitButton = document.getElementById("registerSubmit");

    setLinkedPage(
      document.getElementById("loginLink"),
      "dangnhap.html",
      nextPage,
    );

    function clearError() {
      errorElement.textContent = "";
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
      confirmPasswordInput.setCustomValidity("");
    }

    function showError(message, field) {
      errorElement.textContent = message;
      if (!field) return;
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }

    form.addEventListener("input", clearError);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearError();

      const fullName = fullNameInput.value.trim();
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (password !== confirmPassword) {
        const message = "Mật khẩu xác nhận không khớp.";
        confirmPasswordInput.setCustomValidity(message);
        showError(message, confirmPasswordInput);
        confirmPasswordInput.reportValidity();
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      try {
        const result = await registerUser(
          fullName,
          username,
          email,
          password,
        );
        if (!result.success) {
          showError(result.message);
          return;
        }
        window.location.replace(nextPage);
      } catch (error) {
        console.error("Không thể đăng ký:", error);
        showError("Đã xảy ra lỗi. Vui lòng thử lại.");
      } finally {
        submitButton.disabled = false;
        submitButton.setAttribute("aria-busy", "false");
      }
    });
  }

  initializeLoginForm();
  initializeRegisterForm();
})();
