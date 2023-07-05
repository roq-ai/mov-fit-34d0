import * as yup from 'yup';

export const exerciseValidationSchema = yup.object().shape({
  name: yup.string().required(),
  reps: yup.number().integer().required(),
  sets: yup.number().integer().required(),
  rest_time: yup.number().integer().required(),
  timestamp: yup.number().integer().required(),
  workout_id: yup.string().nullable(),
});
