import { useEffect, useState } from "react";
import { useTranslations }  from "../contexts/TranslationContext.tsx";
import { motion, AnimatePresence } from "framer-motion";
import Header  from "../components/Header.tsx";
import Footer  from "../components/Footer.tsx";

import type { Quote } from "../types/Quote.ts";

import SHA256 from "crypto-js/sha256";
import HexEnc from "crypto-js/enc-hex";

const API_BASE = "http://localhost:4001";
async function fetchQuotes(search = "", author = ""): Promise<Quote[]> {
  const params = new URLSearchParams();
  if (search)  params.set("search", search);
  if (author)  params.set("author", author);
  const res = await fetch(`${API_BASE}/quotes?${params}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
async function fetchChain() {
  const res = await fetch(`${API_BASE}/chain`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export default function Quotes() {
  const t = useTranslations("quotes");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchQuotes(search, filterAuthor),
      fetchChain(),
    ])
      .then(([rows, chain]) => {
        const enriched: Quote[] = rows.map((row) => {
          const fullData = {
            platform:  row.platform,
            poster:    row.poster,
            post_id:   row.post_id,
            content:   row.content,
            post_time: row.post_time,
            tweet_url: row.tweet_url,
          };
          const commitment = SHA256(JSON.stringify(fullData))
            .toString(HexEnc);

          const proofBlock = chain.find(
            (b: any) =>
              b.data.recordId === row.id &&
              b.data.commitment === commitment
          );

          return {
            ...row,
            commitment,
            proof: proofBlock
              ? {
                  index:        Number(proofBlock.index),
                  timestamp:    Number(proofBlock.timestamp),
                  hash:         String(proofBlock.hash),
                  previousHash: String(proofBlock.previousHash),
                  nonce:        Number(proofBlock.nonce),
                }
              : undefined,
          };
        });
        setQuotes(enriched);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, filterAuthor]);

  const authors = Array.from(new Set(quotes.map((q) => q.poster)));
  const filtered = quotes.filter((q) =>
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
          <p className="mb-2 text-center text-gray-500 dark:text-gray-400 mt-4">Showing the hashed blockchain database, ✔ mark means that it is verified, hashes match, ✖ means that they do not. Hover over the commitment hash to see the data that it contains on the blockchain! </p>

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

          {loading ? (
            <p className="text-center">{t("loading")}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t("no_results")}
            </p>
          ) : (
            <AnimatePresence>
              {filtered.map((q) => {
                const isOnChain = !!q.proof;
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit   ={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transform hover:scale-[1.02] transition"
                  >
                    <p className="text-lg mb-2">“{q.content}”</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                      — {q.poster}
                    </p>

                    <div className="flex items-center space-x-2 text-xs font-mono break-all">
                      {isOnChain ? (
                        <span className="text-green-500">✔</span>
                      ) : (
                        <span className="text-red-500">✖</span>
                      )}
                      <span>
                        {isOnChain
                          ? `Block #${q.proof!.index}`
                          : "Not on chain"}
                      </span>

                      <div id="quote" className="block">
                        <span className="block-index">
                        {t("commitment_hash")} {q.commitment}
                        </span>

                        <pre id="quote-dropdown" className="block-reveal">
                          {JSON.stringify(
                            {
                              recordId: q.id,
                              commitment: q.commitment,
                              ...(q.proof && {
                                blockIndex:    q.proof.index,
                                blockHash:     q.proof.hash,
                                previousHash:  q.proof.previousHash,
                                nonce:         q.proof.nonce,
                                timestamp:     new Date(q.proof.timestamp).toISOString(),
                              }),
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
