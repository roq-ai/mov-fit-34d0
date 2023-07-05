import * as yup from 'yup';

export const workoutValidationSchema = yup.object().shape({
  intensity_level: yup.string().required(),
  workout_type: yup.string().required(),
  equipment: yup.string(),
  media_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
