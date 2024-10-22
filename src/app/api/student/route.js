import { connectToDatabase } from '../../lib/mongo';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { studentId, password } = await req.json();
  const client = await connectToDatabase();
  const db = client.db();

  // Find the student by ID
  const student = await db.collection('users').findOne({ studentId, userType: 'student' });

  // Check if user exists and validate password (assuming you have hashed passwords for students)
  if (student && await bcrypt.compare(password, student.password)) {
    return NextResponse.json({ message: 'Student logged in' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
