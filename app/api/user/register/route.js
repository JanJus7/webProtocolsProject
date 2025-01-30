import { createUser } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();
  try {
    const userId = await createUser(username, password);
    return NextResponse.json({ userId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}