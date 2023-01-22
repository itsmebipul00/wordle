import { DarkThemeIcon, LightThemeIcon } from "../icones";

type PropTypes = {
  toggleDarkMode: () => void;
  darkSide: boolean;
};

export const DarkMode = ({ toggleDarkMode, darkSide }: PropTypes) => {
  return (
    <div
      onClick={toggleDarkMode}
      className="dark:text-white text-black self-end mt-5 mr-5 cursor-pointer"
    >
      {darkSide ? (
        <DarkThemeIcon className="w-6 h-6 md:w-10 md:h-10" />
      ) : (
        <LightThemeIcon className="w-6 h-6 md:w-10 md:h-10" />
      )}
    </div>
  );
};
