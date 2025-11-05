# 🔐 Hướng dẫn Setup Forgot Password với OTP

## ✅ Đã hoàn thành

Chức năng **Forgot Password với OTP qua Email** đã được implement hoàn chỉnh!

---

## 📋 Luồng hoạt động

```
1. User nhập email → Request OTP
2. System tạo OTP 6 số ngẫu nhiên
3. System lưu OTP vào database (expires sau 5 phút)
4. System gửi OTP qua email (hiện tại: log ra console)
5. User nhập OTP + password mới
6. System verify OTP (đúng? còn hạn? chưa dùng?)
7. System cập nhật password mới
8. System đánh dấu OTP đã sử dụng
9. User có thể login với password mới
```

---

## 🗄️ BƯỚC 1: Tạo bảng trong Database

### Cách 1: Sử dụng pgAdmin (KHUYẾN NGHỊ)

1. Mở **pgAdmin**
2. Kết nối đến PostgreSQL server
3. Chọn database **pos**
4. Click **Tools → Query Tool**
5. Copy nội dung file `database-otp.sql` và paste vào
6. Click **Execute (F5)**

### Cách 2: Sử dụng psql

```bash
psql -U postgres -d pos -f database-otp.sql
```

### Cách 3: Copy-paste SQL

```sql
CREATE TABLE password_reset_otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_otp_user_id ON password_reset_otps(user_id);
CREATE INDEX idx_otp_expires_at ON password_reset_otps(expires_at);
CREATE INDEX idx_otp_is_used ON password_reset_otps(is_used);
```

### Verify bảng đã tạo thành công

```sql
SELECT * FROM password_reset_otps;
```

---

## 🚀 BƯỚC 2: Build và Run Application

```bash
# Build
./mvnw clean install

# Run
./mvnw spring-boot:run
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

---

## 🧪 BƯỚC 3: Test chức năng

### Option 1: Sử dụng PowerShell Script (Interactive)

```powershell
powershell -File test-forgot-password.ps1
```

Script sẽ hướng dẫn bạn từng bước:
1. Request OTP
2. Nhập OTP từ console log
3. Nhập password mới
4. Verify và reset
5. Test login với password mới

### Option 2: Sử dụng HTTP File (VS Code REST Client)

Mở file `test-forgot-password.http` trong VS Code và click **Send Request**

### Option 3: Sử dụng Postman/curl

**Step 1: Request OTP**
```bash
curl -X POST http://localhost:8080/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

Response:
```json
{
  "message": "If your email exists in our system, you will receive an OTP code shortly."
}
```

**Kiểm tra console log để lấy OTP:**
```
================================================================================
📧 SENDING PASSWORD RESET OTP EMAIL
================================================================================
To: john@example.com
Subject: Password Reset OTP
--------------------------------------------------------------------------------
Hi John Doe,

You requested to reset your password. Your OTP code is:

    🔐 OTP: 123456

This OTP will expire in 5 minutes.
================================================================================
```

**Step 2: Verify OTP và Reset Password**
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "otp":"123456",
    "newPassword":"newPassword123"
  }'
```

Response:
```json
{
  "message": "Password has been reset successfully."
}
```

**Step 3: Test Login với password mới**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"newPassword123"
  }'
```

---

## 📡 API Endpoints

### 1. Request OTP

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "message": "If your email exists in our system, you will receive an OTP code shortly."
}
```

**Note:** Luôn trả về success message dù email có tồn tại hay không (security best practice)

---

### 2. Verify OTP và Reset Password

```http
POST /api/auth/verify-otp-reset
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

**Response (Success):**
```json
{
  "message": "Password has been reset successfully."
}
```

**Response (Error - Invalid OTP):**
```json
{
  "message": "Invalid or expired OTP"
}
```

**Response (Error - OTP đã sử dụng):**
```json
{
  "message": "OTP has already been used"
}
```

---

## 🔒 Security Features

### 1. Không tiết lộ email tồn tại
- Endpoint `/forgot-password` luôn trả về success
- Không cho attacker biết email nào có trong hệ thống

### 2. OTP có thời hạn
- OTP hết hạn sau **5 phút**
- Không thể sử dụng OTP đã hết hạn

### 3. OTP chỉ dùng 1 lần
- Sau khi reset password thành công, OTP bị đánh dấu `is_used = true`
- Không thể sử dụng lại OTP đã dùng

### 4. OTP ngẫu nhiên
- Sử dụng `SecureRandom` để tạo OTP
- OTP 6 số (100000 - 999999)

### 5. Xóa OTP cũ
- Khi request OTP mới, tất cả OTP cũ của user bị xóa
- Chỉ có 1 OTP active tại một thời điểm

### 6. Password validation
- Password mới phải ít nhất 6 ký tự
- Được hash với BCrypt trước khi lưu

---

## 📧 Email Service

### Hiện tại: Mock Email Service

Email service hiện tại chỉ **log OTP ra console** thay vì gửi email thật.

**Ưu điểm:**
- Dễ test, không cần cấu hình SMTP
- Không tốn chi phí email service
- Phù hợp cho development

**Nhược điểm:**
- Không gửi email thật
- Phải copy OTP từ console log

### Nâng cấp lên Real Email Service

Để gửi email thật, làm theo các bước sau:

#### 1. Thêm dependency (đã có sẵn trong hướng dẫn)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

#### 2. Cấu hình SMTP trong `application.yml`

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password  # Không phải password Gmail thường!
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

**Lưu ý với Gmail:**
- Phải tạo **App Password** (không dùng password Gmail thường)
- Vào: Google Account → Security → 2-Step Verification → App passwords
- Tạo app password mới cho ứng dụng

#### 3. Uncomment code trong `EmailService.java`

Mở file `EmailService.java` và uncomment phần code gửi email thật (đã có sẵn trong TODO)

---

## 🧪 Test Cases

### ✅ Happy Path
1. Request OTP với email hợp lệ → Success
2. Nhập OTP đúng + password mới → Success
3. Login với password mới → Success

### ❌ Error Cases
1. **Email không tồn tại** → Vẫn trả về success (security)
2. **OTP sai** → Error: "Invalid or expired OTP"
3. **OTP hết hạn** (sau 5 phút) → Error: "Invalid or expired OTP"
4. **OTP đã sử dụng** → Error: "OTP has already been used"
5. **Password quá ngắn** → Error: "Password must be at least 6 characters"
6. **Email format sai** → Error: "Email should be valid"

---

## 📁 Files đã tạo

```
backend/
├── database-otp.sql                                    # SQL tạo bảng
├── src/main/java/com/example/pos/
│   ├── entity/
│   │   └── PasswordResetOtp.java                      # Entity
│   ├── repository/
│   │   └── PasswordResetOtpRepository.java            # Repository
│   ├── dto/
│   │   ├── ForgotPasswordRequest.java                 # DTO
│   │   ├── VerifyOtpResetPasswordRequest.java         # DTO
│   │   └── MessageResponse.java                       # DTO
│   ├── service/
│   │   ├── EmailService.java                          # Email service (mock)
│   │   └── PasswordResetService.java                  # Business logic
│   └── controller/
│       └── AuthController.java                        # Updated (2 endpoints mới)
├── test-forgot-password.http                          # HTTP test file
├── test-forgot-password.ps1                           # PowerShell test script
└── FORGOT_PASSWORD_SETUP.md                           # This file
```

---

## 🎯 Cấu hình

### OTP Settings

Có thể thay đổi trong `PasswordResetService.java`:

```java
private static final int OTP_LENGTH = 6;              // Độ dài OTP
private static final int OTP_EXPIRATION_MINUTES = 5;  // Thời gian hết hạn
```

### Email Template

Có thể customize email template trong `EmailService.java` → method `buildEmailTemplate()`

---

## 🔄 Cleanup OTP hết hạn (Optional)

Để tự động xóa OTP đã hết hạn, thêm scheduled task:

```java
@Scheduled(cron = "0 0 * * * *")  // Chạy mỗi giờ
public void cleanupExpiredOtps() {
    passwordResetService.cleanupExpiredOtps();
}
```

Cần enable scheduling trong `PosApplication.java`:

```java
@EnableScheduling
@SpringBootApplication
public class PosApplication {
    // ...
}
```

---

## ✅ Checklist

- [x] Tạo bảng `password_reset_otps` trong database
- [x] Tạo Entity `PasswordResetOtp`
- [x] Tạo Repository `PasswordResetOtpRepository`
- [x] Tạo DTOs (ForgotPasswordRequest, VerifyOtpResetPasswordRequest, MessageResponse)
- [x] Tạo `EmailService` (mock version)
- [x] Tạo `PasswordResetService` với business logic
- [x] Thêm 2 endpoints vào `AuthController`
- [x] Security config đã cho phép public access
- [x] Tạo test files (HTTP, PowerShell)
- [ ] **TODO: Chạy SQL để tạo bảng**
- [ ] **TODO: Test chức năng**
- [ ] **TODO (Optional): Setup real email service**

---

## 🎉 Kết luận

Chức năng **Forgot Password với OTP** đã sẵn sàng!

**Để bắt đầu:**
1. Chạy SQL tạo bảng (BƯỚC 1)
2. Run application
3. Test với script hoặc Postman

**Hiện tại:** OTP được log ra console  
**Sau này:** Có thể nâng cấp lên gửi email thật

Chúc bạn test thành công! 🚀

