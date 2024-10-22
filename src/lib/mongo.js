import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  await client.connect();
  cachedClient = client;
  return client;
} 
