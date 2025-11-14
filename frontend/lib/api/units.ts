import { api } from "./axios-instance";

export interface Unit {
  id: number;
  name: string;
  shortName: string;
  noOfProducts: number;
  createdAt: string;
  status: "active" | "inactive";
}

export interface UnitListResponse {
  units: Unit[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateUnitPayload extends Omit<Unit, 'id' | 'noOfProducts' | 'createdDate' | 'status'> {
  name: string;
  shortName: string;
}

export interface UpdateUnitPayload extends Partial<CreateUnitPayload> {
  status?: "active" | "inactive";
}

export const getUnits = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  try {
    const response = await api.get<UnitListResponse>('/units', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
};

export const getUnitById = async (id: number) => {
  try {
    const response = await api.get<Unit>(`/units/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching unit with ID ${id}:`, error);
    throw error;
  }
};

export const createUnit = async (unit: CreateUnitPayload) => {
  try {
    const response = await api.post<Unit>('/units', unit);
    return response.data;
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
};

export const updateUnit = async (id: number, unit: UpdateUnitPayload) => {
  try {
    const response = await api.put<Unit>(`/units/${id}`, unit);
    return response.data;
  }  catch (error) {
    console.error(`Error updating unit with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUnit = async (id: number) => {
  try {
    const response = await api.delete<{ message: string }>(`/units/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting unit with ID ${id}:`, error);
    throw error;
  }
};