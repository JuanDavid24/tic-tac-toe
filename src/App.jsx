import { useState } from "react";
import confetti from "canvas-confetti";

import Square from "./components/Square";
import WinnerModal from "./components/WinnerModal";
import { checkEndGame, checkwinner } from "./logic/board";
import {  saveGameToStorage, resetStorage } from "./storage/storage";
import { TURNS } from "./constants";

export default function App() {
  const [board, setBoard] = useState( () => {
    const boardFromStorage = JSON.parse(window.localStorage.getItem('board'));
    return boardFromStorage ?? Array(9).fill(null)
  });

  const [turn, setTurn] = useState( () => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return JSON.parse(turnFromStorage) ?? TURNS.X
  });
  const [winner, setWinner] = useState(null) // false: empate - null: sin ganador

  // actualizar tablero tras cada jugada
  const updateBoard = (index) => {
    // si la posicion esta ocupada o ya hay un ganador
    if (board[index] || winner) {  
      return
    }
    // actualizo tablero con nueva jugada
    const newBoard = [...board]; //creo un nuevo tablero con los datos del anterior
    newBoard[index] = turn; //modifico nuevo tablero
    setBoard(newBoard); //solo se puede cambiar el estado con setBoard y un nuevo estado -> ESTADOS INMUTABLES

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X; //calcula el turno siguiente
    setTurn(newTurn);

    saveGameToStorage({
      board: newBoard, 
      turn: newTurn
    })

    // chequear si hay ganador
    const newWinner = checkwinner(newBoard, index);

    if (newWinner) { // newWinner es X u O
      setWinner(newWinner);
      shootConfetti();
      return
    }
    else if (checkEndGame(newBoard)) { // tablero lleno
      setWinner(false);
      return
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    resetStorage();
  }

  const shootConfetti = () => {
    confetti({
      spread: 150,
      particleCount: 350,
    })
  }

  return (
    <main className="board">
      <h1>Ta te ti</h1>
      <section className="game">
        {
          board.map((element, index) => {
            return(
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {element}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected = {turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected = {turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <WinnerModal
        winner={winner}
        resetGame={resetGame}>
      </WinnerModal>
      <button onClick={resetGame}>Reiniciar</button>
    </main>
  );
}
