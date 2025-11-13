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
  first: boolean; // Added first property
  last: boolean;
}

export interface Biller {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  companyName: string | null; // Added for Biller
  status: "active" | "inactive";
  imageUrl: string | null;
  createdAt: string;
}

export interface BillerListResponse {
  billers: Biller[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
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

export const getCustomerById = async (id: string) => {
  try {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    throw error;
  }
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
  try {
    const response = await api.post<Customer>('/customers', customer);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string | null;
  country?: string | null;
  status?: "active" | "inactive";
  imageUrl?: string | null;
}

export const updateCustomer = async (id: string, customer: UpdateCustomerPayload) => {
  try {
    const response = await api.put<Customer>(`/users/${id}`, customer); // Change endpoint to /users/{id}
    return response.data;
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error);
    throw error;
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer with ID ${id}:`, error);
    throw error;
  }
};

// Generic user deletion function
export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

// Biller API functions
export const getBillers = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<BillerListResponse>('/billers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching billers:', error);
    throw error;
  }
};

export const getBillerById = async (id: string) => {
  try {
    const response = await api.get<Biller>(`/billers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching biller with ID ${id}:`, error);
    throw error;
  }
};

export const createBiller = async (biller: Omit<Biller, 'id' | 'createdAt' | 'code'> & { email: string; companyName: string | null; imageUrl?: string | null; }) => {
  try {
    const response = await api.post<Biller>('/billers', biller);
    return response.data;
  } catch (error) {
    console.error('Error creating biller:', error);
    throw error;
  }
};

export interface UpdateBillerPayload {
  name?: string;
  phone?: string | null;
  country?: string | null;
  companyName?: string | null;
  status?: "active" | "inactive";
  imageUrl?: string | null;
}

export const updateBiller = async (id: string, biller: UpdateBillerPayload) => {
  try {
    const response = await api.put<Biller>(`/users/${id}`, biller); // Assuming /users/{id} for biller update as well
    return response.data;
  } catch (error) {
    console.error(`Error updating biller with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBiller = async (id: string) => {
  try {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting biller with ID ${id}:`, error);
    throw error;
  }
};

export interface Supplier {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  status: "active" | "inactive";
  imageUrl: string | null;
  createdAt: string;
}

export interface SupplierListResponse {
  suppliers: Supplier[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const getSuppliers = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<SupplierListResponse>('/suppliers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const getSupplierById = async (id: string) => {
  try {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching supplier with ID ${id}:`, error);
    throw error;
  }
};

export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'code'> & { email: string; imageUrl?: string | null; }) => {
  try {
    const response = await api.post<Supplier>('/suppliers', supplier);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

export interface UpdateSupplierPayload {
  name?: string;
  phone?: string | null;
  country?: string | null;
  status?: "active" | "inactive";
  imageUrl?: string | null;
}

export const updateSupplier = async (id: string, supplier: UpdateSupplierPayload) => {
  try {
    const response = await api.put<Supplier>(`/users/${id}`, supplier); // Assuming /users/{id} for supplier update as well
    return response.data;
  } catch (error) {
    console.error(`Error updating supplier with ID ${id}:`, error);
    throw error;
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting supplier with ID ${id}:`, error);
    throw error;
  }
};

export interface Warehouse {
  id: number; // Changed to number
  code: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  totalProducts: number;
  stock: number;
  qty: number;
  status: "active" | "inactive" | "deleted"; // Added "deleted" status
  imageUrl: string | null; // Keep imageUrl for consistency, though not in backend response for now
  createdOn: string; // Changed from createdAt to createdOn
  userId: number; // Added userId
  managingUserName: string; // Added managingUserName
}

export interface WarehouseListResponse {
  warehouses: Warehouse[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const getWarehouses = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "DELETED"; // Added "DELETED" status
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<WarehouseListResponse>('/warehouses', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    throw error;
  }
};

export const getWarehouseById = async (id: number) => {
  try {
    const response = await api.get<Warehouse>(`/warehouses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching warehouse with ID ${id}:`, error);
    throw error;
  }
};

export const createWarehouse = async (warehouse: Omit<Warehouse, 'id' | 'code' | 'totalProducts' | 'stock' | 'qty' | 'createdOn' | 'status' | 'managingUserName' | 'imageUrl'> & { name: string; contactPerson?: string | null; phone?: string | null; userId: number; }) => {
  try {
    const response = await api.post<Warehouse>('/warehouses', warehouse);
    return response.data;
  } catch (error) {
    console.error('Error creating warehouse:', error);
    throw error;
  }
};

export interface UpdateWarehousePayload {
  name?: string;
  contactPerson?: string | null;
  phone?: string | null;
  userId?: number; // Added userId
}

export const updateWarehouse = async (id: number, warehouse: UpdateWarehousePayload) => {
  try {
    const response = await api.put<Warehouse>(`/warehouses/${id}`, warehouse); // Changed endpoint and payload type
    return response.data;
  } catch (error) {
    console.error(`Error updating warehouse with ID ${id}:`, error);
    throw error;
  }
};

export const deleteWarehouse = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/warehouses/${id}`); // Changed endpoint
    return response.data;
  } catch (error) {
    console.error(`Error deleting warehouse with ID ${id}:`, error);
    throw error;
  }
};

export interface Store {
  id: number;
  code: string | null; // Added code
  name: string;
  userName: string; // Keep userName from API response
  email: string;
  phone: string | null;
  address: string; // Added address
  city: string; // Added city
  country: string; // Added country
  warehouseId: number; // Added warehouseId
  warehouseName: string; // Added warehouseName
  userId: number; // Added userId
  totalProducts: number; // Added totalProducts
  totalStock: number; // Added totalStock
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string; // Added updatedAt
}

export interface StoreListResponse {
  stores: Store[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateStorePayload extends Omit<Store, 'id' | 'code' | 'userName' | 'totalProducts' | 'totalStock' | 'status' | 'createdAt' | 'updatedAt' | 'warehouseName'> {
  name: string;
  email: string;
  phone?: string | null;
  address: string;
  city: string;
  country: string;
  warehouseId: number;
  userId: number;
}

export interface UpdateStorePayload extends Partial<CreateStorePayload> {
  status?: "active" | "inactive";
}

export const getStores = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<StoreListResponse>('/stores', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

export const getStoreById = async (id: number) => {
  try {
    const response = await api.get<Store>(`/stores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching store with ID ${id}:`, error);
    throw error;
  }
};

export const createStore = async (store: CreateStorePayload) => {
  try {
    const response = await api.post<Store>('/stores', store);
    return response.data;
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};

export const updateStore = async (id: number, store: UpdateStorePayload) => {
  try {
    const response = await api.put<Store>(`/stores/${id}`, store);
    return response.data;
  } catch (error) {
    console.error(`Error updating store with ID ${id}:`, error);
    throw error;
  }
};

export const deleteStore = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/stores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting store with ID ${id}:`, error);
    throw error;
  }
};