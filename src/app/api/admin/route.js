import { connectToDatabase } from '../../../lib/mongo';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex'); // Generates an 8-byte random password
}

export async function POST(req) {
  const { username, password } = await req.json();

  if (username === 'admin' && password === 'password') {
    return NextResponse.json({ message: 'Admin logged in' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req) {
  const { action, userType } = await req.json();
  const client = await connectToDatabase();
  const db = client.db();

  const key = crypto.randomBytes(32).toString('hex');
  const iv = crypto.randomBytes(16).toString('hex');

  if (action === 'create' && userType === 'questionSetter') {
    const questionSetterId = `qs_${crypto.randomBytes(4).toString('hex')}`;
    const username = `qs_${crypto.randomBytes(4).toString('hex')}`; // Generate a unique username
    const password = generateRandomPassword(); // Generate a random password

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    await db.collection('users').insertOne({
      userType,
      questionSetterId,
      username,
      password: hashedPassword,
      key,
      iv
    });
    
    return new Response(JSON.stringify({
      message: 'Question Setter Created',
      credentials: { questionSetterId, username, password } // Return username and password
    }), { status: 201 });
  }

  if (action === 'create' && userType === 'student') {
    const studentId = `student_${crypto.randomBytes(4).toString('hex')}`;
    await db.collection('users').insertOne({ userType, studentId });
    return new Response(JSON.stringify({ message: 'Student Created', credentials: { studentId } }), { status: 201 });
  }

  return new Response(JSON.stringify({ message: 'Invalid action or userType' }), { status: 400 });
}
