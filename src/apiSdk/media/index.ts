import axios from 'axios';
import queryString from 'query-string';
import { MediaInterface, MediaGetQueryInterface } from 'interfaces/media';
import { GetQueryInterface } from '../../interfaces';

export const getMedia = async (query?: MediaGetQueryInterface) => {
  const response = await axios.get(`/api/media${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMedia = async (media: MediaInterface) => {
  const response = await axios.post('/api/media', media);
  return response.data;
};

export const updateMediaById = async (id: string, media: MediaInterface) => {
  const response = await axios.put(`/api/media/${id}`, media);
  return response.data;
};

export const getMediaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/media/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMediaById = async (id: string) => {
  const response = await axios.delete(`/api/media/${id}`);
  return response.data;
};
