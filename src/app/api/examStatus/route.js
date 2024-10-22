import { connectToDatabase } from '../../../lib/mongo';

export default async function handler(req, res) {
  const { method } = req;
  const client = await connectToDatabase();
  const db = client.db();

  if (method === 'PUT') {
    await db.collection('examStatus').updateOne({}, { $set: { status: 'started' } }, { upsert: true });
    res.status(200).json({ message: 'Exam started' });
  }
}
