import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/db";

export default async function TenantDashboard({
  params,
}: {
  params: Promise<{ tenantSlug: string }> | { tenantSlug: string };
}) {
  const { userId, redirectToSignIn } = await auth();
  const { tenantSlug } = await params;

  if (!userId) return redirectToSignIn();

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      memberships: {
        where: { user: { clerkUserId: userId } },
      },
    },
  });

  if (!tenant || tenant.memberships.length === 0) {
    return (
      <div className="p-10 text-red-500">
        Unauthorised or not a member of this tenant
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        {`Welcome to${tenant.name}'s dashboard`}
      </h1>
      <p>Your role: {tenant.memberships[0].role}</p>
    </div>
  );
}
