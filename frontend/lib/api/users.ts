import { api } from "./axios-instance";

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};