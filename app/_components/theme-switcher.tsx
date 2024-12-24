"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = isChecked ? "light" : "dark";
    setTheme(newTheme);
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex-none">
      <label className="swap swap-rotate">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
        <svg
          className="swap-on fill-current w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64 4.22l1.42 1.42a1 1 0 010 1.42L4.22 6.36a1 1 0 01-1.42-1.42l1.42-1.42a1 1 0 011.42 0zm12.02 0a1 1 0 011.42 0l1.42 1.42a1 1 0 01-1.42 1.42l-1.42-1.42a1 1 0 010-1.42zM12 6a1 1 0 011 1v3a1 1 0 01-2 0V7a1 1 0 011-1zm8 5a1 1 0 010 2h-3a1 1 0 110-2h3zM6 11a1 1 0 010 2H3a1 1 0 010-2h3zm13.36 7.64a1 1 0 01-1.42 0l-1.42-1.42a1 1 0 011.42-1.42l1.42 1.42a1 1 0 010 1.42zM6.36 19.36a1 1 0 010-1.42l1.42-1.42a1 1 0 111.42 1.42l-1.42 1.42a1 1 0 01-1.42 0zM12 17a1 1 0 011 1v3a1 1 0 01-2 0v-3a1 1 0 011-1zm0-14a10 10 0 110 20 10 10 0 010-20z" />
        </svg>
        <svg
          className="swap-off fill-current w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a10 10 0 103.8 19.38 1 1 0 00-.75-1.85A8 8 0 1112 4a1 1 0 000-2z" />
        </svg>
      </label>
    </div>
  );
}
