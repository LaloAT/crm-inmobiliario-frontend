import axiosInstance from '../config/axios.config';
import type {
  LetterOfInterestDto,
  CreateLetterOfInterestRequest,
  UpdateLetterOfInterestRequest,
  LetterOfInterestFilters,
  LetterOfInterestPaginatedResponse,
} from '../types/letterOfInterest.types';

export const letterOfInterestService = {
  getAll: async (filters?: LetterOfInterestFilters): Promise<LetterOfInterestPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/letters-of-interest', {
        params: filters,
      });
      return {
        items: response.data.items || [],
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 10,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching letters of interest:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<LetterOfInterestDto> => {
    try {
      const response = await axiosInstance.get(`/api/v1/letters-of-interest/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching letter of interest:', error);
      throw error;
    }
  },

  create: async (data: CreateLetterOfInterestRequest): Promise<{ id: string }> => {
    try {
      const response = await axiosInstance.post('/api/v1/letters-of-interest', data);
      return response.data;
    } catch (error) {
      console.error('Error creating letter of interest:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateLetterOfInterestRequest): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/letters-of-interest/${id}`, data);
    } catch (error) {
      console.error('Error updating letter of interest:', error);
      throw error;
    }
  },

  send: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/letters-of-interest/${id}/send`);
    } catch (error) {
      console.error('Error sending letter of interest:', error);
      throw error;
    }
  },

  sign: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/letters-of-interest/${id}/sign`);
    } catch (error) {
      console.error('Error signing letter of interest:', error);
      throw error;
    }
  },

  cancel: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/letters-of-interest/${id}/cancel`);
    } catch (error) {
      console.error('Error cancelling letter of interest:', error);
      throw error;
    }
  },

  convertToDeal: async (id: string): Promise<{ dealId: string }> => {
    try {
      const response = await axiosInstance.post(`/api/v1/letters-of-interest/${id}/convert-to-deal`);
      return response.data;
    } catch (error) {
      console.error('Error converting letter to deal:', error);
      throw error;
    }
  },
};
