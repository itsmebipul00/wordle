import classNames from "classnames";

type PropTypes = {
  key?: React.Key | null;
  shake: boolean;
  currentRowToSet: React.MutableRefObject<number>;
  rowIndex: number;
  word: {
    value: string;
    color: string;
  }[];
  words: {
    value: string;
    color: string;
  }[][];
};

export const WordleGrid = ({
  key,
  shake,
  currentRowToSet,
  rowIndex,
  word,
  words,
}: PropTypes) => {
  return (
    <div
      key={rowIndex}
      className={classNames("grid grid-cols-5 m-2 gap-2	md:m-4 md:gap-4", {
        "horizontal-shake": shake && currentRowToSet.current === rowIndex,
      })}
    >
      {word.map((_, colIndex) => (
        //key could be uuid here for performace benifit
        <div
          key={`${rowIndex}${colIndex}`}
          className={classNames(
            `border dark:border-slate-400 dark:text-slate-400 w-12 h-12 md:w-16 md:h-16 flex justify-center items-center text-xl`,
            {
              "border-2 border-solid border-gray":
                words[rowIndex][colIndex].value,
              "border border-solid border-black":
                !words[rowIndex][colIndex].value,
            }
          )}
          style={{ backgroundColor: words[rowIndex][colIndex].color }}
        >
          {words[rowIndex][colIndex].value}
        </div>
      ))}
    </div>
  );
};
