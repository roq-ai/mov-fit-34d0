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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getExerciseById, updateExerciseById } from 'apiSdk/exercises';
import { Error } from 'components/error';
import { exerciseValidationSchema } from 'validationSchema/exercises';
import { ExerciseInterface } from 'interfaces/exercise';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { WorkoutInterface } from 'interfaces/workout';
import { getWorkouts } from 'apiSdk/workouts';

function ExerciseEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ExerciseInterface>(
    () => (id ? `/exercises/${id}` : null),
    () => getExerciseById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ExerciseInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateExerciseById(id, values);
      mutate(updated);
      resetForm();
      router.push('/exercises');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ExerciseInterface>({
    initialValues: data,
    validationSchema: exerciseValidationSchema,
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
            Edit Exercise
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="reps" mb="4" isInvalid={!!formik.errors?.reps}>
              <FormLabel>Reps</FormLabel>
              <NumberInput
                name="reps"
                value={formik.values?.reps}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('reps', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.reps && <FormErrorMessage>{formik.errors?.reps}</FormErrorMessage>}
            </FormControl>
            <FormControl id="sets" mb="4" isInvalid={!!formik.errors?.sets}>
              <FormLabel>Sets</FormLabel>
              <NumberInput
                name="sets"
                value={formik.values?.sets}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('sets', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.sets && <FormErrorMessage>{formik.errors?.sets}</FormErrorMessage>}
            </FormControl>
            <FormControl id="rest_time" mb="4" isInvalid={!!formik.errors?.rest_time}>
              <FormLabel>Rest Time</FormLabel>
              <NumberInput
                name="rest_time"
                value={formik.values?.rest_time}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('rest_time', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.rest_time && <FormErrorMessage>{formik.errors?.rest_time}</FormErrorMessage>}
            </FormControl>
            <FormControl id="timestamp" mb="4" isInvalid={!!formik.errors?.timestamp}>
              <FormLabel>Timestamp</FormLabel>
              <NumberInput
                name="timestamp"
                value={formik.values?.timestamp}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('timestamp', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.timestamp && <FormErrorMessage>{formik.errors?.timestamp}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<WorkoutInterface>
              formik={formik}
              name={'workout_id'}
              label={'Select Workout'}
              placeholder={'Select Workout'}
              fetcher={getWorkouts}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.intensity_level}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
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
    entity: 'exercise',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ExerciseEditPage);
