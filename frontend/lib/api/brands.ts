import { api } from "./axios-instance";

export interface Brand {
  id: number;
  name: string;
  imageUrl: string | null;
  createdAt: string;
  status: "active" | "inactive";
}

export interface BrandListResponse {
  brands: Brand[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateBrandPayload extends Omit<Brand, 'id' | 'createdAt' | 'status'> {
  name: string;
  imageUrl: string | null;
}

export interface UpdateBrandPayload extends Partial<CreateBrandPayload> {
  status?: "active" | "inactive";
}

export const getBrands = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<BrandListResponse>('/brands', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getBrandById = async (id: number) => {
  try {
    const response = await api.get<Brand>(`/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching brand with ID ${id}:`, error);
    throw error;
  }
};

export const createBrand = async (brand: CreateBrandPayload) => {
  try {
    const response = await api.post<Brand>('/brands', brand);
    return response.data;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

export const updateBrand = async (id: number, brand: UpdateBrandPayload) => {
  try {
    const response = await api.put<Brand>(`/brands/${id}`, brand);
    return response.data;
  } catch (error) {
    console.error(`Error updating brand with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBrand = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting brand with ID ${id}:`, error);
    throw error;
  }
};