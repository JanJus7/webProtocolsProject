import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { gameId, userId, content } = await req.json();
    if (!gameId || !userId || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const notesCollection = db.collection("game-notes");

    const result = await notesCollection.insertOne({
      gameId,
      userId,
      content,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ insertedId: result.insertedId }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add note" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const userId = searchParams.get("userId");
    if (!gameId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const notesCollection = db.collection("game-notes");

    const notes = await notesCollection.find({ gameId, userId }).toArray();
    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch notes" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { noteId, userId, content } = await req.json();
    if (!noteId || !userId || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const notesCollection = db.collection("game-notes");

    await notesCollection.updateOne(
      { _id: new ObjectId(noteId), userId },
      { $set: { content } }
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update note" }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { noteId, userId } = await req.json();
    if (!noteId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const notesCollection = db.collection("game-notes");

    await notesCollection.deleteOne({ _id: new ObjectId(noteId), userId });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete note" }), {
      status: 500,
    });
  }
}
