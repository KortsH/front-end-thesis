import { useEffect, useState } from "react";
import { getChain } from "../utils/api.ts";
import Header from "../components/Header.tsx";
import { BlockItem } from "../components/BlockItem.tsx";
import { useTranslations } from "../contexts/TranslationContext.tsx";

interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

export default function Blockchain() {
  const [chain, setChain] = useState<Block[]>([]);
  const t = useTranslations("blockchain");

  useEffect(() => {
    getChain().then(setChain).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />

      <section className="py-8 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">{t("title")}</h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          {t("description")}
        </p>
        <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
          {t("connected")}
        </p>
      </section>

      <div className="blockchain-container">
        {chain.map((block) => (
          <BlockItem key={block.index} block={block} />
        ))}
      </div>
    </div>
  );
}
