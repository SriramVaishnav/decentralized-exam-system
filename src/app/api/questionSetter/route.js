import { connectToDatabase } from '../../../lib/mongo';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { username, password } = await req.json();
  const client = await connectToDatabase();
  const db = client.db();

  // Find the question setter by username
  const questionSetter = await db.collection('users').findOne({ username, userType: 'questionSetter' });

  // Check if user exists and validate password
  if (questionSetter && await bcrypt.compare(password, questionSetter.password)) {
    return NextResponse.json({ message: 'Question Setter logged in' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
