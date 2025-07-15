import { onboardUser } from "@/lib/onboardUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { tenantSlug } = await onboardUser(body);
  return NextResponse.json({ tenantSlug }, { status: 200 });
}
