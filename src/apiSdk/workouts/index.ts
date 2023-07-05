import axios from 'axios';
import queryString from 'query-string';
import { WorkoutInterface, WorkoutGetQueryInterface } from 'interfaces/workout';
import { GetQueryInterface } from '../../interfaces';

export const getWorkouts = async (query?: WorkoutGetQueryInterface) => {
  const response = await axios.get(`/api/workouts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWorkout = async (workout: WorkoutInterface) => {
  const response = await axios.post('/api/workouts', workout);
  return response.data;
};

export const updateWorkoutById = async (id: string, workout: WorkoutInterface) => {
  const response = await axios.put(`/api/workouts/${id}`, workout);
  return response.data;
};

export const getWorkoutById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/workouts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWorkoutById = async (id: string) => {
  const response = await axios.delete(`/api/workouts/${id}`);
  return response.data;
};
