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

  return (
    <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800">
      <h1 className="text-xl font-bold dark:text-white">{t("title")}</h1>
      <div className="flex items-center gap-4">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="p-1 rounded"
        >
          <option value="en">EN</option>
          <option value="nl">NL</option>
          <option value="ee">EE</option>
        </select>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'system' | 'light' | 'dark')}
          className="p-1 rounded"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </header>
  );
}
