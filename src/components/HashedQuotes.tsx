import { useEffect, useState } from "react";
import { useTranslations } from "../contexts/TranslationContext.tsx";
import { motion, AnimatePresence } from "framer-motion";
import type { Quote } from "../types/Quote.ts";
import SHA256 from "crypto-js/sha256";
import HexEnc from "crypto-js/enc-hex";

const API_BASE = "http://localhost:4001";

async function fetchQuotes(search = "", author = ""): Promise<Quote[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (author) params.set("author", author);
  const res = await fetch(`${API_BASE}/quotes?${params}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

async function fetchChain() {
  const res = await fetch(`${API_BASE}/chain`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

interface HashedQuotesProps {
  search: string;
  filterAuthor: string;
  setQuotes: (quotes: Quote[]) => void;
  quotes: Quote[];
}

export default function HashedQuotes({
  search,
  filterAuthor,
  setQuotes,
  quotes,
}: HashedQuotesProps) {
  const t = useTranslations("quotes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchQuotes(search, filterAuthor), fetchChain()])
      .then(([rows, chain]) => {
        const enriched: Quote[] = rows.map((row) => {
          const fullData = {
            platform: row.platform,
            poster: row.poster,
            post_id: row.post_id,
            content: row.content,
            post_time: row.post_time,
            tweet_url: row.tweet_url,
          };
          const commitment = SHA256(JSON.stringify(fullData)).toString(
            HexEnc
          );

          const proofBlock = chain.find(
            (b: any) =>
              b.data.recordId === row.id && b.data.commitment === commitment
          );

          return {
            ...row,
            commitment,
            proof: proofBlock
              ? {
                  index: Number(proofBlock.index),
                  timestamp: Number(proofBlock.timestamp),
                  hash: String(proofBlock.hash),
                  previousHash: String(proofBlock.previousHash),
                  nonce: Number(proofBlock.nonce),
                }
              : undefined,
          };
        });
        setQuotes(enriched);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, filterAuthor, setQuotes]);

  const filtered = quotes.filter(
    (q) =>
      q.content.toLowerCase().includes(search.toLowerCase()) &&
      (!filterAuthor || q.poster === filterAuthor)
  );

  return (
    <div>
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
                exit={{ opacity: 0, y: -20 }}
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
                    {isOnChain ? `Block #${q.proof!.index}` : "Not on chain"}
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
                            blockIndex: q.proof.index,
                            blockHash: q.proof.hash,
                            previousHash: q.proof.previousHash,
                            nonce: q.proof.nonce,
                            timestamp: new Date(
                              q.proof.timestamp
                            ).toISOString(),
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
  );
}
