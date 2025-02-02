export function checkWinner(board, x, y, player) {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (const [dx, dy] of directions) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      if (board[x + i * dx]?.[y + i * dy] === player) count++;
      else break;
    }
    for (let i = 1; i < 5; i++) {
      if (board[x - i * dx]?.[y - i * dy] === player) count++;
      else break;
    }
    if (count >= 5) return true;
  }
  return false;
}
