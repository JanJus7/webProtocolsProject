import { getCollection } from '@/models/Game';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const collection = await getCollection();
  const games = await collection.find({ userId }).toArray();

  return NextResponse.json(games);
}