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
  metadata?: Record<string, unknown | never>;
}) => {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userId,
      // Resolved prisma issue: https://github.com/prisma/prisma/issues/12131
      metadata: JSON.stringify(metadata),
    },
  });
};
