import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createWorkout } from 'apiSdk/workouts';
import { Error } from 'components/error';
import { workoutValidationSchema } from 'validationSchema/workouts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { MediaInterface } from 'interfaces/media';
import { UserInterface } from 'interfaces/user';
import { getMedia } from 'apiSdk/media';
import { getUsers } from 'apiSdk/users';
import { WorkoutInterface } from 'interfaces/workout';

function WorkoutCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WorkoutInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWorkout(values);
      resetForm();
      router.push('/workouts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WorkoutInterface>({
    initialValues: {
      intensity_level: '',
      workout_type: '',
      equipment: '',
      media_id: (router.query.media_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: workoutValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Workout
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="intensity_level" mb="4" isInvalid={!!formik.errors?.intensity_level}>
            <FormLabel>Intensity Level</FormLabel>
            <Input
              type="text"
              name="intensity_level"
              value={formik.values?.intensity_level}
              onChange={formik.handleChange}
            />
            {formik.errors.intensity_level && <FormErrorMessage>{formik.errors?.intensity_level}</FormErrorMessage>}
          </FormControl>
          <FormControl id="workout_type" mb="4" isInvalid={!!formik.errors?.workout_type}>
            <FormLabel>Workout Type</FormLabel>
            <Input type="text" name="workout_type" value={formik.values?.workout_type} onChange={formik.handleChange} />
            {formik.errors.workout_type && <FormErrorMessage>{formik.errors?.workout_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="equipment" mb="4" isInvalid={!!formik.errors?.equipment}>
            <FormLabel>Equipment</FormLabel>
            <Input type="text" name="equipment" value={formik.values?.equipment} onChange={formik.handleChange} />
            {formik.errors.equipment && <FormErrorMessage>{formik.errors?.equipment}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<MediaInterface>
            formik={formik}
            name={'media_id'}
            label={'Select Media'}
            placeholder={'Select Media'}
            fetcher={getMedia}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'workout',
    operation: AccessOperationEnum.CREATE,
  }),
)(WorkoutCreatePage);
