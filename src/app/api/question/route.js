import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongo';
import crypto from 'crypto';

export async function POST(req) {
  const client = await connectToDatabase();
  const db = client.db();
  
  const { question, options, setterId, key, iv } = await req.json();

  // Validate key and IV
  if (key.length !== 64) {
    return NextResponse.json({ message: 'Invalid key length. Key must be 32 bytes (64 hex characters).' }, { status: 400 });
  }
  if (iv.length !== 32) {
    return NextResponse.json({ message: 'Invalid IV length. IV must be 16 bytes (32 hex characters).' }, { status: 400 });
  }

  const encrypt = (text) => {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex')
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  };

  try {
    const encryptedQuestion = encrypt(question);
    const encryptedOptions = options.map((opt) => encrypt(opt));

    await db.collection('questions').insertOne({
      setterId,
      question: encryptedQuestion,
      options: encryptedOptions,
    });

    return NextResponse.json({ message: 'Question added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Encryption Error:', error); // Log the error for debugging
    return NextResponse.json({ message: 'Encryption failed' }, { status: 500 });
  }
}
