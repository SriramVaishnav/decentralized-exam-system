import { connectToDatabase } from '../../lib/mongo';
import crypto from 'crypto';

export default async function handler(req, res) {
  const { method } = req;
  const client = await connectToDatabase();
  const db = client.db();

  if (method === 'GET') {
    const { studentId } = req.query;
    const student = await db.collection('users').findOne({ studentId });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const examStarted = await db.collection('examStatus').findOne({ status: 'started' });

    if (!examStarted) return res.status(403).json({ message: 'Test not started yet' });

    const questions = await db.collection('questions').aggregate([{ $sample: { size: 10 } }]).toArray();
    res.status(200).json({ questions });
  }

  if (method === 'POST') {
    const { answers, studentId } = req.body;
    await db.collection('results').insertOne({ studentId, answers });

    const result = {
      score: Math.floor(Math.random() * 10),  // Example scoring logic
      rank: Math.floor(Math.random() * 100),  // Example ranking logic
    };

    res.status(201).json(result);
  }
}
