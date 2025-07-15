import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  if (process.env.WEBHOOK_ENABLED !== "true") {
    return new Response("Webhook connection is forbidden", {
      status: 403,
    });
  }

  const secret = req.headers.get("clerk-signature");

  if (secret !== process.env.CLERK_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  if (!body || !body.data) {
    return new Response("Invalid request", { status: 400 });
  }

  const {
    data: { id, email_addresses, full_name },
  } = body.data;

  const email = email_addresses?.[0]?.email_address;
  const name = full_name || email;

  const slug = `${email?.split("@")[0]}-${Math.floor(Math.random() * 1000)}`;

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: id },
  });

  if (existingUser) {
    return NextResponse.json({ message: "User already exists." });
  }

  await prisma.tenant.create({
    data: {
      name: `${name}'s Team`,
      slug,
      memberships: {
        create: {
          role: "OWNER",
          user: {
            create: {
              clerkUserId: id,
              email,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ success: true });
}
