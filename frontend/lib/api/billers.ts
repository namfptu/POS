import { api } from "./axios-instance";

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

export const getBillers = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "active" | "inactive";
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

export const createBiller = async (biller: Omit<Biller, 'id' | 'createdAt' | 'code'> & { email: string; companyName: string | null; imageUrl?: string | null; status: "active" | "inactive"; }) => {
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