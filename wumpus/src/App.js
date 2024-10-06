import React, { useEffect, useState } from "react";
import "./App.css";
import wumpusImg from "./assets/wumpus.png";
import treasureImg from "./assets/treasure.png";
import agentImg from "./assets/agent.png";
import pitImg from "./assets/pit.png";
import breezeImg from "./assets/breeze.png";
import stenchImg from "./assets/stench.png";

// Game grid layout
const grid = [
  [{ breeze: true }, { breeze: true }, {}, {}],
  [{ stench: true }, {}, { pit: true }, {}],
  [{ stench: true }, { wumpus: true }, { treasure: true }, {}],
  [{ breeze: true }, {}, {}, {}],
];

// Initial agent position
const initialPosition = { row: 3, col: 0 };

function App() {
  const [position, setPosition] = useState(initialPosition);
  const [message, setMessage] = useState("Start exploring!");
  const [gameOver, setGameOver] = useState(false);

  // Handle arrow key movement
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        moveAgent("up");
      } else if (event.key === "ArrowDown") {
        moveAgent("down");
      } else if (event.key === "ArrowLeft") {
        moveAgent("left");
      } else if (event.key === "ArrowRight") {
        moveAgent("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [position]);

  const moveAgent = (direction) => {
    if (gameOver) return; // Prevent movement if the game is over

    const { row, col } = position;

    let newRow = row;
    let newCol = col;

    switch (direction) {
      case "up":
        if (row > 0) newRow -= 1;
        break;
      case "down":
        if (row < 3) newRow += 1;
        break;
      case "left":
        if (col > 0) newCol -= 1;
        break;
      case "right":
        if (col < 3) newCol += 1;
        break;
      default:
        return;
    }

    setPosition({ row: newRow, col: newCol });
    handleRoomEvent(newRow, newCol);
  };

  const handleRoomEvent = (row, col) => {
    const room = grid[row][col];

    if (room.pit) {
      setMessage("You fell into a pit! Game over!");
      setGameOver(true);
    } else if (room.wumpus) {
      setMessage("You encountered the Wumpus! Game over!");
      setGameOver(true);
    } else if (room.treasure) {
      setMessage("You found the treasure! You win!");
      setGameOver(true);
    } else if (room.stench) {
      setMessage("You smell something foul nearby...");
    } else if (room.breeze) {
      setMessage("You feel a breeze, there might be a pit nearby...");
    } else {
      setMessage("It's safe here. Keep exploring.");
    }
  };

  const resetGame = () => {
    setPosition(initialPosition);
    setMessage("Start exploring!");
    setGameOver(false);
  };

  return (
    <div className="App">
      <h1 className="heading">Wumpus World</h1>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((room, colIndex) => {
            // Only show the current room and relevant indicators
            if (position.row === rowIndex && position.col === colIndex) {
              return (
                <div key={`${rowIndex}-${colIndex}`} className="cell">
                  <img src={agentImg} alt="agent" className="icon" />
                  {room.wumpus && <img src={wumpusImg} alt="wumpus" className="icon" />}
                  {room.treasure && <img src={treasureImg} alt="treasure" className="icon" />}
                  {room.pit && <img src={pitImg} alt="pit" className="icon" />}
                  {room.breeze && <img src={breezeImg} alt="breeze" className="icon" />}
                  {room.stench && <img src={stenchImg} alt="stench" className="icon" />}
                </div>
              );
            }
            return <div key={`${rowIndex}-${colIndex}`} className="cell" />;
          })
        )}
      </div>
      <div className="message">{message}</div>
      {gameOver && (
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      )}
    </div>
  );
}

export default App;
