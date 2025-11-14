import { api } from "./axios-instance";

// Hàm gọi API để đăng ký người dùng mới
export const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    const response = await api.post<{
      message: string;
      accessToken: string; // Changed from 'token' to 'accessToken'
      user: { id: string; name: string; email: string; role: string };
    }>('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Hàm gọi API để đăng nhập
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post<{
      message: string;
      accessToken: string; // Changed from 'token' to 'accessToken'
      user: { id: string; name: string; email: string; role: string; companyName: string | null; emailVerified: boolean; imageUrl: string | null; phone: string | null; provider: string; status: string; createdAt: string; updatedAt: string };
    }>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Hàm gọi API để yêu cầu đặt lại mật khẩu (quên mật khẩu)
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error during forgot password request:', error);
    throw error;
  }
};

// Hàm gọi API để xác thực mã OTP
export const verifyOtp = async (credentials: { email: string; otp: string }) => {
  try {
    const response = await api.post('/auth/verify-otp', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during OTP verification:', error);
    throw error;
  }
};

// Hàm gọi API để đặt lại mật khẩu
export const resetPassword = async (credentials: { resetToken: string; newPassword: string; confirmPassword: string }) => {
  try {
    const response = await api.post('/auth/reset-password', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during password reset:', error);
    throw error;
  }
};
