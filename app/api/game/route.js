import { createGame } from "@/models/Game";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const gameId = await createGame(userId);
    return NextResponse.json({ gameId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
