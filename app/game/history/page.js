"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";

export default function History() {
  const [games, setGames] = useState([]);
  const [notes, setNotes] = useState({});
  const [editing, setEditing] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      const userId = Cookies.get("userId");
      if (!userId) return;

      try {
        const response = await axios.get(`/api/game/history?userId=${userId}`);
        setGames(response.data);

        response.data.forEach((game) => {
          fetchNotes(game._id);
        });
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGames();
  }, []);

  const fetchNotes = async (gameId) => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    try {
      const response = await axios.get(
        `/api/game/history/notes?gameId=${gameId}&userId=${userId}`
      );
      const note = response.data.length > 0 ? response.data[0] : null;
      setNotes((prev) => ({ ...prev, [gameId]: note }));
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleAddOrUpdateNote = async (gameId, content) => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    const existingNote = notes[gameId];
    if (existingNote && existingNote._id) {
      await axios.put("/api/game/history/notes", {
        noteId: existingNote._id,
        userId,
        content,
      });
    } else {
      await axios.post("/api/game/history/notes", { gameId, userId, content });
    }

    setEditing((prev) => ({ ...prev, [gameId]: false }));
    fetchNotes(gameId);
  };

  const handleDeleteNote = async (gameId) => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    const existingNote = notes[gameId];
    if (existingNote) {
      await axios.delete("/api/game/history/notes", {
        data: { noteId: existingNote._id, userId },
      });
      setNotes((prev) => ({ ...prev, [gameId]: null }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl text-blue-400 font-bold mb-4">Historia gier</h1>
      <ul className="w-full max-w-2xl">
        {games.map((game) => (
          <li
            key={game._id}
            className="flex justify-between items-center bg-white p-4 text-green-400 rounded-lg shadow-md mb-4"
          >
            <div>
              <p>
                Data utworzenia: {new Date(game.createdAt).toLocaleString()}
              </p>
              <p>
                Status:{" "}
                {game.winner ? `Zwycięzca: ${game.winner}` : "W trakcie"}
              </p>
              {!game.winner && (
                <Link href={`/game/${game._id}`}>
                  <button className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600">
                    Kontynuuj grę
                  </button>
                </Link>
              )}
            </div>
            <div>
              {editing[game._id] ? (
                <div>
                  <input
                    type="text"
                    value={notes[game._id]?.content || ""}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [game._id]: {
                          ...prev[game._id],
                          content: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter notes"
                  />
                  <button
                    onClick={() =>
                      handleAddOrUpdateNote(game._id, notes[game._id]?.content)
                    }
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              ) : notes[game._id] ? (
                <div>
                  <p>{notes[game._id].content}</p>
                  <button
                    onClick={() =>
                      setEditing((prev) => ({ ...prev, [game._id]: true }))
                    }
                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(game._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setEditing((prev) => ({ ...prev, [game._id]: true }))
                  }
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                >
                  Add notes
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
