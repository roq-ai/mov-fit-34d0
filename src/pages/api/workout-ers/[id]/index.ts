import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { workoutErValidationSchema } from 'validationSchema/workout-ers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.workout_er
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getWorkoutErById();
    case 'PUT':
      return updateWorkoutErById();
    case 'DELETE':
      return deleteWorkoutErById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWorkoutErById() {
    const data = await prisma.workout_er.findFirst(convertQueryToPrismaUtil(req.query, 'workout_er'));
    return res.status(200).json(data);
  }

  async function updateWorkoutErById() {
    await workoutErValidationSchema.validate(req.body);
    const data = await prisma.workout_er.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteWorkoutErById() {
    const data = await prisma.workout_er.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
