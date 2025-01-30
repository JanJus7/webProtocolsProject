import Link from 'next/link';

export default function Menu() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-300">Main Menu</h1>
        <Link href="/game/new">
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4">
            New Game
          </button>
        </Link>
        <Link href="/game/history">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            History
          </button>
        </Link>
      </div>
    </div>
  );
}