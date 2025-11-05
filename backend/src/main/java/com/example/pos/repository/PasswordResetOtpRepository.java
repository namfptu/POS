package com.example.pos.repository;

import com.example.pos.entity.PasswordResetOtp;
import com.example.pos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Integer> {

    // Tìm OTP theo user và OTP code
    Optional<PasswordResetOtp> findByUserAndOtp(User user, String otp);

    // Tìm OTP hợp lệ (chưa dùng, chưa hết hạn)
    @Query("SELECT o FROM PasswordResetOtp o WHERE o.user = ?1 AND o.otp = ?2 AND o.isUsed = false AND o.expiresAt > ?3")
    Optional<PasswordResetOtp> findValidOtp(User user, String otp, LocalDateTime now);

    // Xóa tất cả OTP cũ của user (khi tạo OTP mới)
    @Modifying
    @Query("DELETE FROM PasswordResetOtp o WHERE o.user = ?1")
    void deleteByUser(User user);

    // Xóa OTP đã hết hạn (có thể chạy định kỳ)
    @Modifying
    @Query("DELETE FROM PasswordResetOtp o WHERE o.expiresAt < ?1")
    void deleteExpiredOtps(LocalDateTime now);
}

