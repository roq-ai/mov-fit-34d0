import { WorkoutInterface } from 'interfaces/workout';
import { GetQueryInterface } from 'interfaces';

export interface ExerciseInterface {
  id?: string;
  name: string;
  reps: number;
  sets: number;
  rest_time: number;
  timestamp: number;
  workout_id?: string;
  created_at?: any;
  updated_at?: any;

  workout?: WorkoutInterface;
  _count?: {};
}

export interface ExerciseGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  workout_id?: string;
}
