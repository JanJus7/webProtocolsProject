"use client";

import Link from "next/link";

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-300">
          Welcome to the game of Gomoku!
        </h1>
        <Link href="/login">
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4">
            Log in / Register
          </button>
        </Link>
        <Link href="/game/guest-session">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            Play as Guest
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
