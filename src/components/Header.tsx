import { Link } from "react-router-dom";
import {
  useSetLanguage,
  useCurrentLanguage,
  useTranslations,
} from "../contexts/TranslationContext.tsx";
import { useTheme } from "../contexts/ThemeContext.tsx";
import SliderButton from "./SliderButton.tsx";

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
    </header>
  );
}
