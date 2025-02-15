"use client";
import { useEffect, useState, use } from "react";
import axios from "axios";
import { checkWinner } from "@/lib/gameLogic";
import { useRouter } from "next/navigation";

export default function Game({ params }) {
  const { id } = use(params);
  const [board, setBoard] = useState(
    Array(15)
      .fill()
      .map(() => Array(15).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`/api/game/${id}`);
        const game = response.data;

        if (game) {
          setBoard(game.board);
          setCurrentPlayer(game.currentPlayer);
          setWinner(game.winner);
        } else {
          router.push("/menu");
        }
      } catch (error) {
        console.error("Failed to fetch game:", error);
        router.push("/menu");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, router]);

  const handleCellClick = async (x, y) => {
    if (board[x][y] || winner) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[x][y] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, x, y, currentPlayer)) {
      setWinner(currentPlayer);
      await axios.put(`/api/game/${id}`, {
        board: newBoard,
        currentPlayer,
        winner: currentPlayer,
      });
    } else {
      const nextPlayer = currentPlayer === "black" ? "white" : "black";
      setCurrentPlayer(nextPlayer);
      await axios.put(`/api/game/${id}`, {
        board: newBoard,
        currentPlayer: nextPlayer,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl text-blue-400 font-bold mb-4">Gomoku</h1>
      {winner && <p className="text-xl text-blue-400 mb-4">Winner: {winner}</p>}
      <div className="board">
        {board.map((row, x) =>
          row.map((cell, y) => (
            <div
              key={`${x}-${y}`}
              className="w-8 h-8 border border-gray-300 flex bg-gray-400 hover:bg-gray-600 items-center justify-center cursor-pointer"
              onClick={() => handleCellClick(x, y)}
            >
              {cell === "black" ? "⚫" : cell === "white" ? "⚪" : ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
