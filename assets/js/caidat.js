document.addEventListener("DOMContentLoaded", function () {
  const isSettingsPage = window.location.pathname.endsWith("caidat.html");
  if (!isSettingsPage) return;

  let currentUser =
    typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!currentUser) {
    window.location.replace("dangnhap.html?next=caidat.html");
    return;
  }

  function getInitials(name) {
    if (!name) return "ND";
    return name
      .trim()
      .split(/\s+/)
      .slice(-2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  function getProductCount(username) {
    try {
      const products = JSON.parse(
        localStorage.getItem("expirycheck_products_" + username) || "[]",
      );
      return Array.isArray(products) ? products.length : 0;
    } catch (error) {
      console.warn("Không thể đọc danh sách sản phẩm:", error);
      return 0;
    }
  }

  function configureField(id, attributes) {
    const input = document.getElementById(id);
    if (!input) return;
    Object.entries(attributes).forEach(([name, value]) => {
      input.setAttribute(name, String(value));
    });
    const label = input.closest(".field")?.querySelector("label");
    if (label) label.setAttribute("for", id);
  }

  function setupAccessibility() {
    configureField("p_username", { autocomplete: "username" });
    configureField("p_fullName", {
      autocomplete: "name",
      required: "",
      minlength: 2,
      maxlength: 80,
      "aria-describedby": "profileMsg",
    });
    configureField("p_email", {
      autocomplete: "email",
      inputmode: "email",
      required: "",
      maxlength: 254,
      "aria-describedby": "profileMsg",
    });
    configureField("p_oldPassword", {
      autocomplete: "current-password",
      required: "",
      "aria-describedby": "passwordMsg",
    });
    configureField("p_newPassword", {
      autocomplete: "new-password",
      required: "",
      minlength: 8,
      maxlength: 128,
      "aria-describedby": "passwordMsg",
    });
    configureField("p_confirmPassword", {
      autocomplete: "new-password",
      required: "",
      minlength: 8,
      maxlength: 128,
      "aria-describedby": "passwordMsg",
    });
    configureField("deletePasswordInput", {
      autocomplete: "current-password",
      required: "",
      "aria-describedby": "deleteMsg",
    });

    ["profileMsg", "passwordMsg"].forEach((id) => {
      const message = document.getElementById(id);
      if (message) message.setAttribute("aria-live", "polite");
    });

    const toast = document.getElementById("toast");
    if (toast) {
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
    }

    [
      "saveProfileBtn",
      "savePasswordBtn",
      "openDeleteModal",
      "closeDeleteModal",
      "cancelDelete",
      "confirmDelete",
    ].forEach((id) => {
      const button = document.getElementById(id);
      if (button) button.setAttribute("type", "button");
    });
  }

  function renderProfileCard() {
    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };

    setText("profileAvatar", getInitials(currentUser.fullName));
    setText("cardFullName", currentUser.fullName || currentUser.username);
    setText("cardUsername", "@" + currentUser.username);
    setText("cardProductCount", getProductCount(currentUser.username));
    setText("deleteUsernamePreview", currentUser.username);

    const usernameInput = document.getElementById("p_username");
    const fullNameInput = document.getElementById("p_fullName");
    const emailInput = document.getElementById("p_email");
    if (usernameInput) usernameInput.value = currentUser.username;
    if (fullNameInput) fullNameInput.value = currentUser.fullName || "";
    if (emailInput) emailInput.value = currentUser.email || "";
  }

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function showMsg(id, text, type) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = text;
    element.className = "msg show " + type;
    element.setAttribute("role", type === "error" ? "alert" : "status");
  }

  function clearMsg(id) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = "";
    element.className = "msg";
    element.removeAttribute("role");
  }

  function setButtonBusy(button, isBusy) {
    if (!button) return;
    button.disabled = isBusy;
    button.setAttribute("aria-busy", String(isBusy));
  }

  setupAccessibility();

  const saveProfileBtn = document.getElementById("saveProfileBtn");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", function () {
      clearMsg("profileMsg");
      const fullNameInput = document.getElementById("p_fullName");
      const emailInput = document.getElementById("p_email");
      if (!fullNameInput || !emailInput) return;

      if (!fullNameInput.checkValidity()) {
        fullNameInput.reportValidity();
        return;
      }
      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      const result = updateUserProfile(
        currentUser.username,
        fullNameInput.value,
        emailInput.value,
      );
      if (!result.success) {
        showMsg("profileMsg", result.message, "error");
        return;
      }

      currentUser = getCurrentUser();
      renderProfileCard();
      showMsg("profileMsg", "Đã cập nhật thông tin cá nhân.", "success");
      showToast("Đã lưu thông tin cá nhân");

      const greeting = document.getElementById("headerGreeting");
      if (greeting) {
        greeting.textContent =
          "Xin chào, " +
          (currentUser.fullName || currentUser.username).toUpperCase();
      }
    });
  }

  const savePasswordBtn = document.getElementById("savePasswordBtn");
  if (savePasswordBtn) {
    savePasswordBtn.addEventListener("click", async function () {
      clearMsg("passwordMsg");
      const oldPasswordInput = document.getElementById("p_oldPassword");
      const newPasswordInput = document.getElementById("p_newPassword");
      const confirmPasswordInput = document.getElementById(
        "p_confirmPassword",
      );
      if (!oldPasswordInput || !newPasswordInput || !confirmPasswordInput) {
        return;
      }

      if (!oldPasswordInput.value) {
        showMsg("passwordMsg", "Vui lòng nhập mật khẩu hiện tại.", "error");
        oldPasswordInput.focus();
        return;
      }
      if (!newPasswordInput.checkValidity()) {
        newPasswordInput.reportValidity();
        return;
      }
      if (newPasswordInput.value !== confirmPasswordInput.value) {
        showMsg("passwordMsg", "Mật khẩu xác nhận không khớp.", "error");
        confirmPasswordInput.focus();
        return;
      }

      setButtonBusy(savePasswordBtn, true);
      try {
        const result = await changeUserPassword(
          currentUser.username,
          oldPasswordInput.value,
          newPasswordInput.value,
        );
        if (!result.success) {
          showMsg("passwordMsg", result.message, "error");
          return;
        }

        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        confirmPasswordInput.value = "";
        showMsg("passwordMsg", "Đã đổi mật khẩu thành công.", "success");
        showToast("Đã đổi mật khẩu");
      } catch (error) {
        console.error("Không thể đổi mật khẩu:", error);
        showMsg(
          "passwordMsg",
          "Đã xảy ra lỗi. Vui lòng thử lại.",
          "error",
        );
      } finally {
        setButtonBusy(savePasswordBtn, false);
      }
    });
  }

  const deleteOverlay = document.getElementById("deleteOverlay");
  const openDeleteModal = document.getElementById("openDeleteModal");
  const closeDeleteModal = document.getElementById("closeDeleteModal");
  const cancelDelete = document.getElementById("cancelDelete");
  const confirmDelete = document.getElementById("confirmDelete");
  const deletePasswordInput = document.getElementById("deletePasswordInput");
  let previouslyFocusedElement = null;

  let deleteMsg = document.getElementById("deleteMsg");
  if (!deleteMsg && deletePasswordInput) {
    deleteMsg = document.createElement("p");
    deleteMsg.id = "deleteMsg";
    deleteMsg.className = "msg";
    deleteMsg.setAttribute("aria-live", "polite");
    deletePasswordInput.closest(".field")?.before(deleteMsg);
  }

  function showDeleteMsg(text, type) {
    if (!deleteMsg) return;
    deleteMsg.textContent = text;
    deleteMsg.className = "msg show " + type;
    deleteMsg.setAttribute("role", type === "error" ? "alert" : "status");
  }

  function clearDeleteMsg() {
    if (!deleteMsg) return;
    deleteMsg.textContent = "";
    deleteMsg.className = "msg";
    deleteMsg.removeAttribute("role");
  }

  function openDelete() {
    if (!deleteOverlay || !deletePasswordInput) return;
    previouslyFocusedElement = document.activeElement;
    deletePasswordInput.value = "";
    clearDeleteMsg();
    deleteOverlay.inert = false;
    deleteOverlay.classList.add("show");
    deleteOverlay.setAttribute("aria-hidden", "false");
    setTimeout(() => deletePasswordInput.focus(), 0);
  }

  function closeDelete() {
    if (!deleteOverlay) return;
    deleteOverlay.classList.remove("show");
    deleteOverlay.setAttribute("aria-hidden", "true");
    deleteOverlay.inert = true;
    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
  }

  if (deleteOverlay) {
    deleteOverlay.setAttribute("aria-hidden", "true");
    deleteOverlay.inert = true;
  }
  if (closeDeleteModal) {
    closeDeleteModal.setAttribute("aria-label", "Đóng hộp thoại");
  }

  openDeleteModal?.addEventListener("click", openDelete);
  closeDeleteModal?.addEventListener("click", closeDelete);
  cancelDelete?.addEventListener("click", closeDelete);
  deleteOverlay?.addEventListener("click", function (event) {
    if (event.target === deleteOverlay) closeDelete();
  });

  deleteOverlay?.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDelete();
      return;
    }
    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      deleteOverlay.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusableElements.length) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (confirmDelete) {
    confirmDelete.addEventListener("click", async function () {
      if (!deletePasswordInput?.value) {
        showDeleteMsg("Vui lòng nhập mật khẩu để xác nhận.", "error");
        deletePasswordInput?.focus();
        return;
      }

      clearDeleteMsg();
      setButtonBusy(confirmDelete, true);
      try {
        const result = await deleteUserAccount(
          currentUser.username,
          deletePasswordInput.value,
        );
        if (!result.success) {
          showDeleteMsg(result.message, "error");
          deletePasswordInput.select();
          return;
        }

        showDeleteMsg("Tài khoản đã được xóa.", "success");
        showToast("Đã xóa tài khoản và dữ liệu của bạn");
        setTimeout(() => window.location.replace("dangnhap.html"), 500);
      } catch (error) {
        console.error("Không thể xóa tài khoản:", error);
        showDeleteMsg("Đã xảy ra lỗi. Vui lòng thử lại.", "error");
      } finally {
        setButtonBusy(confirmDelete, false);
      }
    });
  }

  document.getElementById("p_email")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveProfileBtn?.click();
  });
  document
    .getElementById("p_confirmPassword")
    ?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") savePasswordBtn?.click();
    });
  deletePasswordInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") confirmDelete?.click();
  });

  renderProfileCard();
});
