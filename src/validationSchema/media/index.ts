import * as yup from 'yup';

export const mediaValidationSchema = yup.object().shape({
  name: yup.string().required(),
  subtitle_file: yup.string().required(),
  user_id: yup.string().nullable(),
});
