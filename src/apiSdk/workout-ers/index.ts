import axios from 'axios';
import queryString from 'query-string';
import { WorkoutErInterface, WorkoutErGetQueryInterface } from 'interfaces/workout-er';
import { GetQueryInterface } from '../../interfaces';

export const getWorkoutErs = async (query?: WorkoutErGetQueryInterface) => {
  const response = await axios.get(`/api/workout-ers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWorkoutEr = async (workoutEr: WorkoutErInterface) => {
  const response = await axios.post('/api/workout-ers', workoutEr);
  return response.data;
};

export const updateWorkoutErById = async (id: string, workoutEr: WorkoutErInterface) => {
  const response = await axios.put(`/api/workout-ers/${id}`, workoutEr);
  return response.data;
};

export const getWorkoutErById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/workout-ers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWorkoutErById = async (id: string) => {
  const response = await axios.delete(`/api/workout-ers/${id}`);
  return response.data;
};
