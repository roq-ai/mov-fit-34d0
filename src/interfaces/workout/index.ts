import { ExerciseInterface } from 'interfaces/exercise';
import { MediaInterface } from 'interfaces/media';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface WorkoutInterface {
  id?: string;
  intensity_level: string;
  workout_type: string;
  equipment?: string;
  media_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  exercise?: ExerciseInterface[];
  media?: MediaInterface;
  user?: UserInterface;
  _count?: {
    exercise?: number;
  };
}

export interface WorkoutGetQueryInterface extends GetQueryInterface {
  id?: string;
  intensity_level?: string;
  workout_type?: string;
  equipment?: string;
  media_id?: string;
  user_id?: string;
}
