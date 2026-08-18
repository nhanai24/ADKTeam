/* ==========================================================================
   reviews.js — Phần "Đánh Giá Từ Người Dùng" (chấm sao + nhận xét)
   Mỗi người dùng có thể gửi NHIỀU đánh giá. Ai cũng xem được đánh giá
   của mọi người. Người dùng có thể Sửa/Xoá đánh giá của chính mình.
   Lưu chung cho toàn site trong localStorage, hiển thị trên Trang Chủ.
   Nội dung tĩnh (nhãn, nút, thông báo) dùng hàm t() từ theme.js nên sẽ
   tự đổi theo ngôn ngữ đang chọn.
   ========================================================================== */

const REVIEWS_STORAGE_KEY = "expirycheck_reviews";

function getReviews() {
  try {
    const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    const reviews = Array.isArray(parsed)
      ? parsed.filter(
          (review) =>
            review &&
            typeof review === "object" &&
            Number.isInteger(Number(review.rating)) &&
            Number(review.rating) >= 1 &&
            Number(review.rating) <= 5 &&
            typeof review.comment === "string",
        ).map((review) => ({
          ...review,
          rating: Number(review.rating),
          fullName:
            typeof review.fullName === "string" ? review.fullName : "Người dùng",
          username:
            typeof review.username === "string" ? review.username : "",
        }))
      : [];
    // Vá dữ liệu cũ: gán id cho các đánh giá được tạo trước khi có tính năng Sửa/Xoá
    let changed = false;
    reviews.forEach((r) => {
      if (!r.id) {
        r.id = reviewMakeId();
        changed = true;
      }
    });
    if (changed) saveReviews(reviews);
    return reviews;
  } catch (e) {
    return [];
  }
}

function saveReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    return true;
  } catch (error) {
    console.warn("Không thể lưu đánh giá.", error);
    return false;
  }
}

function reviewInitials(name) {
  if (!name) return "ND";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function reviewEscapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function reviewFormatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

function reviewMakeId() {
  return "rv_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

// Dùng t() từ theme.js nếu có (theme.js phải được nạp trước reviews.js).
// Nếu vì lý do gì đó chưa có, dùng key làm chuỗi tạm để không bị lỗi.
function rt(key, params) {
  return typeof t === "function" ? t(key, params) : key;
}

function starsHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html +=
      i <= rating
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

document.addEventListener("DOMContentLoaded", function () {
  const summaryBox = document.getElementById("reviewSummary");
  const formWrap = document.getElementById("reviewFormWrap");
  const listBox = document.getElementById("reviewList");
  if (!summaryBox || !formWrap || !listBox) return;

  const currentUser =
    typeof getCurrentUser === "function" ? getCurrentUser() : null;

  // id của đánh giá đang được sửa (null = đang thêm đánh giá mới)
  let editingId = null;

  function renderSummary() {
    const reviews = getReviews();
    const total = reviews.length;

    if (total === 0) {
      summaryBox.innerHTML = `
        <div class="review-summary-left">
          <div class="review-summary-score">—<span class="review-summary-max">/5</span></div>
          <div class="review-summary-stars">${starsHtml(0)}</div>
          <div class="review-summary-count">${rt("review_no_reviews")}</div>
        </div>
        <div class="review-summary-right">
          <div class="review-summary-stat">
            <i class="fa-solid fa-circle-check"></i>
            ${rt("review_be_first")}
          </div>
        </div>
      `;
      return;
    }

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    const fiveStarPct = Math.round(
      (reviews.filter((r) => r.rating === 5).length / total) * 100,
    );
    const satisfiedPct = Math.round(
      (reviews.filter((r) => r.rating >= 4).length / total) * 100,
    );

    summaryBox.innerHTML = `
      <div class="review-summary-left">
        <div class="review-summary-score">${avg.toFixed(1)}<span class="review-summary-max">/5</span></div>
        <div class="review-summary-stars">${starsHtml(Math.round(avg))}</div>
        <div class="review-summary-count">${rt("review_based_on", { count: total })}</div>
      </div>
      <div class="review-summary-right">
        <div class="review-summary-stat">
          <i class="fa-solid fa-circle-check"></i>
          ${rt("review_five_star_pct", { pct: fiveStarPct })}
        </div>
        <div class="review-summary-stat">
          <i class="fa-solid fa-circle-check"></i>
          ${rt("review_satisfied_pct", { pct: satisfiedPct })}
        </div>
      </div>
    `;
  }

  function renderList() {
    const reviews = getReviews().slice().sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    if (reviews.length === 0) {
      listBox.innerHTML = `
        <div class="review-empty">
          <i class="fa-regular fa-comment-dots"></i>
          <div>${rt("review_be_first_empty")}</div>
        </div>
      `;
      return;
    }
    listBox.innerHTML = reviews
      .map((r) => {
        const safeId = reviewEscapeHtml(r.id);
        const isMine = currentUser && r.username === currentUser.username;
        return `
        <div class="review-card" data-id="${safeId}">
          <div class="review-card-head">
            <div class="review-avatar">${reviewEscapeHtml(reviewInitials(r.fullName))}</div>
            <div class="review-meta">
              <div class="review-name">${reviewEscapeHtml(r.fullName)}</div>
              <div class="review-stars">${starsHtml(r.rating)}</div>
            </div>
            <div class="review-date">${reviewFormatDate(r.date)}</div>
          </div>
          <p class="review-comment">${reviewEscapeHtml(r.comment)}</p>
          ${
            isMine
              ? `
          <div class="review-card-actions">
            <button type="button" class="review-action-btn edit-review-btn" data-id="${safeId}">
              <i class="fa-solid fa-pen"></i> ${rt("review_edit_btn")}
            </button>
            <button type="button" class="review-action-btn delete-review-btn" data-id="${safeId}">
              <i class="fa-solid fa-trash"></i> ${rt("review_delete_btn")}
            </button>
          </div>`
              : ""
          }
        </div>
      `;
      })
      .join("");

    // Gắn sự kiện Sửa
    listBox.querySelectorAll(".edit-review-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const review = getReviews().find(
          (r) =>
            r.id === id &&
            currentUser &&
            r.username === currentUser.username,
        );
        if (!review) return;
        editingId = id;
        renderForm();
        formWrap.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    // Gắn sự kiện Xoá
    listBox.querySelectorAll(".delete-review-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (!confirm(rt("review_confirm_delete"))) return;
        const reviews = getReviews().filter(
          (r) =>
            r.id !== id ||
            !currentUser ||
            r.username !== currentUser.username,
        );
        saveReviews(reviews);
        if (editingId === id) editingId = null;
        renderSummary();
        renderList();
        renderForm();
      });
    });
  }

  function renderForm() {
    if (!currentUser) {
      formWrap.innerHTML = `
        <div class="review-login-prompt">
          <i class="fa-solid fa-lock"></i>
          <span>${rt("review_login_prompt_html")}</span>
        </div>
      `;
      return;
    }

    const editingReview = editingId
      ? getReviews().find((r) => r.id === editingId)
      : null;
    // Nếu đánh giá đang sửa không còn tồn tại (đã bị xoá) thì quay về chế độ thêm mới
    if (editingId && !editingReview) editingId = null;

    formWrap.innerHTML = `
      <div class="review-form">
        <h3>${editingReview ? rt("review_edit_title") : rt("review_share_title")}</h3>
        <div class="star-rating" id="starRatingInput">
          <input type="radio" id="star5" name="rating" value="5" />
          <label for="star5"><i class="fa-solid fa-star"></i></label>
          <input type="radio" id="star4" name="rating" value="4" />
          <label for="star4"><i class="fa-solid fa-star"></i></label>
          <input type="radio" id="star3" name="rating" value="3" />
          <label for="star3"><i class="fa-solid fa-star"></i></label>
          <input type="radio" id="star2" name="rating" value="2" />
          <label for="star2"><i class="fa-solid fa-star"></i></label>
          <input type="radio" id="star1" name="rating" value="1" />
          <label for="star1"><i class="fa-solid fa-star"></i></label>
        </div>
        <textarea id="reviewComment" class="review-textarea" placeholder="${rt("review_placeholder")}" maxlength="500">${editingReview ? reviewEscapeHtml(editingReview.comment) : ""}</textarea>
        <p class="review-form-msg" id="reviewFormMsg"></p>
        <div class="review-form-buttons">
          <button type="button" class="btn-review-submit" id="submitReviewBtn">
            <i class="fa-solid fa-paper-plane"></i> ${editingReview ? rt("review_save_changes") : rt("review_submit")}
          </button>
          ${
            editingReview
              ? `<button type="button" class="btn-review-cancel" id="cancelEditBtn">${rt("review_cancel")}</button>`
              : ""
          }
        </div>
      </div>
    `;

    if (editingReview) {
      const radio = document.getElementById("star" + editingReview.rating);
      if (radio) radio.checked = true;
    }

    if (editingReview) {
      document.getElementById("cancelEditBtn").addEventListener("click", () => {
        editingId = null;
        renderForm();
      });
    }

    document
      .getElementById("submitReviewBtn")
      .addEventListener("click", function () {
        const msg = document.getElementById("reviewFormMsg");
        const checked = document.querySelector(
          '#starRatingInput input[name="rating"]:checked',
        );
        const comment = document.getElementById("reviewComment").value.trim();

        if (!checked) {
          msg.textContent = rt("review_error_rating");
          msg.className = "review-form-msg show error";
          return;
        }
        if (!comment) {
          msg.textContent = rt("review_error_comment");
          msg.className = "review-form-msg show error";
          return;
        }

        const reviews = getReviews();
        const rating = parseInt(checked.value, 10);

        if (editingId) {
          // Cập nhật đánh giá đã có
          const idx = reviews.findIndex(
            (r) =>
              r.id === editingId && r.username === currentUser.username,
          );
          if (idx >= 0) {
            reviews[idx] = {
              ...reviews[idx],
              rating: rating,
              comment: comment,
              date: new Date().toISOString(),
            };
          }
          editingId = null;
        } else {
          // Thêm đánh giá mới (mỗi người có thể có nhiều đánh giá)
          reviews.push({
            id: reviewMakeId(),
            username: currentUser.username,
            fullName: currentUser.fullName || currentUser.username,
            rating: rating,
            comment: comment,
            date: new Date().toISOString(),
          });
        }

        saveReviews(reviews);

        renderSummary();
        renderList();
        renderForm();
        const successMsg = document.getElementById("reviewFormMsg");
        if (successMsg) {
          successMsg.textContent = rt("review_thanks");
          successMsg.className = "review-form-msg show success";
        }
      });
  }

  renderSummary();
  renderList();
  renderForm();

  // Khi người dùng đổi ngôn ngữ (nhãn, nút, ...), render lại toàn bộ khối này
  document.addEventListener("languagechange", () => {
    renderSummary();
    renderList();
    renderForm();
  });
});
