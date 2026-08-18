# ExpiryCheck

ExpiryCheck là website tĩnh hỗ trợ kiểm tra và quản lý hạn sử dụng sản phẩm. Đồ án có **9 trang nội dung chính** (đúng yêu cầu 8–10 trang), thêm trang `404.html`, giao diện responsive, Tailwind CSS cục bộ, JavaScript ngoài, form góp ý, bảng dữ liệu và các tương tác lưu bằng `localStorage`.

## Chạy nhanh trên máy hiện tại

Nếu terminal đang ở `D:\Ai` như ảnh trước, chạy trực tiếp:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory "D:\Ai\ADKTeam (4)\ADKTeam"
```

Sau đó mở [http://127.0.0.1:8080/](http://127.0.0.1:8080/). Giữ terminal mở; nhấn `Ctrl + C` khi muốn dừng server.

Nếu dự án nằm ở vị trí khác, thay đường dẫn sau `--directory` bằng thư mục chứa trực tiếp `index.html`. Nếu máy không nhận `python`, dùng lệnh đầy đủ sau hoặc dùng Live Server theo hướng dẫn chi tiết:

```powershell
py -3 -m http.server 8080 --bind 127.0.0.1 --directory "D:\Ai\ADKTeam (4)\ADKTeam"
```

Không mở website trực tiếp bằng địa chỉ `file:///...`, vì camera, đường dẫn và `localStorage` có thể hoạt động khác so với khi chạy qua HTTP.

## Cấu trúc chính

```text
ADKTeam/
├── index.html                         # Trang chủ
├── kiemtrahsd.html                    # Kiểm tra thủ công / quét mã vạch
├── tinhnang.html                      # Bảng quản lý sản phẩm
├── huongdan.html                      # Hướng dẫn và bảng trạng thái HSD
├── gioithieu.html                     # Giới thiệu đồ án
├── hotro.html                         # FAQ, liên kết và form góp ý
├── dangnhap.html                      # Đăng nhập hồ sơ cục bộ
├── dangky.html                        # Đăng ký hồ sơ cục bộ
├── caidat.html                        # Cài đặt tài khoản
├── 404.html                           # Trang lỗi GitHub Pages
├── assets/
│   ├── css/                           # CSS ngoài + Tailwind nguồn/bản build
│   ├── js/                            # Toàn bộ logic JavaScript ngoài
│   └── images/                        # Ảnh giao diện, favicon, social preview
├── package.json                       # Lệnh build Tailwind
├── tailwind.config.js                 # Cấu hình Tailwind prefix `ec-`
├── robots.txt
├── sitemap.xml
└── docs/
    ├── HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md
    └── BAO_CAO_THAY_DOI.md
```

## Phát triển Tailwind

Website đã lưu sẵn `assets/css/tailwind.css`, nên **người chỉ chạy hoặc chấm bài không cần cài Node.js**. Khi chỉnh các utility Tailwind trong HTML/JS, dùng Node.js 18+:

```powershell
npm install
npm run build:css
```

Hoặc theo dõi và build tự động trong lúc sửa:

```powershell
npm run watch:css
```

Không nộp hoặc commit thư mục `node_modules/`; có thể khôi phục nó bằng `npm install`.

## Tài liệu

- [Hướng dẫn cài đặt, chạy và demo đồ án](docs/HUONG_DAN_CAI_DAT_VA_CHAY_DO_AN.md)
- [Báo cáo đầy đủ các thay đổi so với bản gốc](docs/BAO_CAO_THAY_DOI.md)

## Lưu ý dữ liệu

ExpiryCheck không có backend. Hồ sơ, sản phẩm, đánh giá và góp ý được lưu trong `localStorage` của đúng trình duyệt và đúng origin đang dùng. Hướng dẫn này dùng thống nhất `127.0.0.1:8080`; nếu đổi sang `localhost` hoặc cổng khác, trình duyệt sẽ dùng vùng dữ liệu khác. Khi tra mã vạch, mã sản phẩm được gửi tới Open Food Facts theo yêu cầu của người dùng.

Phiên bản công khai: <https://trinhkiet1302.github.io/ExpiryCheck/>. Thay đổi local chỉ xuất hiện trên link này sau khi commit, push lên đúng nhánh GitHub Pages và chờ deploy hoàn tất.
