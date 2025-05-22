import quotes from "../assets/obamaquote.json";
import { useTranslations } from "../contexts/TranslationContext.tsx";

const ObamaQuoteDemo = () => {
  const t = useTranslations("demo");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {t("section_obama_title")}
      </h2>
      <p className="text-center mb-3">
        {t("section_obama_description")}
      </p>
      <div className="space-y-4">
        {quotes.map((quote, index) => (
          <div key={index} className="p-4 border rounded-xl shadow">
            <p>{quote.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObamaQuoteDemo;
