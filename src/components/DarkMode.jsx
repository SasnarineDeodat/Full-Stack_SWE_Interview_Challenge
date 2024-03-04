import React, { useLayoutEffect, useState } from "react";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";

export default function DarkMode() {

  const [theme, setTheme] = useState(localStorage.getItem("selectedTheme") || "dark");
  
  useLayoutEffect(() => {
    if(theme === "light"){
        document.querySelector("body").className = "light";
        localStorage.setItem("selectedTheme", "light");
    } else {
        document.querySelector("body").className = "dark";
        localStorage.setItem("selectedTheme", "dark");
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div>
        <img className="hidden dark:block cursor-pointer ml-5" src={sun} alt="Light Mode" onClick={toggleTheme} width={30} height={30} />
        <img className="block dark:hidden cursor-pointer ml-5" src={moon} alt="Dark Mode" onClick={toggleTheme} width={30} height={30} />
    </div>
  );
}
