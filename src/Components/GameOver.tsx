type PropTypes = {
  handleGameOver: () => void;
};

export const GameOver = ({ handleGameOver }: PropTypes) => {
  return (
    <div className="fixed min-h-screen min-w-[100vw] top-0 left-0 flex flex-col justify-center items-center z-10 backdrop-brightness-[30%] border border-black gap-8">
      <button
        className="py-4 px-12 text-2xl bg-purple-100 cursor-pointer rounded text-slate-500"
        onClick={handleGameOver}
      >
        Play Again !!
      </button>
    </div>
  );
};
