import api from './api';
import type { Tutorial } from '../types/tutorial';

export interface TutorialFilters {
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
  difficulty?: string;
  category?: string;
}

export const tutorialService = {
  async getList(filters: TutorialFilters = {}): Promise<Tutorial[]> {
    const { data } = await api.get('/mongo-tutorials', {
      params: { page: 1, limit: 50, ...filters },
    });
    return data.data?.tutorials ?? [];
  },

  async getById(id: string): Promise<Tutorial> {
    const { data } = await api.get(`/mongo-tutorials/${id}`);
    return data.data.tutorial;
  },

  async getFeatured(): Promise<Tutorial[]> {
    const { data } = await api.get('/mongo-tutorials', {
      params: { featured: true, limit: 6 },
    });
    return data.data?.tutorials ?? [];
  },
};
