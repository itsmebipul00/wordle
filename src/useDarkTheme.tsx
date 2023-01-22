import { useState, useEffect } from "react";

type ThemeType = "light" | "dark";

export const useDarkSide = (): [ThemeType, React.Dispatch<ThemeType>] => {
  const [theme, setTheme] = useState(localStorage.theme);
  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, colorTheme]);

  return [colorTheme, setTheme];
};
