import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../App';

const GamePage = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [selected, setSelected] = useState("");
  const { socketRef } = useContext(DataContext)
  const [opponentMove, setOpponentMove] = useState("")
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    if (timeLeft > 0 && winner === null) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

      return () => clearTimeout(timerId);
    } else {
      determineWinner()
    }
  }, [timeLeft]);

  useEffect(() => {
    socketRef.current.onmessage = (e) => {

        const data = JSON.parse(e.data);

        console.log(data)
        if (data.type === 'forward_move') {
          setOpponentMove(data.move)
        }
    };
  }, []);

  const handleChoice = (choice) => {
    setSelected(choice);

    try {
      socketRef.current.send(JSON.stringify({move: choice}));
    } catch (error) {
      console.error("Failed to send choice:", error);
  }
  };


  const determineWinner = () => {
    if (!opponentMove && !selected) {
      setWinner("tie")
    } else if (!opponentMove) {
      setWinner("won")
    } else if (!selected) {
      setWinner("lost")
    } else {
      if (selected === opponentMove) {
        setWinner("tie")
      } else if (
        (selected === 'rock' && opponentMove === 'scissors') ||
        (selected === 'scissors' && opponentMove === 'paper') ||
        (selected === 'paper' && opponentMove === 'rock')
      ) {
        setWinner("won")
      } else {
        setWinner("lost")
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        {winner === null && timeLeft > 0 && (
          <>
            <p className="text-2xl text-indigo-600 font-bold mb-4">Choose in {timeLeft} seconds</p>
            <div className="flex space-x-4">
              <button disabled={selected} onClick={() => handleChoice('rock')} className={`font-bold py-2 px-4 rounded-full transition duration-300 
            ${selected ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                Rock
              </button>
              <button disabled={selected} onClick={() => handleChoice('paper')} className={`font-bold py-2 px-4 rounded-full transition duration-300 
            ${selected ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                Paper
              </button>
              <button disabled={selected} onClick={() => handleChoice('scissors')} className={`font-bold py-2 px-4 rounded-full transition duration-300 
            ${selected ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                Scissors
              </button>
            </div>
          </>
        )}

        {winner === "won" && <p className="text-2xl text-green-600 font-bold mb-4">You won!</p>}
        {winner === "lost" && <p className="text-2xl text-red-600 font-bold mb-4">You lost!</p>}
        {winner === "tie" && <p className="text-2xl text-yellow-600 font-bold mb-4">It's a tie!</p>}
      </div>
    </div>
  );
};

export default GamePage;
