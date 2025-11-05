package com.example.pos.service;

import com.example.pos.entity.PasswordResetOtp;
import com.example.pos.entity.User;
import com.example.pos.exception.BadRequestException;
import com.example.pos.repository.PasswordResetOtpRepository;
import com.example.pos.repository.UserRepository;
import com.example.pos.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRATION_MINUTES = 5;
    private static final SecureRandom random = new SecureRandom();

    /**
     * Tạo và gửi OTP cho forgot password
     * Security: Không tiết lộ email có tồn tại hay không
     */
    @Transactional
    public void sendPasswordResetOtp(String email) {
        log.info("Password reset OTP requested for email: {}", email);

        Optional<User> userOptional = userRepository.findByEmail(email);

        // Security: Luôn trả về success, không tiết lộ email có tồn tại hay không
        if (userOptional.isEmpty()) {
            log.warn("Password reset requested for non-existent email: {}", email);
            // Không throw exception, chỉ log và return
            return;
        }

        User user = userOptional.get();

        // Xóa tất cả OTP cũ của user này
        otpRepository.deleteByUser(user);

        // Tạo OTP mới
        String otp = generateOtp();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        PasswordResetOtp resetOtp = PasswordResetOtp.builder()
                .user(user)
                .otp(otp)
                .expiresAt(expiresAt)
                .isUsed(false)
                .build();

        otpRepository.save(resetOtp);

        // Gửi OTP qua email
        emailService.sendPasswordResetOtp(user.getEmail(), user.getName(), otp);

        log.info("✅ OTP created and sent successfully for user: {}", user.getEmail());
    }

    /**
     * Verify OTP và trả về reset token
     * BƯỚC 2: Sau khi nhập OTP đúng, trả về temporary token
     */
    @Transactional
    public String verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);

        // Tìm user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or OTP"));

        // Tìm OTP hợp lệ
        PasswordResetOtp resetOtp = otpRepository.findValidOtp(user, otp, LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));

        // Kiểm tra OTP đã được sử dụng chưa
        if (resetOtp.getIsUsed()) {
            throw new BadRequestException("OTP has already been used");
        }

        // Kiểm tra OTP đã hết hạn chưa
        if (resetOtp.isExpired()) {
            throw new BadRequestException("OTP has expired");
        }

        // Đánh dấu OTP đã sử dụng
        resetOtp.setIsUsed(true);
        otpRepository.save(resetOtp);

        // Tạo temporary reset token (15 phút)
        String resetToken = jwtTokenProvider.generatePasswordResetToken(user.getId(), user.getEmail());

        log.info("✅ OTP verified successfully for user: {}", user.getEmail());

        return resetToken;
    }

    /**
     * Reset password với reset token
     * BƯỚC 3: Sau khi có reset token, đổi password
     */
    @Transactional
    public void resetPassword(String resetToken, String newPassword, String confirmPassword) {
        log.info("Resetting password with reset token");

        // Validate password match
        if (!newPassword.equals(confirmPassword)) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        // Validate reset token và lấy userId
        Integer userId = jwtTokenProvider.validatePasswordResetToken(resetToken);

        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("✅ Password reset successfully for user: {}", user.getEmail());
    }

    /**
     * Tạo OTP 6 số ngẫu nhiên
     */
    private String generateOtp() {
        int otp = random.nextInt(900000) + 100000; // Tạo số từ 100000 đến 999999
        return String.valueOf(otp);
    }

    /**
     * Xóa các OTP đã hết hạn (có thể chạy định kỳ với @Scheduled)
     */
    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
        log.info("Cleaned up expired OTPs");
    }
}

