import { createUser } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();
  
  try {
    const userId = await createUser(username, password);
    return NextResponse.json({ userId }, { status: 201 });
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}