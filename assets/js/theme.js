/* ==========================================================================
   theme.js — Cài đặt chung cho toàn site: chế độ sáng/tối, ngôn ngữ, thông báo
   Lưu trong localStorage nên áp dụng nhất quán trên mọi trang.

   CÁCH DÙNG CHO NGÔN NGỮ:
   - Gắn data-i18n="key" vào phần tử để dịch textContent theo từ điển I18N.
   - Gắn data-i18n-html="key" nếu nội dung có chứa thẻ HTML lồng bên trong
     (ví dụ <b>, <i>) — sẽ thay bằng innerHTML.
   - Gắn data-i18n-placeholder="key" cho input/textarea để dịch placeholder.
   - Thêm key tương ứng vào cả hai khối "vi" và "en" bên dưới.
   ========================================================================== */

const THEME_KEY = "expirycheck_theme"; // "light" | "dark"
const LANG_KEY = "expirycheck_lang"; // "vi" | "en"
const NOTI_KEY = "expirycheck_notifications"; // "on" | "off"
const NOTI_LAST_KEY = "expirycheck_notification_last";

const I18N = {
  vi: {
    features_action_edit: "Sửa",
    features_action_delete: "Xóa",
    default_user_label: "Người dùng",
    home: "Trang Chủ",
    check: "Kiểm Tra Ngay",
    features: "Tính Năng",
    guide: "Hướng Dẫn",
    about: "Giới Thiệu",
    logout: "Đăng xuất",
    greeting: "Xin chào",
    quickSettings: "Cài đặt nhanh",
    darkMode: "Chế độ tối",
    language: "Ngôn ngữ",
    notifications: "Thông báo",
    notification_title: "ExpiryCheck nhắc hạn dùng",
    notification_summary:
      "{expired} sản phẩm đã hết hạn và {soon} sản phẩm sẽ hết hạn trong 7 ngày tới.",
    accountSettings: "Cài đặt tài khoản",
    helpCenter: "Trung tâm hỗ trợ",
    nav_login: "Đăng Nhập",
    nav_register: "Đăng Ký",
    nav_support: "Hỗ Trợ",
    footer_text: "2026 ExpiryCheck - Website Kiểm Tra Hạn Sử Dụng Của Sản Phẩm",

    /* ---------- Modal thông tin người dùng (dùng chung nhiều trang) ---------- */
    user_modal_title: "Thông tin người dùng",
    user_modal_fullname: "Họ và tên",
    user_modal_username: "Tên đăng nhập",
    user_modal_email: "Email",
    user_modal_role: "Vai trò",
    user_modal_joindate: "Ngày tham gia",
    user_modal_count: "Số sản phẩm đang quản lý",
    user_modal_close: "Đóng",

    /* ---------- Modal yêu cầu đăng nhập (dùng chung nhiều trang) ---------- */
    login_required_title: "Vui lòng đăng nhập",
    login_required_desc: "Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ.",
    login_required_btn: "Đăng nhập",
    login_required_home: "Về trang chủ",

    /* ---------- Trang chủ (index.html) ---------- */
    home_hero_title: "Kiểm Tra Hạn Sử Dụng Nhanh Chóng & An Toàn",
    home_hero_desc:
      "ExpiryCheck giúp bạn quản lý, kiểm tra hạn sử dụng của sản phẩm một cách dễ dàng",
    home_features_title: "Tính Năng Nổi Bật",
    home_feature1_title: "Kiểm tra sản phẩm",
    home_feature1_desc: "Kiểm tra hạn sử dụng nhanh chóng và chính xác",
    home_feature2_title: "Nhắc Nhở Hạn Dùng",
    home_feature2_desc:
      "Nhận nhắc nhở khi mở website và sản phẩm sắp hết hạn",
    home_feature3_title: "Quản Lý Sản Phẩm",
    home_feature3_desc: "Lưu trữ và theo dõi danh sách sản phẩm",
    home_reviews_title: "Đánh Giá Từ Người Dùng",
    home_reviews_subtitle:
      "Chia sẻ trải nghiệm của bạn để ExpiryCheck ngày càng hữu ích hơn.",

    /* ---------- Đánh giá (reviews.js) ---------- */
    review_no_reviews: "Chưa có đánh giá nào",
    review_be_first: "Hãy là người đầu tiên chia sẻ trải nghiệm của bạn",
    review_be_first_empty: "Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!",
    review_based_on: "Dựa trên {count} đánh giá",
    review_five_star_pct: "{pct}% người dùng đánh giá 5 sao",
    review_satisfied_pct: "{pct}% hài lòng với ExpiryCheck (từ 4 sao trở lên)",
    review_share_title: "Chia sẻ trải nghiệm của bạn",
    review_edit_title: "Sửa đánh giá của bạn",
    review_placeholder: "Bạn thấy ExpiryCheck thế nào?",
    review_submit: "Gửi đánh giá",
    review_save_changes: "Lưu thay đổi",
    review_cancel: "Huỷ",
    review_edit_btn: "Sửa",
    review_delete_btn: "Xoá",
    review_confirm_delete: "Bạn có chắc muốn xoá đánh giá này không?",
    review_error_rating: "Vui lòng chọn số sao đánh giá.",
    review_error_comment: "Vui lòng nhập nhận xét của bạn.",
    review_thanks: "Cảm ơn bạn đã đánh giá!",
    review_login_prompt_html:
      'Vui lòng <a href="dangnhap.html">đăng nhập</a> để gửi đánh giá của bạn.',

    /* ---------- Kiểm tra ngay (kiemtrahsd.html) ---------- */
    check_badge: "Hệ thống nhận diện thời gian thực",
    check_hero_title: "Kiểm Tra Hạn Sử Dụng",
    check_card_title: "KIỂM TRA HẠN SỬ DỤNG SẢN PHẨM",
    check_tab_scan: "Quét Mã Vạch",
    check_tab_manual: "Nhập Thủ Công",
    check_scan_hint_html:
      'Đưa mã vạch của sản phẩm vào trước khung quét camera để nhận diện tự động.',
    check_label_name: "Tên sản phẩm",
    check_placeholder_name: "Ví dụ: Sữa tươi Vinamilk, Kem chống nắng...",
    check_label_nsx: "Ngày sản xuất (NSX)",
    check_label_hsd: "Ngày hết hạn (HSD)",
    check_btn_start: "BẮT ĐẦU KIỂM TRA",
    check_btn_save: "LƯU SẢN PHẨM",
    check_alert_camera_error:
      "Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera.",
    check_scan_searching: "Đang tìm kiếm sản phẩm...",
    check_scan_found: "Đã tìm thấy sản phẩm",
    check_scan_barcode_label: "Mã vạch:",
    check_scan_source_label: "Nguồn dữ liệu:",
    check_scan_btn_continue_hsd: "Tiếp tục nhập hạn sử dụng",
    check_scan_btn_rescan: "Quét lại",
    check_scan_not_found: "Không tìm thấy sản phẩm",
    check_scan_manual_hint: "Bạn có thể nhập thông tin sản phẩm thủ công.",
    check_scan_btn_manual: "Nhập thủ công",
    check_scan_btn_rescan2: "Quét lại",
    check_default_product_name: "Sản phẩm",
    check_alert_need_hsd: "Vui lòng nhập hạn sử dụng (HSD).",
    check_alert_nsx_after_hsd:
      "Ngày sản xuất không được sau ngày hết hạn.",
    check_result_expired_html:
      "<b>{name}</b> đã hết hạn được <b>{days}</b> ngày.",
    check_result_warning_html:
      "<b>{name}</b> sắp hết hạn, còn <b>{days}</b> ngày nữa.",
    check_result_safe_html:
      "<b>{name}</b> vẫn còn hạn sử dụng, còn <b>{days}</b> ngày nữa mới hết hạn.",
    check_alert_need_name_hsd:
      "Vui lòng nhập tên sản phẩm và hạn sử dụng.",
    check_alert_saved: "Đã lưu sản phẩm thành công!",
    check_scan_source_local: "Dữ liệu đã lưu",

    /* ---------- Tính năng (tinhnang.html) ---------- */
    features_hero_title: "Quản Lý Sản Phẩm & Hạn Sử Dụng",
    features_hero_desc:
      "Thêm, sửa, xóa sản phẩm; lọc theo trạng thái hạn dùng và tra cứu nhanh theo tên — tất cả tại một nơi.",
    features_search_placeholder: "Tìm theo tên sản phẩm...",
    features_filter_all_cat: "Tất cả danh mục",
    features_add_btn: "Thêm sản phẩm",
    features_chip_all: "Tất cả",
    features_chip_ok: "Còn hạn",
    features_chip_warn: "Gần hết hạn",
    features_chip_bad: "Hết hạn",
    features_th_name: "Sản phẩm",
    features_th_category: "Danh mục",
    features_th_qty: "Số lượng",
    features_th_expiry: "Ngày hết hạn",
    features_th_status: "Trạng thái",
    features_th_action: "Hành động",
    features_empty: "Không tìm thấy sản phẩm phù hợp.",
    features_empty_noproduct:
      'Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để bắt đầu quản lý.',
    features_stat_total: "Tổng sản phẩm",
    features_stat_ok: "Còn hạn",
    features_stat_warn: "Gần hết hạn (≤{days} ngày)",
    features_stat_bad: "Đã hết hạn",
    features_modal_add_title: "Thêm sản phẩm",
    features_modal_edit_title: "Sửa sản phẩm",
    features_toast_invalid: "Vui lòng điền đầy đủ và hợp lệ thông tin",
    features_toast_updated: "Đã cập nhật sản phẩm",
    features_toast_added: "Đã thêm sản phẩm mới",
    features_toast_deleted: "Đã xóa sản phẩm",
    features_confirm_delete: 'Xóa sản phẩm "{name}"?',
    features_field_name: "Tên sản phẩm",
    features_field_name_ph: "Ví dụ: Sữa tươi Vinamilk",
    features_field_category: "Danh mục",
    features_field_category_ph: "Ví dụ: Sữa & Chế phẩm",
    features_field_qty: "Số lượng",
    features_field_expiry: "Ngày hết hạn",
    features_btn_cancel: "Hủy",
    features_btn_save: "Lưu sản phẩm",

    /* ---------- Hướng dẫn (huongdan.html) ---------- */
    guide_hero_title: "Hướng dẫn sử dụng ExpiryCheck",
    guide_hero_desc:
      "Chỉ với vài bước đơn giản để kiểm tra và quản lý hạn sử dụng sản phẩm.",
    guide_section_title: "Hướng dẫn sử dụng",
    guide_step1_title: "Bước 1. Đăng nhập tài khoản",
    guide_step1_desc_html:
      "Chọn nút <b>Đăng nhập / Đăng ký</b> ở góc trên bên phải. Nếu chưa có tài khoản hãy đăng ký để sử dụng đầy đủ các chức năng.",
    guide_step2_title: "Bước 2. Thêm sản phẩm",
    guide_step2_desc:
      "Nhập tên sản phẩm, ngày sản xuất, hạn sử dụng hoặc quét mã QR/Barcode để thêm sản phẩm vào hệ thống.",
    guide_step3_title: "Bước 3. Kiểm tra hạn sử dụng",
    guide_step3_desc_html:
      "Nhấn nút <b>Kiểm Tra Ngay</b>. Hệ thống sẽ tính số ngày còn lại và hiển thị trạng thái sản phẩm.",
    guide_step4_title: "Bước 4. Quản lý danh sách sản phẩm",
    guide_step4_desc:
      "Bạn có thể tìm kiếm, lọc theo còn hạn hoặc hết hạn, chỉnh sửa và xóa sản phẩm bất cứ lúc nào.",
    guide_step5_title: "Bước 5. Theo dõi sản phẩm",
    guide_step5_desc:
      "Kiểm tra thường xuyên để biết sản phẩm còn hạn hay sắp hết hạn nhằm sử dụng an toàn hơn.",
    guide_functions_title: "Các chức năng chính",
    guide_func1_title: "Kiểm tra hạn sử dụng",
    guide_func1_desc: "Kiểm tra nhanh trạng thái còn hạn hoặc hết hạn của sản phẩm.",
    guide_func2_title: "Quét QR / Barcode",
    guide_func2_desc: "Quét mã sản phẩm bằng camera để nhập dữ liệu nhanh hơn.",
    guide_func3_title: "Lưu danh sách sản phẩm",
    guide_func3_desc: "Quản lý toàn bộ sản phẩm đã thêm trong cùng một nơi.",
    guide_faq_title: "Câu hỏi thường gặp",
    guide_faq1_q: "Không quét được QR thì phải làm sao?",
    guide_faq1_a: "Bạn có thể nhập thông tin sản phẩm thủ công để kiểm tra.",
    guide_faq2_q: "Website có lưu thông tin cá nhân không?",
    guide_faq2_a:
      "Website có lưu thông tin cá nhân, nhưng chỉ trên trình duyệt của chính người dùng (Ví dụ: tên đăng nhập, email, mật khẩu nếu bạn đăng nhập trực tiếp,...)",
    guide_faq3_q: "Website có miễn phí không?",
    guide_faq3_a: "Có. Bạn có thể sử dụng miễn phí.",
    guide_cta_btn: "Kiểm tra ngay",

    /* ---------- Giới thiệu (gioithieu.html) ---------- */
    about_banner_title: "Giới thiệu về ExpiryCheck",
    about_banner_desc: "Đồng hành cùng bạn trong việc bảo vệ sức khỏe bạn mỗi ngày.",
    about_goals_title: "Mục tiêu của website",
    about_goal1: "Hỗ trợ người dùng kiểm tra và theo dõi hạn sử dụng của sản phẩm.",
    about_goal2: "Giảm nguy cơ sử dụng thực phẩm, mỹ phẩm hoặc thuốc hết hạn.",
    about_goal3: "Cung cấp giao diện trực quan, dễ sử dụng trên nhiều thiết bị.",
    about_goal4: "Giúp người dùng quản lý sản phẩm hiệu quả, tiết kiệm thời gian.",
    about_goal5:
      "Nâng cao ý thức bảo vệ sức khỏe thông qua việc sử dụng sản phẩm còn trong thời gian an toàn",
    about_feedback_title: "Góp ý cho ADK Team",
    about_feedback_desc:
      "Chúng tôi rất mong nhận được sự góp của bạn để cải thiện website. Vui lòng nhấn vào nút bên dưới để đóng góp ý kiến",
    about_feedback_btn: "Đi đến biểu mẫu",
    about_back_btn: "Quay về Trang chủ",

    /* ---------- Hỗ trợ (hotro.html) ---------- */
    support_hero_title: "Trung Tâm Hỗ Trợ",
    support_hero_desc:
      "Giải đáp thắc mắc, hướng dẫn liên hệ và quy định sử dụng dịch vụ của ExpiryCheck.",
    support_tab_support: "Trung Tâm Hỗ Trợ",
    support_tab_terms: "Quy Định Sử Dụng",
    support_card1_title: "Hướng dẫn sử dụng",
    support_card1_desc: "Xem hướng dẫn từng bước để bắt đầu với ExpiryCheck.",
    support_card1_link: "Xem hướng dẫn →",
    support_card2_title: "Gửi góp ý",
    support_card2_desc: "Đóng góp ý kiến để chúng tôi cải thiện sản phẩm mỗi ngày.",
    support_card2_link: "Điền biểu mẫu →",
    support_card3_title: "Cài đặt tài khoản",
    support_card3_desc: "Cập nhật thông tin cá nhân, đổi mật khẩu hoặc xóa tài khoản.",
    support_card3_link: "Đi tới cài đặt →",
    support_faq1_q: "Làm sao để thêm sản phẩm vào danh sách theo dõi?",
    support_faq1_a_html:
      "Vào mục <b>Kiểm Tra Ngay</b>, nhập hoặc quét mã sản phẩm, sau đó nhấn <b>Lưu sản phẩm</b>. Sản phẩm sẽ xuất hiện trong mục <b>Tính Năng</b>.",
    support_faq2_q: "Không quét được mã vạch thì phải làm sao?",
    support_faq2_a_html:
      "Bạn có thể chuyển sang tab <b>Nhập Thủ Công</b> để nhập tên sản phẩm, ngày sản xuất và hạn sử dụng trực tiếp.",
    support_faq3_q: "ExpiryCheck có lưu dữ liệu của tôi trên máy chủ không?",
    support_faq3_a:
      "Hồ sơ và danh sách sản phẩm được lưu cục bộ trên trình duyệt. Khi bạn quét mã vạch, mã sản phẩm được gửi đến Open Food Facts để tra cứu tên.",
    support_faq4_q: "Tôi quên mật khẩu thì làm thế nào?",
    support_faq4_a:
      "Vì tài khoản chỉ được lưu trên thiết bị này, ExpiryCheck không thể khôi phục mật khẩu. Bạn có thể xóa dữ liệu trang trong cài đặt trình duyệt để tạo hồ sơ cục bộ mới.",
    support_faq5_q: "Làm sao để đổi chế độ sáng/tối hoặc ngôn ngữ?",
    support_faq5_a_html:
      'Nhấn vào biểu tượng bánh răng <i class="fa-solid fa-gear"></i> cạnh nút <b>Đăng xuất</b> ở góc trên bên phải để mở menu <b>Cài đặt nhanh</b>.',
    support_contact_title: "Vẫn cần trợ giúp?",
    support_contact_desc: "Đội ngũ ADK Team luôn sẵn sàng lắng nghe bạn.",
    support_contact_btn: "Liên hệ ngay",
    terms_updated: "Cập nhật lần cuối: 08/2026",
    terms_s1_title: "1. Giới thiệu chung",
    terms_s1_body:
      "Khi truy cập và sử dụng ExpiryCheck, bạn đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.",
    terms_s2_title: "2. Hồ sơ cục bộ",
    terms_s2_i1: "Không sử dụng lại mật khẩu quan trọng cho hồ sơ ExpiryCheck.",
    terms_s2_i2: "Hồ sơ chỉ tồn tại trên thiết bị và trình duyệt bạn đang dùng.",
    terms_s2_i3: "Không nhập thông tin nhạy cảm không cần thiết.",
    terms_s3_title: "3. Dữ liệu và quyền riêng tư",
    terms_s3_body:
      "Hồ sơ và danh sách sản phẩm được lưu cục bộ trên trình duyệt. Mã vạch được gửi đến Open Food Facts khi bạn yêu cầu tra cứu. Xóa dữ liệu trình duyệt hoặc hồ sơ sẽ làm mất dữ liệu và không thể khôi phục.",
    terms_s4_title: "4. Giới hạn trách nhiệm",
    terms_s4_body:
      "ExpiryCheck hỗ trợ tính toán và nhắc nhở hạn sử dụng dựa trên thông tin do người dùng nhập hoặc tra cứu tự động. Chúng tôi không chịu trách nhiệm cho các thiệt hại phát sinh từ việc sử dụng sản phẩm đã hết hạn nếu thông tin nhập vào không chính xác.",
    terms_s5_title: "5. Hành vi bị cấm",
    terms_s5_i1: "Sử dụng website vào mục đích trái pháp luật.",
    terms_s5_i2: "Can thiệp, phá hoại hoặc gây ảnh hưởng đến hoạt động của hệ thống.",
    terms_s5_i3: "Sao chép, phân phối lại nội dung của ExpiryCheck khi chưa được cho phép.",
    terms_s6_title: "6. Thay đổi điều khoản",
    terms_s6_body:
      "ADK Team có thể cập nhật quy định sử dụng theo thời gian. Phiên bản mới nhất sẽ luôn được hiển thị tại trang này.",

    /* ---------- Cài đặt tài khoản (caidat.html) ---------- */
    settings_badge: "Quản lý tài khoản",
    settings_hero_title: "Cài Đặt",
    settings_hero_desc: "Cập nhật thông tin cá nhân, đổi mật khẩu và quản lý tài khoản của bạn.",
    settings_profile_stat: "Sản phẩm đang quản lý",
    settings_panel1_title: "Thông tin cá nhân",
    settings_panel1_desc: "Cập nhật họ tên và email của bạn",
    settings_username: "Tên đăng nhập",
    settings_username_note: "Tên đăng nhập không thể thay đổi.",
    settings_fullname: "Họ và tên",
    settings_fullname_ph: "Họ và tên",
    settings_email: "Email",
    settings_email_ph: "Email",
    settings_save_profile: "Lưu thay đổi",
    settings_panel2_title: "Đổi mật khẩu",
    settings_panel2_desc:
      "Nên dùng mật khẩu trên 6 ký tự và không dùng lại mật khẩu cũ",
    settings_old_password: "Mật khẩu hiện tại",
    settings_old_password_ph: "Mật khẩu hiện tại",
    settings_new_password: "Mật khẩu mới",
    settings_new_password_ph: "Mật khẩu mới",
    settings_confirm_password: "Xác nhận mật khẩu mới",
    settings_confirm_password_ph: "Nhập lại mật khẩu mới",
    settings_change_password_btn: "Đổi mật khẩu",
    settings_danger_title: "Xóa tài khoản",
    settings_danger_desc: "Toàn bộ dữ liệu và sản phẩm đã lưu sẽ bị xóa vĩnh viễn",
    settings_danger_body:
      "Hành động này không thể hoàn tác. Tất cả sản phẩm bạn đã lưu trong ExpiryCheck sẽ bị xóa cùng với tài khoản.",
    settings_danger_btn: "Xóa tài khoản của tôi",
    settings_delete_modal_title: "Xác nhận xóa tài khoản",
    settings_delete_modal_body_html:
      "Nhập mật khẩu để xác nhận xóa vĩnh viễn tài khoản",
    settings_delete_modal_suffix: "và toàn bộ sản phẩm đã lưu.",
    settings_delete_password_label: "Mật khẩu",
    settings_delete_password_ph: "Nhập mật khẩu",
    settings_delete_cancel: "Hủy",
    settings_delete_confirm: "Xóa vĩnh viễn",

    /* ---------- Đăng nhập / Đăng ký ---------- */
    login_title: "Đăng Nhập",
    auth_local_note:
      "Hồ sơ và dữ liệu chỉ được lưu trên trình duyệt của thiết bị này.",
    login_username_ph: "Tên đăng nhập",
    login_password_ph: "Mật khẩu",
    login_submit_btn: "Đăng Nhập",
    login_no_account: "Chưa có tài khoản?",
    login_register_link: "Đăng ký",
    register_title: "Đăng Ký Tài Khoản",
    register_fullname_ph: "Họ và tên",
    register_username_ph: "Tên đăng nhập",
    register_email_ph: "Email",
    register_password_ph: "Mật khẩu",
    register_confirm_password_ph: "Nhập lại mật khẩu",
    register_submit_btn: "Đăng ký",
    register_has_account: "Đã có tài khoản",
    register_login_link: "Đăng nhập",
  },
  en: {
    /* ---------- Common / navigation ---------- */
    features_action_edit: "Edit",
    features_action_delete: "Delete",
    default_user_label: "User",
    home: "Home",
    check: "Check Now",
    features: "Features",
    guide: "Guide",
    about: "About",
    logout: "Log out",
    greeting: "Hello",
    quickSettings: "Quick settings",
    darkMode: "Dark mode",
    language: "Language",
    notifications: "Notifications",
    notification_title: "ExpiryCheck reminder",
    notification_summary:
      "{expired} product(s) expired and {soon} product(s) expire within the next 7 days.",
    accountSettings: "Account settings",
    helpCenter: "Help center",
    nav_login: "Log In",
    nav_register: "Sign Up",
    nav_support: "Support",
    footer_text: "2026 ExpiryCheck - Product Expiry Date Checking Website",

    /* ---------- User info modal (shared) ---------- */
    user_modal_title: "User Information",
    user_modal_fullname: "Full name",
    user_modal_username: "Username",
    user_modal_email: "Email",
    user_modal_role: "Role",
    user_modal_joindate: "Join date",
    user_modal_count: "Products managed",
    user_modal_close: "Close",

    /* ---------- Login required modal (shared) ---------- */
    login_required_title: "Please log in",
    login_required_desc: "Please log in to continue using the service.",
    login_required_btn: "Log in",
    login_required_home: "Back to home",

    /* ---------- Home page (index.html) ---------- */
    home_hero_title: "Quick & Safe Expiry Date Checking",
    home_hero_desc:
      "ExpiryCheck helps you easily manage and check product expiry dates",
    home_features_title: "Key Features",
    home_feature1_title: "Check Product",
    home_feature1_desc: "Check expiry dates quickly and accurately",
    home_feature2_title: "Expiry Reminders",
    home_feature2_desc:
      "Get reminders when you open the site and products are nearing expiry",
    home_feature3_title: "Product Management",
    home_feature3_desc: "Store and track your product list",
    home_reviews_title: "User Reviews",
    home_reviews_subtitle:
      "Share your experience to help make ExpiryCheck more useful.",

    /* ---------- Reviews (reviews.js) ---------- */
    review_no_reviews: "No reviews yet",
    review_be_first: "Be the first to share your experience",
    review_be_first_empty: "Be the first to share your experience!",
    review_based_on: "Based on {count} reviews",
    review_five_star_pct: "{pct}% of users rated 5 stars",
    review_satisfied_pct: "{pct}% satisfied with ExpiryCheck (4 stars and up)",
    review_share_title: "Share your experience",
    review_edit_title: "Edit your review",
    review_placeholder: "What do you think of ExpiryCheck?",
    review_submit: "Submit review",
    review_save_changes: "Save changes",
    review_cancel: "Cancel",
    review_edit_btn: "Edit",
    review_delete_btn: "Delete",
    review_confirm_delete: "Are you sure you want to delete this review?",
    review_error_rating: "Please select a star rating.",
    review_error_comment: "Please enter your comment.",
    review_thanks: "Thank you for your review!",
    review_login_prompt_html:
      'Please <a href="dangnhap.html">log in</a> to submit your review.',

    /* ---------- Check Now (kiemtrahsd.html) ---------- */
    check_badge: "Real-time recognition system",
    check_hero_title: "Check Expiry Date",
    check_card_title: "CHECK PRODUCT EXPIRY DATE",
    check_tab_scan: "Scan Barcode",
    check_tab_manual: "Manual Entry",
    check_scan_hint_html:
      "Place the product barcode in front of the camera scanner frame for automatic recognition.",
    check_label_name: "Product name",
    check_placeholder_name: "E.g.: Vinamilk fresh milk, sunscreen...",
    check_label_nsx: "Manufacture date",
    check_label_hsd: "Expiry date",
    check_btn_start: "START CHECKING",
    check_btn_save: "SAVE PRODUCT",
    check_alert_camera_error:
      "Unable to access the camera. Please check camera permissions.",
    check_scan_searching: "Searching for product...",
    check_scan_found: "Product found",
    check_scan_barcode_label: "Barcode:",
    check_scan_source_label: "Source:",
    check_scan_btn_continue_hsd: "Continue to expiry date",
    check_scan_btn_rescan: "Scan again",
    check_scan_not_found: "Product not found",
    check_scan_manual_hint: "You can enter the product information manually.",
    check_scan_btn_manual: "Enter manually",
    check_scan_btn_rescan2: "Scan again",
    check_default_product_name: "Product",
    check_alert_need_hsd: "Please enter the expiry date.",
    check_alert_nsx_after_hsd:
      "Manufacture date cannot be after the expiry date.",
    check_result_expired_html:
      "<b>{name}</b> expired <b>{days}</b> day(s) ago.",
    check_result_warning_html:
      "<b>{name}</b> is expiring soon, in <b>{days}</b> day(s).",
    check_result_safe_html:
      "<b>{name}</b> is still valid, with <b>{days}</b> day(s) remaining.",
    check_alert_need_name_hsd:
      "Please enter the product name and expiry date.",
    check_alert_saved: "Product saved successfully!",
    check_scan_source_local: "Saved data",

    /* ---------- Features (tinhnang.html) ---------- */
    features_hero_title: "Manage Products & Expiry Dates",
    features_hero_desc:
      "Add, edit, delete products; filter by expiry status and search by name — all in one place.",
    features_search_placeholder: "Search by product name...",
    features_filter_all_cat: "All categories",
    features_add_btn: "Add product",
    features_chip_all: "All",
    features_chip_ok: "Valid",
    features_chip_warn: "Expiring soon",
    features_chip_bad: "Expired",
    features_th_name: "Product",
    features_th_category: "Category",
    features_th_qty: "Quantity",
    features_th_expiry: "Expiry date",
    features_th_status: "Status",
    features_th_action: "Action",
    features_empty: "No matching products found.",
    features_empty_noproduct:
      'No products yet. Click "Add product" to get started.',
    features_stat_total: "Total products",
    features_stat_ok: "Valid",
    features_stat_warn: "Expiring soon (≤{days} days)",
    features_stat_bad: "Expired",
    features_modal_add_title: "Add product",
    features_modal_edit_title: "Edit product",
    features_toast_invalid: "Please fill in all fields with valid information",
    features_toast_updated: "Product updated",
    features_toast_added: "New product added",
    features_toast_deleted: "Product deleted",
    features_confirm_delete: 'Delete product "{name}"?',
    features_field_name: "Product name",
    features_field_name_ph: "E.g.: Vinamilk fresh milk",
    features_field_category: "Category",
    features_field_category_ph: "E.g.: Dairy & Products",
    features_field_qty: "Quantity",
    features_field_expiry: "Expiry date",
    features_btn_cancel: "Cancel",
    features_btn_save: "Save product",

    /* ---------- Guide (huongdan.html) ---------- */
    guide_hero_title: "How to Use ExpiryCheck",
    guide_hero_desc: "Just a few simple steps to check and manage product expiry dates.",
    guide_section_title: "User guide",
    guide_step1_title: "Step 1. Log into your account",
    guide_step1_desc_html:
      "Select <b>Log In / Sign Up</b> in the top right corner. If you don't have an account yet, sign up to unlock all features.",
    guide_step2_title: "Step 2. Add a product",
    guide_step2_desc:
      "Enter the product name, manufacture date, expiry date, or scan a QR/Barcode to add the product to the system.",
    guide_step3_title: "Step 3. Check the expiry date",
    guide_step3_desc_html:
      "Press <b>Check Now</b>. The system will calculate the remaining days and show the product's status.",
    guide_step4_title: "Step 4. Manage your product list",
    guide_step4_desc:
      "You can search, filter by valid or expired, edit, and delete products at any time.",
    guide_step5_title: "Step 5. Track your products",
    guide_step5_desc:
      "Check regularly to know which products are valid or about to expire for safer use.",
    guide_functions_title: "Main features",
    guide_func1_title: "Check expiry date",
    guide_func1_desc: "Quickly check whether a product is valid or expired.",
    guide_func2_title: "Scan QR / Barcode",
    guide_func2_desc: "Scan a product code with your camera for faster data entry.",
    guide_func3_title: "Save product list",
    guide_func3_desc: "Manage all added products in one place.",
    guide_faq_title: "Frequently asked questions",
    guide_faq1_q: "What if I can't scan the QR code?",
    guide_faq1_a: "You can enter the product information manually to check it.",
    guide_faq2_q: "Does the website store personal information?",
    guide_faq2_a:
      "Yes, but only in your own browser (e.g. username, email, password if you sign in directly, etc.)",
    guide_faq3_q: "Is the website free?",
    guide_faq3_a: "Yes. You can use it for free.",
    guide_cta_btn: "Check now",

    /* ---------- About (gioithieu.html) ---------- */
    about_banner_title: "About ExpiryCheck",
    about_banner_desc: "Accompanying you in protecting your health every day.",
    about_goals_title: "Website goals",
    about_goal1: "Help users check and track product expiry dates.",
    about_goal2: "Reduce the risk of using expired food, cosmetics, or medicine.",
    about_goal3: "Provide an intuitive interface, easy to use on many devices.",
    about_goal4: "Help users manage products efficiently, saving time.",
    about_goal5:
      "Raise health-protection awareness by using products that are still within a safe period",
    about_feedback_title: "Feedback for the ADK Team",
    about_feedback_desc:
      "We'd love to hear your feedback to improve the website. Please click the button below to share your thoughts",
    about_feedback_btn: "Go to form",
    about_back_btn: "Back to Home",

    /* ---------- Support (hotro.html) ---------- */
    support_hero_title: "Help Center",
    support_hero_desc:
      "Answers to your questions, contact guidance, and ExpiryCheck's terms of service.",
    support_tab_support: "Help Center",
    support_tab_terms: "Terms of Service",
    support_card1_title: "User guide",
    support_card1_desc: "See the step-by-step guide to get started with ExpiryCheck.",
    support_card1_link: "View guide →",
    support_card2_title: "Send feedback",
    support_card2_desc: "Share your feedback to help us improve every day.",
    support_card2_link: "Fill out form →",
    support_card3_title: "Account settings",
    support_card3_desc: "Update your personal info, change your password, or delete your account.",
    support_card3_link: "Go to settings →",
    support_faq1_q: "How do I add a product to my watch list?",
    support_faq1_a_html:
      "Go to <b>Check Now</b>, enter or scan the product code, then press <b>Save product</b>. The product will appear under <b>Features</b>.",
    support_faq2_q: "What if I can't scan the barcode?",
    support_faq2_a_html:
      "You can switch to the <b>Manual Entry</b> tab to enter the product name, manufacture date, and expiry date directly.",
    support_faq3_q: "Does ExpiryCheck store my data on a server?",
    support_faq3_a:
      "Profiles and product lists stay in your browser. When you scan a barcode, the product code is sent to Open Food Facts to look up its name.",
    support_faq4_q: "What if I forget my password?",
    support_faq4_a:
      "Because accounts only exist on this device, ExpiryCheck cannot recover passwords. Clear this site's data in your browser settings to create a new local profile.",
    support_faq5_q: "How do I switch dark mode or language?",
    support_faq5_a_html:
      'Click the gear icon <i class="fa-solid fa-gear"></i> next to the <b>Log out</b> button in the top right corner to open the <b>Quick settings</b> menu.',
    support_contact_title: "Still need help?",
    support_contact_desc: "The ADK Team is always ready to listen.",
    support_contact_btn: "Contact us",
    terms_updated: "Last updated: 08/2026",
    terms_s1_title: "1. General Introduction",
    terms_s1_body:
      "By accessing and using ExpiryCheck, you agree to comply with the terms below. Please read them carefully before using the service.",
    terms_s2_title: "2. Local Profiles",
    terms_s2_i1: "Do not reuse an important password for your ExpiryCheck profile.",
    terms_s2_i2: "Your profile only exists in this browser on this device.",
    terms_s2_i3: "Do not enter unnecessary sensitive information.",
    terms_s3_title: "3. Data and Privacy",
    terms_s3_body:
      "Profiles and product lists stay in your browser. Barcodes are sent to Open Food Facts when you request a lookup. Clearing browser data or deleting the profile permanently removes saved data.",
    terms_s4_title: "4. Limitation of Liability",
    terms_s4_body:
      "ExpiryCheck supports expiry calculations and reminders based on information entered by the user or looked up automatically. We are not liable for damages arising from using expired products if the entered information is inaccurate.",
    terms_s5_title: "5. Prohibited Conduct",
    terms_s5_i1: "Using the website for unlawful purposes.",
    terms_s5_i2: "Interfering with, sabotaging, or disrupting the system's operation.",
    terms_s5_i3: "Copying or redistributing ExpiryCheck's content without permission.",
    terms_s6_title: "6. Changes to the Terms",
    terms_s6_body:
      "The ADK Team may update the terms of service over time. The latest version will always be shown on this page.",

    /* ---------- Account settings (caidat.html) ---------- */
    settings_badge: "Account management",
    settings_hero_title: "Settings",
    settings_hero_desc: "Update your personal info, change password, and manage your account.",
    settings_profile_stat: "Products managed",
    settings_panel1_title: "Personal information",
    settings_panel1_desc: "Update your full name and email",
    settings_username: "Username",
    settings_username_note: "Username cannot be changed.",
    settings_fullname: "Full name",
    settings_fullname_ph: "Full name",
    settings_email: "Email",
    settings_email_ph: "Email",
    settings_save_profile: "Save changes",
    settings_panel2_title: "Change password",
    settings_panel2_desc:
      "Use a password with more than 6 characters and avoid reusing an old password",
    settings_old_password: "Current password",
    settings_old_password_ph: "Current password",
    settings_new_password: "New password",
    settings_new_password_ph: "New password",
    settings_confirm_password: "Confirm new password",
    settings_confirm_password_ph: "Re-enter new password",
    settings_change_password_btn: "Change password",
    settings_danger_title: "Delete account",
    settings_danger_desc: "All your saved data and products will be permanently deleted",
    settings_danger_body:
      "This action cannot be undone. All products you've saved in ExpiryCheck will be deleted along with your account.",
    settings_danger_btn: "Delete my account",
    settings_delete_modal_title: "Confirm account deletion",
    settings_delete_modal_body_html:
      "Enter your password to confirm permanently deleting the account",
    settings_delete_modal_suffix: "and all saved products.",
    settings_delete_password_label: "Password",
    settings_delete_password_ph: "Enter password",
    settings_delete_cancel: "Cancel",
    settings_delete_confirm: "Delete permanently",

    /* ---------- Log in / Sign up ---------- */
    login_title: "Log In",
    auth_local_note:
      "Your profile and data are stored only in this browser on this device.",
    login_username_ph: "Username",
    login_password_ph: "Password",
    login_submit_btn: "Log In",
    login_no_account: "Don't have an account?",
    login_register_link: "Sign up",
    register_title: "Create an Account",
    register_fullname_ph: "Full name",
    register_username_ph: "Username",
    register_email_ph: "Email",
    register_password_ph: "Password",
    register_confirm_password_ph: "Re-enter password",
    register_submit_btn: "Sign up",
    register_has_account: "Already have an account",
    register_login_link: "Log in",
  },
};

const NAV_KEY_BY_HREF = {
  "index.html": "home",
  "kiemtrahsd.html": "check",
  "tinhnang.html": "features",
  "huongdan.html": "guide",
  "gioithieu.html": "about",
  "hotro.html": "nav_support",
};

function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}
function getLang() {
  try {
    return localStorage.getItem(LANG_KEY) === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}
function getNotifications() {
  try {
    return localStorage.getItem(NOTI_KEY) === "on" ? "on" : "off";
  } catch {
    return "off";
  }
}

/**
 * Dịch theo key, hỗ trợ thay thế tham số dạng {name}.
 * VD: t("review_based_on", { count: 12 }) -> "Dựa trên 12 đánh giá"
 */
function t(key, params) {
  const dict = I18N[getLang()] || I18N.vi;
  let str = dict[key];
  if (str === undefined) str = key;
  if (params) {
    Object.keys(params).forEach((k) => {
      str = str.replace(new RegExp("{" + k + "}", "g"), params[k]);
    });
  }
  return str;
}

// Áp dụng chế độ sáng/tối lên <body>
function applyTheme() {
  const isDark = getTheme() === "dark";
  document.body.classList.toggle("dark-mode", isDark);
}

// Dịch toàn bộ nội dung trang: nav dùng chung, và mọi phần tử có data-i18n*
function applyLanguage() {
  document.documentElement.setAttribute("lang", getLang());

  // Menu điều hướng (theo href, không cần gắn tay data-i18n)
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    const key = NAV_KEY_BY_HREF[href];
    if (key) a.textContent = t(key);
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.textContent = t("logout");

  const greeting = document.getElementById("headerGreeting");
  if (greeting) {
    const name = greeting.getAttribute("data-name");
    if (name) greeting.textContent = t("greeting") + ", " + name;
  }

  // Bất kỳ phần tử nào có data-i18n -> dịch textContent
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });

  // data-i18n-html -> dịch và ghi đè innerHTML (dùng khi có thẻ lồng bên trong)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (key) el.innerHTML = t(key);
  });

  // data-i18n-placeholder -> dịch placeholder của input/textarea
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) el.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (key) el.setAttribute("aria-label", t(key));
  });
}

function setTheme(isDark) {
  try {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch {
    // Vẫn áp dụng được cho phiên hiện tại khi trình duyệt chặn lưu trữ.
  }
  applyTheme();
}

function setLang(lang) {
  const safeLang = lang === "en" ? "en" : "vi";
  try {
    localStorage.setItem(LANG_KEY, safeLang);
  } catch {
    // Không chặn người dùng đổi ngôn ngữ trong phiên hiện tại.
  }
  applyLanguage();
  // Báo cho các script khác (vd reviews.js) biết để tự render lại nội dung động
  document.dispatchEvent(new CustomEvent("languagechange"));
}

async function setNotifications(isOn) {
  let enabled = Boolean(isOn);

  if (enabled) {
    if (typeof Notification === "undefined") {
      enabled = false;
    } else if (Notification.permission === "default") {
      enabled = (await Notification.requestPermission()) === "granted";
    } else {
      enabled = Notification.permission === "granted";
    }
  }

  try {
    localStorage.setItem(NOTI_KEY, enabled ? "on" : "off");
  } catch {
    enabled = false;
  }

  if (enabled) checkExpiryNotifications();
  return enabled;
}

function checkExpiryNotifications() {
  if (
    getNotifications() !== "on" ||
    typeof Notification === "undefined" ||
    Notification.permission !== "granted" ||
    typeof getCurrentUser !== "function"
  ) {
    return;
  }

  const user = getCurrentUser();
  if (!user) return;

  let products = [];
  try {
    const saved = JSON.parse(
      localStorage.getItem("expirycheck_products_" + user.username) || "[]",
    );
    products = Array.isArray(saved) ? saved : [];
  } catch {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const dailyKey = NOTI_LAST_KEY + "_" + user.username;

  try {
    if (localStorage.getItem(dailyKey) === todayKey) return;
  } catch {
    return;
  }

  let expired = 0;
  let soon = 0;
  products.forEach((product) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(product.date || ""))) return;
    const expiry = new Date(product.date + "T00:00:00");
    const days = Math.round((expiry - today) / 86400000);
    if (days < 0) expired += 1;
    else if (days <= 7) soon += 1;
  });

  if (expired === 0 && soon === 0) return;

  try {
    new Notification(t("notification_title"), {
      body: t("notification_summary", { expired: expired, soon: soon }),
      icon: "assets/images/ExpiryCheck.jpg",
      tag: "expirycheck-daily-reminder",
    });
  } catch (error) {
    console.warn("Không thể hiển thị thông báo hạn dùng.", error);
    return;
  }

  try {
    localStorage.setItem(dailyKey, todayKey);
  } catch {
    // Thông báo vẫn đã được hiển thị.
  }
}

// Áp dụng theme ngay khi script chạy để tránh nháy giao diện
applyTheme();

/**
 * Dựng menu "Cài đặt nhanh" (bánh răng) và chèn vào #navAuth,
 * ngay bên phải nút Đăng xuất. Gọi hàm này SAU khi nút Đăng xuất
 * đã tồn tại trong DOM (ví dụ sau khi userinfo.js dựng xong navAuth).
 */
function buildSettingsMenu() {
  const navAuth = document.getElementById("navAuth");
  if (!navAuth || document.getElementById("settingsPanel")) return;

  const theme = getTheme();
  const lang = getLang();
  const noti = getNotifications();

  const wrapper = document.createElement("div");
  wrapper.className = "settings-menu";
  wrapper.innerHTML = `
    <button type="button" class="settings-trigger" id="settingsTrigger" aria-label="Cài đặt nhanh" data-i18n-aria-label="quickSettings" aria-controls="settingsPanel" aria-expanded="false">
      <i class="fa-solid fa-gear"></i>
    </button>
    <div class="settings-panel" id="settingsPanel" role="group" aria-label="Cài đặt nhanh" data-i18n-aria-label="quickSettings">
      <div class="settings-panel-title" data-i18n="quickSettings">${t("quickSettings")}</div>

      <div class="settings-row">
        <span class="label"><i class="fa-solid fa-moon"></i> <span data-i18n="darkMode">${t("darkMode")}</span></span>
        <label class="switch">
          <input type="checkbox" id="darkModeToggle" aria-label="Chế độ tối" data-i18n-aria-label="darkMode" ${theme === "dark" ? "checked" : ""} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="settings-row">
        <span class="label"><i class="fa-solid fa-language"></i> <span data-i18n="language">${t("language")}</span></span>
        <select class="settings-select" id="langSelect" aria-label="Ngôn ngữ" data-i18n-aria-label="language">
          <option value="vi" ${lang === "vi" ? "selected" : ""}>Tiếng Việt</option>
          <option value="en" ${lang === "en" ? "selected" : ""}>English</option>
        </select>
      </div>

      <div class="settings-row">
        <span class="label"><i class="fa-solid fa-bell"></i> <span data-i18n="notifications">${t("notifications")}</span></span>
        <label class="switch">
          <input type="checkbox" id="notiToggle" aria-label="Thông báo" data-i18n-aria-label="notifications" ${noti === "on" ? "checked" : ""} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="settings-divider"></div>

      <a href="caidat.html" class="settings-link">
        <i class="fa-solid fa-user-gear"></i> <span data-i18n="accountSettings">${t("accountSettings")}</span>
      </a>
      <a href="hotro.html" class="settings-link">
        <i class="fa-solid fa-circle-question"></i> <span data-i18n="helpCenter">${t("helpCenter")}</span>
      </a>
    </div>
  `;

  navAuth.appendChild(wrapper);

  document.getElementById("darkModeToggle").addEventListener("change", (e) => {
    setTheme(e.target.checked);
  });
  document.getElementById("langSelect").addEventListener("change", (e) => {
    setLang(e.target.value);
  });
  document.getElementById("notiToggle").addEventListener("change", async (e) => {
    e.target.disabled = true;
    e.target.checked = await setNotifications(e.target.checked);
    e.target.disabled = false;
  });
}

function applyActiveNavigation() {
  const currentPage =
    window.location.pathname.split("/").filter(Boolean).pop() || "index.html";

  document.querySelectorAll(".nav-links a[href]").forEach((link) => {
    const linkPage = (link.getAttribute("href") || "").split(/[?#]/)[0];
    const isCurrent = linkPage === currentPage;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(
    ".card, .review-summary, .review-form-wrap, .review-list, .panel, .stat-card, .support-card, .faq-item, .guide-card, .step-card, .about-page, .feedback-form",
  );
  if (!items.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  items.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", Math.min(index % 6, 5) * 55 + "ms");
  });

  if (reduceMotion || typeof IntersectionObserver === "undefined") {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
  );

  items.forEach((item) => observer.observe(item));
}

function initPageTransitions() {
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest("a[href]");
    if (
      !link ||
      link.target ||
      link.hasAttribute("download") ||
      link.classList.contains("require-login")
    ) {
      return;
    }

    const rawHref = link.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#")) return;

    const destination = new URL(link.href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      !["http:", "https:"].includes(destination.protocol)
    ) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("fade-out");
    window.setTimeout(() => window.location.assign(destination.href), 240);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  applyTheme();
  applyLanguage();
  applyActiveNavigation();
  initPageTransitions();
  // Chờ 1 nhịp để userinfo.js (nếu có) dựng xong nút Đăng xuất trước,
  // rồi dịch lại + gắn menu cài đặt nhanh.
  setTimeout(function () {
    applyLanguage();
    buildSettingsMenu();
    checkExpiryNotifications();
    initRevealAnimations();
  }, 0);
});
