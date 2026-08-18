# Hướng dẫn cài đặt, chạy và trình bày đồ án ExpiryCheck

Tài liệu này dành cho người phát triển, người chấm bài và thành viên tiếp nhận dự án. Các bước bên dưới dùng Windows/PowerShell vì đó là môi trường hiện tại của đồ án.

## 0. Chạy ngay trên máy hiện tại

Trong ảnh trước, terminal đang đứng tại `D:\Ai`, trong khi `index.html` nằm sâu hơn tại `D:\Ai\ADKTeam (4)\ADKTeam`. Nếu server cũ còn chạy, nhấn `Ctrl + C`, sau đó chạy đúng một trong hai cách dưới đây.

**Cách nhanh nhất, chạy được ngay cả khi terminal vẫn đang ở `D:\Ai`:**

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory "D:\Ai\ADKTeam (4)\ADKTeam"
```

**Hoặc chuyển vào thư mục dự án trước:**

```powershell
Set-Location -LiteralPath "D:\Ai\ADKTeam (4)\ADKTeam"
python -m http.server 8080 --bind 127.0.0.1
```

Giữ terminal mở và truy cập đúng địa chỉ:

```text
http://127.0.0.1:8080/
```

Không dùng `http://localhost:8080/` trong phiên chạy này. Server được bind vào IPv4 `127.0.0.1`; trên một số máy, `localhost` có thể được phân giải thành IPv6 `::1` và không kết nối được.

Nếu đã chép dự án sang nơi khác, thay `D:\Ai\ADKTeam (4)\ADKTeam` bằng đường dẫn mới tới **thư mục chứa trực tiếp `index.html`**.

## 1. Yêu cầu tối thiểu

Để **chạy và chấm website**, chỉ cần:

- Chrome, Edge hoặc Firefox phiên bản tương đối mới;
- Python 3 để mở web server cục bộ, hoặc extension Live Server của VS Code;
- thư mục đồ án đầy đủ, trong đó có `index.html`, `assets/` và `assets/css/tailwind.css`.

Để **sửa utility Tailwind và build lại CSS**, cần thêm:

- Node.js 18 trở lên;
- npm đi kèm Node.js.

Node.js không bắt buộc khi chỉ mở website, vì file Tailwind đã build được lưu sẵn trong dự án.

## 2. Chạy nhanh bằng Python

### Bước 1: xác định đúng thư mục dự án

Trong VS Code, mở **File → Open Folder** và chọn thư mục chứa trực tiếp `index.html`. Với máy hiện tại, thư mục đó là:

```powershell
Set-Location -LiteralPath "D:\Ai\ADKTeam (4)\ADKTeam"
```

Nếu dự án đã được giải nén hoặc chép sang vị trí khác, hãy đổi đường dẫn trên cho phù hợp. Kiểm tra bằng:

```powershell
Get-Location
Test-Path -LiteralPath ".\index.html" -PathType Leaf
Test-Path -LiteralPath ".\assets" -PathType Container
```

Hai kết quả đều phải là `True`. Nếu một kết quả là `False`, chưa được chạy server; hãy mở lại đúng thư mục.

> Dự án đang nằm trong **hai lớp thư mục trùng tên gần nhau**: `ADKTeam (4)\ADKTeam`. Nếu chạy server từ `D:\Ai` hoặc `D:\Ai\ADKTeam (4)`, trang chủ sẽ không nằm ngay tại `/`.

### Bước 2: mở web server

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Nếu máy chỉ nhận Python Launcher:

```powershell
py -3 -m http.server 8080 --bind 127.0.0.1
```

Khi terminal hiện dòng tương tự `Serving HTTP on 127.0.0.1 port 8080`, server đã chạy. Terminal chưa trả lại dấu nhắc lệnh là bình thường; giữ cửa sổ đó mở.

### Bước 3: mở đúng URL

Truy cập chính xác:

```text
http://127.0.0.1:8080/
```

Giữ nguyên host và cổng này trong suốt buổi demo để đăng ký, đăng nhập và dữ liệu `localStorage` dùng cùng một origin.

### Bước 4: dừng server

Quay về terminal đang chạy server và nhấn:

```text
Ctrl + C
```

## 3. Chạy bằng Live Server trong VS Code

1. Mở mục **Extensions** trong VS Code.
2. Cài extension **Live Server** của Ritwick Dey.
3. Dùng **File → Open Folder** để mở đúng thư mục chứa trực tiếp `index.html` (trên máy hiện tại là `D:\Ai\ADKTeam (4)\ADKTeam`).
4. Nhấp phải `index.html` và chọn **Open with Live Server**.
5. Dùng đúng URL mà extension tự mở/cung cấp; URL đó có thể dùng `127.0.0.1` hoặc `localhost`. Không tự đổi host hoặc cổng giữa buổi demo.
6. Khi thử camera, mở URL trong tab Chrome/Edge/Firefox thông thường, không dùng preview nhúng bên trong VS Code.

Không chạy đồng thời Python server và Live Server nếu không cần, vì hai server dùng hai origin khác nhau và sẽ có hai vùng `localStorage` riêng.

## 4. Không mở bằng `file:///...`

Không nhấp đúp `index.html` để mở trực tiếp. Cách đó tạo URL dạng:

```text
file:///C:/duong-dan-den-du-an/index.html
```

Khi dùng `file://`, quyền camera, chính sách bảo mật, tải tài nguyên và dữ liệu trình duyệt có thể khác với website thật. Luôn chạy qua HTTP local như hướng dẫn ở trên.

## 5. Cài và build Tailwind khi phát triển

### Kiểm tra Node.js và npm

```powershell
node --version
npm --version
```

### Cài dependency

Chỉ chạy tại thư mục có `package.json`. Trước hết dùng `Set-Location` để vào thư mục dự án của máy hiện tại, hoặc thay bằng đường dẫn nơi bạn đã giải nén dự án:

```powershell
Set-Location -LiteralPath "D:\Ai\ADKTeam (4)\ADKTeam"
npm install
```

Lệnh này tạo `node_modules/`. Thư mục đó chỉ là dependency có thể sinh lại, đã được khai báo trong `.gitignore` và không cần nộp bài.

### Build CSS một lần

```powershell
npm run build:css
```

Nguồn vào và đầu ra:

```text
assets/css/tailwind.input.css  →  assets/css/tailwind.css
```

### Theo dõi thay đổi trong lúc viết code

Mở một terminal riêng và chạy:

```powershell
npm run watch:css
```

Giữ terminal này chạy trong lúc chỉnh class Tailwind. Dùng terminal thứ hai để chạy Python server.

### Vì sao Tailwind có prefix `ec-`?

`tailwind.config.js` đặt prefix `ec-` và tắt Preflight. Nhờ đó utility Tailwind như `ec-w-full`, `ec-p-3` hỗ trợ responsive/layout mà không ghi đè hàng loạt CSS giao diện sẵn có.

## 6. Cấu trúc và trách nhiệm từng nhóm file

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

Quy ước tổ chức:

- HTML nằm ở thư mục gốc để URL GitHub Pages ngắn và ổn định.
- CSS trình bày nằm trong `assets/css/`; không dùng `<style>`, thuộc tính `style="..."` hoặc thẻ `<font>`.
- JavaScript nằm trong `assets/js/`; logic xác thực và logic theo từng trang được tách riêng.
- `motion.css` và `motion.js` là bộ hiệu ứng dùng chung được nạp trên cả 10 HTML; cần giữ cả hai khi chạy hoặc đóng gói bài.
- Ảnh nằm trong `assets/images/`; không để asset ứng dụng lẫn với HTML.
- Tài liệu dài nằm trong `docs/`; chỉ giữ `README.md` ở gốc để người nhận dự án thấy hướng dẫn chạy nhanh ngay.
- `tailwind.input.css` là nguồn build; `tailwind.css` là file trình duyệt dùng trực tiếp.
- `package-lock.json` cần giữ để dependency có phiên bản nhất quán; `node_modules/` không cần giữ.

## 7. Luồng demo đề xuất khi chấm điểm

Nên mở DevTools (`F12`) và quan sát tab **Console** trong lúc demo. Luồng dưới đây đi qua đủ nội dung, form, bảng, JavaScript, animation và responsive.

### 7.1. Trang chủ và giao diện chung

1. Mở `http://127.0.0.1:8080/`.
2. Giới thiệu logo ExpiryCheck, banner, màu teal và thanh điều hướng thống nhất.
3. Đi qua các mục **Trang Chủ**, **Kiểm Tra Ngay**, **Tính Năng**, **Hướng Dẫn**, **Giới Thiệu**, **Hỗ Trợ**.
4. Mở menu cài đặt nhanh để đổi sáng/tối và Việt/Anh.
5. Quan sát animation khi tải trang, hover và chuyển trang.
6. Thu nhỏ cửa sổ để chứng minh thanh điều hướng và nội dung tự thích ứng.

### 7.2. Demo và kiểm thử hiệu ứng chuột

Thực hiện phần này trên máy có chuột hoặc touchpad và chưa bật chế độ giảm chuyển động:

1. Cuộn trang để quan sát thanh tiến độ ở cạnh trên thay đổi theo vị trí cuộn.
2. Di chuyển chuột trong trang: vùng glow và vòng ring đi theo, nhưng con trỏ hệ thống vẫn luôn hiển thị và vẫn là điểm bấm chính.
3. Đưa chuột lên card/khung nội dung để thấy lớp sheen đổi vị trí theo chuột; đưa lên nút hoặc link để thấy vòng ring đổi trạng thái.
4. Nhấn chuột trái vào một nút hoặc link nội bộ phù hợp để thấy ripple và cụm 8 particle. Chọn phần tử không làm mất dữ liệu; có thể dùng nút mở menu cài đặt.
5. Quan sát badge ở trang **Kiểm Tra Ngay** hoặc **Cài Đặt** có hiệu ứng thở nhẹ.
6. Chuyển sang dark mode và lặp lại bước 2–4 để kiểm tra glow, ring và sheen vẫn dễ nhìn.
7. Bật **Reduce motion** của hệ điều hành hoặc giả lập `prefers-reduced-motion: reduce` trong DevTools, tải lại trang rồi xác nhận hiệu ứng chuột/particle/badge đã tắt. Trên màn hình cảm ứng/coarse pointer, các hiệu ứng phụ thuộc chuột cũng tự tắt.
8. Mở Console trong lúc thử; nếu có lỗi thì ghi lại và sửa trước khi đánh dấu checklist, không kết luận đạt chỉ dựa trên việc nhìn thấy animation.

Bộ hiệu ứng dùng event delegation và `requestAnimationFrame`; các lớp trang trí có `pointer-events: none`, không che form, không chặn thao tác và không ẩn con trỏ hệ thống.

### 7.3. Đăng ký và đăng nhập

1. Nhấn **Đăng Ký**; chỉ rõ đây là nút riêng, không dính với **Đăng Nhập**.
2. Thử gửi form thiếu dữ liệu hoặc mật khẩu xác nhận sai để trình bày validation JavaScript.
3. Tạo một hồ sơ demo bằng email không quan trọng và mật khẩu chỉ dùng cho buổi chấm.
4. Đăng xuất rồi đăng nhập lại.
5. Giải thích hồ sơ được băm bằng PBKDF2 và lưu cục bộ, không phải tài khoản máy chủ.

### 7.4. Kiểm tra hạn sử dụng

1. Mở **Kiểm Tra Ngay**.
2. Chọn tab **Nhập Thủ Công**.
3. Nhập tên sản phẩm, ngày sản xuất và hạn sử dụng; thử một ngày sai để thấy validation.
4. Nhập dữ liệu hợp lệ và xem kết quả trạng thái.
5. Lưu sản phẩm vào hồ sơ đang đăng nhập.
6. Chuyển sang **Quét Mã Vạch** để giới thiệu luồng camera/Open Food Facts; không bắt buộc quét thật nếu thiết bị chấm không có camera.

### 7.5. Bảng quản lý sản phẩm

1. Mở **Tính Năng** sau khi đăng nhập.
2. Trình bày bảng có `caption`, tiêu đề cột, trạng thái và thao tác.
3. Thử tìm kiếm, lọc theo danh mục/trạng thái, thêm, sửa và xóa một sản phẩm demo.
4. Cho thấy empty state nếu không còn bản ghi.

### 7.6. Form, liên kết và ảnh động

1. Mở **Hỗ Trợ**.
2. Mở/đóng FAQ bằng chuột, sau đó thử bằng Enter hoặc Space.
3. Chỉ ra `assets/images/expirycheck-animated.gif` là GIF chuyển động thật; khi người dùng bật `prefers-reduced-motion`, thẻ `<picture>` tự dùng ảnh JPG tĩnh thay thế.
4. Trình bày form gồm: họ tên, email, chủ đề, radio mức hài lòng, checkbox đồng ý và textarea nội dung.
5. Gửi form rỗng để thấy lỗi; sau đó điền dữ liệu hợp lệ và gửi.
6. Chỉ ra liên kết nội bộ **Hướng dẫn sử dụng**, liên kết email `mailto:` và liên kết ngoài GitHub mở tab mới an toàn.

### 7.7. Nội dung hướng dẫn và cài đặt

1. Mở **Hướng Dẫn**, giới thiệu bảng trạng thái hạn dùng công khai.
2. Mở các câu hỏi thường gặp để trình bày tương tác JavaScript.
3. Mở **Cài Đặt** từ hồ sơ, thử cập nhật tên hoặc đổi mật khẩu với validation.
4. Không xóa tài khoản demo cho tới khi hoàn tất toàn bộ phần trình bày.

### 7.8. Responsive và trình duyệt

Kiểm tra ít nhất ba kích thước:

- desktop: khoảng 1366 × 768;
- tablet: khoảng 768 × 1024;
- mobile: khoảng 390 × 844.

Thực hiện một lượt trên Chrome/Edge và một lượt trên Firefox. Xác nhận không có cuộn ngang bất thường, chữ không tràn, nút vẫn bấm được, form và bảng vẫn đọc được.

## 8. Dữ liệu `localStorage`

Website không có backend/database. Những dữ liệu sau được lưu trên trình duyệt:

- hồ sơ đăng ký và phiên đăng nhập;
- danh sách sản phẩm theo hồ sơ;
- đánh giá/góp ý;
- theme, ngôn ngữ và tùy chọn thông báo.

Cần nhớ:

- origin được khuyến nghị cho hướng dẫn này là `http://127.0.0.1:8080`;
- `http://127.0.0.1:8080` và `http://127.0.0.1:8081` là hai origin khác nhau;
- `http://127.0.0.1:8080` và `http://localhost:8080` cũng là hai origin khác nhau;
- website GitHub Pages là một origin khác hoàn toàn, nên dữ liệu local không tự xuất hiện trên bản online;
- profile trình duyệt khác hoặc chế độ ẩn danh cũng có vùng lưu trữ riêng;
- chế độ ẩn danh có vùng dữ liệu tạm riêng;
- xóa Site Data/Local Storage sẽ xóa hồ sơ và sản phẩm đã lưu;
- dữ liệu không tự đồng bộ sang máy hoặc trình duyệt khác;
- không dùng lại mật khẩu quan trọng cho tài khoản demo.

Để xem dữ liệu trong Chrome/Edge: mở `F12` → **Application** → **Local storage** → chọn origin hiện tại.

## 9. Camera, Internet và HTTPS

Tính năng quét mã vạch cần:

- thiết bị có camera;
- người dùng cấp quyền camera;
- trình duyệt hỗ trợ `getUserMedia`;
- một loopback origin như `http://127.0.0.1`/`http://localhost` khi chạy local, hoặc HTTPS khi triển khai trên Internet;
- kết nối Internet để tải icon Font Awesome, thư viện quét `html5-qrcode` và tra cứu Open Food Facts.

Không dùng một địa chỉ HTTP dạng IP LAN như `http://192.168.x.x` để demo camera; trình duyệt có thể không xem đó là secure context. Nếu camera hoặc Internet không dùng được, vẫn có thể chấm luồng chính bằng tab **Nhập Thủ Công** và dữ liệu `localStorage`. Việc tra cứu tên sản phẩm phụ thuộc dữ liệu Open Food Facts nên không phải mã vạch nào cũng có kết quả.

## 10. Triển khai GitHub Pages

Website công khai dự kiến tại:

```text
https://trinhkiet1302.github.io/ExpiryCheck/
```

Quy trình cập nhật:

1. Chạy `git remote -v` và `git branch --show-current` để xác nhận repository/branch trước khi commit.
2. URL công khai `/ExpiryCheck/` chỉ được cập nhật từ repository mà GitHub Pages của dự án ExpiryCheck đang cấu hình. Trong working copy hiện tại, remote `origin` đang trỏ tới repository `ADK-`; vì vậy **không push ngay** nếu `git remote -v` vẫn hiển thị `ADK-.git`.
3. Xác nhận với thành viên quản lý repository cách đưa thay đổi vào đúng repo `ExpiryCheck`. Không dùng force-push và không tự đổi remote khi hai repository có lịch sử khác nhau.
4. Chạy các bước kiểm tra ở mục 12 và xác nhận không đưa `node_modules/` vào commit.
5. Commit mã nguồn, tài liệu và file Tailwind đã build trong đúng working copy.
6. Push lên đúng repository và đúng branch đang được GitHub Pages sử dụng.
7. Vào **Settings → Pages** trên GitHub để kiểm tra nguồn deploy.
8. Chờ GitHub Pages build xong, sau đó mở link công khai và nhấn `Ctrl + F5`.

Không nhầm phiên bản local với phiên bản online: sửa file trong máy không tự cập nhật website GitHub Pages nếu chưa push/deploy.

## 11. Xử lý lỗi server local thường gặp

### Terminal báo server đang chạy nhưng mở `/` không thấy ExpiryCheck

Nguyên nhân phổ biến nhất là server đang phục vụ nhầm thư mục. Ảnh trước đó cho thấy terminal chạy tại `D:\Ai`, không phải thư mục chứa `index.html`.

Dừng server cũ bằng `Ctrl + C`. Từ bất kỳ thư mục nào, chạy lệnh sau để chỉ định trực tiếp thư mục website:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory "D:\Ai\ADKTeam (4)\ADKTeam"
```

Mở `http://127.0.0.1:8080/`. Nếu dự án đã được di chuyển, thay đường dẫn sau `--directory` bằng vị trí mới.

### Chỉ thấy danh sách thư mục

Server không tìm thấy `index.html` trong thư mục gốc đang phục vụ. Với vị trí hiện tại, kiểm tra:

```powershell
Test-Path -LiteralPath "D:\Ai\ADKTeam (4)\ADKTeam\index.html" -PathType Leaf
Test-Path -LiteralPath "D:\Ai\ADKTeam (4)\ADKTeam\assets" -PathType Container
```

Cả hai kết quả phải là `True`. Nếu đã chép dự án đi nơi khác, dùng đường dẫn mới.

### `python is not recognized`

Thử:

```powershell
py --version
py -3 -m http.server 8080 --bind 127.0.0.1 --directory "D:\Ai\ADKTeam (4)\ADKTeam"
```

Nếu cả `python` và `py` đều không có, cài Python từ trang chính thức và bật tùy chọn thêm Python vào `PATH`, hoặc dùng Live Server.

### Cổng 8080 đang được sử dụng

Dừng terminal server cũ bằng `Ctrl + C`, hoặc dùng cổng khác:

```powershell
python -m http.server 8081 --bind 127.0.0.1 --directory "D:\Ai\ADKTeam (4)\ADKTeam"
```

Sau đó mở `http://127.0.0.1:8081/`. Lưu ý dữ liệu cũ ở cổng 8080 sẽ không xuất hiện vì origin đã đổi.

### CSS, JavaScript hoặc ảnh không tải

- Đảm bảo URL là HTTP, không phải `file://`.
- Đảm bảo thư mục đang phục vụ có cả `index.html` và `assets/`.
- Mở DevTools → **Network**, tải lại và tìm request màu đỏ/404.
- Nhấn `Ctrl + F5` để bỏ cache.
- Nếu vừa đổi class Tailwind, chạy lại `npm run build:css`.

### `npm` hoặc `tailwindcss` không chạy

```powershell
node --version
npm --version
npm install
npm run build:css
```

Nếu `node` không tồn tại, cài Node.js LTS. Không cần xử lý lỗi này nếu chỉ chạy bản CSS đã build.

### Đăng ký ở một URL nhưng đăng nhập ở URL khác không thấy tài khoản

Quay lại đúng host và cổng đã dùng khi đăng ký. Hướng dẫn này dùng thống nhất `http://127.0.0.1:8080`; không đổi sang `localhost` hoặc cổng khác giữa chừng.

### Camera không mở

- Cho phép quyền camera trong biểu tượng ổ khóa/cài đặt trang.
- Nếu đã chặn trước đó, mở Site settings, đặt lại quyền camera rồi tải lại trang.
- Đóng ứng dụng khác đang dùng camera.
- Dùng địa chỉ loopback trong hướng dẫn (`http://127.0.0.1:8080`) hoặc website HTTPS.
- Mở website trong tab trình duyệt thông thường, không dùng preview nhúng của editor.
- Thử Chrome/Edge mới; kiểm tra Console nếu vẫn lỗi.
- Dùng tab nhập thủ công khi máy chấm không có camera.

### Code đã sửa nhưng giao diện chưa đổi

1. Nếu sửa utility Tailwind, chạy `npm run build:css`.
2. Nhấn `Ctrl + F5`.
3. Trong DevTools → **Network**, bật **Disable cache** và tải lại.
4. Xác nhận trình duyệt đang mở đúng cổng và đúng thư mục dự án.

## 12. Bảng kiểm thử trước khi nộp

Chỉ đánh dấu mục nào sau khi đã trực tiếp kiểm tra trên bản cuối:

- [ ] `npm run build:css` hoàn thành không lỗi và tạo `assets/css/tailwind.css`.
- [ ] Tất cả file JavaScript ngoài vượt qua kiểm tra cú pháp.
- [ ] 10 file HTML (9 trang nội dung + 404) không có lỗi markup nghiêm trọng.
- [ ] Không còn `<style>`, `style="..."`, `<font>` hoặc handler `onclick="..."` trong HTML.
- [ ] Tất cả `href`, `src` và `url(...)` nội bộ đều trỏ tới file tồn tại.
- [ ] Trang chủ, menu, logo, nút đăng nhập/đăng ký và các liên kết hoạt động.
- [ ] Đăng ký, đăng nhập, đăng xuất và validation form hoạt động.
- [ ] Kiểm tra ngày thủ công hoạt động với cả dữ liệu sai và hợp lệ.
- [ ] Bảng sản phẩm có thể thêm, tìm, lọc, sửa và xóa.
- [ ] Form hỗ trợ có input, email, select, radio, checkbox, textarea và báo lỗi đúng.
- [ ] Liên kết nội bộ, `mailto:` và liên kết ngoài đúng loại.
- [ ] Không có lỗi JavaScript trong Console ở các luồng chính.
- [ ] Không có request 404 trong Network cho asset nội bộ.
- [ ] Desktop, tablet và mobile không tràn ngang hoặc che nút.
- [ ] Kiểm tra thủ công trên Chrome/Edge và Firefox.
- [ ] Ảnh động/animation vẫn rõ ràng và tôn trọng `prefers-reduced-motion`.
- [ ] `motion.css` và `motion.js` tải thành công trên cả 10 HTML, không phát sinh request 404.
- [ ] Thanh scroll progress, cursor glow/ring, card sheen, ripple + 8 particle và badge breathe hoạt động khi dùng chuột/fine pointer.
- [ ] Dark mode hiển thị hiệu ứng đủ rõ; con trỏ hệ thống không bị ẩn; lớp trang trí không chặn click hoặc nhập liệu.
- [ ] Khi bật reduced motion hoặc dùng coarse pointer, các hiệu ứng chuột/particle/badge tự tắt như thiết kế.

Các lệnh hỗ trợ dành cho người phát triển:

```powershell
npm run build:css
Get-ChildItem -LiteralPath ".\assets\js" -Filter "*.js" | ForEach-Object { node --check $_.FullName }
git diff --check
```

## 13. Chuẩn bị thư mục nộp bài hoặc file ZIP

Giữ lại:

- toàn bộ HTML;
- `assets/css/`, gồm cả `tailwind.input.css` và `tailwind.css`;
- `assets/js/`;
- `assets/images/`;
- `package.json`, `package-lock.json`, `tailwind.config.js`;
- `robots.txt`, `sitemap.xml`;
- `README.md` và toàn bộ thư mục `docs/` chứa hướng dẫn/báo cáo.

Không đưa vào file nộp:

- `node_modules/`;
- file log npm;
- file tạm của hệ điều hành như `.DS_Store`, `Thumbs.db`;
- bản sao asset cũ ở thư mục gốc;
- thư mục cache hoặc file build tạm không được HTML tham chiếu.

Sau khi giải nén file nộp ở một thư mục khác, nên chạy lại bằng Python server để chắc chắn dự án không vô tình phụ thuộc đường dẫn tuyệt đối trên máy ban đầu.

## 14. Checklist trình bày theo phiếu chấm

- **Cấu trúc và nội dung:** chứng minh 9 trang chính, chủ đề nhất quán và trang chủ rõ ràng.
- **Giao diện & UX/UI:** cho thấy logo/banner/navigation đồng bộ, màu sắc dễ đọc, responsive và animation.
- **HTML5 & CSS:** chỉ ra semantic HTML, metadata, Tailwind responsive và CSS ngoài.
- **JavaScript:** demo xác thực, validation, FAQ, theme/ngôn ngữ, quản lý sản phẩm và hiệu ứng.
- **Thành phần chức năng:** demo form nhiều loại trường, bảng dữ liệu, ảnh động, email, link nội bộ/ngoài.
- **Trình duyệt:** mở Console/Network sạch và kiểm tra desktop/tablet/mobile trên Chrome/Firefox.

Chi tiết đầy đủ các thay đổi so với bản gốc nằm trong [BAO_CAO_THAY_DOI.md](BAO_CAO_THAY_DOI.md).
