import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { mediaValidationSchema } from 'validationSchema/media';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMedia();
    case 'POST':
      return createMedia();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMedia() {
    const data = await prisma.media
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'media'));
    return res.status(200).json(data);
  }

  async function createMedia() {
    await mediaValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.workout?.length > 0) {
      const create_workout = body.workout;
      body.workout = {
        create: create_workout,
      };
    } else {
      delete body.workout;
    }
    const data = await prisma.media.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
