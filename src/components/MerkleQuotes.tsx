import React, { useEffect, useState } from "react";
import { useTranslations }   from "../contexts/TranslationContext.tsx";
import { motion, AnimatePresence } from "framer-motion";
import type { Quote } from "../types/Quote.ts";
import SHA256 from "crypto-js/sha256";
import HexEnc from "crypto-js/enc-hex";

const QUOTES_BASE = "http://localhost:4001";
const CHAIN_BASE  = "http://localhost:4002";

class MerkleTree {
  leaves: string[];
  layers: string[][];

  constructor(commitments: string[]) {
    this.leaves = commitments.map(c => SHA256(c).toString(HexEnc));
    this.layers = [this.leaves];
    this.buildTree();
  }

  private static hashPair(left: string, right: string): string {
    return SHA256(left + right).toString(HexEnc);
  }

  private buildTree() {
    let current = this.leaves;
    while (current.length > 1) {
      const next: string[] = [];
      for (let i = 0; i < current.length; i += 2) {
        const left  = current[i];
        const right = i + 1 < current.length ? current[i + 1] : left;
        next.push(MerkleTree.hashPair(left, right));
      }
      this.layers.push(next);
      current = next;
    }
  }

  get root(): string | null {
    const top = this.layers[this.layers.length - 1];
    return top.length === 0 ? null : top[0];
  }

  getProof(leafIndex: number): { position: "left" | "right"; hash: string }[] {
    const proof: { position: "left" | "right"; hash: string }[] = [];
    let idx = leafIndex;
    for (let level = 0; level < this.layers.length - 1; level++) {
      const layer = this.layers[level];
      const isRight = idx % 2 === 1;
      const pairIdx = isRight ? idx - 1 : idx + 1;
      const siblingHash = layer[pairIdx] ?? layer[idx];
      proof.push({ position: isRight ? "left" : "right", hash: siblingHash });
      idx = Math.floor(idx / 2);
    }
    return proof;
  }
}

export default function MerkleQuotes({ search, filterAuthor }: { search: string; filterAuthor: string }) {
  const t = useTranslations("quotes");
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<(Quote & { proof?: any; commitment?: string })[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [rows, chain] = await Promise.all([
          fetch(`${QUOTES_BASE}/quotes?${new URLSearchParams({ search, author: filterAuthor })}`).then(r => r.json()),
          fetch(`${CHAIN_BASE}/chain`).then(r => r.json()),
        ]);

        const enriched = rows.map((row: Quote) => {
          const fullData = {
            platform:  row.platform,
            poster:    row.poster,
            post_id:   row.post_id,
            content:   row.content,
            post_time: row.post_time,
            tweet_url: row.tweet_url,
          };
          const commitment = SHA256(JSON.stringify(fullData)).toString(HexEnc);

          const postId = String(row.post_id);
          const block = chain.find((b: any) => b.records.some((r: any) => String(r.recordId) === postId));
          if (!block) return { ...row, commitment };

          const commitments = block.records.map((r: any) => String(r.commitment));
          const tree = new MerkleTree(commitments);
          const leafIndex = commitments.findIndex(c => c === commitment);

          if (leafIndex < 0) return { ...row, commitment, proof: { validRoot: false, validHeader: false } };
          const proofPath    = tree.getProof(leafIndex);
          const computedRoot = tree.root;
          const validRoot    = computedRoot === block.merkleRoot;

          const header = {
            index:        block.index,
            timestamp:    block.timestamp,
            merkleRoot:   block.merkleRoot,
            previousHash: block.previousHash,
            nonce:        block.nonce,
          };
          const headerHash  = SHA256(JSON.stringify(header)).toString(HexEnc);
          const validHeader = headerHash === block.hash;

          return {
            ...row,
            commitment,
            proof: {
              blockIndex:  block.index,
              leafIndex,
              merkleRoot:  block.merkleRoot,
              computedRoot,
              validRoot,
              headerHash,
              validHeader,
              proofPath,
            }
          };
        });

        setQuotes(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, filterAuthor]);

  const filtered = quotes.filter(q =>
    q.content?.toLowerCase().includes(search.toLowerCase()) &&
    (!filterAuthor || q.poster === filterAuthor)
  );

  if (loading) return <p className="text-center">{t("loading")}</p>;
  if (!filtered.length) return <p className="text-center text-gray-500 dark:text-gray-400">{t("no_results")}</p>;

  return (
    <AnimatePresence>
      {filtered.map((q) => {
        const ok = q.proof?.validRoot && q.proof?.validHeader;
        return (
          <motion.div
            key={q.post_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transform hover:scale-[1.02] transition"
          >
            <p className="text-lg mb-2">“{q.content}”</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">— {q.poster}</p>

            <div className="flex items-center space-x-2 text-xs font-mono break-all">
              {ok ? <span className="text-green-500">✔</span> : <span className="text-red-500">✖</span>}
              <span>{ok ? `Block #${q.proof.blockIndex}` : t("not_on_chain")}</span>

              <div id="quote" className="block">
                <span className="block-index">
                  {t("commitment_hash")}{" "}{q.commitment}
                </span>
                <pre id="quote-dropdown" className="block-reveal">
                  {JSON.stringify({ recordId: q.post_id, commitment: q.commitment, ...q.proof }, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
