import { api } from "./axios-instance";

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
