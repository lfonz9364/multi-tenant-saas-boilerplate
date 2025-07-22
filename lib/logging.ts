import { prisma } from "./db";

export const logAudit = async ({
  action,
  entity,
  entityId,
  userId,
  metadata,
}: {
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  metadata?: Record<string, never>;
}) => {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userId,
      metadata,
    },
  });
};
