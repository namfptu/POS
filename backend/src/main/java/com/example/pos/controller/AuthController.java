package com.example.pos.controller;

import com.example.pos.dto.*;
import com.example.pos.service.AuthService;
import com.example.pos.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Request OTP để reset password
     * POST /api/auth/forgot-password
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.sendPasswordResetOtp(request.getEmail());
        return ResponseEntity.ok(MessageResponse.of(
            "If your email exists in our system, you will receive an OTP code shortly."
        ));
    }

    /**
     * BƯỚC 2: Verify OTP và nhận reset token
     * POST /api/auth/verify-otp
     * Body: { "email": "user@example.com", "otp": "123456" }
     * Response: { "message": "...", "resetToken": "eyJhbGc..." }
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        String resetToken = passwordResetService.verifyOtp(
            request.getEmail(),
            request.getOtp()
        );
        return ResponseEntity.ok(VerifyOtpResponse.of(
            "OTP verified successfully. Use the reset token to change your password.",
            resetToken
        ));
    }

    /**
     * BƯỚC 3: Reset password với reset token
     * POST /api/auth/reset-password
     * Body: { "resetToken": "eyJhbGc...", "newPassword": "newpass123", "confirmPassword": "newpass123" }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(
            request.getResetToken(),
            request.getNewPassword(),
            request.getConfirmPassword()
        );
        return ResponseEntity.ok(MessageResponse.of("Password has been reset successfully."));
    }

    /**
     * Resend OTP (nếu chưa nhận được hoặc hết hạn)
     * POST /api/auth/resend-otp
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<MessageResponse> resendOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.sendPasswordResetOtp(request.getEmail());
        return ResponseEntity.ok(MessageResponse.of(
            "If your email exists in our system, you will receive a new OTP code shortly."
        ));
    }
}

