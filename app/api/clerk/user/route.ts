import { clerkAPI } from "@/lib/clerk";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();

  try {
    await clerkAPI.delete(`users/${userId}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting Clerk user:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { userId, updateData } = await req.json();

  try {
    const res = await clerkAPI.patch(`users/${userId}`, updateData);
    return NextResponse.json(res.data);
  } catch (err) {
    console.error("Error updating Clerk user", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
