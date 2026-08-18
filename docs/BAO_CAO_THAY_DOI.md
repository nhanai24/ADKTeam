# Báo cáo đầy đủ các thay đổi ExpiryCheck so với bản gốc

Ngày cập nhật: **17/08/2026**  
Phạm vi mã nguồn: thư mục dự án `D:\Ai\ADKTeam (4)\ADKTeam`  
Mục tiêu: hoàn thiện đồ án theo phiếu chấm 10 điểm, sửa lỗi chức năng/giao diện, tăng an toàn và khả năng truy cập, tổ chức lại mã nguồn, thêm animation, hướng dẫn chạy và loại bỏ file không cần thiết.

> Đây là báo cáo của mã nguồn local. Website <https://trinhkiet1302.github.io/ExpiryCheck/> chỉ thay đổi sau khi mã nguồn được commit, push lên đúng branch GitHub Pages và deploy hoàn tất.

## 1. Tóm tắt kết quả

So với bản gốc, dự án đã được nâng từ 7 trang nội dung lên **9 trang nội dung chính**, đúng khoảng 8–10 trang của phiếu chấm. Ngoài ra có `404.html` phục vụ GitHub Pages.

Các nhóm thay đổi lớn:

- thêm trang **Cài đặt** và **Hỗ trợ** để hoàn thiện nội dung;
- thống nhất logo, navigation, màu sắc, font, trạng thái active và thanh tài khoản;
- tách riêng hai nút **Đăng Nhập** và **Đăng Ký**, gồm cả desktop lẫn mobile;
- thêm Tailwind CSS cục bộ cho responsive/layout, không phụ thuộc CDN Tailwind;
- giữ toàn bộ CSS trình bày trong file `.css` ngoài;
- tách logic JavaScript theo trách nhiệm và đưa logic xác thực theo trang ra file riêng;
- bổ sung form góp ý có nhiều loại trường, validation và lưu cục bộ;
- chuẩn hóa hai bảng dữ liệu bằng `caption`, `scope` và cấu trúc semantic;
- thêm ảnh có animation, liên kết email, liên kết nội bộ và liên kết ngoài;
- cải thiện đăng ký/đăng nhập, kiểm tra hạn dùng, mã vạch, quản lý sản phẩm, đánh giá và cài đặt;
- bổ sung metadata, SEO, social preview, sitemap, robots và trang 404;
- gom CSS/JS/ảnh vào `assets/`, loại file cũ/trùng/được sinh lại và viết lại tài liệu chạy dự án.

## 2. Đối chiếu trực tiếp với phiếu chấm

| Tiêu chí | Phần đã đáp ứng trong mã nguồn | Bằng chứng chính |
| --- | --- | --- |
| 1. Cấu trúc và nội dung — 2,0 | Có 9 trang nội dung, nội dung bám chủ đề hạn sử dụng, trang chủ rõ ràng, có hướng dẫn/giới thiệu/hỗ trợ/cài đặt. | `index.html`, `kiemtrahsd.html`, `tinhnang.html`, `huongdan.html`, `gioithieu.html`, `hotro.html`, `dangnhap.html`, `dangky.html`, `caidat.html` |
| 2. Giao diện & UX/UI — 2,0 | Logo/banner/navigation nhất quán, bảng màu teal dễ đọc, font đồng bộ, nút đăng nhập/đăng ký tách riêng, có dark mode, song ngữ, responsive và animation. | `assets/css/common.css`, CSS từng trang, `assets/js/theme.js` |
| 3. HTML5 & CSS — 2,0 | Dùng landmark HTML5, `label`, ARIA, metadata description/keywords; Tailwind local có utility responsive; CSS nằm ngoài HTML. | toàn bộ HTML, `tailwind.config.js`, `assets/css/tailwind.input.css`, `assets/css/tailwind.css` |
| 4. JavaScript — 1,5 | JavaScript ngoài xử lý xác thực, kiểm tra ngày, scanner, CRUD, validation, FAQ, theme/ngôn ngữ, modal và animation/chuyển trang. | `assets/js/*.js` |
| 5. Thành phần chức năng — 1,5 | Form hỗ trợ có input/email/select/radio/checkbox/textarea; bảng quản lý và bảng trạng thái dùng đúng mục đích; có GIF động thật, `mailto:`, link nội bộ và link ngoài. | `hotro.html`, `huongdan.html`, `tinhnang.html`, `assets/images/expirycheck-animated.gif`, `assets/js/hotro.js` |
| 6. Hiển thị trên trình duyệt — 1,0 | Có breakpoint/utility responsive, menu/nút/form/bảng co giãn theo desktop/tablet/mobile; mã dùng Web APIs tiêu chuẩn và có xử lý lỗi. | CSS chung, CSS từng trang, Tailwind local, JavaScript ngoài |

Bảng trên mô tả phần đã cài đặt, **không phải cam kết điểm số**. Điểm cuối cùng còn phụ thuộc việc chạy bản nộp, trình duyệt, mạng/camera và đánh giá của giảng viên.

### Kết luận rà theo từng dòng của phiếu chấm

Ở mức mã nguồn, **cả 13 hạng mục con trong 6 nhóm tiêu chí đều đã có phần triển khai và bằng chứng**:

- 9 trang nội dung chính, thêm 404 kỹ thuật; cả 10 HTML đều có `title`, description, keywords, viewport, `<main>`, CSS ngoài, JavaScript ngoài và Tailwind local;
- tìm thấy 197 lượt utility có prefix `ec-`; không có `<style>`, `style=`, `<font>`, script inline hoặc inline event handler;
- 12 file JavaScript ngoài hợp lệ về cú pháp; logic xác thực nằm trong `assets/js/auth.js` và `assets/js/auth-pages.js`;
- form hỗ trợ có text, email, select, radio, checkbox và textarea; hai bảng có `caption`/`scope`;
- có GIF động thật, `mailto:`, liên kết nội bộ và liên kết ngoài;
- 180 tham chiếu runtime nội bộ tồn tại, 4 liên kết tài liệu nội bộ tồn tại; không có file test/tạm, `node_modules` hoặc nhóm file trùng byte.

Phần còn cần làm thủ công trước khi nộp không phải là thiếu tính năng, mà là bước nghiệm thu môi trường: mở trực tiếp bản cuối trên Firefox, thử lại các breakpoint và quyền camera trên máy trình bày. Giao diện/màu sắc/hình ảnh vẫn có phần đánh giá thẩm mỹ chủ quan của giảng viên, nên không nên tuyên bố chắc chắn điểm 10 trước khi chấm.

## 3. Số lượng trang và nội dung

### Bản gốc

Bản gốc có 7 trang HTML nội dung:

1. `index.html`;
2. `kiemtrahsd.html`;
3. `tinhnang.html`;
4. `dangnhap.html`;
5. `dangky.html`;
6. `huongdan.html`;
7. `gioithieu.html`.

### Bản hiện tại

Bản hiện tại có 9 trang nội dung chính:

1. `index.html` — trang chủ, giới thiệu nhanh tính năng và đánh giá;
2. `kiemtrahsd.html` — kiểm tra thủ công và quét mã vạch;
3. `tinhnang.html` — bảng quản lý sản phẩm;
4. `huongdan.html` — quy trình sử dụng, FAQ và bảng trạng thái HSD;
5. `gioithieu.html` — giới thiệu mục tiêu/đội ngũ/phạm vi đồ án;
6. `hotro.html` — FAQ, quy định, liên kết và form góp ý;
7. `dangnhap.html` — đăng nhập hồ sơ cục bộ;
8. `dangky.html` — tạo hồ sơ cục bộ;
9. `caidat.html` — chỉnh hồ sơ, đổi mật khẩu và xóa tài khoản.

`404.html` là trang kỹ thuật bổ sung và không tính vào 9 trang nội dung.

## 4. Cấu trúc thư mục trước và sau

### Trước khi sửa

- HTML, CSS, JavaScript và ảnh nằm lẫn ở thư mục gốc.
- Có hai bộ file kiểm tra hạn dùng (`kthsd.*` và tên mới), gây khó xác định bộ đang dùng.
- Không có cấu hình Tailwind, tài liệu dự án, sitemap, robots hoặc trang 404.
- Trách nhiệm logic xác thực, giao diện và trang cụ thể chưa được mô tả rõ.

### Sau khi sửa

```text
ADKTeam/
├── index.html
├── kiemtrahsd.html
├── tinhnang.html
├── huongdan.html
├── gioithieu.html
├── hotro.html
├── dangnhap.html
├── dangky.html
├── caidat.html
├── 404.html
├── assets/
│   ├── css/
│   │   ├── common.css
│   │   ├── motion.css
│   │   ├── style.css
│   │   ├── kiemtrangay.css
│   │   ├── tinhnang.css
│   │   ├── login.css
│   │   ├── dangky.css
│   │   ├── caidat.css
│   │   ├── huongdan.css
│   │   ├── gioithieu.css
│   │   ├── hotro.css
│   │   ├── tailwind.input.css
│   │   └── tailwind.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── auth-pages.js
│   │   ├── login-required.js
│   │   ├── motion.js
│   │   ├── theme.js
│   │   ├── userinfo.js
│   │   ├── kiemtrangay.js
│   │   ├── tinhnang.js
│   │   ├── reviews.js
│   │   ├── caidat.js
│   │   ├── huongdan.js
│   │   └── hotro.js
│   └── images/
│       ├── ExpiryCheck.jpg
│       ├── bg.webp
│       ├── expirycheck-animated.gif
│       └── og-expirycheck.jpg
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
├── robots.txt
├── sitemap.xml
├── README.md
└── docs/
    ├── HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md
    └── BAO_CAO_THAY_DOI.md
```

HTML vẫn nằm ở thư mục gốc để giữ URL GitHub Pages ngắn và tránh làm gãy liên kết công khai. Tất cả đường dẫn `href`, `src` và `url(...)` đã được chuyển theo cấu trúc `assets/`. Hai tài liệu dài được gom vào `docs/`; `README.md` vẫn ở gốc để cung cấp lệnh chạy nhanh.

## 5. Thay đổi giao diện và UX/UI

### Header, logo và navigation

- Chuẩn hóa logo ExpiryCheck và cho logo liên kết về `index.html`.
- Chuẩn hóa các mục navigation chính trên các trang có header.
- Bổ sung mục **Hỗ Trợ** vào navigation.
- Đánh dấu trang hiện tại bằng class active và `aria-current="page"`.
- Tách **Đăng Nhập** và **Đăng Ký** thành hai nút/điểm bấm riêng; sửa khoảng cách để không còn dính liền.
- Giữ thanh điều hướng đọc được trên desktop, tablet và mobile.
- Thêm nhãn điều hướng bằng `aria-label`.

### Màu sắc, font và hình ảnh

- Đồng bộ bảng màu teal/trắng/xám và trạng thái xanh–vàng–đỏ theo hạn dùng.
- Chuẩn hóa typography, khoảng cách, card, nút, focus ring và shadow.
- Thống nhất Font Awesome 7.0.1, thêm SRI và `crossorigin`.
- Chuyển ảnh nền JPG sang WebP, từ 453.091 byte xuống khoảng 287.714 byte (giảm khoảng 36%).
- Thêm social preview 1200 × 630.
- Thêm `width`, `height`, `loading="lazy"` và `decoding="async"` ở ảnh phù hợp để giảm layout shift.

### Animation và khả năng tiếp cận chuyển động

- Thêm hiệu ứng tải trang, hover/focus, card, button, modal và chuyển trang.
- Thêm animation cho ảnh ở khu vực góp ý `hotro.html`.
- Tạo bộ hiệu ứng dùng chung gồm `assets/css/motion.css` và `assets/js/motion.js`, được nạp bằng file ngoài trên cả 10 HTML (9 trang nội dung và trang 404).
- Hiển thị thanh tiến độ cuộn ở cạnh trên; vùng sáng và vòng tròn đi theo chuột; ánh sáng `sheen` bám vị trí chuột trên card; hiệu ứng `ripple` kèm đúng 8 hạt màu khi nhấn; badge có nhịp thở nhẹ.
- Điều chỉnh màu glow, vòng tròn và sheen cho dark mode để vẫn đủ tương phản mà không chói.
- Giữ nguyên con trỏ hệ thống; tất cả lớp trang trí đặt `pointer-events: none` nên không che hoặc chặn nút/link/form.
- Các hiệu ứng phụ thuộc chuột và animation trang trí tự tắt khi `prefers-reduced-motion: reduce` hoặc thiết bị dùng coarse pointer/không hỗ trợ hover chính xác.
- Dùng event delegation cho hover/click và gom cập nhật vị trí/tiến độ bằng `requestAnimationFrame` để hạn chế listener lặp và giảm số lần cập nhật layout.
- Dùng `prefers-reduced-motion` để giảm/tắt chuyển động khi hệ điều hành yêu cầu.
- Không để animation che nội dung hoặc chặn thao tác.

### Theme và ngôn ngữ

- Hoàn thiện dark mode và lưu lựa chọn cục bộ.
- Hoàn thiện chuyển Việt/Anh cho nội dung dùng chung.
- Đồng bộ trạng thái theme/ngôn ngữ giữa các trang.
- Bổ sung chuỗi dịch cho mục navigation Hỗ Trợ.

## 6. HTML5, metadata, CSS ngoài và Tailwind

### HTML5 semantic

- Bổ sung/chuẩn hóa `header`, `nav`, `main`, `section`, `footer`, `form`, `fieldset`, `table`.
- Đổi tiêu đề chính của trang đăng nhập/đăng ký thành `<h1>` trong khi giữ nguyên giao diện bằng selector CSS tương ứng.
- Thêm `lang="vi"`, charset và viewport.
- Bổ sung label liên kết đúng `for`/`id`, mô tả lỗi, live region và ARIA cho modal/tab/FAQ.
- Thêm `type="button"` cho nút không submit.
- Dùng `hidden`, `inert` và `aria-hidden` đúng trạng thái ở modal/khu vực ẩn.
- Thêm skip link/focus handling ở các luồng phù hợp.

### Metadata

- Bổ sung title, `meta description`, `meta keywords`, `theme-color` và referrer policy theo nội dung trang.
- Bổ sung canonical và Open Graph/Twitter Card cho trang chủ.
- Thêm favicon nhất quán.
- Thêm `robots.txt`, `sitemap.xml` và `404.html`.

### CSS ngoài

- Chuyển stylesheet khỏi thư mục gốc vào `assets/css/`.
- Phần trình bày không dùng thẻ `<font>`.
- Không dùng `<style>` hoặc thuộc tính `style="..."` trong HTML mục tiêu.
- Các style dùng chung nằm ở `common.css`; style riêng được tách theo trang.

### Tailwind CSS

- Thêm Tailwind CSS 3.4.17 dưới dạng dependency phát triển cục bộ.
- Thêm `package.json`, `package-lock.json`, `tailwind.config.js`.
- Thêm `tailwind.input.css` và bản build minify `tailwind.css`.
- Tailwind quét `*.html` và `assets/js/**/*.js`.
- Dùng prefix `ec-` để tránh xung đột với CSS hiện có.
- Tắt Preflight để không thay đổi giao diện cũ ngoài ý muốn.
- Dùng utility Tailwind cho width, spacing, flex, bảng và breakpoint responsive.
- Người chấm chỉ cần file `tailwind.css`; không phải cài npm.

## 7. JavaScript và các chức năng động

### `assets/js/auth.js`

- Thay mật khẩu plaintext bằng PBKDF2-SHA-256.
- Dùng salt ngẫu nhiên 16 byte, hash 32 byte và 310.000 vòng.
- Tự chuyển tài khoản cũ từ plaintext sang hash sau lần đăng nhập đúng.
- Không trả credential từ `getCurrentUser()`.
- Chuẩn hóa username/email/họ tên và chặn trùng không phân biệt hoa thường.
- Thêm giới hạn độ dài, validation và đọc JSON an toàn.
- Bổ sung cập nhật hồ sơ, đổi mật khẩu và xóa tài khoản/dữ liệu liên quan.

### `assets/js/auth-pages.js`

- Tách xử lý form đăng nhập và đăng ký khỏi HTML.
- Quản lý trạng thái bận/loading, lỗi validation và redirect sau đăng nhập.
- Cho phép tham số `next` theo allowlist trang nội bộ để tránh open redirect.
- Giữ `next` khi chuyển giữa trang đăng nhập và đăng ký.

### `assets/js/login-required.js`

- Tách modal yêu cầu đăng nhập khỏi HTML trang chủ.
- Hỗ trợ đóng bằng overlay/Escape, focus trap và trả focus.
- Đồng bộ `inert`, `aria-hidden` và URL đăng nhập có tham số `next`.

### `assets/js/theme.js`

- Quản lý dark/light, Việt/Anh, notification và cài đặt nhanh.
- Thêm trạng thái active cho navigation theo trang hiện tại.
- Thêm chuyển trang nội bộ có tôn trọng reduced motion.
- Bỏ xử lý lặp ở từng HTML.
- Đọc/ghi cấu hình trong `try/catch` để không làm hỏng toàn trang khi storage bị chặn.

### `assets/js/motion.js`

- Khởi tạo cùng một hệ hiệu ứng cho toàn bộ 10 HTML: scroll progress, cursor glow/ring, card sheen và phản hồi click.
- Tạo `ripple` và 8 particle bằng DOM API, đánh dấu phần tử trang trí `aria-hidden="true"` rồi tự dọn sau animation.
- Dùng event delegation ở `document` cho bề mặt/card và phần tử có thể bấm; dùng `requestAnimationFrame` cho thanh cuộn và vòng tròn bám chuột.
- Chỉ bật hiệu ứng chuột khi có fine pointer, hover chính xác và người dùng không yêu cầu giảm chuyển động; không thay thế hay ẩn con trỏ hệ thống.

### `assets/js/kiemtrangay.js`

- Hoàn thiện kiểm tra hạn sử dụng thủ công và lưu sản phẩm.
- Kiểm tra ngày theo lịch thật, chặn 31/02, NSX trong tương lai hoặc NSX sau HSD.
- Không render dữ liệu động bằng `innerHTML`; dùng DOM API/`textContent` để giảm DOM XSS.
- Chuẩn hóa/giới hạn tên sản phẩm, mã vạch và dữ liệu ngoài.
- Lazy-load `html5-qrcode@2.3.8`, thêm SRI và timeout.
- Quản lý mở/dừng camera tuần tự, dừng khi đổi tab/rời trang và chặn kết quả lặp.
- Thêm timeout/xử lý lỗi cho Open Food Facts.

### `assets/js/tinhnang.js`

- Bảo vệ trang quản lý theo phiên đăng nhập.
- Đọc dữ liệu storage an toàn và bỏ bản ghi sai cấu trúc.
- Thêm/tìm/lọc/sửa/xóa sản phẩm bằng event listener/delegation.
- Không dùng inline handler hoặc đưa hàm thao tác ra `window`.
- Chuẩn hóa số lượng, ngày, tên, danh mục, barcode và giới hạn đầu vào.
- Render lại theo ngôn ngữ, hiển thị empty state và trạng thái HSD.

### `assets/js/hotro.js`

- Điều khiển tab/FAQ bằng chuột và bàn phím.
- Validation form họ tên, email, chủ đề, radio, textarea và checkbox.
- Hiển thị lỗi tại đúng trường qua live region.
- Lưu góp ý minh họa trong `localStorage`, không giả vờ gửi lên máy chủ.
- Xử lý reset, trạng thái thành công và lỗi storage.

### `assets/js/huongdan.js`

- Tách tương tác FAQ khỏi HTML.
- Hỗ trợ click, Enter và Space; đồng bộ `aria-expanded`/`aria-hidden`.

### Các file còn lại

- `reviews.js`: validation, escape nội dung, ownership khi sửa/xóa và lưu đánh giá an toàn.
- `caidat.js`: cập nhật hồ sơ, đổi mật khẩu, xóa tài khoản, validation và modal accessible.
- `userinfo.js`: thanh người dùng/modal hồ sơ dùng chung, tránh lặp logic.

## 8. Form, bảng, ảnh động và liên kết theo rubric

### Form nhiều thành phần

`hotro.html` có một form góp ý thật sự dùng được, gồm:

- input text họ tên;
- input email;
- select chủ đề;
- nhóm radio mức hài lòng;
- textarea nội dung chi tiết;
- checkbox đồng ý lưu cục bộ;
- nút submit và reset;
- validation JavaScript, thông báo lỗi và status live.

Các form đăng ký, đăng nhập, kiểm tra ngày, sản phẩm và cài đặt cũng được chuẩn hóa label/autocomplete/validation.

### Bảng

- `tinhnang.html`: bảng quản lý sản phẩm với `caption`, `scope="col"`, tìm kiếm, lọc và CRUD.
- `huongdan.html`: bảng trạng thái còn hạn/sắp hết hạn/đã hết hạn với `caption`, header cột/hàng và hướng dẫn hành động.
- Bảng được đặt trong vùng responsive để vẫn sử dụng được trên màn hình hẹp.

### Ảnh động và liên kết

- Thêm ảnh động thật `assets/images/expirycheck-animated.gif` gồm 28 khung hình, không chỉ dịch chuyển ảnh tĩnh bằng CSS.
- Dùng `<picture>` để tự chuyển sang `ExpiryCheck.jpg` tĩnh khi người dùng bật `prefers-reduced-motion: reduce`.
- Có liên kết nội bộ tới hướng dẫn và các trang navigation.
- Có liên kết email `mailto:kiet0853366410@gmail.com`.
- Có liên kết ngoài tới GitHub/Google Forms/Open Food Facts.
- Sửa liên kết “Mã nguồn GitHub” trỏ trực tiếp tới repository `ExpiryCheck`, không qua URL repository cũ.
- Link mở tab mới dùng `rel="noopener noreferrer"`.

## 9. Sửa lỗi và tăng an toàn

- Sửa cấu trúc form đăng ký/nút submit.
- Sửa hai nút đăng nhập và đăng ký bị dính thành một khối.
- Sửa utility Tailwind từng làm form đăng nhập/đăng ký giãn toàn chiều ngang trên desktop; giới hạn đúng 410/445 px và vẫn co vừa mobile.
- Sửa lỗi gõ nhầm `border: 2px solide` thành cú pháp hợp lệ `border: 2px solid` trong CSS trang kiểm tra.
- Sửa xung đột tên biến global giữa các script cổ điển.
- Bỏ inline event handler và logic lặp.
- Ngăn open redirect bằng allowlist `next`.
- Hạn chế DOM XSS trong checker và dữ liệu động.
- Thêm `try/catch` cho JSON/localStorage lỗi hoặc bị chặn.
- Không lưu sản phẩm khách dưới key dùng chung; yêu cầu đăng nhập đúng luồng.
- Thêm focus trap, Escape, trả focus, `inert` và ARIA cho modal.
- Trì hoãn focus của modal yêu cầu đăng nhập để tránh trình duyệt trả focus về link vừa bấm; kiểm tra Tab đã quấn đúng trong hộp thoại.
- Thêm `noopener noreferrer`, SRI và referrer policy cho tài nguyên/liên kết ngoài phù hợp.
- Nêu rõ hệ thống là ứng dụng localStorage, không tuyên bố có backend hoặc đồng bộ đám mây.

## 10. SEO và hiệu năng

- Thêm metadata có nội dung riêng, keywords phù hợp và title rõ ràng.
- Thêm Open Graph, Twitter Card và ảnh `og-expirycheck.jpg`.
- Thêm canonical trang chủ, `robots.txt`, `sitemap.xml`, `404.html`.
- Preload ảnh hero và preconnect Font Awesome.
- Tối ưu ảnh nền sang WebP.
- Lazy-load ảnh phụ và thư viện scanner.
- Pin phiên bản CDN, dùng SRI và timeout API.
- Giảm JavaScript lặp bằng các file dùng chung.

## 11. Danh sách file tạo mới

### Trang và tài liệu

- `caidat.html` — trang cài đặt tài khoản.
- `hotro.html` — trang hỗ trợ, FAQ, liên kết và form.
- `404.html` — trang không tìm thấy của GitHub Pages.
- `README.md` — giới thiệu/chạy nhanh và liên kết tài liệu.
- `docs/HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md` — hướng dẫn cài, chạy, demo, deploy và xử lý lỗi chi tiết.
- `docs/BAO_CAO_THAY_DOI.md` — báo cáo hiện tại.
- `robots.txt`, `sitemap.xml` — hỗ trợ crawler/SEO.

### Hạ tầng Tailwind/npm

- `.gitignore` — bỏ qua `node_modules`, log npm và file hệ điều hành.
- `package.json`, `package-lock.json` — khóa Tailwind 3.4.17 và lệnh build/watch.
- `tailwind.config.js` — content paths, prefix `ec-`, tắt Preflight, thêm breakpoint `xs`.
- `assets/css/tailwind.input.css` — nguồn utility.
- `assets/css/tailwind.css` — bản build trình duyệt dùng.

### CSS/JavaScript/ảnh mới hoặc tách mới

- `assets/css/common.css`, `assets/css/motion.css`, `assets/css/caidat.css`, `assets/css/hotro.css`.
- `assets/js/auth-pages.js`, `assets/js/login-required.js`, `assets/js/motion.js`, `assets/js/theme.js`, `assets/js/userinfo.js`, `assets/js/reviews.js`, `assets/js/caidat.js`, `assets/js/huongdan.js`, `assets/js/hotro.js`.
- `assets/images/bg.webp`, `assets/images/og-expirycheck.jpg`, `assets/images/expirycheck-animated.gif`.

Hai file `motion.css` và `motion.js` được tham chiếu trong cả 10 HTML. Đây là asset runtime cần giữ khi nộp bài, không phải file build tạm.

### Điều chỉnh hướng dẫn chạy và cấu trúc tài liệu

- Chuẩn hóa lệnh Python dùng `--bind 127.0.0.1` với đúng URL `http://127.0.0.1:8080/`, không còn hướng dẫn bind IPv4 nhưng lại ưu tiên mở `localhost`.
- Bổ sung lệnh `--directory "D:\Ai\ADKTeam (4)\ADKTeam"` để chạy đúng website ngay cả khi terminal đang đứng tại `D:\Ai`.
- Thay lệnh kiểm tra thư mục gây hiểu nhầm bằng `Test-Path` có `PathType`; giải thích cách đổi đường dẫn khi giải nén dự án trên máy khác.
- Bổ sung xử lý Python Launcher, Live Server, đổi cổng, origin `localStorage`, camera loopback/HTTPS, phụ thuộc Internet và kiểm tra Git remote trước khi deploy.
- Gom hướng dẫn và báo cáo dài vào `docs/`; giữ HTML/SEO/config ở gốc và asset runtime trong `assets/` để cấu trúc gọn nhưng không đổi URL website.

## 12. Danh sách file gốc đã sửa hoặc di chuyển

| File gốc | Trạng thái hiện tại | Thay đổi chính |
| --- | --- | --- |
| `index.html` | Sửa tại gốc | SEO/social, navigation, hero/card/link, semantic, modal, đánh giá, responsive, Tailwind. |
| `kiemtrahsd.html` | Sửa tại gốc | Metadata, form/ARIA, scanner, modal, asset paths, Tailwind. |
| `tinhnang.html` | Sửa tại gốc | Bảng semantic, filter/form/modal, asset paths, responsive/Tailwind. |
| `dangnhap.html` | Sửa tại gốc | Form accessible, validation, loading, redirect an toàn, tách JS. |
| `dangky.html` | Sửa tại gốc | Sửa submit, validation, loading, PBKDF2 flow, tách JS. |
| `huongdan.html` | Sửa tại gốc | Metadata, nav, nội dung, FAQ, bảng trạng thái, Tailwind, tách JS. |
| `gioithieu.html` | Sửa tại gốc | Metadata, semantic, nội dung, nav, responsive/Tailwind. |
| `auth.js` | Chuyển thành `assets/js/auth.js` và sửa | PBKDF2, migration, validation, hồ sơ/mật khẩu/xóa tài khoản. |
| `tinhnang.js` | Chuyển thành `assets/js/tinhnang.js` và sửa | CRUD/filter/search, validation, storage, modal, accessibility. |
| `style.css` | Chuyển thành `assets/css/style.css` và sửa | Trang chủ, responsive, animation, dark mode. |
| `login.css` | Chuyển thành `assets/css/login.css` và sửa | Form đăng nhập, responsive, focus/error/loading. |
| `dangky.css` | Chuyển thành `assets/css/dangky.css` và sửa | Form đăng ký, responsive, focus/error/loading. |
| `tinhnang.css` | Chuyển thành `assets/css/tinhnang.css` và sửa | Bảng/form/modal/filter responsive. |
| `huongdan.css` | Chuyển thành `assets/css/huongdan.css` và sửa | Nội dung/FAQ/bảng responsive. |
| `gioithieu.css` | Chuyển thành `assets/css/gioithieu.css` và sửa | Section/card/team/responsive. |
| `ExpiryCheck.jpg` | Chuyển thành `assets/images/ExpiryCheck.jpg` | Dùng làm logo/favicon/ảnh minh họa. |
| `bg.jpg` | Thay bằng `assets/images/bg.webp` | Giảm dung lượng và preload ở trang chủ. |

Ngoài ra, bộ đang dùng cho trang kiểm tra là `assets/css/kiemtrangay.css` và `assets/js/kiemtrangay.js`, được sửa sâu về validation, scanner, storage và an toàn render.

## 13. File đã xóa hoặc không đưa vào bản nộp

- Xóa các bản CSS/JS/ảnh cũ ở thư mục gốc sau khi chuyển vào `assets/`.
- Xóa `kthsd.css` và `kthsd.js` cũ vì không còn được tham chiếu; tránh tồn tại hai bộ checker.
- Xóa `bg.jpg` cũ sau khi thay bằng `bg.webp` tối ưu.
- Xóa `HUONG_DAN_CHAY.md` vì đã được thay đầy đủ bằng `HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md`.
- Loại `node_modules/` khỏi bản nộp/working tree cuối; đây là dependency sinh lại bằng `npm install`.
- Không xóa `package-lock.json`, `tailwind.config.js`, `tailwind.input.css` hoặc `tailwind.css` vì chúng cần cho tính tái lập và chạy website.
- Không tìm thấy asset runtime thừa nào khác sau khi đối chiếu các tham chiếu nội bộ; vì vậy không xóa các file còn lại chỉ để giảm số lượng.

## 14. Kết quả nghiệm thu bản cuối

Vòng nghiệm thu cuối được chạy trên bản đã build ngày 17/08/2026, trước khi xóa thư mục dependency sinh tự động `node_modules/`.

| Nhóm | Kết quả thực tế |
| --- | --- |
| Tailwind | **PASS** — `npm run build:css` hoàn thành; `tailwind.css` được tạo minify. `npm audit` báo 0 lỗ hổng. |
| JavaScript riêng lẻ | **PASS** — 12/12 file `assets/js/*.js` qua `node --check`. |
| Phạm vi script theo trang | **PASS** — ghép và parse toàn bộ script cổ điển của 10 HTML bằng `vm.Script`, không có khai báo global trùng. |
| HTML5 | **PASS** — 10/10 HTML qua `html-validate`; chỉ tắt các rule cấu hình về kiểu viết doctype, dấu `/` ở void element và ưu tiên phần tử native trong một số widget ARIA. |
| CSS runtime | **PASS** — 12 file CSS trình duyệt dùng hợp lệ; riêng `motion.css` đã qua `csstree-validator`. `tailwind.input.css` là nguồn có directive build nên được kiểm tra bằng chính lệnh Tailwind. |
| Không inline | **PASS** — 0 `<style>`, 0 `style=`, 0 `<font>`, 0 inline event handler và 0 `<script>` thiếu `src`. |
| Asset và liên kết local | **PASS** — 180 tham chiếu runtime trong HTML/CSS (gồm `src`, `href`, `srcset` và `url(...)`) đều tồn tại; không còn asset runtime mồ côi. |
| Ảnh động thật | **PASS** — GIF 256 × 256 px, 28 khung hình, lặp vô hạn; `src`/`srcset` đều hợp lệ và có ảnh tĩnh thay thế cho reduced-motion. |
| Hiệu ứng chuột/motion | **PASS** — 10/10 HTML tải `motion.css` và `motion.js`; full-motion tạo đúng cursor glow/ring, một sheen cho card, một ripple và 8 particle rồi tự dọn; reduced-motion ẩn toàn bộ lớp motion; console không có error/warning. |
| Song ngữ | **PASS** — 264 khóa VI/EN cân bằng; 201 khóa được HTML sử dụng đều resolve. |
| ID, label và ARIA | **PASS** — ID không trùng; toàn bộ `for`, `aria-controls`, `aria-labelledby`, `aria-describedby` trỏ tới phần tử tồn tại. |
| Hồi quy tài khoản | **PASS** — đăng ký, PBKDF2, không lưu plaintext, đăng nhập sai/đúng, cập nhật hồ sơ, đổi mật khẩu và xóa tài khoản đều đạt trong bộ test bộ nhớ. |
| HTTP local | **PASS** — 10 trang, route `/` và 4 asset đại diện đều trả HTTP 200, đúng content type. |
| Chrome desktop/tablet/mobile | **PASS** — không tràn ngang bất thường; nav dùng được; hai nút Đăng Nhập/Đăng Ký tách rõ; form auth đúng kích thước; bảng cuộn trong vùng riêng trên màn hình nhỏ. |
| Luồng chức năng trên Chrome | **PASS** — FAQ, form góp ý lỗi/thành công, đăng ký, đăng nhập sai/đúng, redirect `next`, tính HSD, thêm sản phẩm, thống kê, cài đặt, xóa tài khoản thử và bảo vệ trang Tính Năng đều đúng; console không có error/warning. |
| Modal/accessibility | **PASS** — `aria-hidden`/`inert`, focus ban đầu, focus trap và trả focus hoạt động đúng ở modal yêu cầu đăng nhập. |
| Cleanup | **PASS** — `node_modules/` đã xóa khỏi working tree; cài lại bằng `npm install`. |

Không cấp quyền camera trong vòng tự động để tránh tự ý bật thiết bị. Đã xác minh scanner chỉ lazy-load khi chọn tab Quét, URL được pin phiên bản và SRI đúng ở vòng kiểm tra trước. Firefox chưa được mở trực tiếp trong môi trường này; dự án dùng HTML/CSS/JS chuẩn và đã qua validator, nhưng nên chạy checklist Firefox thủ công trên máy trình bày.

Các lệnh tham khảo:

```powershell
npm run build:css
Get-ChildItem -LiteralPath ".\assets\js" -Filter "*.js" | ForEach-Object { node --check $_.FullName }
git diff --check
```

Checklist thao tác chi tiết nằm trong `docs/HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md`.

## 15. Giới hạn còn lại cần trình bày đúng

- ExpiryCheck vẫn là website tĩnh, không có backend/database.
- PBKDF2 tốt hơn plaintext nhưng localStorage không an toàn tương đương hệ thống xác thực máy chủ.
- Dữ liệu không đồng bộ giữa trình duyệt, thiết bị, host hoặc cổng khác nhau.
- Xóa dữ liệu website sẽ xóa hồ sơ và sản phẩm cục bộ.
- Notification chỉ kiểm tra khi website được mở; chưa có service worker chạy nền khi trang đóng.
- Scanner cần camera, quyền truy cập và loopback/HTTPS; icon, thư viện scan và tra barcode phụ thuộc Internet/CDN/Open Food Facts.
- Form hỗ trợ là form minh họa lưu cục bộ; nút/liên kết email hoặc Google Forms mới là kênh liên hệ ngoài.
- Không nên tuyên bố dự án tuyệt đối không còn lỗ hổng. Báo cáo chỉ xác nhận các lỗi đã biết trong phạm vi rà soát đã được xử lý.

## 16. Trạng thái triển khai

- Các thay đổi hiện nằm trong working tree local.
- Không tự tạo commit hoặc push thay cho chủ dự án.
- Remote hiện tại trỏ tới repository `ADK-`, trong khi URL GitHub Pages mục tiêu dùng `/ExpiryCheck/`; cần xác nhận đúng repository/branch trước khi push, không force-push hoặc đổi remote mù.
- Để website công khai nhận bản mới: chạy nghiệm thu, commit, push đúng branch GitHub Pages và chờ deploy.
- Hướng dẫn đầy đủ: [HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md](HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md).
