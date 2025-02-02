import clientPromise from "@/lib/db";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = "users";

async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(COLLECTION_NAME);
}

export async function createUser(username, password) {
  const collection = await getCollection();

  const existingUser = await collection.findOne({ username });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    username,
    password: hashedPassword,
    friends: [],
    createdAt: new Date(),
  };
  const result = await collection.insertOne(user);
  return result.insertedId.toString();
}

export async function findUserByUsername(username) {
  const collection = await getCollection();
  return collection.findOne({ username });
}

export async function findUserByUserId(userId) {
  const collection = await getCollection();
  return collection.findOne({ _id: new ObjectId(userId) });
}

export async function updateUserUsername(userId, newUsername) {
  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { username: newUsername } }
  );

  if (result.modifiedCount === 0) {
    return null;
  }

  return findUserByUserId(userId);
}

export async function deleteUser(userId) {
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(userId) });
  return result.deletedCount > 0;
}

export async function addFriend(userId, friendId) {
  const collection = await getCollection();

  const user = await collection.findOne({ _id: new ObjectId(userId) });
  if (!user.friends) {
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { friends: [] } }
    );
  }

  const isFriendAlreadyAdded = user.friends?.some(
    (friend) => friend.friendId.toString() === friendId
  );

  if (isFriendAlreadyAdded) {
    throw new Error("Friend already added");
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { friends: { friendId: new ObjectId(friendId), status: "pending" } } }
  );

  return result.modifiedCount > 0;
}

export async function updateFriendStatus(userId, friendId, status) {
  const collection = await getCollection();

  const result = await collection.updateOne(
    { _id: new ObjectId(userId), "friends.friendId": new ObjectId(friendId) },
    { $set: { "friends.$.status": status } }
  );

  return result.modifiedCount > 0;
}

export async function removeFriend(userId, friendId) {
  const collection = await getCollection();

  const result1 = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { friends: { friendId: new ObjectId(friendId) } } }
  );

  const result2 = await collection.updateOne(
    { _id: new ObjectId(friendId) },
    { $pull: { friends: { friendId: new ObjectId(userId) } } }
  );

  return result1.modifiedCount > 0 || result2.modifiedCount > 0;
}

export async function findUsersByPattern(pattern) {
  const collection = await getCollection();

  const users = await collection
    .find({ username: { $regex: pattern, $options: "i" } })
    .toArray();

  return users.map((user) => ({
    _id: user._id.toString(),
    username: user.username,
  }));
}