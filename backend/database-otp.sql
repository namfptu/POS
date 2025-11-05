-- Bảng lưu OTP cho forgot password
CREATE TABLE password_reset_otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT FALSE
);

-- Index để tăng tốc độ query
CREATE INDEX idx_otp_user_id ON password_reset_otps(user_id);
CREATE INDEX idx_otp_expires_at ON password_reset_otps(expires_at);
CREATE INDEX idx_otp_is_used ON password_reset_otps(is_used);

-- Tự động xóa OTP đã hết hạn (optional - có thể chạy định kỳ)
-- DELETE FROM password_reset_otps WHERE expires_at < NOW();

