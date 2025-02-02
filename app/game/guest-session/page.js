"use client";

import { checkWinner } from "@/lib/gameLogic";
import { useState } from "react";

function Game() {
  const [board, setBoard] = useState(
    Array(15)
      .fill()
      .map(() => Array(15).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const [winner, setWinner] = useState(null);

  const handleCellClick = async (x, y) => {
    if (board[x][y] || winner) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[x][y] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, x, y, currentPlayer)) {
      setWinner(currentPlayer);
    } else {
      const nextPlayer = currentPlayer === "black" ? "white" : "black";
      setCurrentPlayer(nextPlayer);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

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
      {winner && (
        <button
          onClick={refreshPage}
          className="bg-blue-500 mt-4 p-2 rounded-lg hover:bg-blue-600 text-white"
        >
          Start over
        </button>
      )}
      <div className="text-sm text-gray-600 mt-4">
        Beware that on guest session your progress will be lost even if you
        refresh the website!
      </div>
    </div>
  );
}

export default Game;
