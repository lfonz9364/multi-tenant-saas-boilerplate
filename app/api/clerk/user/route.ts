import { clerkAPI } from "@/lib/clerk";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/logging";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { userId: currentUserId } = await auth();
  const { userId } = await req.json();

  try {
    // Delete from Clerk
    await clerkAPI.delete(`users/${userId}`);

    // Delete record from Supabase
    await prisma.$transaction([
      prisma.membership.deleteMany({
        where: { userId },
      }),
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    await logAudit({
      action: "DELETE_USER",
      entity: "User",
      entityId: userId,
      userId: currentUserId!,
    });

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
  const { userId: currentUserId } = await auth();
  const { userId, updateData } = await req.json();

  try {
    //  Update in Clerk
    const res = await clerkAPI.patch(`users/${userId}`, updateData);

    // Update in Supabase
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await logAudit({
      action: "UPDATE_USER",
      entity: "User",
      entityId: updatedUser.id,
      userId: currentUserId!,
    });

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("Error updating Clerk user", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
