import { addFriend, updateFriendStatus, removeFriend } from "@/models/User";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { userId, friendId } = await request.json();

    if (!userId || !friendId || !ObjectId.isValid(userId) || !ObjectId.isValid(friendId)) {
      return NextResponse.json({ error: "Invalid userId or friendId" }, { status: 400 });
    }

    const added = await addFriend(userId, friendId);

    if (added) {
      return NextResponse.json({ message: "Friend added successfully" }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to add friend" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST /api/user/friends:", error);
    return NextResponse.json({ error: error.message || "Failed to add friend" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId, friendId, status } = await request.json();
    if (!userId ||!friendId ||!status) {
      return NextResponse.json({ error: "Missing userId, friendId or status" }, { status: 400 });
    }

    const updated = await updateFriendStatus(userId, friendId, status);
    if (updated) {
      return NextResponse.json({ message: "Friend status updated successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to update friend status" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update friend status" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId, friendId } = await request.json();
    if (!userId ||!friendId) {
      return NextResponse.json({ error: "Missing userId or friendId" }, { status: 400 });
    }

    const removed = await removeFriend(userId, friendId);
    if (removed) {
      return NextResponse.json({ message: "Friend removed successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to remove friend" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove friend" }, { status: 500 });
  }
}