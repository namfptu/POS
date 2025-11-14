import { api } from "./axios-instance";

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CategoryListResponse {
  categories: Category[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateCategoryPayload extends Omit<Category, 'id' | 'createdAt' | 'status'> {
  name: string;
  slug: string;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {
  status?: "active" | "inactive";
}

export const getCategories = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "active" | "inactive";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<CategoryListResponse>('/categories', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (category: CreateCategoryPayload) => {
  try {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: number, category: UpdateCategoryPayload) => {
  try {
    const response = await api.put<Category>(`/categories/${id}`, category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
};