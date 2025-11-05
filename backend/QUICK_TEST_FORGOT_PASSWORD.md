# ⚡ Quick Test - Forgot Password với OTP

## 🚀 3 Bước để test ngay

### BƯỚC 1: Tạo bảng trong database

Mở **pgAdmin** → database `pos` → Query Tool → Chạy SQL:

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

### BƯỚC 2: Run application

```bash
./mvnw spring-boot:run
```

### BƯỚC 3: Test với Postman

**1. Request OTP:**
```http
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**2. Lấy OTP từ console log:**
```
🔐 OTP: 123456
```

**3. Reset password:**
```http
POST http://localhost:8080/api/auth/verify-otp-reset
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
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

## 🎯 Hoặc dùng PowerShell Script

```powershell
powershell -File test-forgot-password.ps1
```

Script sẽ hướng dẫn từng bước!

---

## 📋 Tính năng

✅ OTP 6 số ngẫu nhiên  
✅ Hết hạn sau 5 phút  
✅ Chỉ dùng 1 lần  
✅ Gửi qua email (hiện tại: log console)  
✅ Security: không tiết lộ email tồn tại  

---

Xem chi tiết: **FORGOT_PASSWORD_SETUP.md**

