import { useTranslations } from "../contexts/TranslationContext.tsx";

export default function ExtensionInstructions() {
  const t = useTranslations("home");

  return (
    <div className="mt-1 space-y-8">
      <a
        href={`${process.env.PUBLIC_URL}/chrome_extention.zip`}
        download
        className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
      >
        {t("download_extension")}
      </a>

      <div className="max-w-3xl mx-auto text-left bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md space-y-4">
        <h3 className="text-2xl font-bold">{t("install_title")}</h3>
        <p>{t("install_browser_note")}</p>

        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>{t("step_enable_dev_mode")}</li>
          <li>{t("step_go_to_extensions")}</li>
          <li>{t("step_unzip")}</li>
          <li>{t("step_drag_crx")}</li>
          <li>{t("step_confirm_add")}</li>
        </ol>

        <div className="mt-4">
          <strong>{t("note_other_browsers_title")}</strong>
          <p>{t("note_other_browsers_desc")}</p>
        </div>

        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4">
          <p className="text-sm italic text-gray-500 dark:text-gray-400">
            {t("screenshots_coming_soon")}
          </p>
        </div>
      </div>
    </div>
  );
}
