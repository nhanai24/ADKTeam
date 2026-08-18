const loggedInUser =
  typeof getCurrentUser === "function" ? getCurrentUser() : null;

if (loggedInUser) {
  const currentUser = {
    fullName: loggedInUser.fullName || t("default_user_label"),
    username: loggedInUser.username || "",
    email: loggedInUser.email || "",
    role: loggedInUser.role || t("default_user_label"),
    joinDate: loggedInUser.joinDate || "—",
  };

  runApp(currentUser);
} else if (window.location.pathname.endsWith("tinhnang.html")) {
  window.location.replace("dangnhap.html?next=tinhnang.html");
}
function getProductUserInitials(name) {
  if (!name) return "ND";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
function parseLocalDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateString || ""))) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}
function toLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function runApp(currentUser) {
  // STATE
  const PRODUCT_KEY = "expirycheck_products_" + currentUser.username;
  let products = [];
  try {
    const saved = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "[]");
    if (Array.isArray(saved)) {
      products = saved
        .filter(
          (product) =>
            product &&
            typeof product === "object" &&
            typeof product.name === "string" &&
            typeof product.category === "string" &&
            parseLocalDate(product.date),
        )
        .map((product, index) => ({
          id: Number.isSafeInteger(Number(product.id))
            ? Number(product.id)
            : Date.now() + index,
          name: product.name.slice(0, 120),
          category: product.category.slice(0, 60),
          qty: Math.min(
            999999,
            Math.max(1, Number.parseInt(product.qty, 10) || 1),
          ),
          date: product.date,
          barcode:
            typeof product.barcode === "string"
              ? product.barcode.slice(0, 100)
              : "",
        }));
    }
  } catch (error) {
    console.warn("Không thể đọc danh sách sản phẩm đã lưu.", error);
  }
  let nextId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  let editingId = null;
  let productModalTrigger = null;
  let currentStatus = "all";
  let currentCategory = "all";
  let currentSearch = "";
  function saveProducts() {
    try {
      localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
      return true;
    } catch (error) {
      console.warn("Không thể lưu danh sách sản phẩm.", error);
      showToast(t("features_toast_invalid"));
      return false;
    }
  }
  // HIỂN THỊ THÔNG TIN USER
  function renderCurrentUser() {
    const initials = getProductUserInitials(currentUser.fullName);
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set("headerGreeting", t("greeting") + ", " + currentUser.fullName.toUpperCase());
    set("uinfoAvatar", initials);
    set("uinfoName", currentUser.fullName);
    set("uinfoUsername", currentUser.username);
    set("uinfoEmail", currentUser.email);
    set("uinfoRole", currentUser.role);
    set("uinfoJoinDate", currentUser.joinDate);
  }
  // TÍNH TRẠNG THÁI HẠN
  function getStatus(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expireDate = parseLocalDate(dateString);
    if (!expireDate) return "bad";
    const diff = Math.round((expireDate - today) / 86400000);
    if (diff < 0) return "bad";
    if (diff <= 30) return "warn";
    return "ok";
  }
  // TÊN TRẠNG THÁI
  function statusLabel(status) {
    if (status === "bad") return t("features_chip_bad");
    if (status === "warn") return t("features_chip_warn");
    return t("features_chip_ok");
  }
  // ĐỊNH DẠNG NGÀY
  function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  // HIỂN THỊ DANH MỤC
  function renderCategories() {
    const select = document.getElementById("categoryFilter");
    if (!select) return;
    const categories = [...new Set(products.map((p) => p.category))].sort();
    select.innerHTML = `<option value="all">${t("features_filter_all_cat")}</option>`;
    categories.forEach((category) => {
      select.innerHTML += `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`;
    });
    select.value = currentCategory;
  }
  // HIỂN THỊ THỐNG KÊ
  function renderStats() {
    const counts = { ok: 0, warn: 0, bad: 0 };
    products.forEach((p) => counts[getStatus(p.date)]++);
    const total = products.length;
    const stats = document.getElementById("statsRow");
    if (stats) {
      stats.innerHTML = `
                <div class="stat-card total"><div class="bar"></div><div class="label">${t("features_stat_total")}</div><div class="value">${total}</div></div>
                <div class="stat-card ok"><div class="bar"></div><div class="label">${t("features_stat_ok")}</div><div class="value">${counts.ok}</div></div>
                <div class="stat-card warn"><div class="bar"></div><div class="label">${t("features_stat_warn", { days: 30 })}</div><div class="value">${counts.warn}</div></div>
                <div class="stat-card bad"><div class="bar"></div><div class="label">${t("features_stat_bad")}</div><div class="value">${counts.bad}</div></div>
            `;
    }
    const userCount = document.getElementById("uinfoCount");
    if (userCount) userCount.textContent = total;
  }
  // HIỂN THỊ BẢNG SẢN PHẨM
  function renderTable() {
    const search = currentSearch.toLowerCase();
    let list = products.filter((p) => {
      const status = getStatus(p.date);
      const matchStatus = currentStatus === "all" || status === currentStatus;
      const matchCategory =
        currentCategory === "all" || p.category === currentCategory;
      const matchSearch = String(p.name || "").toLowerCase().includes(search);
      return matchStatus && matchCategory && matchSearch;
    });
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
    const tbody = document.getElementById("tableBody");
    const empty = document.getElementById("emptyState");
    if (!tbody || !empty) return;
    if (list.length === 0) {
      tbody.innerHTML = "";
      empty.hidden = false;
      empty.innerHTML =
        products.length === 0
          ? `<i class="fa-regular fa-clipboard"></i><div>${t("features_empty_noproduct")}</div>`
          : `<i class="fa-solid fa-magnifying-glass"></i><div>${t("features_empty")}</div>`;
      return;
    }
    empty.hidden = true;
    tbody.innerHTML = list
      .map((product) => {
        const status = getStatus(product.date);
        return `
                <tr>
                    <td><div class="prod-name">${escapeHtml(product.name)}</div></td>
                    <td><span class="prod-cat">${escapeHtml(product.category)}</span></td>
                    <td>${product.qty}</td>
                    <td>${formatDate(product.date)}</td>
                    <td><span class="badge ${status}">${statusLabel(status)}</span></td>
                    <td>
                        <div class="row-actions">
                            <button type="button" class="icon-btn" title="${t("features_action_edit")}" aria-label="${t("features_action_edit")}" data-product-action="edit" data-product-id="${product.id}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button>
                            <button type="button" class="icon-btn danger" title="${t("features_action_delete")}" aria-label="${t("features_action_delete")}" data-product-action="delete" data-product-id="${product.id}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>
                        </div>
                    </td>
                </tr>
            `;
      })
      .join("");
  }
  function renderAll() {
    renderCategories();
    renderStats();
    renderTable();
  }
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  // TÌM KIẾM
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderTable();
    });
  }
  // LỌC DANH MỤC
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
      currentCategory = e.target.value;
      renderTable();
    });
  }
  // LỌC TRẠNG THÁI
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document
        .querySelectorAll(".chip")
        .forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      currentStatus = chip.dataset.status;
      renderTable();
    });
  });
  // MODAL THÊM SẢN PHẨM
  const productOverlay = document.getElementById("productOverlay");
  const addBtn = document.getElementById("addBtn");
  if (addBtn) addBtn.addEventListener("click", openAdd);
  const closeProductModalBtn = document.getElementById("closeProductModal");
  if (closeProductModalBtn)
    closeProductModalBtn.addEventListener("click", closeProductModal);
  const cancelProduct = document.getElementById("cancelProduct");
  if (cancelProduct) cancelProduct.addEventListener("click", closeProductModal);
  if (productOverlay) {
    productOverlay.addEventListener("click", (e) => {
      if (e.target === productOverlay) closeProductModal();
    });
  }
  const productTableBody = document.getElementById("tableBody");
  productTableBody?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-product-action]");
    if (!button || !productTableBody.contains(button)) return;

    const id = Number(button.dataset.productId);
    if (!Number.isSafeInteger(id)) return;

    if (button.dataset.productAction === "edit") openEdit(id);
    if (button.dataset.productAction === "delete") deleteProduct(id);
  });
  // MỞ FORM THÊM
  function openAdd() {
    productModalTrigger = document.activeElement;
    editingId = null;
    document.getElementById("modalTitle").textContent = t("features_modal_add_title");
    document.getElementById("f_name").value = "";
    document.getElementById("f_category").value = "";
    document.getElementById("f_qty").value = "";
    document.getElementById("f_date").value = toLocalDateInputValue();
    productOverlay.inert = false;
    productOverlay.classList.add("show");
    productOverlay.setAttribute("aria-hidden", "false");
    document.getElementById("f_name").focus();
  }
  // MỞ FORM SỬA
  function openEdit(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    productModalTrigger = document.activeElement;
    editingId = id;
    document.getElementById("modalTitle").textContent = t("features_modal_edit_title");
    document.getElementById("f_name").value = product.name;
    document.getElementById("f_category").value = product.category;
    document.getElementById("f_qty").value = product.qty;
    document.getElementById("f_date").value = product.date;
    productOverlay.inert = false;
    productOverlay.classList.add("show");
    productOverlay.setAttribute("aria-hidden", "false");
    document.getElementById("f_name").focus();
  }
  //  XÓA SẢN PHẨM
  function deleteProduct(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    if (!confirm(t("features_confirm_delete", { name: product.name }))) return;
    products = products.filter((item) => item.id !== id);
    saveProducts();
    renderAll();
    showToast(t("features_toast_deleted"));
  }
  // ĐÓNG MODAL SẢN PHẨM
  function closeProductModal() {
    if (productOverlay) {
      productOverlay.classList.remove("show");
      productOverlay.setAttribute("aria-hidden", "true");
      productOverlay.inert = true;
      if (productModalTrigger instanceof HTMLElement) {
        productModalTrigger.focus();
      }
    }
  }
  // LƯU SẢN PHẨM
  const saveProduct = document.getElementById("saveProduct");
  if (saveProduct) {
    saveProduct.addEventListener("click", () => {
      const name = document.getElementById("f_name").value.trim();
      const category = document.getElementById("f_category").value.trim();
      const qty = parseInt(document.getElementById("f_qty").value, 10);
      const date = document.getElementById("f_date").value;
      if (
        !name ||
        name.length > 120 ||
        !category ||
        category.length > 60 ||
        !parseLocalDate(date) ||
        isNaN(qty) ||
        qty < 1 ||
        qty > 999999
      ) {
        showToast(t("features_toast_invalid"));
        return;
      }
      if (editingId !== null) {
        const product = products.find((item) => item.id === editingId);
        if (product) {
          product.name = name;
          product.category = category;
          product.qty = qty;
          product.date = date;
          saveProducts();
          showToast(t("features_toast_updated"));
        }
      } else {
        products.push({ id: nextId++, name, category, qty, date });
        saveProducts();
        showToast(t("features_toast_added"));
      }
      closeProductModal();
      renderAll();
    });
  }
  // Khi người dùng đổi ngôn ngữ (từ menu Cài đặt nhanh), vẽ lại phần nội dung
  // do JS tự sinh (dropdown danh mục, trạng thái rỗng) theo ngôn ngữ mới.
  document.addEventListener("languagechange", renderAll);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (productOverlay?.classList.contains("show")) closeProductModal();
  });

  renderCurrentUser();
  renderAll();
}
