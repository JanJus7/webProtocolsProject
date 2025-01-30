import { findUserByUsername } from '@/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();
  try {
    const user = await findUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}