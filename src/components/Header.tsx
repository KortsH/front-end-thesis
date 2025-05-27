import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useSetLanguage,
  useCurrentLanguage,
  useTranslations,
} from "../contexts/TranslationContext.tsx";
import { useTheme } from "../contexts/ThemeContext.tsx";
import SliderButton from "./SliderButton.tsx";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const setLang = useSetLanguage();
  const lang = useCurrentLanguage();
  const t = useTranslations("header");
  const { theme, setTheme } = useTheme();

  const langs = ["en", "nl", "ee"];
  const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];

  const location = useLocation();
  const navItems = [
    { name: t("home"), to: "/" },
    { name: t("demo"), to: "/demo" },
    { name: t("quotes"), to: "/quotes" },
    { name: t("blockchain"), to: "/chain" },
    { name: t("tracked_people"), to: "/tracked-people" },
  ];

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(currentScrollY / docHeight);

      setShowTopBtn(currentScrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-width duration-200"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <header
        className={`fixed top-0 left-0 w-full z-40 transition-transform duration-300 transform ${
scrollProgress === 0 ? "" : isVisible ? "translate-y-0" : "-translate-y-full"
        } bg-white dark:bg-gray-800 shadow backdrop-blur-md bg-opacity-90 dark:bg-opacity-80`}
      >
        <div className="p-4 max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-bold dark:text-white hover:opacity-80 transition-opacity"
            >
              {t("title")}
            </Link>
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`hover:underline transition-all ${
location.pathname === item.to
                      ? "underline text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SliderButton
              options={langs}
              value={lang}
              onChange={setLang}
              className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              capitalize={true}
            />
            <SliderButton
              options={themes}
              value={theme}
              onChange={setTheme}
              className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              capitalize={false}
            />
          </div>
        </div>
      </header>

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
