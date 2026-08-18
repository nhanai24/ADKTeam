const USERS_KEY = "expirycheck_users";
const SESSION_KEY = "expirycheck_current_users";
const REVIEWS_KEY = "expirycheck_reviews";
const PASSWORD_ALGORITHM = "PBKDF2-SHA-256";
const PASSWORD_ITERATIONS = 310000;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_HASH_BYTES = 32;

function normalizeIdentity(value) {
  return String(value || "").normalize("NFKC").trim().toLowerCase();
}

function normalizeUsername(value) {
  return String(value || "").normalize("NFKC").trim();
}

function normalizeFullName(value) {
  return String(value || "").normalize("NFKC").trim().replace(/\s+/g, " ");
}

function normalizeEmail(value) {
  return String(value || "").normalize("NFKC").trim().toLowerCase();
}

function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) return [];

    const users = JSON.parse(data);
    return Array.isArray(users)
      ? users.filter(
          (user) =>
            user &&
            typeof user === "object" &&
            typeof user.username === "string",
        )
      : [];
  } catch (error) {
    console.error("Không thể đọc dữ liệu tài khoản:", error);
    return [];
  }
}

function saveUsers(users) {
  if (!Array.isArray(users)) {
    throw new TypeError("Danh sách tài khoản không hợp lệ.");
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCryptoApi() {
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.subtle &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    return globalThis.crypto;
  }
  throw new Error("CRYPTO_UNAVAILABLE");
}

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function derivePasswordHash(password, salt, iterations) {
  const cryptoApi = getCryptoApi();
  const passwordKey = await cryptoApi.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await cryptoApi.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt,
      iterations: iterations,
    },
    passwordKey,
    PASSWORD_HASH_BYTES * 8,
  );
  return new Uint8Array(bits);
}

async function createPasswordFields(password) {
  const cryptoApi = getCryptoApi();
  const salt = cryptoApi.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES));
  const hash = await derivePasswordHash(password, salt, PASSWORD_ITERATIONS);
  return {
    passwordAlgorithm: PASSWORD_ALGORITHM,
    passwordIterations: PASSWORD_ITERATIONS,
    passwordSalt: bytesToBase64(salt),
    passwordHash: bytesToBase64(hash),
  };
}

function hasPasswordHash(user) {
  return Boolean(
    user &&
      user.passwordAlgorithm === PASSWORD_ALGORITHM &&
      typeof user.passwordSalt === "string" &&
      typeof user.passwordHash === "string" &&
      Number.isSafeInteger(user.passwordIterations) &&
      user.passwordIterations >= 10000 &&
      user.passwordIterations <= 1000000,
  );
}

function secureBytesEqual(left, right) {
  if (!(left instanceof Uint8Array) || !(right instanceof Uint8Array)) {
    return false;
  }

  let difference = left.length ^ right.length;
  const maxLength = Math.max(left.length, right.length);
  for (let i = 0; i < maxLength; i += 1) {
    difference |= (left[i] || 0) ^ (right[i] || 0);
  }
  return difference === 0;
}

async function verifyUserPassword(user, password) {
  if (!user || typeof password !== "string") return false;

  if (hasPasswordHash(user)) {
    try {
      const salt = base64ToBytes(user.passwordSalt);
      const expectedHash = base64ToBytes(user.passwordHash);
      const actualHash = await derivePasswordHash(
        password,
        salt,
        user.passwordIterations,
      );
      return secureBytesEqual(actualHash, expectedHash);
    } catch (error) {
      console.error("Không thể xác minh mật khẩu:", error);
      return false;
    }
  }

  // Dữ liệu cũ chỉ được đọc để đăng nhập một lần. loginUser() sẽ thay
  // mật khẩu dạng rõ bằng PBKDF2 ngay sau khi xác minh thành công.
  return typeof user.password === "string" && user.password === password;
}

function applyPasswordFields(user, passwordFields) {
  Object.assign(user, passwordFields);
  delete user.password;
}

function publicUser(user) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  delete safeUser.passwordHash;
  delete safeUser.passwordSalt;
  delete safeUser.passwordIterations;
  delete safeUser.passwordAlgorithm;
  return safeUser;
}

function validateAccountFields(fullName, username, email) {
  if (fullName.length < 2 || fullName.length > 80) {
    return "Họ và tên phải có từ 2 đến 80 ký tự.";
  }
  if (
    username.length < 3 ||
    username.length > 32 ||
    !/^[^\s<>"']+$/u.test(username)
  ) {
    return "Tên đăng nhập phải có 3–32 ký tự và không chứa khoảng trắng.";
  }
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)
  ) {
    return "Email không hợp lệ.";
  }
  return "";
}

function validateProfileFields(fullName, email) {
  if (fullName.length < 2 || fullName.length > 80) {
    return "Họ và tên phải có từ 2 đến 80 ký tự.";
  }
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)
  ) {
    return "Email không hợp lệ.";
  }
  return "";
}

function validatePassword(password) {
  if (typeof password !== "string") {
    return "Mật khẩu không hợp lệ.";
  }
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return "Mật khẩu phải có từ 8 đến 128 ký tự.";
  }
  return "";
}

function authFailureMessage(error) {
  if (error && error.message === "CRYPTO_UNAVAILABLE") {
    return "Trình duyệt này không hỗ trợ mã hóa mật khẩu. Hãy mở trang bằng HTTPS và dùng trình duyệt mới.";
  }
  console.error("Lỗi xử lý tài khoản:", error);
  return "Không thể lưu dữ liệu tài khoản. Vui lòng thử lại.";
}

async function registerUser(fullName, username, email, password) {
  const cleanFullName = normalizeFullName(fullName);
  const cleanUsername = normalizeUsername(username);
  const cleanEmail = normalizeEmail(email);
  const fieldError = validateAccountFields(
    cleanFullName,
    cleanUsername,
    cleanEmail,
  );
  if (fieldError) return { success: false, message: fieldError };

  const passwordError = validatePassword(password);
  if (passwordError) return { success: false, message: passwordError };

  const users = getUsers();
  if (
    users.some(
      (user) => normalizeIdentity(user.username) === normalizeIdentity(cleanUsername),
    )
  ) {
    return { success: false, message: "Tên đăng nhập đã tồn tại." };
  }
  if (
    users.some(
      (user) => normalizeIdentity(user.email) === normalizeIdentity(cleanEmail),
    )
  ) {
    return { success: false, message: "Email đã được đăng ký." };
  }

  try {
    const passwordFields = await createPasswordFields(password);
    users.push({
      fullName: cleanFullName,
      username: cleanUsername,
      email: cleanEmail,
      ...passwordFields,
      joinDate: new Date().toISOString().slice(0, 10),
    });
    saveUsers(users);
    setCurrentUser(cleanUsername);
    return { success: true };
  } catch (error) {
    return { success: false, message: authFailureMessage(error) };
  }
}

async function loginUser(username, password) {
  const cleanUsername = normalizeUsername(username);
  if (!cleanUsername || !password) {
    return {
      success: false,
      message: "Vui lòng nhập tên đăng nhập và mật khẩu.",
    };
  }

  const users = getUsers();
  const user = users.find(
    (candidate) =>
      normalizeIdentity(candidate.username) === normalizeIdentity(cleanUsername),
  );
  if (!user || !(await verifyUserPassword(user, password))) {
    return {
      success: false,
      message: "Sai tên đăng nhập hoặc mật khẩu.",
    };
  }

  try {
    let userChanged = false;
    if (!hasPasswordHash(user) || user.passwordIterations < PASSWORD_ITERATIONS) {
      applyPasswordFields(user, await createPasswordFields(password));
      userChanged = true;
    }
    if (!user.joinDate) {
      user.joinDate = new Date().toISOString().slice(0, 10);
      userChanged = true;
    }
    if (userChanged) saveUsers(users);
    setCurrentUser(user.username);
    return { success: true };
  } catch (error) {
    return { success: false, message: authFailureMessage(error) };
  }
}

function setCurrentUser(username) {
  localStorage.setItem(SESSION_KEY, normalizeUsername(username));
}

function getCurrentUser() {
  try {
    const username = localStorage.getItem(SESSION_KEY);
    if (!username) return null;

    const users = getUsers();
    const user = users.find(
      (candidate) =>
        normalizeIdentity(candidate.username) === normalizeIdentity(username),
    );
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    if (!user.joinDate) {
      user.joinDate = new Date().toISOString().slice(0, 10);
      saveUsers(users);
    }
    return publicUser(user);
  } catch (error) {
    console.error("Không thể đọc phiên đăng nhập:", error);
    return null;
  }
}

function updateReviewAuthor(username, fullName) {
  try {
    const rawReviews = localStorage.getItem(REVIEWS_KEY);
    if (!rawReviews) return;
    const reviews = JSON.parse(rawReviews);
    if (!Array.isArray(reviews)) return;

    let changed = false;
    reviews.forEach((review) => {
      if (
        review &&
        normalizeIdentity(review.username) === normalizeIdentity(username)
      ) {
        review.fullName = fullName;
        changed = true;
      }
    });
    if (changed) localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.warn("Không thể đồng bộ tên trong đánh giá:", error);
  }
}

function updateUserProfile(username, fullName, email) {
  const cleanFullName = normalizeFullName(fullName);
  const cleanUsername = normalizeUsername(username);
  const cleanEmail = normalizeEmail(email);
  const userError = validateProfileFields(cleanFullName, cleanEmail);
  if (userError) return { success: false, message: userError };

  const users = getUsers();
  const user = users.find(
    (candidate) =>
      normalizeIdentity(candidate.username) === normalizeIdentity(cleanUsername),
  );
  if (!user) {
    return { success: false, message: "Không tìm thấy tài khoản." };
  }
  if (
    users.some(
      (candidate) =>
        candidate !== user &&
        normalizeIdentity(candidate.email) === normalizeIdentity(cleanEmail),
    )
  ) {
    return { success: false, message: "Email đã được đăng ký." };
  }

  try {
    user.fullName = cleanFullName;
    user.email = cleanEmail;
    saveUsers(users);
    updateReviewAuthor(user.username, cleanFullName);
    return { success: true, user: publicUser(user) };
  } catch (error) {
    return { success: false, message: authFailureMessage(error) };
  }
}

async function changeUserPassword(username, oldPassword, newPassword) {
  const passwordError = validatePassword(newPassword);
  if (passwordError) return { success: false, message: passwordError };
  if (!oldPassword) {
    return { success: false, message: "Vui lòng nhập mật khẩu hiện tại." };
  }
  if (oldPassword === newPassword) {
    return {
      success: false,
      message: "Mật khẩu mới phải khác mật khẩu hiện tại.",
    };
  }

  const users = getUsers();
  const user = users.find(
    (candidate) =>
      normalizeIdentity(candidate.username) === normalizeIdentity(username),
  );
  if (!user) {
    return { success: false, message: "Không tìm thấy tài khoản." };
  }
  if (!(await verifyUserPassword(user, oldPassword))) {
    return { success: false, message: "Mật khẩu hiện tại không đúng." };
  }

  try {
    applyPasswordFields(user, await createPasswordFields(newPassword));
    saveUsers(users);
    return { success: true };
  } catch (error) {
    return { success: false, message: authFailureMessage(error) };
  }
}

function removeUserOwnedData(username) {
  localStorage.removeItem("expirycheck_products_" + username);

  try {
    const rawReviews = localStorage.getItem(REVIEWS_KEY);
    if (!rawReviews) return;
    const reviews = JSON.parse(rawReviews);
    if (!Array.isArray(reviews)) return;
    const remainingReviews = reviews.filter(
      (review) =>
        !review ||
        normalizeIdentity(review.username) !== normalizeIdentity(username),
    );
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(remainingReviews));
  } catch (error) {
    console.warn("Không thể xóa dữ liệu đánh giá:", error);
  }
}

async function deleteUserAccount(username, password) {
  if (!password) {
    return { success: false, message: "Vui lòng nhập mật khẩu để xác nhận." };
  }

  const users = getUsers();
  const userIndex = users.findIndex(
    (candidate) =>
      normalizeIdentity(candidate.username) === normalizeIdentity(username),
  );
  if (userIndex < 0) {
    return { success: false, message: "Không tìm thấy tài khoản." };
  }
  const user = users[userIndex];
  if (!(await verifyUserPassword(user, password))) {
    return { success: false, message: "Mật khẩu không đúng." };
  }

  try {
    users.splice(userIndex, 1);
    saveUsers(users);
    removeUserOwnedData(user.username);
    logoutUser();
    return { success: true };
  } catch (error) {
    return { success: false, message: authFailureMessage(error) };
  }
}

function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}
