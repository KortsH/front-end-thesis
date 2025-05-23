import { useState } from "react";
import { useTranslations } from "../contexts/TranslationContext.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import SliderButton from "../components/SliderButton.tsx";
import HashedQuotes from "../components/HashedQuotes.tsx";
import MerkleQuotes from "../components/MerkleQuotes.tsx";
import type { Quote } from "../types/Quote.ts";

export default function Quotes() {
  const t = useTranslations("quotes");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [chain, setChain] = useState<"hashed" | "merkle">("hashed");

  // Derive filtered list locally for UI purposes
  const authors = Array.from(new Set(quotes.map((q) => q.poster)));
  const filtered = quotes.filter(
    (q) =>
      q.content.toLowerCase().includes(search.toLowerCase()) &&
      (!filterAuthor || q.poster === filterAuthor)
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      <div className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-8 text-center">
            {t("quotes_title")}
          </h1>

          <SliderButton
            options={["hashed", "merkle"]}
            value={chain}
            onChange={setChain}
            className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            capitalize={false}
          />

          <p className="mb-2 text-center text-gray-500 dark:text-gray-400 mt-4">
            Showing the blockchain database: ✔ means verified, ✖ means not. Hover over the commitment hash to inspect its data.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">{t("filter_all")}</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {chain === "hashed" && (
            <HashedQuotes
              search={search}
              filterAuthor={filterAuthor}
              setQuotes={setQuotes}
              quotes={filtered}
            />
          )}
          {chain === "merkle" && (
            <MerkleQuotes
              search={search}
              filterAuthor={filterAuthor}
              setQuotes={setQuotes}
              quotes={filtered}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
