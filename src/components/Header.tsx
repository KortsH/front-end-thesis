import { Link } from "react-router-dom";
import {
  useSetLanguage,
  useCurrentLanguage,
  useTranslations,
} from "../contexts/TranslationContext.tsx";
import { useTheme } from "../contexts/ThemeContext.tsx";

export default function Header() {
  const setLang = useSetLanguage();
  const lang = useCurrentLanguage();
  const t = useTranslations("header");
  const { theme, setTheme } = useTheme();

  const langs = ["en", "nl", "ee"];
  const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];

  return (
    <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
      <Link to="/" className="text-xl font-bold dark:text-white hover:opacity-80">
        {t("title")}
      </Link>
      <div className="flex items-center gap-6">

        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-sm font-medium transition ${
                lang === l
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 text-sm font-medium capitalize transition ${
                theme === t
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
