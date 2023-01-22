import { BackSpaceIcon } from "../icones";
import classNames from "classnames";

type PropTypes = {
  handleLetterTap: (letter: string) => void;
  letter: string;
};

export const KeyBoardRow = ({ handleLetterTap, letter }: PropTypes) => {
  return (
    <span
      className={classNames(
        "bg-black border dark:border-slate-400  text-white w-8 h-10 md:w-12 md:h-16 text-xs md:text-base flex flex-col items-center justify-center rounded cursor-pointer",
        {
          "w-14 md:w-20": letter === "ENTER" || letter === "Backspace",
        }
      )}
      onClick={() => handleLetterTap(letter)}
    >
      {letter === "Backspace" ? <BackSpaceIcon /> : letter}
    </span>
  );
};
