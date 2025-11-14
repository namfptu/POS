import { api } from "./axios-instance";

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
  }  catch (error) {
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