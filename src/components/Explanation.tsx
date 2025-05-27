import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "../contexts/TranslationContext.tsx";
import Section from "./Section.tsx";

const Explanation: React.FC = () => {
  const t = useTranslations("explanation");

  const sections = [
    {
      title: t("why_title"),
      content: <p>{t("why_content")}</p>,
    },
    {
      title: t("what_title"),
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("what_1")}</li>
          <li>{t("what_2")}</li>
          <li>{t("what_3")}</li>
        </ul>
      ),
    },
    {
      title: t("how_title"),
      content: (
        <>
          <p className="mb-3">{t("how_1")}</p>
          <p>{t("how_2")}</p>
        </>
      ),
    },
    {
      title: t("tech_title"),
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("tech_1")}</li>
          <li>{t("tech_2")}</li>
          <li>{t("tech_3")}</li>
          <li>{t("tech_4")}</li>
          <li>{t("tech_5")}</li>
        </ul>
      ),
    },
    {
      title: t("prototype_title"),
      content: <p>{t("prototype_content")}</p>,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto px-6 py-2 text-base"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mb-10 text-gray-800 dark:text-gray-300 text-center">
        {t("intro")}
      </p>
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <Section key={idx} title={section.title} content={section.content} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <p className="italic text-sm text-gray-500 dark:text-gray-400 select-none">
          {t("quote")}
        </p>
      </div>
    </motion.section>
  );
};

export default Explanation;
