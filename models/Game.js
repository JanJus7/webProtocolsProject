import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "games-history";

export async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTION_NAME);
}

export async function createGame(userId) {
  const collection = await getCollection();
  const initialBoard = Array(15)
    .fill()
    .map(() => Array(15).fill(null));
  const game = {
    board: initialBoard,
    currentPlayer: "black",
    winner: null,
    createdAt: new Date(),
    userId,
  };
  const result = await collection.insertOne(game);
  return result.insertedId;
}

export async function getGame(id) {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updateGame(id, updates) {
  const collection = await getCollection();
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
}
