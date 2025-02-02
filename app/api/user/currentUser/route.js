import {
  findUserByUserId,
  findUserByUsername,
  updateUserUsername,
} from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  try {
    const user = await findUserByUserId(userId);
    if (!user) {
      return NextResponse.json({ error: "No user exists!" }, { status: 404 });
    }

    return NextResponse.json(
      { username: user.username, createdAt: user.createdAt },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  try {
    const { username } = await request.json();
    const updatedUser = await updateUserUsername(userId, username);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        username: updatedUser.username,
        message: "Username updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
