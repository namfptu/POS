import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or invalidity
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid or expired, log out the user
      console.error("Authentication error: Invalid or expired token. Logging out...");
      // This assumes you have a way to access the logout function from AuthContext
      // For now, we will just clear localStorage and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

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

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  status: "active" | "inactive"; // Updated to match backend response
  imageUrl: string | null; // Added imageUrl field
  createdAt: string; // Assuming createdAt is a string date
}

export interface CustomerListResponse {
  customers: Customer[]; // Updated from 'content' to 'customers'
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getCustomers = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    // In a real application, you might get the token from an AuthContext or localStorage
    // api.defaults.headers.common['Authorization'] = `Bearer YOUR_AUTH_TOKEN`;
    const response = await api.get<CustomerListResponse>('/customers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};