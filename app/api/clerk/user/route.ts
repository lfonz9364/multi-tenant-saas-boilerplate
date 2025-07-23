import { clerkAPI } from "@/lib/clerk";
import { logAudit } from "@/lib/logging";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { userId: currentUserId } = await auth();
  const { userId } = await req.json();
  const supabase = await createSupabaseClient();

  try {
    // Delete from Clerk
    await clerkAPI.delete(`users/${userId}`);

    // Delete record from Supabase
    const { error: deleteMembershipError } = await supabase
      .from("Membership")
      .delete()
      .eq("userId", userId);

    const { error: deleteUserError } = await supabase
      .from("User")
      .delete()
      .eq("id", userId);

    if (deleteMembershipError || deleteUserError) {
      throw new Error("Supabase deletion failed");
    }

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
  const supabase = await createSupabaseClient();

  try {
    //  Update in Clerk
    const res = await clerkAPI.patch(`users/${userId}`, updateData);

    // Update in Supabase
    const { data: updatedUser, error } = await supabase
      .from("User")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

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
