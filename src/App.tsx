import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import classNames from "classnames";

// https://www.nytimes.com/games/wordle/index.html

import { wordsDictionary } from "./words";

export default function App() {
  const initialState = [...new Array(6)].map(() =>
    [...new Array(5)].map(() => ({ value: "", color: "" }))
  );

  const [words, setWords] = useState(initialState);
  const currentRowToSet = useRef(0);
  const currentColToSet = useRef(0);
  const [shake, setShake] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const targetWord = "ALBUM";

  const handleKeyDown = (e: KeyboardEvent) => {
    let updatedWords = [...words];

    if (e.keyCode >= 65 && e.keyCode <= 91 && currentColToSet.current !== 5) {
      const keyValue = String.fromCharCode(e.keyCode);
      updatedWords[currentRowToSet.current][currentColToSet.current].value =
        keyValue;

      setWords(updatedWords);
      currentColToSet.current = currentColToSet.current + 1;
    }

    if (e.code === "Backspace") {
      if (currentColToSet.current > 0) {
        currentColToSet.current = currentColToSet.current - 1;
        updatedWords[currentRowToSet.current][currentColToSet.current].value =
          "";
        setWords(updatedWords);
      }
    }

    const currentWord = words[currentRowToSet?.current]
      ?.reduce((acc: string[], val) => [...acc, val?.value], [])
      ?.join("");

    if (currentColToSet.current < 5 && e.code === "Enter") {
      toast("Not enough words");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    if (currentColToSet.current === 5 && e.code === "Enter") {
      if (!wordsDictionary.includes(currentWord)) {
        toast("Not in wordlist");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return;
      }

      if (targetWord === currentWord) {
        toast(`You won!! ${targetWord}`);
        setGameOver(true);
      }

      if (currentRowToSet.current === 5 && targetWord !== currentWord) {
        toast(`You lost!!`);
        setGameOver(true);
      }

      words.forEach((wordRow, rowIndex) =>
        wordRow.forEach((wordCol, colIndex) => {
          if (wordCol.value === "") {
            return;
          }
          if (wordCol.value === targetWord[colIndex]) {
            updatedWords[rowIndex][colIndex].color = "green";
          } else if (
            wordCol.value !== targetWord[colIndex] &&
            targetWord.includes(wordCol.value)
          ) {
            updatedWords[rowIndex][colIndex].color = "yellow";
          } else {
            updatedWords[rowIndex][colIndex].color = "gray";
          }

          setWords(updatedWords);
        })
      );

      currentColToSet.current = 0;
      currentRowToSet.current = currentRowToSet.current + 1;
    }
  };

  useEffect(() => {
    if (!gameOver) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  const handleGameOver = () => {
    setWords(initialState);
    setGameOver(false);
    currentRowToSet.current = 0;
    currentColToSet.current = 0;
  };

  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "Backspace"];

  const BackSpaceIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 md:w-7 md:h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
        />
      </svg>
    );
  };

  const handleLetterTap = (letter: string) => {
    let e = { keyCode: 0, code: "" };
    if (letter === "ENTER") {
      e.code = "Enter";
    } else if (letter === "Backspace") {
      e.code = "Backspace";
    } else {
      e.keyCode = letter.charCodeAt(0);
    }
    handleKeyDown(e as any);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">
      <section>
        {gameOver && (
          <div className="game-over">
            <button className="btn-again" onClick={handleGameOver}>
              Play Again
            </button>
          </div>
        )}

        {words.map((word, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className={classNames(
                "grid grid-cols-5 m-2 gap-2	md:m-4 md:gap-4",
                {
                  "horizontal-shake":
                    shake && currentRowToSet.current === rowIndex,
                }
              )}
            >
              {word.map((_, colIndex) => (
                //key could be uuid here for performace benifit
                <div
                  key={`${rowIndex}${colIndex}`}
                  className="border border-black w-12 h-12 md:w-16 md:h-16 flex justify-center items-center text-xl"
                  style={{
                    backgroundColor: words[rowIndex][colIndex].color,
                    border: words[rowIndex][colIndex].value
                      ? "3px solid gray"
                      : "1px solid black",
                  }}
                >
                  {words[rowIndex][colIndex].value}
                </div>
              ))}
            </div>
          );
        })}
      </section>
      <div className="flex flex-col items-center gap-4 justify-center">
        <div className="flex gap-1 md:gap-4">
          {row1.map((letter) => (
            <span
              className="bg-black text-white w-8 h-10 md:w-12 md:h-16 text-xs md:text-base flex flex-col items-center justify-center rounded cursor-pointer"
              onClick={() => handleLetterTap(letter)}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="flex gap-1 md:gap-4">
          {row2.map((letter) => (
            <span
              className="bg-black text-white w-8 h-10 md:w-12 md:h-16 text-xs md:text-base flex flex-col items-center justify-center rounded cursor-pointer"
              onClick={() => handleLetterTap(letter)}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="flex gap-1 md:gap-4">
          {row3.map((letter) => (
            <span
              className={classNames(
                "bg-black text-white w-8 h-10 md:w-12 md:h-16 text-xs md:text-base flex flex-col items-center justify-center rounded cursor-pointer",
                {
                  "w-14 md:w-20": letter === "ENTER" || letter === "Backspace",
                }
              )}
              onClick={() => handleLetterTap(letter)}
            >
              {letter === "Backspace" ? <BackSpaceIcon /> : letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
