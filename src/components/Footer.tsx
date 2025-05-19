import { useTranslations } from "../contexts/TranslationContext.tsx";

export default function Footer() {
  const t = useTranslations("footer");
  return(
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4">
      <small className="text-gray-500 dark:text-gray-400">{t("footer_credit")}</small>
    </footer>
  );
}
