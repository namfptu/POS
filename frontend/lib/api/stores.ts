import { api } from "./axios-instance";

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
  phone: string | null;
  address: string;
  city: string;
  country: string;
  warehouseId: number;
  userId: number;
}

export interface UpdateStorePayload extends Partial<Omit<Store, 'id' | 'code' | 'userName' | 'totalProducts' | 'totalStock' | 'createdAt' | 'updatedAt' | 'warehouseName'>> {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string;
  city?: string;
  country?: string;
  warehouseId?: number;
  userId?: number;
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