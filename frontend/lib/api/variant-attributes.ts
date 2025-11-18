import { api } from "./axios-instance";

export interface VariantAttribute {
  id: number;
  name: string;
  values: string[];
  imageUrl: string | null;
  createdAt: string;
  status: "active" | "inactive";
}

export interface VariantAttributeListResponse {
  variantAttributes: VariantAttribute[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateVariantAttributePayload {
  name: string;
  values: string[];
  imageUrl?: string | null;
  status: "active" | "inactive";
}

export interface UpdateVariantAttributePayload {
  name?: string;
  values?: string[];
  imageUrl?: string | null;
  status?: "active" | "inactive";
}

export const getVariantAttributes = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "active" | "inactive";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<VariantAttributeListResponse>('/variant-attributes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching variant attributes:', error);
    throw error;
  }
};

export const getVariantAttributeById = async (id: number) => {
  try {
    const response = await api.get<VariantAttribute>(`/variant-attributes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching variant attribute with ID ${id}:`, error);
    throw error;
  }
};

export const createVariantAttribute = async (variantAttribute: CreateVariantAttributePayload) => {
  try {
    const response = await api.post<VariantAttribute>('/variant-attributes', variantAttribute);
    return response.data;
  } catch (error) {
    console.error('Error creating variant attribute:', error);
    throw error;
  }
};

export const updateVariantAttribute = async (id: number, variantAttribute: UpdateVariantAttributePayload) => {
  try {
    const response = await api.put<VariantAttribute>(`/variant-attributes/${id}`, variantAttribute);
    return response.data;
  } catch (error) {
    console.error(`Error updating variant attribute with ID ${id}:`, error);
    throw error;
  }
};

export const deleteVariantAttribute = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/variant-attributes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting variant attribute with ID ${id}:`, error);
    throw error;
  }
};
