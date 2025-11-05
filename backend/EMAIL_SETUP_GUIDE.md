# 📧 Hướng dẫn cấu hình Email Service

## ✅ Đã hoàn thành

Email Service đã được cấu hình để gửi OTP thật qua email!

---

## 🔧 Cấu hình Gmail (KHUYẾN NGHỊ)

### Bước 1: Tạo App Password cho Gmail

1. **Đăng nhập Gmail** của bạn
2. Vào **Google Account Settings**: https://myaccount.google.com/
3. Chọn **Security** (Bảo mật)
4. Bật **2-Step Verification** (Xác minh 2 bước) nếu chưa bật
5. Sau khi bật 2-Step Verification, quay lại **Security**
6. Tìm **App passwords** (Mật khẩu ứng dụng)
7. Click **App passwords**
8. Chọn:
   - **App**: Mail
   - **Device**: Other (Custom name) → Nhập "DreamsPOS"
9. Click **Generate**
10. **Copy** mật khẩu 16 ký tự (dạng: `xxxx xxxx xxxx xxxx`)

### Bước 2: Cấu hình trong application.yml

Có 2 cách:

#### **Cách 1: Sử dụng Environment Variables (BẢO MẬT - KHUYẾN NGHỊ)**

**Windows PowerShell:**
```powershell
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="your-app-password-16-chars"
$env:EMAIL_FROM="DreamsPOS <your-email@gmail.com>"
```

**Windows CMD:**
```cmd
set MAIL_USERNAME=your-email@gmail.com
set MAIL_PASSWORD=your-app-password-16-chars
set EMAIL_FROM=DreamsPOS <your-email@gmail.com>
```

**Linux/Mac:**
```bash
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password-16-chars"
export EMAIL_FROM="DreamsPOS <your-email@gmail.com>"
```

Sau đó run application:
```bash
./mvnw spring-boot:run
```

#### **Cách 2: Sửa trực tiếp application.yml (CHỈ CHO DEV)**

⚠️ **CẢNH BÁO:** Không commit file này lên Git!

Mở `src/main/resources/application.yml` và sửa:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: xxxx xxxx xxxx xxxx  # App password 16 ký tự
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
          connectiontimeout: 5000
          timeout: 5000
          writetimeout: 5000

app:
  email:
    from: DreamsPOS <your-email@gmail.com>
```

**Thay thế:**
- `your-email@gmail.com` → Email Gmail của bạn
- `xxxx xxxx xxxx xxxx` → App password 16 ký tự vừa tạo

---

## 🔧 Cấu hình Email Service khác

### SendGrid

```yaml
spring:
  mail:
    host: smtp.sendgrid.net
    port: 587
    username: apikey
    password: YOUR_SENDGRID_API_KEY
```

### AWS SES

```yaml
spring:
  mail:
    host: email-smtp.us-east-1.amazonaws.com
    port: 587
    username: YOUR_SMTP_USERNAME
    password: YOUR_SMTP_PASSWORD
```

### Outlook/Hotmail

```yaml
spring:
  mail:
    host: smtp-mail.outlook.com
    port: 587
    username: your-email@outlook.com
    password: your-password
```

### Yahoo Mail

```yaml
spring:
  mail:
    host: smtp.mail.yahoo.com
    port: 587
    username: your-email@yahoo.com
    password: your-app-password
```

---

## 🧪 Test Email Service

### Bước 1: Chạy SQL tạo bảng (nếu chưa)

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

### Bước 2: Run application

```bash
./mvnw spring-boot:run
```

### Bước 3: Test với Postman

**1. Request OTP:**
```http
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**2. Kiểm tra email:**
- Mở hộp thư của `john@example.com`
- Tìm email từ DreamsPOS
- Copy OTP 6 số

**3. Verify OTP và reset password:**
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

**4. Test login:**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "newPassword123"
}
```

---

## 🎨 Email Template

Email được gửi với design đẹp theo brand DreamsPOS:

- ✅ Logo DreamsPOS
- ✅ Màu cam gradient (#FF9066 → #FF6B35)
- ✅ OTP code lớn, dễ đọc
- ✅ Warning về thời gian hết hạn
- ✅ Responsive design
- ✅ Professional footer

Preview:
```
┌─────────────────────────────────────┐
│   🎯 DreamsPOS                      │
│   Password Reset Request            │
├─────────────────────────────────────┤
│                                     │
│   Hi John Doe,                      │
│                                     │
│   You requested to reset your       │
│   password. Please use the OTP      │
│   code below:                       │
│                                     │
│   ┌───────────────────────────┐    │
│   │   Your OTP Code           │    │
│   │                           │    │
│   │      1 2 3 4 5 6          │    │
│   └───────────────────────────┘    │
│                                     │
│   ⏰ This OTP will expire in        │
│      5 minutes.                     │
│                                     │
│   If you didn't request this,       │
│   please ignore this email.         │
│                                     │
├─────────────────────────────────────┤
│   Copyrights © 2025 - DreamsPOS    │
└─────────────────────────────────────┘
```

---

## 🔒 Security Best Practices

### ✅ Đã implement:

1. **App Password** - Không dùng password Gmail thật
2. **Environment Variables** - Không hardcode credentials
3. **TLS/STARTTLS** - Mã hóa kết nối SMTP
4. **Timeout configuration** - Tránh hang khi gửi email
5. **Error handling** - Log lỗi nhưng không expose details
6. **HTML sanitization** - Template an toàn

### ⚠️ Lưu ý:

1. **KHÔNG commit** credentials vào Git
2. **Thêm vào .gitignore:**
   ```
   application-local.yml
   .env
   ```
3. **Production:** Dùng environment variables hoặc secret management
4. **Rate limiting:** Giới hạn số email gửi (implement sau)

---

## 🐛 Troubleshooting

### Lỗi: "Authentication failed"

**Nguyên nhân:** Sai username/password hoặc chưa bật App Password

**Giải pháp:**
1. Kiểm tra lại email và app password
2. Đảm bảo đã bật 2-Step Verification
3. Tạo lại App Password

### Lỗi: "Could not connect to SMTP host"

**Nguyên nhân:** Firewall hoặc network issue

**Giải pháp:**
1. Kiểm tra internet connection
2. Thử đổi port: 587 → 465 (SSL)
3. Tắt firewall/antivirus tạm thời để test

### Lỗi: "Timed out"

**Nguyên nhân:** SMTP server chậm

**Giải pháp:**
1. Tăng timeout trong application.yml:
   ```yaml
   connectiontimeout: 10000
   timeout: 10000
   writetimeout: 10000
   ```

### Email vào Spam

**Giải pháp:**
1. Thêm SPF record cho domain
2. Dùng email service chuyên nghiệp (SendGrid, AWS SES)
3. Verify domain với email provider

---

## 📊 Monitoring

### Check logs

Khi gửi email thành công:
```
📧 SENDING PASSWORD RESET OTP EMAIL
To: john@example.com
Subject: Password Reset OTP
OTP: 123456
✅ Email sent successfully to: john@example.com
```

Khi gửi email thất bại:
```
❌ Failed to send email to: john@example.com
```

---

## 🚀 Next Steps

### Nâng cấp (Optional):

1. **Email Queue** - Gửi email async với RabbitMQ/Kafka
2. **Email Templates** - Dùng Thymeleaf cho templates phức tạp
3. **Email Tracking** - Track email opened/clicked
4. **Multiple Languages** - Support i18n
5. **Email Verification** - Verify email khi register
6. **Rate Limiting** - Giới hạn số email/user/hour

---

## ✅ Checklist

- [x] Thêm dependency `spring-boot-starter-mail`
- [x] Cấu hình SMTP trong application.yml
- [x] Update EmailService để gửi email thật
- [x] Tạo HTML email template đẹp
- [x] Error handling
- [ ] **TODO: Tạo Gmail App Password**
- [ ] **TODO: Cấu hình environment variables**
- [ ] **TODO: Test gửi email thật**

---

## 📚 Resources

- [Spring Boot Mail Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/io.html#io.email)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [JavaMail API](https://javaee.github.io/javamail/)

---

Chúc bạn cấu hình thành công! 🎉

