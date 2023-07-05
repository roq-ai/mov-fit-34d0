import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { mediaValidationSchema } from 'validationSchema/media';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.media
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMediaById();
    case 'PUT':
      return updateMediaById();
    case 'DELETE':
      return deleteMediaById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMediaById() {
    const data = await prisma.media.findFirst(convertQueryToPrismaUtil(req.query, 'media'));
    return res.status(200).json(data);
  }

  async function updateMediaById() {
    await mediaValidationSchema.validate(req.body);
    const data = await prisma.media.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMediaById() {
    const data = await prisma.media.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
