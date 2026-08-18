let html5QrcodeScanner = null;
let isProcessingScan = false;
let lastScannedBarcode = null;
let scannerRequested = false;
let scannerState = "idle";
let scannerQueue = Promise.resolve();
let html5QrcodeLoadPromise = null;

const BARCODE_DB_KEY = "expirycheck_barcode_db";
const HTML5_QRCODE_URL =
  "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
const HTML5_QRCODE_INTEGRITY =
  "sha384-c9d8RFSL+u3exBOJ4Yp3HUJXS4znl9f+z66d1y54ig+ea249SpqR+w1wyvXz/lk+";
const MAX_PRODUCT_NAME_LENGTH = 200;
const MAX_BARCODE_LENGTH = 128;
const MAX_BARCODE_DB_ENTRIES = 2000;

function translate(key, params) {
  try {
    return typeof t === "function" ? String(t(key, params)) : key;
  } catch (error) {
    console.warn("Không thể tải bản dịch:", key, error);
    return key;
  }
}

function getCurrentLanguage() {
  try {
    if (typeof getLang === "function") return getLang();
  } catch (error) {
    console.warn("Không thể đọc ngôn ngữ hiện tại:", error);
  }

  return document.documentElement.lang === "en" ? "en" : "vi";
}

function localMessage(viMessage, enMessage) {
  return getCurrentLanguage() === "en" ? enMessage : viMessage;
}

function cleanText(value, maxLength) {
  if (typeof value !== "string" && typeof value !== "number") return "";

  return String(value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeProductName(value) {
  return cleanText(value, MAX_PRODUCT_NAME_LENGTH);
}

function normalizeBarcode(value) {
  return cleanText(value, MAX_BARCODE_LENGTH);
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function safeReadJSON(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) return fallbackValue;
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn(`Dữ liệu lưu tại "${key}" không hợp lệ và đã được bỏ qua.`, error);
    return fallbackValue;
  }
}

function safeWriteJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Không thể lưu dữ liệu tại "${key}".`, error);
    return false;
  }
}

function createIcon(className) {
  const icon = document.createElement("i");
  icon.className = className;
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function createStatusRow(extraClass = "") {
  const row = document.createElement("div");
  row.className = extraClass ? `srow ${extraClass}` : "srow";
  return row;
}

function setScanInfo(renderContent) {
  const infoBox = document.getElementById("scanResultInfo");
  if (!infoBox) return;

  infoBox.replaceChildren();
  infoBox.className = "scan-result-info show";
  renderContent(infoBox);
}

function clearScanInfo() {
  const infoBox = document.getElementById("scanResultInfo");
  if (!infoBox) return;

  infoBox.replaceChildren();
  infoBox.className = "scan-result-info";
}

function renderScanSearching() {
  setScanInfo((infoBox) => {
    const row = createStatusRow();
    row.append(
      createIcon("fa-solid fa-spinner fa-spin"),
      document.createTextNode(` ${translate("check_scan_searching")}`),
    );
    infoBox.append(row);
  });
}

function appendLabeledValue(parent, label, value, valueTag = "b") {
  const row = createStatusRow();
  const valueElement = document.createElement(valueTag);
  valueElement.textContent = value;
  row.append(document.createTextNode(`${label} `), valueElement);
  parent.append(row);
}

function createScanAction(className, iconClass, label, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.append(
    createIcon(iconClass),
    document.createTextNode(` ${label}`),
  );
  button.addEventListener("click", handler);
  return button;
}

function appendScanActions(parent, continueLabel, continueIcon) {
  const actions = document.createElement("div");
  actions.className = "scan-result-actions";
  actions.append(
    createScanAction(
      "btn-continue",
      continueIcon,
      continueLabel,
      () => switchTab("manual"),
    ),
    createScanAction(
      "btn-rescan",
      "fa-solid fa-rotate",
      translate("check_scan_btn_rescan"),
      rescanBarcode,
    ),
  );
  parent.append(actions);
}

function renderScanFound(product, barcode) {
  setScanInfo((infoBox) => {
    const foundRow = createStatusRow();
    foundRow.append(
      createIcon("fa-solid fa-circle-check"),
      document.createTextNode(` ${translate("check_scan_found")}`),
    );
    infoBox.append(foundRow);

    const productRow = createStatusRow();
    const productName = document.createElement("strong");
    productName.textContent = product.name;
    productRow.append(productName);
    infoBox.append(productRow);

    appendLabeledValue(
      infoBox,
      translate("check_scan_barcode_label"),
      barcode,
    );

    const sourceRow = createStatusRow();
    sourceRow.style.fontSize = "13px";
    sourceRow.style.color = "#666";
    sourceRow.textContent = `${translate("check_scan_source_label")} ${product.source}`;
    infoBox.append(sourceRow);

    appendScanActions(
      infoBox,
      translate("check_scan_btn_continue_hsd"),
      "fa-solid fa-arrow-right",
    );
  });
}

function renderScanNotFound(barcode) {
  setScanInfo((infoBox) => {
    const notFoundRow = createStatusRow("not-found");
    notFoundRow.append(
      createIcon("fa-solid fa-triangle-exclamation"),
      document.createTextNode(` ${translate("check_scan_not_found")}`),
    );
    infoBox.append(notFoundRow);

    appendLabeledValue(
      infoBox,
      translate("check_scan_barcode_label"),
      barcode,
    );

    const hintRow = createStatusRow();
    hintRow.style.fontSize = "13px";
    hintRow.style.color = "#666";
    hintRow.textContent = translate("check_scan_manual_hint");
    infoBox.append(hintRow);

    appendScanActions(
      infoBox,
      translate("check_scan_btn_manual"),
      "fa-solid fa-pen-to-square",
    );
  });
}

function renderCameraError() {
  setScanInfo((infoBox) => {
    const row = createStatusRow("not-found");
    row.append(
      createIcon("fa-solid fa-camera-rotate"),
      document.createTextNode(` ${translate("check_alert_camera_error")}`),
    );
    infoBox.append(row);
  });
}

function setReaderBusy(isBusy) {
  const reader = document.getElementById("reader");
  if (reader) reader.setAttribute("aria-busy", String(isBusy));
}

function queueScannerOperation(operation) {
  const queuedOperation = scannerQueue
    .catch(() => undefined)
    .then(operation);

  scannerQueue = queuedOperation.catch(() => undefined);
  return queuedOperation;
}

function loadHtml5Qrcode() {
  if (
    typeof Html5Qrcode === "function" &&
    typeof Html5QrcodeSupportedFormats !== "undefined"
  ) {
    return Promise.resolve();
  }

  if (html5QrcodeLoadPromise) return html5QrcodeLoadPromise;

  html5QrcodeLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "html5-qrcode-script";
    script.src = HTML5_QRCODE_URL;
    script.integrity = HTML5_QRCODE_INTEGRITY;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.addEventListener("load", () => {
      if (
        typeof Html5Qrcode === "function" &&
        typeof Html5QrcodeSupportedFormats !== "undefined"
      ) {
        resolve();
      } else {
        reject(new Error("Thư viện html5-qrcode không khởi tạo đúng cách."));
      }
    });
    script.addEventListener("error", () => {
      reject(new Error("Không thể tải thư viện html5-qrcode."));
    });
    document.head.append(script);
  }).catch((error) => {
    document.getElementById("html5-qrcode-script")?.remove();
    html5QrcodeLoadPromise = null;
    throw error;
  });

  return html5QrcodeLoadPromise;
}

function switchTab(type) {
  const scanMode = type === "scan";
  const btnScan = document.getElementById("btn-tab-scan");
  const btnManual = document.getElementById("btn-tab-manual");
  const scannerContainer = document.getElementById("scanner-container");

  if (!btnScan || !btnManual || !scannerContainer) return;

  btnScan.classList.toggle("active", scanMode);
  btnManual.classList.toggle("active", !scanMode);
  btnScan.setAttribute("aria-pressed", String(scanMode));
  btnManual.setAttribute("aria-pressed", String(!scanMode));
  scannerContainer.style.display = scanMode ? "block" : "none";
  scannerContainer.setAttribute("aria-hidden", String(!scanMode));
  scannerContainer.inert = !scanMode;

  if (scanMode) {
    clearScanInfo();
    void startCameraScanner();
  } else {
    void stopCameraScanner();
  }
}

function startCameraScanner() {
  scannerRequested = true;

  return queueScannerOperation(async () => {
    if (!scannerRequested) return;

    if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
      scannerState = "scanning";
      return;
    }

    scannerState = "starting";
    setReaderBusy(true);

    try {
      await loadHtml5Qrcode();
      if (!scannerRequested) {
        scannerState = "idle";
        return;
      }

      if (!html5QrcodeScanner) {
        html5QrcodeScanner = new Html5Qrcode("reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
          ],
        });
      }

      await html5QrcodeScanner.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 300, height: 120 },
        },
        onScanSuccess,
        onScanFailure,
      );

      if (!scannerRequested && html5QrcodeScanner.isScanning) {
        await html5QrcodeScanner.stop();
        scannerState = "idle";
        return;
      }

      scannerState = "scanning";
    } catch (error) {
      scannerState = "idle";
      if (scannerRequested) {
        console.warn("Không thể khởi động camera:", error);
        renderCameraError();
        showToast(translate("check_alert_camera_error"));
      }
    } finally {
      setReaderBusy(false);
    }
  });
}

function stopCameraScanner() {
  scannerRequested = false;

  return queueScannerOperation(async () => {
    if (!html5QrcodeScanner || !html5QrcodeScanner.isScanning) {
      scannerState = "idle";
      setReaderBusy(false);
      return;
    }

    scannerState = "stopping";
    setReaderBusy(true);

    try {
      await html5QrcodeScanner.stop();
    } catch (error) {
      console.warn("Không thể dừng camera:", error);
    } finally {
      scannerState = "idle";
      setReaderBusy(false);
    }
  });
}

function onScanFailure() {
  // Callback chạy mỗi khung hình không có mã; cố ý không ghi log để tránh làm đầy console.
}

async function onScanSuccess(decodedText) {
  if (isProcessingScan) return;

  const barcode = normalizeBarcode(decodedText);
  if (!barcode) return;

  isProcessingScan = true;
  lastScannedBarcode = barcode;
  renderScanSearching();

  try {
    await stopCameraScanner();
    const product = await lookupProductByBarcode(barcode);

    if (product) {
      const prodName = document.getElementById("prodName");
      if (prodName) prodName.value = product.name;
      renderScanFound(product, barcode);
    } else {
      renderScanNotFound(barcode);
    }
  } catch (error) {
    console.warn("Không thể xử lý mã vạch:", error);
    renderScanNotFound(barcode);
  } finally {
    isProcessingScan = false;
  }
}

function rescanBarcode() {
  lastScannedBarcode = null;
  clearScanInfo();
  void startCameraScanner();
}

function getBarcodeDB() {
  const storedValue = safeReadJSON(BARCODE_DB_KEY, {});
  const cleanDatabase = Object.create(null);

  if (!isPlainObject(storedValue)) return cleanDatabase;

  const entries = Object.entries(storedValue).slice(0, MAX_BARCODE_DB_ENTRIES);
  entries.forEach(([storedBarcode, storedName]) => {
    const barcode = normalizeBarcode(storedBarcode);
    const name = normalizeProductName(storedName);
    if (barcode && name) cleanDatabase[barcode] = name;
  });

  return cleanDatabase;
}

function getLocalBarcodeName(barcode) {
  const database = getBarcodeDB();
  return Object.hasOwn(database, barcode) ? database[barcode] : null;
}

function saveLocalBarcodeName(barcodeValue, nameValue) {
  const barcode = normalizeBarcode(barcodeValue);
  const name = normalizeProductName(nameValue);
  if (!barcode || !name) return false;

  const database = getBarcodeDB();
  database[barcode] = name;
  return safeWriteJSON(BARCODE_DB_KEY, database);
}

async function lookupProductByBarcode(barcodeValue) {
  const barcode = normalizeBarcode(barcodeValue);
  if (!barcode) return null;

  const localName = getLocalBarcodeName(barcode);
  if (localName) {
    return {
      name: localName,
      source: translate("check_scan_source_local"),
    };
  }

  const controller =
    typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), 10000)
    : null;

  try {
    const url =
      `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(barcode)}` +
      "?product_type=all&lc=vi&cc=vn";
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller ? controller.signal : undefined,
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!isPlainObject(data) || !isPlainObject(data.product)) return null;

    const product = data.product;
    const productName = [
      product.product_name_vi,
      product.product_name_en,
      product.product_name,
      product.generic_name_vi,
      product.generic_name,
      product.abbreviated_product_name,
      product.brands,
    ]
      .map(normalizeProductName)
      .find(Boolean);

    if (!productName) return null;

    saveLocalBarcodeName(barcode, productName);
    return { name: productName, source: "Open Food Facts" };
  } catch (error) {
    if (error && error.name !== "AbortError") {
      console.warn("Không thể tra cứu Open Food Facts:", error);
    }
    return null;
  } finally {
    if (timeoutId !== null) clearTimeout(timeoutId);
  }
}

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function parseDateInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1900 || year > 9999) return null;

  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    date,
    dayNumber: Math.floor(Date.UTC(year, month - 1, day) / 86400000),
  };
}

function getTodayDayNumber() {
  const today = new Date();
  return Math.floor(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000,
  );
}

function validateProductDates(nsxValue, hsdValue) {
  if (!hsdValue) {
    alert(translate("check_alert_need_hsd"));
    return null;
  }

  const hsd = parseDateInput(hsdValue);
  const nsx = nsxValue ? parseDateInput(nsxValue) : null;

  if (!hsd || (nsxValue && !nsx)) {
    alert(
      localMessage(
        "Ngày không hợp lệ. Vui lòng chọn lại ngày sản xuất và hạn sử dụng.",
        "Invalid date. Please select the manufacture and expiry dates again.",
      ),
    );
    return null;
  }

  if (nsx && nsx.dayNumber > hsd.dayNumber) {
    alert(translate("check_alert_nsx_after_hsd"));
    return null;
  }

  if (nsx && nsx.dayNumber > getTodayDayNumber()) {
    alert(
      localMessage(
        "Ngày sản xuất không được ở trong tương lai.",
        "The manufacture date cannot be in the future.",
      ),
    );
    return null;
  }

  return { nsx, hsd };
}

function appendExpiryMessage(resultBox, translationKey, name, days) {
  const nameMarker = "__EXPIRYCHECK_PRODUCT_NAME__";
  const daysMarker = "__EXPIRYCHECK_DAYS__";
  const translatedTemplate = translate(translationKey, {
    name: nameMarker,
    days: daysMarker,
  });
  const plainTemplate = translatedTemplate.replace(/<[^>]*>/g, "");
  const parts = plainTemplate.split(
    /(__EXPIRYCHECK_PRODUCT_NAME__|__EXPIRYCHECK_DAYS__)/g,
  );

  parts.forEach((part) => {
    if (part === nameMarker || part === daysMarker) {
      const strong = document.createElement("strong");
      strong.textContent = part === nameMarker ? name : String(days);
      resultBox.append(strong);
    } else if (part) {
      resultBox.append(document.createTextNode(part));
    }
  });
}

function renderExpiryResult(status, translationKey, name, days) {
  const resultBox = document.getElementById("resultBox");
  if (!resultBox) return;

  resultBox.replaceChildren();
  resultBox.className = `result-alert show ${status}`;
  resultBox.append(
    createIcon("fa-solid fa-triangle-exclamation"),
    document.createTextNode(" "),
  );
  appendExpiryMessage(resultBox, translationKey, name, days);
}

function checkExpiryDate() {
  const nameInput = document.getElementById("prodName");
  const nsxInput = document.getElementById("prodNSX");
  const hsdInput = document.getElementById("prodHSD");
  if (!nameInput || !nsxInput || !hsdInput) return;

  const name =
    normalizeProductName(nameInput.value) ||
    translate("check_default_product_name");
  const dates = validateProductDates(nsxInput.value, hsdInput.value);
  if (!dates) return;

  const diffDays = dates.hsd.dayNumber - getTodayDayNumber();

  if (diffDays < 0) {
    renderExpiryResult(
      "expired",
      "check_result_expired_html",
      name,
      Math.abs(diffDays),
    );
  } else if (diffDays <= 30) {
    renderExpiryResult(
      "warning",
      "check_result_warning_html",
      name,
      diffDays,
    );
  } else {
    renderExpiryResult("safe", "check_result_safe_html", name, diffDays);
  }
}

function getAuthenticatedUser() {
  try {
    if (typeof getCurrentUser !== "function") return null;
    const user = getCurrentUser();
    return user && typeof user.username === "string" && user.username.trim()
      ? user
      : null;
  } catch (error) {
    console.warn("Không thể đọc phiên đăng nhập:", error);
    return null;
  }
}

function getProductKey(user = getAuthenticatedUser()) {
  if (!user) return null;
  return `expirycheck_products_${user.username}`;
}

function getSavedProducts(productKey = getProductKey()) {
  if (!productKey) return [];
  const storedProducts = safeReadJSON(productKey, []);
  return Array.isArray(storedProducts) ? storedProducts : [];
}

function saveProducts(products, productKey = getProductKey()) {
  if (!productKey || !Array.isArray(products)) return false;
  return safeWriteJSON(productKey, products);
}

function prepareProductToSave() {
  const user = getAuthenticatedUser();
  const productKey = getProductKey(user);

  if (!productKey) {
    alert(translate("login_required_desc"));
    return;
  }

  const nameInput = document.getElementById("prodName");
  const nsxInput = document.getElementById("prodNSX");
  const hsdInput = document.getElementById("prodHSD");
  if (!nameInput || !nsxInput || !hsdInput) return;

  const name = normalizeProductName(nameInput.value);
  const nsx = nsxInput.value;
  const hsd = hsdInput.value;

  if (!name || !hsd) {
    alert(translate("check_alert_need_name_hsd"));
    return;
  }

  if (!validateProductDates(nsx, hsd)) return;

  const productToSave = {
    id: Date.now(),
    name,
    category: "Sản phẩm",
    qty: 1,
    nsx,
    date: hsd,
    barcode: lastScannedBarcode || "",
  };

  const products = getSavedProducts(productKey);
  products.push(productToSave);

  if (!saveProducts(products, productKey)) {
    alert(
      localMessage(
        "Không thể lưu sản phẩm. Vui lòng kiểm tra dung lượng trình duyệt và thử lại.",
        "Unable to save the product. Please check browser storage and try again.",
      ),
    );
    return;
  }

  if (lastScannedBarcode) {
    saveLocalBarcodeName(lastScannedBarcode, name);
  }

  nameInput.value = name;
  alert(translate("check_alert_saved"));
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function syncDateConstraints() {
  const nsxInput = document.getElementById("prodNSX");
  const hsdInput = document.getElementById("prodHSD");
  if (!nsxInput || !hsdInput) return;

  nsxInput.max = toDateInputValue(new Date());
  hsdInput.min = nsxInput.value || "1900-01-01";
}

window.saveCheckedProduct = prepareProductToSave;

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btn-tab-scan")
    ?.addEventListener("click", () => switchTab("scan"));
  document
    .getElementById("btn-tab-manual")
    ?.addEventListener("click", () => switchTab("manual"));
  document
    .getElementById("checkExpiryBtn")
    ?.addEventListener("click", checkExpiryDate);
  document
    .getElementById("saveProductBtn")
    ?.addEventListener("click", prepareProductToSave);
  document
    .getElementById("prodNSX")
    ?.addEventListener("change", syncDateConstraints);

  syncDateConstraints();
});

window.addEventListener("pagehide", () => {
  scannerRequested = false;
  if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
    void html5QrcodeScanner.stop().catch(() => undefined);
  }
});
