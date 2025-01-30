import clientPromise from '@/lib/db';
import bcrypt from 'bcrypt';

const COLLECTION_NAME = 'users';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTION_NAME);
}

export async function createUser(username, password) {
  const collection = await getCollection();

  const existingUser = await collection.findOne({ username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    username,
    password: hashedPassword,
    games: [],
    createdAt: new Date(),
  };
  const result = await collection.insertOne(user);
  return result.insertedId.toString();
}

export async function findUserByUsername(username) {
  const collection = await getCollection();
  return collection.findOne({ username });
}