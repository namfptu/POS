# ⚡ Quick Start - Forgot Password (UPDATED)

## 🚀 3 Bước để chạy ngay

### BƯỚC 1: Tạo bảng trong database

Mở **pgAdmin** → database `pos` → Query Tool → Execute:

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

---

### BƯỚC 2: Cấu hình Email (Gmail)

#### 2.1. Tạo App Password

1. Vào: https://myaccount.google.com/
2. **Security** → **2-Step Verification** (bật nếu chưa)
3. **App passwords** → Tạo mới cho "DreamsPOS"
4. Copy password 16 ký tự (dạng: `xxxx xxxx xxxx xxxx`)

#### 2.2. Set Environment Variables

**PowerShell:**
```powershell
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="xxxx xxxx xxxx xxxx"
$env:EMAIL_FROM="DreamsPOS <your-email@gmail.com>"
```

**Thay thế:**
- `your-email@gmail.com` → Email Gmail của bạn
- `xxxx xxxx xxxx xxxx` → App password vừa tạo

---

### BƯỚC 3: Run Application

```bash
./mvnw spring-boot:run
```

---

## 🧪 Test với Postman

### 1️⃣ Request OTP
```http
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**→ Kiểm tra email để lấy OTP**

---

### 2️⃣ (Optional) Resend OTP
```http
POST http://localhost:8080/api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

---

### 3️⃣ Verify OTP và Reset Password
```http
POST http://localhost:8080/api/auth/verify-otp-reset
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

---

### 4️⃣ Test Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "newPassword123"
}
```

---

## ✅ Tính năng

| Feature | Status |
|---------|--------|
| Request OTP | ✅ |
| Resend OTP | ✅ |
| Verify OTP | ✅ |
| Reset Password | ✅ |
| Confirm Password | ✅ |
| Email thật (HTML) | ✅ |
| OTP hết hạn 5 phút | ✅ |
| OTP chỉ dùng 1 lần | ✅ |

---

## 📧 Email Template

Email gửi đi sẽ có:
- ✅ Logo DreamsPOS
- ✅ Màu cam gradient đẹp
- ✅ OTP code lớn, dễ đọc
- ✅ Warning về thời gian hết hạn
- ✅ Professional design

---

## 🐛 Troubleshooting

### Email không gửi được?

1. **Kiểm tra App Password:**
   - Đã bật 2-Step Verification chưa?
   - App Password có đúng 16 ký tự không?

2. **Kiểm tra Environment Variables:**
   ```powershell
   echo $env:MAIL_USERNAME
   echo $env:MAIL_PASSWORD
   ```

3. **Xem logs:**
   - Tìm dòng: `✅ Email sent successfully to: ...`
   - Hoặc: `❌ Failed to send email to: ...`

### Email vào Spam?

- Đánh dấu "Not Spam" trong Gmail
- Hoặc dùng email service chuyên nghiệp (SendGrid, AWS SES)

---

## 📚 Chi tiết

- **Setup Email:** `EMAIL_SETUP_GUIDE.md`
- **Full Documentation:** `FORGOT_PASSWORD_FINAL.md`
- **Test Cases:** `test-forgot-password.http`

---

## 🎯 API Endpoints

```
POST /api/auth/forgot-password      → Request OTP
POST /api/auth/resend-otp           → Resend OTP
POST /api/auth/verify-otp-reset     → Verify OTP + Reset Password
```

---

Chúc bạn test thành công! 🎉

