# Routine — Smart Fashion E-Commerce & AI Stylist Platform

> Nền tảng thương mại điện tử thời trang hiện đại kết hợp tính năng **Smart Outfit** và **Trợ lý tư vấn thời trang thông minh AI Stylist** (sử dụng Google Gemini AI), tích hợp cổng thanh toán trực tuyến **VNPay Sandbox** và hệ thống quản trị **Admin Portal** hoàn chỉnh.

---

## 📌 Mục lục

1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Kiến trúc hệ thống & Công nghệ](#2-kiến-trúc-hệ-thống--công-nghệ)
3. [Tính năng nổi bật](#3-tính-năng-nổi-bật)
4. [Cấu trúc thư mục dự án](#4-cấu-trúc-thư-mục-dự-án)
5. [Yêu cầu môi trường (Prerequisites)](#5-yêu-cầu-môi-trường-prerequisites)
6. [Hướng dẫn cài đặt & Cấu hình chi tiết](#6-hướng-dẫn-cài-đặt--cấu-hình-chi-tiết)
   - [Bước 1: Thiết lập Cơ sở dữ liệu (MySQL)](#bước-1-thiết-lập-cơ-sở-dữ-liệu-mysql)
   - [Bước 2: Cài đặt & Cấu hình Backend](#bước-2-cài-đặt--cấu-hình-backend)
   - [Bước 3: Cài đặt & Cấu hình Frontend](#bước-3-cài-đặt--cấu-hình-frontend)
7. [Cách khởi chạy dự án (How to Run)](#7-cách-khởi-chạy-dự-án-how-to-run)
8. [Tài liệu API (API Endpoints)](#8-tài-liệu-api-api-endpoints)
9. [Chạy các kịch bản kiểm thử (Automated Tests)](#9-chạy-các-kịch-bản-kiểm-thử-automated-tests)
10. [Khắc phục sự cố thường gặp (Troubleshooting)](#10-khắc-phục-sự-cố-thường-gặp-troubleshooting)

---

## 1. Giới thiệu tổng quan

**Routine_web** là giải pháp toàn diện cho một trang web thương mại điện tử ngành thời trang, được xây dựng theo kiến trúc **Monorepo (Frontend + Backend tách biệt)**:
- **Khách hàng (Customer)**: Trải nghiệm mua sắm mượt mà, xem sản phẩm, gợi ý phối đồ theo set (**Smart Outfit**), trò chuyện với chuyên gia tạo mẫu ảo (**AI Stylist**) để nhận gợi ý trang phục theo dịp/phong cách/ngân sách, thanh toán linh hoạt qua COD hoặc VNPay.
- **Quản trị viên (Admin)**: Trang quản trị trực quan tại `/admin` để quản lý sản phẩm, danh mục, set phối đồ, đơn hàng, mã giảm giá (voucher), đánh giá và khách hàng.

---

## 2. Kiến trúc hệ thống & Công nghệ

### Sơ đồ kiến trúc tổng thể

```mermaid
graph TD
    Client["Client (Trình duyệt Web)"]
    FE["Frontend (Next.js 14 App Router) - Port 3000"]
    BE["Backend (Express.js API) - Port 5001"]
    DB[("MySQL Database (routine_db)")]
    Prisma["Prisma ORM"]
    Gemini["Google Gemini AI API"]
    VNPay["Cổng thanh toán VNPay Sandbox"]
    SMTP["Gmail SMTP (Nodemailer)"]

    Client -->|HTTP/SSR/JSON| FE
    FE -->|REST API /api/v1| BE
    BE -->|Query| Prisma
    Prisma -->|CRUD| DB
    BE -->|Prompt & Suggestions| Gemini
    BE -->|Create Payment URL & IPN| VNPay
    BE -->|Send OTP & Invoices| SMTP
```

### Chi tiết công nghệ

| Thành phần | Công nghệ | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router)** & **React 18** | Tối ưu SEO, Server-Side Rendering (SSR), Client Components và quản lý routing linh hoạt. |
| **Styling** | **Vanilla CSS & CSS Modules** | Kiểm soát giao diện 100%, phong cách tối giản, sang trọng, không phụ thuộc thư viện UI cồng kềnh. |
| **State Management** | **React Context API** | Quản lý Giỏ hàng (`CartContext`), Xác thực (`UserContext`), Yêu thích (`WishlistContext`), Thanh toán (`CheckoutContext`), Đơn hàng (`OrderContext`). |
| **Backend Framework** | **Node.js** & **Express.js** | Xây dựng RESTful API tại `/api/v1`, xử lý CORS, middleware bảo mật và chống cache. |
| **ORM & Database** | **Prisma ORM 6** & **MySQL** | Thiết kế dữ liệu với quan hệ chặt chẽ (16 Models), hỗ trợ migration và đồng bộ schema. |
| **Bảo mật & Auth** | **JWT (JSON Web Token)** & **bcryptjs** | Xác thực phân quyền `CUSTOMER` / `ADMIN`, hỗ trợ session khách vãng lai (`x-session-id`). |
| **AI Stylist** | **Google Gemini AI REST API** | Phân tích tiêu chí người dùng (dịp, phong cách, ngân sách), kết hợp dữ liệu sản phẩm trong DB để tư vấn thời trang chuyên nghiệp. |
| **Cổng thanh toán** | **VNPay Sandbox** (`vnpay` package) | Tạo link thanh toán online an toàn, mã hóa chữ ký HMAC-SHA512, xử lý IPN & Return URL. |
| **Tồn kho (Inventory)** | **Stock Reservation** | Tự động giữ hàng trong thời gian chờ khách thanh toán online để tránh overselling. |
| **Email Service** | **Nodemailer** | Gửi OTP đăng ký tài khoản, quên mật khẩu và email hóa đơn chi tiết khi đặt hàng thành công. |

---

## 3. Tính năng nổi bật

### 🛍️ Dành cho Khách hàng (Storefront)
1. **Trang chủ & Danh mục đa dạng**:
   - Khám phá bộ sưu tập Nam, Nữ, Unisex, Hàng mới về (New Arrivals), Giảm giá (Sale).
   - Bộ lọc chi tiết: Theo danh mục, mức giá, màu sắc, kích cỡ, phong cách (Minimal, Streetwear, Smart Casual...).
   - Tìm kiếm sản phẩm thông minh với gợi ý từ khóa phổ biến.
2. **Chi tiết sản phẩm (Product Detail)**:
   - Thư viện ảnh sản phẩm trực quan, chọn màu sắc và kích cỡ thời gian thực.
   - Hiển thị bảng kích thước (Size Guide), đánh giá và sản phẩm liên quan.
3. **Smart Outfit (Bộ phối đồ thông minh)**:
   - Các set đồ mẫu được phối sẵn theo từng dịp: Đi làm, Đi chơi, Hẹn hò, Dạo phố, Tiệc tùng.
   - Xem chi tiết từng món đồ trong set và tính năng **"Thêm toàn bộ set vào giỏ"** chỉ với 1 click.
4. **AI Fashion Stylist Chatbot**:
   - Trò chuyện với Stylist ảo thông qua giao diện chat hiện đại.
   - Nhận diện nhu cầu cá nhân hóa (vóc dáng, dịp diện, kinh phí) để gợi ý set đồ tương ứng kèm lời tư vấn truyền cảm hứng từ Google Gemini AI.
5. **Giỏ hàng & Khách vãng lai linh hoạt**:
   - Khách vãng lai (chưa đăng nhập) vẫn có thể thêm hàng vào giỏ và lưu wishlist bình thường nhờ cơ chế `guest_session_id`.
   - Tự động gộp giỏ hàng khách vào tài khoản khi người dùng thực hiện Đăng nhập.
6. **Quy trình Thanh toán & Quản lý Đơn hàng**:
   - Hỗ trợ mã giảm giá (Coupon/Voucher) giảm theo %, số tiền cố định hoặc miễn phí vận chuyển.
   - Chọn phương thức giao hàng và phương thức thanh toán: **COD (Thanh toán khi nhận hàng)** hoặc **VNPay (Quét mã QR / Thẻ nội địa / Thẻ quốc tế)**.
   - Theo dõi hành trình đơn hàng (Timeline: Chờ xác nhận → Đã xác nhận → Đang vận chuyển → Hoàn tất).
7. **Bảo mật & Tài khoản**:
   - Đăng ký tài khoản kèm xác thực mã OTP qua Email.
   - Đổi thông tin cá nhân, sổ địa chỉ nhận hàng, đổi mật khẩu và khôi phục mật khẩu quên.

### 🛡️ Dành cho Quản trị viên (Admin Portal - `/admin`)
1. **Dashboard tổng quan**: Thống kê doanh thu, số lượng đơn hàng, sản phẩm và khách hàng.
2. **Quản lý Sản phẩm**: Thêm mới, chỉnh sửa, tải ảnh, quản lý tồn kho, phân loại danh mục/phong cách và gán nhãn (New, Best Seller, Sale).
3. **Quản lý Outfits**: Tạo các bộ phối thời trang mới, chọn sản phẩm thành phần cho set.
4. **Quản lý Đơn hàng**: Xem chi tiết đơn, chuyển đổi trạng thái đơn hàng (Xác nhận, Giao hàng, Hoàn tất, Hủy đơn).
5. **Quản lý Danh mục & Phong cách**: Điều chỉnh danh mục hiển thị, phong cách phối đồ.
6. **Quản lý Vouchers & Đánh giá**: Tạo mã giảm giá khuyến mãi, kiểm duyệt đánh giá của khách hàng.

---

## 4. Cấu trúc thư mục dự án

```
Routine_web/
├── backend/                             # Phân hệ Máy chủ API (Node.js & Express)
│   ├── app.js                           # Khởi tạo Express, cấu hình middleware CORS, logger, router
│   ├── package.json                     # Danh sách dependencies & scripts backend
│   ├── routine_db.sql                   # File CSDL MySQL mẫu đã có sẵn cấu trúc và dữ liệu
│   ├── bin/
│   │   └── www                          # Điểm chạy máy chủ HTTP (Port 5001)
│   ├── prisma/
│   │   └── schema.prisma                # Định nghĩa toàn bộ 16 Models CSDL
│   ├── scripts/                         # Script trích xuất SQL và tạo ảnh mẫu
│   │   ├── build_full_sql.js
│   │   └── generate_product_images.js
│   ├── src/
│   │   ├── config/                      # Cấu hình kết nối Prisma Client
│   │   ├── controllers/                 # Tầng tiếp nhận request & trả JSON
│   │   ├── middlewares/                 # auth.js (JWT), identifyUser.js, errorHandler.js
│   │   ├── routes/                      # Khai báo các API routes con & api.js tổng hợp
│   │   ├── services/                    # Tầng xử lý nghiệp vụ chính (Cart, Order, VNPay, AI, Email...)
│   │   └── utils/                       # Chuẩn hóa JSON phản hồi (sendSuccess, sendError)
│   └── test_*.js                        # Bộ script kiểm thử API tự động độc lập
│
├── frontend/                            # Phân hệ Giao diện Người dùng (Next.js 14 App Router)
│   ├── package.json                     # Dependencies frontend (Next.js 14, React 18)
│   ├── next.config.js                   # Cấu hình Next.js
│   ├── jsconfig.json                    # Cấu hình alias `@/*`
│   ├── app/                             # Next.js App Router (Pages & Routes)
│   │   ├── layout.js                    # Root Layout bọc Header, Footer và các Providers
│   │   ├── globals.css                  # Design tokens, màu sắc, font chữ và class dùng chung
│   │   ├── page.js                      # Trang chủ Routine
│   │   ├── admin/                       # Trang quản trị dành cho Admin
│   │   ├── cart/                        # Trang giỏ hàng
│   │   ├── category/[slug]/             # Trang phân loại danh mục
│   │   ├── checkout/                    # Trang thanh toán (thông tin nhận hàng, VNPay)
│   │   ├── login/, register/            # Đăng nhập, đăng ký, xác thực OTP
│   │   ├── orders/                      # Lịch sử đơn hàng
│   │   ├── outfit/[id]/                 # Chi tiết set đồ phối sẵn
│   │   ├── product/[id]/                # Chi tiết sản phẩm
│   │   ├── search/                      # Tìm kiếm sản phẩm
│   │   ├── smart-outfit/                # Trang giới thiệu Smart Outfit & AI Stylist
│   │   └── wishlist/                    # Danh sách yêu thích
│   ├── components/                      # UI Components tái sử dụng (ai, cart, checkout, product...)
│   ├── context/                         # React Contexts quản trị trạng thái
│   ├── lib/                             # Thư viện gọi API backend (api.js, cartService, orderService...)
│   └── public/                          # Tài nguyên tĩnh, hình ảnh sản phẩm & icon
│
└── README.md                            # Tài liệu hướng dẫn toàn bộ dự án
```

---

## 5. Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
- **Node.js**: Phiên bản `>= 18.x` (khuyến nghị Node 20 LTS). Kiểm tra bằng lệnh: `node -v`
- **npm**: Đi kèm với Node.js. Kiểm tra bằng: `npm -v`
- **MySQL Server**: Phiên bản `>= 8.0` (có thể dùng qua XAMPP, Laragon, MySQL Installer hoặc Docker).
- **Git** (nếu cần quản lý phiên bản).

---

## 6. Hướng dẫn cài đặt & Cấu hình chi tiết

### Bước 1: Thiết lập Cơ sở dữ liệu (MySQL)

1. Khởi động dịch vụ **MySQL** (ví dụ: mở XAMPP và nhấn Start tại MySQL, hoặc chạy dịch vụ Windows Service).
2. Mở công cụ quản lý cơ sở dữ liệu (phpMyAdmin, MySQL Workbench, DBeaver, Navicat hoặc MySQL CLI).
3. Tạo mới một cơ sở dữ liệu có tên là `routine_db`:
   ```sql
   CREATE DATABASE routine_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. **Nhập dữ liệu mẫu**:
   - Nhập trực tiếp file [backend/routine_db.sql](file:///c:/Users/ADMIN/OneDrive/Documents/Project/Routine_web/backend/routine_db.sql) vào cơ sở dữ liệu `routine_db` vừa tạo. File này đã chứa đầy đủ cấu trúc bảng, danh mục, sản phẩm, set phối đồ và dữ liệu mẫu.

---

### Bước 2: Cài đặt & Cấu hình Backend

1. Mở cửa sổ dòng lệnh (Terminal / PowerShell) và điều hướng vào thư mục `backend`:
   ```bash
   cd backend
   ```

2. Cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```

3. **Cấu hình file môi trường `.env`**:
   - Trong thư mục `backend`, sao chép file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env     # Trên Linux/macOS
     copy .env.example .env   # Trên Windows PowerShell
     ```
   - Mở file `.env` và cập nhật các thông số tương ứng với máy của bạn:

   ```env
   # Cổng hoạt động của máy chủ backend
   PORT=5001
   NODE_ENV=development

   # Chuỗi kết nối MySQL (thay root và password tương ứng với MySQL của bạn)
   DATABASE_URL="mysql://root:password@localhost:3306/routine_db"

   # Khóa bí mật ký JWT Token (đặt một chuỗi ngẫu nhiên an toàn)
   JWT_SECRET="routine_web_jwt_secret_key_change_me_super_secret"
   JWT_EXPIRES_IN="7d"

   # URL Frontend cho phép gọi CORS
   FRONTEND_URL="http://localhost:3000"

   # Google Gemini AI API Key (để sử dụng tính năng tư vấn AI Stylist)
   # Lấy miễn phí tại: https://aistudio.google.com/
   GEMINI_API_KEY="your_gemini_api_key_here"

   # Cấu hình gửi email xác thực OTP và Hóa đơn đơn hàng (Gmail SMTP)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER="your-gmail@gmail.com"
   SMTP_PASS="your-16-character-app-password"
   SMTP_FROM='"Routine Fashion" <your-gmail@gmail.com>'

   # Cấu hình VNPay Sandbox (Tích hợp thanh toán trực tuyến thử nghiệm)
   VNP_TMN_CODE="your_vnpay_tmn_code"
   VNP_HASH_SECRET="your_vnpay_hash_secret"
   VNP_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
   VNP_API_URL="https://sandbox.vnpayment.vn/merchant_webapi/api/transaction"
   VNP_RETURN_URL="http://localhost:3000/checkout/payment/vnpay-return"
   ```

4. **Sinh mã Prisma Client**:
   ```bash
   npm run db:generate
   ```

*(Lưu ý: Nếu bạn muốn tạo lại cấu trúc database từ đầu qua Prisma thay vì import file sql, bạn có thể chạy `npx prisma db push`).*

---

### Bước 3: Cài đặt & Cấu hình Frontend

1. Mở một cửa sổ Terminal mới và điều hướng vào thư mục `frontend`:
   ```bash
   cd frontend
   ```

2. Cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```

3. **Cấu hình file `.env.local`**:
   - Đảm bảo trong thư mục `frontend` đã có file `.env.local` trỏ chính xác về Backend API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
   ```

---

## 7. Cách khởi chạy dự án (How to Run)

Để toàn bộ hệ thống hoạt động hoàn chỉnh, bạn cần mở **2 Terminal song song**:

### Terminal 1: Chạy Backend Server
```bash
cd backend
npm run dev
```
- Máy chủ Backend sẽ khởi động tại: **`http://localhost:5001`**
- Kiểm tra trạng thái hoạt động (Health-check): Truy cập trình duyệt vào `http://localhost:5001/api/v1/health` (sẽ nhận phản hồi `{ "status": "healthy" }`).

### Terminal 2: Chạy Frontend App
```bash
cd frontend
npm run dev
```
- Ứng dụng Next.js sẽ khởi động tại: **`http://localhost:3000`**

### Truy cập các đường dẫn chính
- **Trang chủ người dùng**: `http://localhost:3000`
- **Smart Outfit**: `http://localhost:3000/smart-outfit`
- **AI Fashion Stylist Chatbot**: `http://localhost:3000/smart-outfit/ai-stylist`
- **Giỏ hàng**: `http://localhost:3000/cart`
- **Đăng nhập / Đăng ký**: `http://localhost:3000/login`
- **Cổng Quản trị Admin**: `http://localhost:3000/admin`

---

## 8. Tài liệu API (API Endpoints)

Mọi API được gắn tại tiền tố `/api/v1` với định dạng phản hồi chuẩn:
```json
{
  "success": true,
  "data": { ... },
  "message": "Thông điệp thành công",
  "meta": { "pagination": ... }
}
```

| Nhóm API | Phương thức | Endpoint | Mô tả |
| :--- | :---: | :--- | :--- |
| **Hệ thống** | `GET` | `/api/v1/health` | Kiểm tra tình trạng backend |
| **Xác thực** | `POST` | `/api/v1/auth/register` | Đăng ký tài khoản người dùng |
| | `POST` | `/api/v1/auth/verify-otp` | Xác minh OTP kích hoạt tài khoản |
| | `POST` | `/api/v1/auth/login` | Đăng nhập nhận JWT Token |
| | `GET` | `/api/v1/auth/me` | Lấy thông tin tài khoản hiện tại |
| | `POST` | `/api/v1/auth/forgot-password` | Yêu cầu mã OTP đặt lại mật khẩu |
| **Sản phẩm** | `GET` | `/api/v1/products` | Danh sách sản phẩm (hỗ trợ lọc, phân trang, sort) |
| | `GET` | `/api/v1/products/:id` | Chi tiết sản phẩm theo ID hoặc Slug |
| | `GET` | `/api/v1/products/featured` | Danh sách sản phẩm nổi bật |
| | `GET` | `/api/v1/products/trending` | Danh sách sản phẩm thịnh hành |
| **Smart Outfit** | `GET` | `/api/v1/outfits` | Danh sách các bộ outfit phối sẵn |
| | `GET` | `/api/v1/outfits/:id` | Chi tiết outfit và danh sách sản phẩm cấu thành |
| **AI Stylist** | `POST` | `/api/v1/ai/recommendation` | AI phân tích & gợi ý set đồ theo dịp/phong cách |
| **Giỏ hàng** | `GET` | `/api/v1/cart` | Lấy giỏ hàng của User hoặc Guest |
| | `POST` | `/api/v1/cart/items` | Thêm sản phẩm vào giỏ hàng |
| | `PATCH` | `/api/v1/cart/items/:lineId` | Cập nhật số lượng sản phẩm trong giỏ |
| | `DELETE` | `/api/v1/cart/items/:lineId` | Xóa sản phẩm khỏi giỏ |
| | `POST` | `/api/v1/cart/merge` | Gộp giỏ hàng khách vào user sau khi đăng nhập |
| **Đơn hàng** | `POST` | `/api/v1/orders` | Đặt hàng mới (tự động giữ kho & trừ kho) |
| | `GET` | `/api/v1/orders` | Danh sách đơn hàng của người dùng |
| | `GET` | `/api/v1/orders/:id` | Chi tiết trạng thái & thông tin đơn hàng |
| **Thanh toán** | `POST` | `/api/v1/payment/vnpay/create-payment-url` | Sinh URL thanh toán VNPay Sandbox |
| | `GET` | `/api/v1/payment/vnpay/vnpay-return` | Xử lý phản hồi kết quả giao dịch từ VNPay |
| **Admin** | `GET/POST/PUT` | `/api/v1/products` *(Admin)* | Thao tác CRUD sản phẩm |
| | `GET/PATCH` | `/api/v1/orders/admin/all` | Quản lý & cập nhật trạng thái đơn hàng |
| | `GET/POST/DELETE`| `/api/v1/coupons` | Quản lý mã giảm giá |

---

## 9. Chạy các kịch bản kiểm thử (Automated Tests)

Trong thư mục `backend/` có sẵn các file kịch bản kiểm thử API tự động mà không cần Postman. Bạn có thể kiểm tra từng phân hệ độc lập:

```bash
cd backend

# 1. Kiểm tra API Sản phẩm
node test_products_api.js

# 2. Kiểm tra API Giỏ hàng & Danh sách yêu thích (User & Guest)
node test_cart_wishlist_api.js

# 3. Kiểm tra API Thanh toán VNPay Sandbox
node test_vnpay_api.js

# 4. Kiểm tra Tạo đơn hàng & Gửi email hóa đơn
node test_order_invoice_email.js

# 5. Kiểm tra toàn bộ API Quản trị Admin
node test_admin_api.js

# 6. Kiểm tra tính đồng bộ dữ liệu Backend
node test_backend_consistency.js
```

---

## 10. Khắc phục sự cố thường gặp (Troubleshooting)

### 1. Lỗi cổng `5001` hoặc `3000` đã bị chiếm dụng (Port already in use)
- **Nguyên nhân**: Một tiến trình node hoặc ứng dụng khác đang chạy trên cổng này.
- **Cách xử lý**:
  - Windows: Mở PowerShell chạy `netstat -ano | findstr :5001` để tìm PID, sau đó chạy `taskkill /PID <PID> /F` để dừng tiến trình. Hoặc đổi `PORT=5002` trong `.env` backend và cập nhật `NEXT_PUBLIC_API_URL` ở frontend.

### 2. Lỗi `PrismaClientInitializationError: Can't reach database server`
- **Nguyên nhân**: Dịch vụ MySQL chưa được bật hoặc thông tin user/password trong `DATABASE_URL` chưa chính xác.
- **Cách xử lý**: Kiểm tra lại MySQL Service trong XAMPP / Services và thử đăng nhập bằng thông tin trong `DATABASE_URL`.

### 3. Lỗi `PrismaClientValidationError` hoặc thiếu thuộc tính Model
- **Cách xử lý**: Mỗi khi thay đổi `schema.prisma`, hãy luôn chạy lệnh `npm run db:generate` trong thư mục `backend` để cập nhật client code.

### 4. Lỗi CORS khi gọi API từ Frontend sang Backend
- **Cách xử lý**: Backend đã cấu hình sẵn cho phép các domain `http://localhost:3000` và `http://127.0.0.1:3000`. Hãy đảm bảo biến `FRONTEND_URL` trong `.env` backend trỏ chính xác về địa chỉ trang web frontend của bạn.

### 5. Lỗi gửi email qua Gmail SMTP (Invalid login / Application-specific password required)
- **Nguyên nhân**: Sử dụng mật khẩu tài khoản Gmail thông thường thay vì Mật khẩu ứng dụng (App Password).
- **Cách xử lý**: Bật xác thực 2 bước (2FA) trên tài khoản Google, vào mục [Mật khẩu ứng dụng](https://myaccount.google.com/apppasswords) tạo một mật khẩu 16 ký tự và dán vào `SMTP_PASS` trong file `.env`.

---

**Routine Web** — Mang đến trải nghiệm mua sắm thời trang tối giản, tinh tế và thông minh! 🚀
