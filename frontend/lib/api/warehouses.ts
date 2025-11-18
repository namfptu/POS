import { api } from "./axios-instance";

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
  status?: "active" | "inactive" | "deleted"; // Added "DELETED" status
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

export const createWarehouse = async (warehouse: Omit<Warehouse, 'id' | 'code' | 'totalProducts' | 'stock' | 'qty' | 'createdOn' | 'managingUserName'> & { name: string; contactPerson?: string | null; phone?: string | null; userId: number; status: "active" | "inactive" | "deleted"; imageUrl?: string | null; }) => {
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
  status?: "active" | "inactive" | "deleted";
  imageUrl?: string | null;
}

export const updateWarehouse = async (id: number, warehouse: UpdateWarehousePayload) => {
  try {
    const response = await api.put<Warehouse>(`/warehouses/${id}`, warehouse);
    return response.data;
  } catch (error) {
    console.error(`Error updating warehouse with ID ${id}:`, error);
    throw error;
  }
};

export const deleteWarehouse = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/warehouses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting warehouse with ID ${id}:`, error);
    throw error;
  }
};