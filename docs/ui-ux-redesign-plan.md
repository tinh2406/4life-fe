# Kế hoạch nâng cấp UI-UX 4LIFE

## Tiến độ triển khai

- **Rooms:** đã chuyển sang hướng Atlas khu phố với bộ lọc, kết quả cạnh bản đồ, marker giá, trạng thái tải/lỗi/rỗng và chế độ chuyển danh sách/bản đồ trên mobile.
- **Chi tiết chỗ ở:** đã làm mới gallery, thứ tự thông tin, sức chứa, mô tả, tiện nghi, đánh giá, giá/CTA và bản đồ responsive; dialog booking giữ nguyên nghiệp vụ.
- **Bản đồ:** các màn dùng `GOOGLE_MAPS_API_KEY` qua cấu hình môi trường; bỏ khóa nhúng trực tiếp trong component.
- **Còn lại:** tiếp tục kiểm toán luồng booking/payment và các route khác theo từng lát cắt; mọi thay đổi quy tắc nghiệp vụ cần tách và xác nhận riêng.

## Mục tiêu

Làm giao diện đặt chỗ lưu trú dễ hiểu, đáng tin và nhất quán hơn trên điện thoại lẫn máy tính. Ưu tiên giúp khách tìm được nơi ở phù hợp, hiểu rõ thông tin trước khi đặt và theo dõi đặt chỗ thuận tiện. Giữ nguyên chức năng, luồng nghiệp vụ và cấu trúc URL trong giai đoạn thiết kế.

## Hiện trạng quan sát được

- Ứng dụng dùng React, TypeScript, Vite, React Router, Redux Toolkit, MUI 5 và SCSS Modules.
- Đã có theme MUI, token màu và component dùng lại, nhưng màu sắc xuất hiện rải rác trong SCSS và style nội tuyến.
- Nhận diện hiện hữu có logo 4LIFE và các sắc hồng/đỏ san hô. Người dùng xác nhận giữ tên và logo; palette hiện tại có thể thay đổi trong lần làm mới.
- Ứng dụng có nhóm trang khám phá (`Home`, `Rooms`, `AccommodationDetail`, `About`), tài khoản (`Login`, `SignUp`, `ForgotPassword`, `MyProfile`), giao dịch (`MyBookings`, `BookingDetail`) và quản lý nội dung (`MyFavorite`, `ManagePosts`).
- Trang chủ có ảnh hero, lời giới thiệu và các lợi ích. Header điều hướng, trạng thái người dùng và thông báo được chia sẻ.
- Chưa có tài liệu chân dung người dùng, nghiên cứu khả dụng, hệ token thiết kế chính thức hay tiêu chí đo lường được xác nhận. Không suy diễn số liệu chuyển đổi hoặc phản hồi khách hàng.

## Hướng thiết kế đã chọn

**Redesign nhận diện mạnh theo hướng Atlas khu phố:** thay hệ thị giác hồng/đỏ hiện tại bằng nền sáng màu giấy, xanh rêu cho hành động và nhấn terracotta tiết chế; dùng bố cục giàu thông tin, bản đồ cạnh danh sách nơi ở và kiểu chữ hiện đại. Đây là hướng người dùng đã chọn cho màn Rooms. Giữ nguyên tên và logo 4LIFE, chức năng, luồng booking/payment, API, phân quyền và URL. Không tự ý sửa nội dung pháp lý, chính sách, nhãn tracking hay cam kết sản phẩm.

Người dùng ưu tiên khách du lịch tự tìm và đặt chỗ; công việc chính là tìm nơi phù hợp nhanh. Có thể tham khảo Booking.com và Airbnb về khả năng tìm kiếm, nhưng tránh sao chép nhận diện. Người dùng cho phép cân nhắc cải tiến nghiệp vụ nếu thấy bất hợp lý; mọi thay đổi nghiệp vụ sẽ được ghi riêng, đánh giá tác động API và xác nhận trước khi triển khai.

Định hướng cho Rooms: desktop hiển thị kết quả cạnh bản đồ, mobile cho phép chuyển giữa danh sách và bản đồ. DIALS cho lát cắt này: `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 2`, `VISUAL_DENSITY 5`; giao diện đặt chỗ cần rõ ràng, nhanh quét và ưu tiên độ tin cậy hơn hiệu ứng.

## Quy trình triển khai thiết kế

- Tuân thủ `clean-code` cho mọi thay đổi mã và cấu trúc: đọc stack, cấu trúc, convention; chỉnh đúng unit sở hữu; kiểm tra diff và xác minh bằng lệnh phù hợp.
- Dùng `impeccable` cho quy trình redesign: hoàn tất product context trong `PRODUCT.md`, kiểm toán giao diện hiện hữu, chọn hướng thị giác trước khi sửa UI, rồi kiểm tra responsive/accessibility và chạy detector theo yêu cầu của skill.
- Dùng `design-taste-frontend` để đọc brief, tránh bố cục/màu sắc rập khuôn và tự kiểm tra chất lượng phần giao diện phù hợp. Với ứng dụng đặt phòng, ưu tiên khả năng hoàn thành tác vụ; không áp nguyên xi checklist landing page vào màn hình vận hành.
- Giữ React, TypeScript, Vite, MUI 5 và SCSS Modules. Mọi đổi framework hoặc thêm thư viện cần lý do cụ thể và được duyệt trước.
- Chỉ dùng ảnh có nguồn/quyền sử dụng rõ ràng; không tự tạo số liệu, đánh giá, tiện ích, giá hoặc chính sách để làm giao diện trông đầy đủ hơn.

## Nguyên tắc trải nghiệm

1. Ưu tiên luồng tìm kiếm và đặt phòng: vị trí, ngày ở, số khách, bộ lọc, kết quả, chi tiết, xác nhận.
2. Giữ nhất quán giữa các trang: header, container, phân cấp tiêu đề, form, nút, trạng thái, khoảng cách và breakpoint.
3. Thiết kế mobile từ luồng thực tế: bộ lọc dễ mở/đóng, thông tin đặt phòng dễ rà soát, nút hành động quan trọng dễ tiếp cận.
4. Hiển thị đầy đủ trạng thái tải, rỗng, lỗi, thành công và quyền truy cập; không chỉ thiết kế trạng thái dữ liệu đã tải thành công.
5. Đảm bảo thao tác bàn phím, focus dễ thấy, nhãn form rõ ràng, tương phản WCAG AA cho chữ thường và văn bản không phụ thuộc riêng vào màu.
6. Dùng ảnh chỗ ở thật đã có quyền sử dụng; giữ tỷ lệ ảnh ổn định và mô tả thay thế phù hợp. Không tạo số liệu, đánh giá hay cam kết giả.
7. Tôn trọng `prefers-reduced-motion`; chuyển động chỉ dùng để phản hồi thao tác hoặc làm rõ thay đổi trạng thái.

## Kế hoạch theo giai đoạn

### 0. Chốt phạm vi và kiểm kê

- Xác nhận nhóm người dùng chính, bối cảnh đặt chỗ, thiết bị ưu tiên, mục tiêu kinh doanh và những tài sản/đặc tính thương hiệu bắt buộc giữ.
- Kiểm kê thương hiệu hiện hữu, nội dung, tính năng, analytics/SEO, API và ràng buộc triển khai; tách phần được thay đổi khỏi phần phải bảo toàn.
- Liệt kê trạng thái hiện có cho tìm phòng, chi tiết chỗ ở, thanh toán/đặt chỗ, đăng nhập và hồ sơ.
- Ghi nhận các thành phần dùng chung, điểm trùng lặp màu/khoảng cách, vấn đề mobile, accessibility và nội dung chưa rõ.
- Không đổi route, thứ tự trường form, nhãn đang gắn tracking, metadata/SEO hoặc nội dung pháp lý trong bước này.

### 0.5. Chuyển quyết định thị giác thành hệ thống

- Hướng Atlas khu phố và bố cục danh sách cạnh bản đồ đã được người dùng chọn cho Rooms.
- Giữ logo, tên 4LIFE và stack. Đồng bộ màu, typography, khoảng cách, hình ảnh, mật độ và motion từ trang Rooms tới các bề mặt liên quan sau khi kiểm toán từng route.
- Kiểm tra tương phản, khả năng thao tác bằng bàn phím và các trạng thái trước khi mở rộng.

### 1. Nền tảng thị giác

- Thiết kế bộ token mới theo hướng đã duyệt trong theme MUI: nền, bề mặt, chữ, đường viền, thương hiệu và trạng thái.
- Xác định thang chữ, chiều rộng nội dung, khoảng cách, bán kính, elevation và breakpoint; ưu tiên token hiện có thay vì giá trị rải rác.
- Đồng bộ cách dùng token giữa MUI và SCSS Modules; lập danh sách style cũ cần thay thế theo từng lát cắt.
- Kiểm tra tương phản, focus và trạng thái tương tác trên các nền và bối cảnh màu đã duyệt.

### 2. Khám phá và chọn chỗ ở

- Làm rõ phân cấp trang chủ: thông điệp, điểm vào tìm kiếm, gợi ý chỗ ở và đường dẫn tới kết quả.
- Tối ưu trang danh sách: vùng tìm kiếm, bộ lọc đang áp dụng, sắp xếp, số kết quả, thẻ chỗ ở và trạng thái không có kết quả.
- Trên mobile, biến bộ lọc thành quy trình mở/đóng rõ ràng, giữ ngữ cảnh kết quả và đảm bảo CTA không che nội dung.
- Tối ưu trang chi tiết: thư viện ảnh, vị trí, sức chứa, tiện nghi, chính sách, giá và hành động đặt phòng; thông tin quan trọng phải tìm thấy trước khi người dùng quyết định.

### 3. Đặt phòng và sau đặt phòng

- Rà soát cách chọn ngày/số khách, kiểm tra dữ liệu, lỗi, tổng chi phí và xác nhận hành động.
- Làm cho chi tiết giá, điều kiện, trạng thái đặt phòng và bước tiếp theo dễ kiểm tra.
- Cải thiện danh sách đặt phòng, chi tiết đặt phòng, yêu thích và thông báo để người dùng nhận biết trạng thái và hành động khả dụng.
- Không thay đổi quy tắc nghiệp vụ thanh toán/hủy/hoàn tiền nếu chưa có xác nhận từ sản phẩm.

### 4. Tài khoản và quản lý nội dung

- Đồng bộ form đăng nhập, đăng ký, quên mật khẩu, hồ sơ và đổi mật khẩu: nhãn, trợ giúp, lỗi, focus và phản hồi thành công.
- Rà soát trang quản lý bài đăng/thống kê riêng với giao diện khách đặt chỗ; ưu tiên khả năng quét thông tin và hiểu trạng thái.
- Giữ phân quyền và hành vi hiện có; chỉ thay đổi cách trình bày.

### 5. Kiểm tra và phát hành từng lát cắt

- Rà soát thủ công trên mobile hẹp, tablet và desktop cho từng giai đoạn.
- Kiểm tra bàn phím, focus, tương phản, zoom, trạng thái lỗi/rỗng/tải và nội dung dài.
- Chạy build/lint và kiểm tra hồi quy các luồng liên quan trước khi nhập từng phần.
- Theo dõi các chỉ số sau khi có baseline và quyền truy cập dữ liệu: tỷ lệ hoàn thành tìm kiếm/đặt chỗ, lỗi form và vấn đề hỗ trợ. Không đặt mục tiêu số khi chưa có baseline.

## Ưu tiên đề xuất

| Ưu tiên | Phạm vi | Lý do |
| --- | --- | --- |
| P0 | Kiểm kê sản phẩm và thương hiệu, chốt hướng thị giác mới, lập baseline UX | Cho phép redesign có chủ đích và giảm rủi ro làm sai sản phẩm |
| P1 | Hệ token mới, header dùng chung, trang Rooms và chi tiết chỗ ở | Áp dụng nhận diện mới trước trên đường đi chính để chọn nơi ở |
| P2 | Đặt chỗ, xác nhận, danh sách/chi tiết booking | Làm rõ giao dịch và thông tin sau khi đặt |
| P3 | Trang chủ, tài khoản, yêu thích và trang quản lý | Nâng độ nhất quán và hoàn thiện các luồng hỗ trợ |

## Điều kiện hoàn tất cho mỗi lát cắt

- Không đổi URL, quyền truy cập, API, quy tắc nghiệp vụ hoặc dữ liệu thật ngoài phạm vi đã duyệt.
- Thành phần dùng đúng token và hoạt động ở màn hình nhỏ/lớn.
- Có thiết kế cho trạng thái tải, rỗng, lỗi và thành công tương ứng với dữ liệu/luồng hiện có.
- Thao tác chính dùng được bằng bàn phím; focus và tương phản dễ nhận biết.
- Build/lint và kiểm tra hồi quy liên quan hoàn tất; ghi rõ phần chưa kiểm chứng.

## Quyết định đã xác nhận

- Giữ tên và logo 4LIFE; đổi mới nhận diện tương đối mạnh.
- Ưu tiên trải nghiệm khách du lịch tìm và đặt chỗ.
- Thành công chính: tìm chỗ phù hợp nhanh.
- Có thể tham khảo Booking.com và Airbnb về mô hình khám phá và tìm kiếm.
- Giữ route, chức năng và các ràng buộc hiện có trong lát cắt redesign; mọi thay đổi nghiệp vụ cần được đánh giá và xác nhận theo phạm vi cụ thể.
=> Nghiệp vụ cũ nếu không thật sự hợp lí thì có thể cải tiến về nghiệp vụ
