import { api } from "./axios-instance";

export interface SubCategory {
  id: number;
  name: string;
  code: string; // This is the Sub Category Code, mapped to 'Category Code' on UI
  status: "active" | "inactive";
  createdAt: string;
  categoryId: number;
  categoryName: string; // To display category name in the table
  imageUrl: string | null; // Added imageUrl
  description: string | null; // Added description
}

export interface SubCategoryListResponse {
  subCategories: SubCategory[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateSubCategoryPayload {
  name: string;
  code: string;
  categoryId: number;
  status: "active" | "inactive"; // Added status for creation
  description?: string | null;
  imageUrl?: string | null;
}

export interface UpdateSubCategoryPayload {
  name?: string;
  code?: string;
  categoryId?: number;
  description?: string | null;
  imageUrl?: string | null;
  status?: "active" | "inactive";
}

export const getSubCategories = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "active" | "inactive";
  sortBy?: string;
  sortDir?: "asc" | "desc";
  categoryId?: number; // Filter by category
}) => {
  try {
    const response = await api.get<SubCategoryListResponse>('/subcategories', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const getSubCategoryById = async (id: number) => {
  try {
    const response = await api.get<SubCategory>(`/subcategories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subcategory with ID ${id}:`, error);
    throw error;
  }
};

export const createSubCategory = async (subCategory: CreateSubCategoryPayload) => {
  try {
    const response = await api.post<SubCategory>('/subcategories', subCategory);
    return response.data;
  } catch (error) {
    console.error('Error creating subcategory:', error);
    throw error;
  }
};

export const updateSubCategory = async (id: number, subCategory: UpdateSubCategoryPayload) => {
  try {
    const response = await api.put<SubCategory>(`/subcategories/${id}`, subCategory);
    return response.data;
  } catch (error) {
    console.error(`Error updating subcategory with ID ${id}:`, error);
    throw error;
  }
};

export const deleteSubCategory = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/subcategories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting subcategory with ID ${id}:`, error);
    throw error;
  }
};
