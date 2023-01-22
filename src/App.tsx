import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDarkSide } from "./useDarkTheme";
import { wordsDictionary } from "./words";
import { DarkMode } from "./Components/DarkMode";
import { GameOver } from "./Components/GameOver";
import { WordleGrid } from "./Components/WordleGrid";
import { KeyBoardRow } from "./Components/KeyBoardRow";

export default function App() {
  const initialState = [...new Array(6)].map(() =>
    [...new Array(5)].map(() => ({ value: "", color: "" }))
  );
  const [words, setWords] = useState(initialState);
  const currentRowToSet = useRef(0);
  const currentColToSet = useRef(0);
  const [shake, setShake] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );
  const targetWord = "ALBUM";
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "Backspace"];

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

  const handleLetterTap = (letter: string) => {
    let e = { keyCode: 0, code: "" };
    if (letter === "ENTER") {
      e.code = "Enter";
    } else if (letter === "Backspace") {
      e.code = letter;
    } else {
      e.keyCode = letter.charCodeAt(0);
    }
    handleKeyDown(e as any);
  };

  const toggleDarkMode = () => {
    setTheme(colorTheme);
    setDarkSide((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 dark:bg-black ">
      <DarkMode toggleDarkMode={toggleDarkMode} darkSide={darkSide} />

      <section>
        {gameOver && <GameOver handleGameOver={handleGameOver} />}
        {words.map((word, rowIndex) => (
          <WordleGrid
            key={rowIndex}
            shake={shake}
            currentRowToSet={currentRowToSet}
            rowIndex={rowIndex}
            word={word}
            words={words}
          />
        ))}
      </section>

      <section className="flex flex-col items-center gap-4 justify-center pb-16">
        <div className="flex gap-1 md:gap-4">
          {row1.map((letter) => (
            <KeyBoardRow handleLetterTap={handleLetterTap} letter={letter} />
          ))}
        </div>
        <div className="flex gap-1 md:gap-4">
          {row2.map((letter) => (
            <KeyBoardRow handleLetterTap={handleLetterTap} letter={letter} />
          ))}
        </div>
        <div className="flex gap-1 md:gap-4">
          {row3.map((letter) => (
            <KeyBoardRow handleLetterTap={handleLetterTap} letter={letter} />
          ))}
        </div>
      </section>
    </div>
  );
}
