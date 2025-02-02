import { getGame, updateGame } from "@/models/Game";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  const game = await getGame(id);
  if (game) {
    return NextResponse.json(game);
  } else {
    return NextResponse.json({ message: "Game not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  // const { id } = params;
  const id = request.nextUrl.pathname.split("/").pop();
  const { board, currentPlayer, winner } = await request.json();
  await updateGame(id, { board, currentPlayer, winner });
  return NextResponse.json({ message: "Game updated" });
}
