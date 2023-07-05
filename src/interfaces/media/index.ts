import { WorkoutInterface } from 'interfaces/workout';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MediaInterface {
  id?: string;
  name: string;
  subtitle_file: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  workout?: WorkoutInterface[];
  user?: UserInterface;
  _count?: {
    workout?: number;
  };
}

export interface MediaGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  subtitle_file?: string;
  user_id?: string;
}
