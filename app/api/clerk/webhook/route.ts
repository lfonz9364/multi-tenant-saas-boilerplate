import { prisma } from "@/lib/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

type Email = {
  created_at: number;
  email_address: string;
  id: string;
  linked_to: [
    {
      id: string;
      type: string;
    }
  ];
  matches_sso_connection: boolean;
  object: string;
  reserved: boolean;
  updated_at: number;
  verification: {
    attempts: null;
    expire_at: null;
    status: string;
    strategy: string;
  };
};

export async function POST(req: NextRequest) {
  if (process.env.WEBHOOK_ENABLED !== "true") {
    return new Response("Webhook connection is forbidden", {
      status: 403,
    });
  }

  const authReq = await verifyWebhook(req);

  if (!authReq) {
    return new Response("Unauthorised", { status: 401 });
  }

  if (
    !authReq.data ||
    !("id" in authReq.data) ||
    !("email_addresses" in authReq.data) ||
    !("first_name" in authReq.data) ||
    !("last_name" in authReq.data)
  ) {
    return new Response("Invalid request", { status: 400 });
  }

  const {
    data: { id, email_addresses, first_name, last_name },
  } = authReq as unknown as {
    data: {
      id: string;
      email_addresses: Email[];
      first_name: string | null;
      last_name: string | null;
    };
  };

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: id },
  });

  if (existingUser) {
    return NextResponse.json({ message: "User already exists." });
  }

  const email = email_addresses?.[0]?.email_address;
  const name = first_name && last_name ? `${first_name} ${last_name}` : email;

  const slug = `${email?.split("@")[0]}-${Math.floor(Math.random() * 1000)}`;

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
