import axiosInstance from '../config/axios.config';
import type { DealDocumentsResponse } from '../types/dealDocument.types';

const BASE_URL = '/api/v1/deals';

export const dealDocumentService = {
  generateChecklist: async (dealId: string): Promise<void> => {
    try {
      await axiosInstance.post(`${BASE_URL}/${dealId}/documents/generate-checklist`);
    } catch (error) {
      console.error('Error generating checklist:', error);
      throw error;
    }
  },

  getDocuments: async (dealId: string): Promise<DealDocumentsResponse> => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${dealId}/documents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deal documents:', error);
      throw error;
    }
  },

  uploadDocument: async (dealId: string, documentId: string, file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axiosInstance.post(
        `${BASE_URL}/${dealId}/documents/${documentId}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  verifyDocument: async (dealId: string, documentId: string): Promise<void> => {
    try {
      await axiosInstance.put(`${BASE_URL}/${dealId}/documents/${documentId}/verify`);
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  },

  rejectDocument: async (dealId: string, documentId: string, notes: string): Promise<void> => {
    try {
      await axiosInstance.put(`${BASE_URL}/${dealId}/documents/${documentId}/reject`, { notes });
    } catch (error) {
      console.error('Error rejecting document:', error);
      throw error;
    }
  },

  markNotApplicable: async (dealId: string, documentId: string): Promise<void> => {
    try {
      await axiosInstance.put(`${BASE_URL}/${dealId}/documents/${documentId}/not-applicable`);
    } catch (error) {
      console.error('Error marking document as not applicable:', error);
      throw error;
    }
  },

  deleteFile: async (dealId: string, documentId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${dealId}/documents/${documentId}/file`);
    } catch (error) {
      console.error('Error deleting document file:', error);
      throw error;
    }
  },

  getDownloadUrl: async (dealId: string, documentId: string): Promise<{ url: string }> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/${dealId}/documents/${documentId}/download-url`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  },
};
