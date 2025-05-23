import { useEffect, useState } from "react";
import { getChain, getHashedChain, getMerkleChain, getMerklePending } from "../utils/api.ts";
import Header from "../components/Header.tsx";
import { BlockItem } from "../components/BlockItem.tsx";
import { useTranslations } from "../contexts/TranslationContext.tsx";
import Footer from "../components/Footer.tsx";
import SliderButton from "../components/SliderButton.tsx";

interface Block {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
}

interface PendingBlock {
  recordId: string;
  commitment: string;
}

export default function Blockchain() {
  const [chainType, setChainType] = useState("merkle");
  const [chain, setChain] = useState<Block[]>([]);
  const [pending, setPending] = useState<PendingBlock[]>([]);
  const t = useTranslations("blockchain");

  useEffect(() => {
    if (chainType === "raw") {
      setChain([]);
      getChain().then(setChain).catch(console.error);
      return;
    }

    if (chainType === "hashed") {
      setChain([]);
      getHashedChain().then(setChain).catch(console.error);
      return;
    }

    if (chainType === "merkle") {
      setChain([]);
      getMerkleChain().then(setChain).catch(console.error);
      setPending([]);
      getMerklePending().then(setPending).catch(console.error);
      return;
    }

  }, [chainType]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
  
      <section className="py-8 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">{t("title")}</h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          {t("description")}
        </p>
        <p className="mt-2 text-sm italic text-gray-500 dark:text-gray-400">
          {t("connected")}
        </p>
        <SliderButton
          options={["raw", "hashed", "merkle"]}
          value={chainType}
          onChange={setChainType}
          capitalize={false}
          className="mt-4 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 inline-flex justify-center"
        />
      </section>
  
      <div className="blockchain-container flex-grow mx-20 mb-10 rounded">
        {chain.map((block) => (
          <BlockItem key={block.index} block={block} />
        ))}
      </div>
  
      <h1 className="text-4xl font-extrabold mb-4 text-center">
        {t("pending")}
      </h1> 
      <div className="blockchain-container flex-grow mx-20 mb-10 rounded">
          {pending.map((block) => (
            <BlockItem key={block.recordId} block={block} />
          ))}
      </div>


      <Footer />
    </div>
  );
} 