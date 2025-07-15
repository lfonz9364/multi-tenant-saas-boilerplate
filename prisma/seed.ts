import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: "Mock pty ltd",
      slug: "mock-pty-ltd",
    },
  });

  const user = await prisma.user.create({
    data: {
      clerkUserId: "clerk_user_id_123",
      email: "mock@example.com",
    },
  });

  await prisma.membership.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
      role: "OWNER",
    },
  });

  console.log("Seeded");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
