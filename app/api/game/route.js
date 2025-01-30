import { createGame } from '@/models/Game';
import { NextResponse } from 'next/server';

export async function POST() {
  const gameId = await createGame();
  return NextResponse.json({ gameId }, { status: 201 });
}