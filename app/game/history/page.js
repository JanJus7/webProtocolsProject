'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function History() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const userId = Cookies.get('userId');
      if (!userId) return;

      try {
        const response = await axios.get(`/api/game/history?userId=${userId}`);
        setGames(response.data);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl text-blue-400 font-bold mb-4">Historia gier</h1>
      <ul className="w-full max-w-2xl">
        {games.map(game => (
          <li key={game._id} className="bg-white p-4 text-green-400 rounded-lg shadow-md mb-4">
            <p>Data utworzenia: {new Date(game.createdAt).toLocaleString()}</p>
            <p>Status: {game.winner ? `Zwycięzca: ${game.winner}` : 'W trakcie'}</p>
            {!game.winner && (
              <Link href={`/game/${game._id}`}>
                <button className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600">
                  Kontynuuj grę
                </button>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}