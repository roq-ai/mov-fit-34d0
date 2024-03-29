import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { workoutValidationSchema } from 'validationSchema/workouts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.workout
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getWorkoutById();
    case 'PUT':
      return updateWorkoutById();
    case 'DELETE':
      return deleteWorkoutById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWorkoutById() {
    const data = await prisma.workout.findFirst(convertQueryToPrismaUtil(req.query, 'workout'));
    return res.status(200).json(data);
  }

  async function updateWorkoutById() {
    await workoutValidationSchema.validate(req.body);
    const data = await prisma.workout.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteWorkoutById() {
    const data = await prisma.workout.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
