import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getWorkoutById } from 'apiSdk/workouts';
import { Error } from 'components/error';
import { WorkoutInterface } from 'interfaces/workout';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { deleteExerciseById } from 'apiSdk/exercises';

function WorkoutViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WorkoutInterface>(
    () => (id ? `/workouts/${id}` : null),
    () =>
      getWorkoutById(id, {
        relations: ['media', 'user', 'exercise'],
      }),
  );

  const exerciseHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteExerciseById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Workout Detail View
          </Text>
          {hasAccess('workout', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/workouts/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Intensity Level:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.intensity_level}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Workout Type:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.workout_type}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Equipment:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.equipment}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('media', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    Media:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/media/view/${data?.media?.id}`}>
                      {data?.media?.name}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('exercise', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Exercises
                    </Text>
                    <NextLink passHref href={`/exercises/create?workout_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>name</Th>
                          <Th>reps</Th>
                          <Th>sets</Th>
                          <Th>rest_time</Th>
                          <Th>timestamp</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.exercise?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/exercises/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.name}</Td>
                            <Td>{record.reps}</Td>
                            <Td>{record.sets}</Td>
                            <Td>{record.rest_time}</Td>
                            <Td>{record.timestamp}</Td>
                            <Td>
                              {hasAccess('exercise', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/exercises/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('exercise', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exerciseHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box></Box>
          </>
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
    entity: 'workout',
    operation: AccessOperationEnum.READ,
  }),
)(WorkoutViewPage);
