# Test Forgot Password Flow với OTP

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST FORGOT PASSWORD WITH OTP" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api/auth"
$testEmail = "john@example.com"

# Step 1: Request OTP
Write-Host "📧 STEP 1: Request OTP for password reset..." -ForegroundColor Yellow
Write-Host "   Email: $testEmail" -ForegroundColor White

$forgotPasswordBody = @{
    email = $testEmail
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/forgot-password" `
        -Method Post `
        -ContentType "application/json" `
        -Body $forgotPasswordBody
    
    Write-Host "   ✅ Request successful!" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor White
    Write-Host "" -ForegroundColor White
    Write-Host "   ⚠️  CHECK CONSOLE LOG để lấy OTP!" -ForegroundColor Yellow
    Write-Host "   (Vì đang dùng mock email service)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Nhập OTP
Write-Host "🔐 STEP 2: Enter OTP from console log..." -ForegroundColor Yellow
$otp = Read-Host "   Enter OTP (6 digits)"

if ($otp -notmatch '^\d{6}$') {
    Write-Host "   ❌ Invalid OTP format! Must be 6 digits." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Nhập password mới
Write-Host "🔑 STEP 3: Enter new password..." -ForegroundColor Yellow
$newPassword = Read-Host "   Enter new password (min 6 characters)" -AsSecureString
$newPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword)
)

if ($newPasswordPlain.Length -lt 6) {
    Write-Host "   ❌ Password must be at least 6 characters!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Verify OTP và reset password
Write-Host "✅ STEP 4: Verify OTP and reset password..." -ForegroundColor Yellow

$verifyBody = @{
    email = $testEmail
    otp = $otp
    newPassword = $newPasswordPlain
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/verify-otp-reset" `
        -Method Post `
        -ContentType "application/json" `
        -Body $verifyBody
    
    Write-Host "   ✅ Password reset successful!" -ForegroundColor Green
    Write-Host "   Message: $($response.message)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Parse error response
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   Details: $($errorObj.message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""

# Step 5: Test login với password mới
Write-Host "🔓 STEP 5: Test login with new password..." -ForegroundColor Yellow

$loginBody = @{
    email = $testEmail
    password = $newPasswordPlain
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "   ✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.user.name) ($($loginResponse.user.email))" -ForegroundColor White
    Write-Host "   Token: $($loginResponse.accessToken.Substring(0, 50))..." -ForegroundColor White
} catch {
    Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ FORGOT PASSWORD FLOW COMPLETED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📊 SUMMARY:" -ForegroundColor Cyan
Write-Host "   • Email: $testEmail" -ForegroundColor White
Write-Host "   • OTP verified: ✅" -ForegroundColor Green
Write-Host "   • Password reset: ✅" -ForegroundColor Green
Write-Host "   • Login with new password: ✅" -ForegroundColor Green
Write-Host ""

