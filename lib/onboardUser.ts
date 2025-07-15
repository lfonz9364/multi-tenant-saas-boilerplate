import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function onboardUser({
  clerkUserId,
  email,
  // name,
}: {
  clerkUserId: string;
  email: string;
  name: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId },
    include: {
      memberships: {
        include: { tenant: true },
      },
    },
  });

  if (existingUser && existingUser.memberships.length) {
    return { tenantSlug: existingUser.memberships[0].tenant.slug };
  }

  const slug = `${email.split("@")[0]}-${Math.floor(Math.random() * 1000)}`;

  // const tenant = await prisma.tenant.create({
  //   data: {
  //     name: `${name}'s Team`,
  //     slug,
  //     memberships: {
  //       create: {
  //         role: "OWNER",
  //         user: {
  //           create: {
  //             clerkUserId,
  //             email,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   include: {
  //     memberships: {
  //       include: { user: true },
  //     },
  //   },
  // });

  return { tenantSlug: slug };
}
