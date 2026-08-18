// ================== HIỂN THỊ NGƯỜI DÙNG TRÊN THANH ĐIỀU HƯỚNG ==================
// Dùng chung cho các trang: index, kiemtrahsd, gioithieu, huongdan.
// Nếu người dùng đã đăng nhập, thay hai nút Đăng Nhập/Đăng Ký bằng khối
// "Xin chào, TÊN" + nút "Đăng xuất", đồng thời cho phép bấm vào để xem
// thông tin tài khoản (nếu trang có modal #userOverlay).

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getInitials(name) {
  if (!name) return "ND";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function fillUserModal(user) {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  let products = [];
  try {
    const saved = JSON.parse(
      localStorage.getItem("expirycheck_products_" + user.username) || "[]",
    );
    products = Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Không thể đọc danh sách sản phẩm đã lưu.", error);
  }

  set("uinfoAvatar", getInitials(user.fullName));
  set("uinfoName", user.fullName || "—");
  set("uinfoUsername", user.username || "—");
  set("uinfoEmail", user.email || "—");
  set(
    "uinfoRole",
    user.role ||
      (typeof t === "function" ? t("default_user_label") : "Người dùng"),
  );
  set("uinfoJoinDate", user.joinDate || "—");
  set("uinfoCount", products.length);
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof getCurrentUser !== "function") return;

  const user = getCurrentUser();
  const navAuth = document.getElementById("navAuth");
  if (!user || !navAuth) return;

  const displayName = (user.fullName || user.username || "").toUpperCase();
  const greetPrefix = typeof t === "function" ? t("greeting") : "Xin chào";
  const logoutText = typeof t === "function" ? t("logout") : "Đăng xuất";

  navAuth.innerHTML = `
        <div class="user-menu" id="userChip">
            <i class="fa-solid fa-circle-user"></i>
            <span id="headerGreeting" data-name="${escapeHtml(displayName)}">${escapeHtml(greetPrefix)}, ${escapeHtml(displayName)}</span>
        </div>
        <button type="button" class="logoutBtn" id="logoutBtn">${escapeHtml(logoutText)}</button>
    `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        logoutUser();
        window.location.href = "index.html";
    });
}

  const userChip = document.getElementById("userChip");
  const userOverlay = document.getElementById("userOverlay");
  if (userChip && userOverlay) {
    userChip.setAttribute("role", "button");
    userChip.setAttribute("tabindex", "0");
    userChip.setAttribute("aria-haspopup", "dialog");
    userChip.addEventListener("click", function () {
      fillUserModal(user);
      userOverlay.inert = false;
      userOverlay.classList.add("show");
      userOverlay.setAttribute("aria-hidden", "false");
      document.getElementById("closeUserModal")?.focus();
    });

    userChip.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      userChip.click();
    });

    const closeUserOverlay = () => {
      userOverlay.classList.remove("show");
      userOverlay.setAttribute("aria-hidden", "true");
      userOverlay.inert = true;
      userChip.focus();
    };

    const closeBtn1 = document.getElementById("closeUserModal");
    const closeBtn2 = document.getElementById("closeUserBtn2");
    if (closeBtn1)
      closeBtn1.addEventListener("click", closeUserOverlay);
    if (closeBtn2)
      closeBtn2.addEventListener("click", closeUserOverlay);

    userOverlay.addEventListener("click", function (e) {
      if (e.target === userOverlay) closeUserOverlay();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && userOverlay.classList.contains("show")) {
        closeUserOverlay();
      }
    });
  }
});
