import { useTranslations } from "../contexts/TranslationContext.tsx";

export default function TwitterLink() {
  const t = useTranslations("demo");

  return (
    <section className="flex-grow px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {t("section_twitter")}
      </h2>
      <p className="text-center mb-3">
        {t("section_twitter_description")}
      </p>
      <div className="flex justify-center">
        <a
          href="https://x.com/henri_testing"
          className="inline-block text-white bg-blue-600 px-6 py-3 rounded-xl shadow transition hover:brightness-90"
        >
          {t("tweet_button")}
        </a>
      </div>
    </section>
  );
}