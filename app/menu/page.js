"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function Menu() {
  const router = useRouter();

  const handleNewGame = async () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      console.error("User ID not found in cookies");
      return;
    }

    try {
      const response = await axios.post("/api/game", { userId });
      const gameId = response.data.gameId;

      router.push(`/game/${gameId}`);
    } catch (error) {
      console.error("Failed to create a new game:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-300">Main Menu</h1>
        <button
          onClick={handleNewGame}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4"
        >
          New Game
        </button>
        <Link href="/game/history">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            History
          </button>
        </Link>
      </div>
    </div>
  );
}