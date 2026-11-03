# 4LIFE - Accommodation Booking Platform (User Frontend)

> **Dự án PBL6 - Giao diện Web đặt phòng lưu trú dành cho người dùng (Client Web Application)**  
> Ứng dụng web hiện đại giúp người dùng dễ dàng tìm kiếm, khám phá các điểm lưu trú qua bản đồ trực quan, đặt phòng, quản lý chuyến đi và đăng bài cho thuê chỗ ở.

---

## 📖 Giới thiệu tổng quan

**4LIFE** là nền tảng đặt phòng trực tuyến được xây dựng theo định hướng thiết kế **"Atlas khu phố" (Neighborhood Atlas)**: kết hợp trải nghiệm tìm kiếm danh sách chỗ ở song song với bản đồ số tương tác (Google Maps), giúp người dùng nắm bắt thông tin vị trí, khoảng giá và tiện nghi một cách nhanh chóng, minh bạch.

Dự án là phần giao diện người dùng (User/Client Frontend) trong hệ thống tổng thể của 4LIFE, kết nối với hệ thống RESTful API Backend và hỗ trợ thông báo thời gian thực qua WebSockets (SignalR).

---

## ✨ Tính năng chính

### 1. 🔍 Tìm kiếm & Khám phá Chỗ ở (Discovery & Search)
- **Bộ lọc tìm kiếm toàn diện**: Tìm kiếm theo địa điểm/thành phố, khoảng ngày nhận phòng (check-in) và trả phòng (check-out), số lượng khách và phòng.
- **Bản đồ trực quan (Split Map Layout)**: Trực quan hóa vị trí phòng trên bản đồ Google Maps với nhãn giá hiển thị trực tiếp. Khi di chuột hoặc bấm chọn phòng, bản đồ sẽ tự động định vị và làm nổi bật địa điểm tương ứng.
- **Lọc nâng cao**: Hỗ trợ lọc theo tiện nghi (Wi-Fi, bể bơi, điều hòa,...), danh mục chỗ ở và mức giá.

### 2. 🏡 Chi tiết chỗ ở (Accommodation Detail)
- Thư viện hình ảnh trực quan (Gallery & Carousel).
- Thông tin chi tiết phòng: loại phòng, số lượng giường, phòng tắm, quy định nhận/trả phòng.
- Danh sách tiện ích và dịch vụ đi kèm.
- Xem vị trí địa lý chính xác trên bản đồ.
- Đọc đánh giá (reviews), chấm điểm sao và bình luận từ những khách đã từng lưu trú.

### 3. 📅 Quy trình Đặt phòng & Quản lý chuyến đi (Booking Flow)
- Chọn ngày lưu trú, tính toán chi phí chi tiết theo số đêm và dịch vụ.
- Quản lý danh sách các đơn đặt phòng cá nhân (`/my-bookings`).
- Xem chi tiết từng đơn đặt phòng (`/my-bookings/:id`), mã đặt phòng, trạng thái xác nhận và thông tin chủ nhà.
- Hỗ trợ chính sách hủy phòng trực tiếp trên giao diện khi đáp ứng điều kiện.

### 4. 📝 Quản lý bài đăng chỗ ở (Host Post Management)
- Dành cho người dùng/chủ nhà tự đăng tải thông tin chỗ ở cho thuê (`/manage-posts`).
- Tạo và chỉnh sửa bài đăng với đầy đủ thông tin: địa chỉ, giá cả, số phòng, danh sách tiện nghi.
- Hỗ trợ tải lên nhiều hình ảnh (Multipart Form Data).
- Chế độ xem trước thời gian thực (Live Preview Modal) trước khi lưu hoặc cập nhật.

### 5. ❤️ Yêu thích & Hồ sơ cá nhân (Favorites & Profile)
- Lưu danh sách chỗ ở yêu thích để xem lại sau (`/my-favorites`).
- Quản lý thông tin tài khoản: họ tên, email, số điện thoại, ngày sinh, địa chỉ (`/profile`).
- Tải lên và cập nhật ảnh đại diện (avatar).
- Đổi mật khẩu tài khoản an toàn.

### 6. 🔐 Xác thực & Bảo mật (Authentication)
- Đăng nhập và Đăng ký tài khoản hệ thống (JWT Authentication).
- Đăng nhập nhanh bằng tài khoản Google (Google OAuth 2.0).
- Chức năng quên mật khẩu và xác minh mã OTP gửi qua email.
- Tự động lưu phiên đăng nhập với Redux Persist và tự động điều hướng khi token hết hạn (401 Interceptor).

### 7. 🔔 Thông báo thời gian thực (Realtime Notifications)
- Tích hợp `@microsoft/signalr` kết nối WebSocket Hub.
- Nhận thông báo tức thì khi có cập nhật trạng thái đơn đặt phòng, tin nhắn hoặc xác nhận từ hệ thống.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Phân loại | Công nghệ / Thư viện | Vai trò |
|---|---|---|
| **Core Framework** | React 18, TypeScript, Vite | Xây dựng Single Page Application hiện đại, tối ưu tốc độ build & HMR |
| **State Management** | Redux Toolkit, Redux Persist, React Query (TanStack Query v3) | Quản lý state toàn cục (Auth), lưu trữ phiên và caching dữ liệu server |
| **UI Framework & Design** | Material UI (MUI v5), Emotion | Hệ thống components chuẩn hóa, dialogs, forms, typography |
| **Styling** | SCSS Modules | Phân tách style scoped theo từng component/page, chống xung đột CSS |
| **Routing** | React Router DOM v6 | Định tuyến client-side với cơ chế Route Protection |
| **Maps & Geolocation** | `@react-google-maps/api`, `google-map-react` | Tích hợp Google Maps, vẽ marker vị trí và hiển thị giá phòng |
| **Forms & Validation** | React Hook Form, Yup | Xử lý form hiệu năng cao, validate dữ liệu đầu vào chặt chẽ |
| **Realtime** | `@microsoft/signalr` | Nhận sự kiện thông báo thời gian thực qua WebSocket |
| **Mocking & Testing** | Mock Service Worker (MSW), Jest, React Testing Library | Giả lập API cho môi trường dev offline/isolated và viết test |
| **Date & Utilities** | Dayjs, Date-fns, Axios, React Toastify, Swiper, React Slick | Xử lý ngày tháng, gọi API, thông báo toast, slider ảnh |

---

## 🎨 Ngôn ngữ thiết kế: "Atlas khu phố"

Giao diện của 4LIFE được xây dựng dựa trên phong cách **Atlas khu phố** (xem chi tiết tại [`DESIGN.md`](./DESIGN.md)):
- **Phông chữ chủ đạo**: `K2D` (hỗ trợ hiển thị tiếng Việt mượt mà, nét hình học hiện đại, thân thiện).
- **Bảng màu đặc trưng**:
  - `Neighborhood Green` (`#2f7668`): Màu hành động chính, nút bấm, điểm nhấn bản đồ đang chọn.
  - `Deep Canopy` (`#245f54`): Trạng thái hover/active của các nút chính.
  - `Harbor Ink` (`#172b3a`): Màu văn bản chính, tiêu đề có độ tương phản cao.
  - `Slate Current` (`#586970`): Văn bản phụ, nhãn thứ cấp.
  - `Paper Ground` (`#f7f8f5`): Nền trang web nhẹ nhàng, tạo cảm giác như trang giấy atlas.
  - `Terracotta Signal` (`#d36b4a`): Điểm nhấn focus ring, nhãn trạng thái đặc biệt.
- **Bố cục Map-First**: Bản đồ luôn giữ vai trò cung cấp ngữ cảnh địa lý trực quan song song với kết quả tìm kiếm.

---

## 📁 Cấu trúc thư mục dự án

```text
PBL6_FE_User/
├── public/                 # Tài nguyên tĩnh (favicon, mockServiceWorker.js, images)
├── docs/                   # Tài liệu thiết kế và đặc tả dự án
├── src/
│   ├── api/                # Cấu hình Axios instance & các module gọi REST API
│   │   ├── instance.ts             # Axios instance cấu hình interceptor (token, 401 redirect)
│   │   ├── auth.api.ts             # API xác thực, đăng nhập Google, OTP
│   │   ├── accommodation.api.ts    # API tìm kiếm, chi tiết, quản lý phòng
│   │   ├── booking.api.ts          # API đặt phòng, hủy phòng, lịch sử đặt
│   │   └── ...
│   ├── assets/             # Hình ảnh tĩnh và cấu hình theme MUI
│   │   ├── images/                 # Logo, banner, default avatars
│   │   └── theme/                  # Theme tokens, palette, typography của Material UI
│   ├── components/         # Các component tái sử dụng (Atomic/Shared UI)
│   │   ├── Auth/                   # ProtectedRoute, ProtectedAuthen
│   │   ├── Card/                   # Card phòng, card bài đăng, card tóm tắt
│   │   ├── Header/ & Footer/       # Thanh điều hướng và chân trang
│   │   ├── Map/ & AccommodationMap # Google Maps component & marker giá phòng
│   │   ├── Dialog/                 # Các hộp thoại xác nhận, form modal
│   │   └── GlobalStyles/           # Setup CSS reset và global styling
│   ├── context/            # React Context (NotifyProvider qua SignalR)
│   ├── hooks/              # Custom hooks kết hợp React Query để fetch/mutate dữ liệu
│   │   ├── use-rooms-by-location.ts
│   │   ├── use-booking.ts
│   │   ├── use-cancel-booking.ts
│   │   └── ...
│   ├── mocks/              # Mock Service Worker (MSW) cho chế độ dev độc lập
│   │   ├── browser.ts              # Setup worker cho trình duyệt
│   │   ├── handlers.ts             # Danh sách mock REST API handlers
│   │   └── data.ts                 # Dữ liệu giả lập mẫu (chỗ ở, người dùng, review)
│   ├── pages/              # Các trang giao diện chính theo định tuyến
│   │   ├── Home/                   # Trang chủ
│   │   ├── Rooms/                  # Trang danh sách phòng + Bản đồ
│   │   ├── AccommodationDetail/    # Chi tiết phòng & đặt phòng
│   │   ├── MyBookings/             # Danh sách đơn đặt phòng cá nhân
│   │   ├── BookingDetail/          # Chi tiết đơn đặt phòng
│   │   ├── ManagePosts/            # Quản lý bài đăng cho thuê của chủ nhà
│   │   ├── MyFavorite/             # Danh sách yêu thích
│   │   ├── MyProfile/              # Quản lý thông tin tài khoản
│   │   ├── Login/ & SignUp/        # Đăng nhập & Đăng ký
│   │   ├── ForgotPassword/         # Quên mật khẩu & OTP
│   │   └── Root.tsx                # Layout bao bọc chung (Header, Outlet, Footer)
│   ├── store/              # Redux Toolkit store & Redux Persist configuration
│   │   ├── authSlice.ts            # Quản lý trạng thái xác thực và người dùng
│   │   └── index.tsx               # Cấu hình store & persistor
│   ├── types/              # TypeScript definitions & model interfaces
│   ├── utils/              # Tiện ích bổ trợ (format tiền tệ, ngày tháng, token storage)
│   ├── App.tsx             # Cấu hình React Router v6
│   └── main.tsx            # Entry point ứng dụng
├── AGENTS.md               # Hướng dẫn chi tiết cho AI coding agents
├── DESIGN.md               # Đặc tả Design System "Atlas khu phố"
├── PRODUCT.md              # Định vị sản phẩm và yêu cầu nghiệp vụ
└── package.json            # Quản lý dependencies & scripts
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu môi trường
- **Node.js**: Phiên bản 18.x trở lên (khuyến nghị Node 18 hoặc Node 20 LTS)
- **npm** (hoặc `yarn` / `bun`)

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường (`.env`)
Tạo file `.env` tại thư mục gốc của dự án (nếu chưa có):

```env
GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
```

> **Lưu ý**: Endpoint API Backend mặc định được cấu hình tại `src/api/instance.ts` (`https://tuna.whitemage.tech/api`).

### 3. Khởi chạy dự án

#### Chế độ kết nối Backend thật:
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

#### Chế độ Mock API (MSW - Mock Service Worker):
Dùng khi backend đang bảo trì hoặc cần chạy test tính năng độc lập với dữ liệu mẫu:
```bash
npm run dev:mock
```
*(Chế độ này kích hoạt Mock Service Worker chặn các request API và phản hồi bằng dữ liệu mẫu từ `src/mocks/`)*

### 4. Build dự án cho Production

```bash
npm run build
```
Lệnh này sẽ kiểm tra kiểu dữ liệu với TypeScript (`tsc`) và đóng gói mã nguồn vào thư mục `dist/` thông qua Vite.

Để xem thử bản build cục bộ:
```bash
npm run preview
```

### 5. Kiểm tra chất lượng mã nguồn & Kiểm thử

- **Chạy ESLint**:
  ```bash
  npm run lint
  ```
- **Chạy Unit Tests (Jest)**:
  ```bash
  npm test
  ```

---

## 📌 Các tuyến đường (Routes) trong hệ thống

| Đường dẫn (Route) | Quyền truy cập | Mô tả |
|---|---|---|
| `/home` hoặc `/` | Công khai | Trang chủ, banner tìm kiếm, danh mục điểm đến phổ biến |
| `/about` | Công khai | Giới thiệu về 4LIFE |
| `/rooms` | Công khai | Danh sách chỗ ở kèm bản đồ tương tác (Google Maps) |
| `/rooms/:id` | Công khai | Trang chi tiết chỗ ở, thông tin tiện nghi, đánh giá & đặt phòng |
| `/login` | Chưa đăng nhập (`ProtectedAuthen`) | Đăng nhập bằng email/mật khẩu hoặc Google |
| `/signup` | Chưa đăng nhập (`ProtectedAuthen`) | Đăng ký tài khoản mới |
| `/forgot-password`| Chưa đăng nhập (`ProtectedAuthen`) | Khôi phục mật khẩu qua email & mã OTP |
| `/profile` | Yêu cầu đăng nhập (`ProtectedRoute`) | Quản lý thông tin cá nhân, ảnh đại diện, đổi mật khẩu |
| `/manage-posts` | Yêu cầu đăng nhập (`ProtectedRoute`) | Quản lý bài đăng cho thuê chỗ ở của người dùng/chủ nhà |
| `/my-bookings` | Yêu cầu đăng nhập (`ProtectedRoute`) | Danh sách tất cả đơn đặt phòng của tôi |
| `/my-bookings/:id` | Công khai/Bảo vệ | Chi tiết đơn đặt phòng cụ thể |
| `/my-favorites` | Yêu cầu đăng nhập (`ProtectedRoute`) | Danh sách các chỗ ở đã lưu vào mục yêu thích |

---

## 👥 Đóng góp & Phát triển

Mọi đóng góp vào dự án cần tuân thủ các nguyên tắc:
1. Đảm bảo giao diện bám sát quy chuẩn trong [`DESIGN.md`](./DESIGN.md) và phông chữ K2D.
2. Viết mã có định kiểu TypeScript rõ ràng, tránh sử dụng `any`.
3. Kiểm tra responsive trên cả màn hình di động (mobile) và máy tính để bàn (desktop).
4. Kiểm tra mã nguồn với `npm run build` trước khi tạo Pull Request.
5. Xem thêm chỉ dẫn chi tiết cho các công cụ lập trình AI tại [`AGENTS.md`](./AGENTS.md).
