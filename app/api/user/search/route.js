import { NextResponse } from "next/server";
import { findUsersByPattern } from "@/models/User";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const users = await findUsersByPattern(query);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/user/search:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
