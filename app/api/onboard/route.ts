import { NextResponse } from "next/server";
import { onboardUser } from "../../../lib/onboardUser";

export async function POST(request: Request) {
  const body = await request.json();
  const { tenantSlug } = await onboardUser(body);
  return NextResponse.json({ tenantSlug }, { status: 200 });
}
