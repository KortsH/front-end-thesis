import type { Quote } from '../types/quote.ts';
import sha256 from "crypto-js/sha256";
import hexEnc  from "crypto-js/enc-hex";

const API = process.env.REACT_APP_API_BASE_URL as string;
const DATABASE_API = process.env.REACT_APP_API_DATABASE_URL as string;
const HASHED_API = process.env.REACT_APP_API_HASHED_URL as string;
const MERKLE_API = process.env.REACT_APP_API_MERKLE_URL as string;

export async function getMerkleChain() {
  const res = await fetch(`${MERKLE_API}/chain`);
  if (!res.ok) {
    throw new Error("Network error: " + res.statusText);
  }
  const data = await res.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.chain)) return data.chain;
  return [];
}

export async function getMerklePending() {
  const res = await fetch(`${MERKLE_API}/pending`);
  if (!res.ok) {
    throw new Error("Network error: " + res.statusText);
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.pending)) return data.pending;
  return [];
}

export async function getHashedChain() {
  const res = await fetch(`${HASHED_API}/chain`);
  if (!res.ok) {
    throw new Error("Network error: " + res.statusText);
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.chain)) return data.chain;
  return [];
}

export async function getHashedQuotes(
  search?: string,
  author?: string
): Promise<Quote[]> {
  const [quotes, chain] = await Promise.all([
    fetch("/api/quotes").then(r => r.json()),
    fetch("/api/chain" ).then(r => r.json()),
  ]);
  
  // 2) for each quote compute commitment & find proof
  const enriched = quotes.map((q: Quote) => {
    const fullData   = {
      platform:   q.platform,
      poster:     q.poster,
      post_id:    q.post_id,
      content:    q.content,
      post_time:  q.post_time,
      tweet_url:  q.tweet_url,
    };
    const commitment = sha256(JSON.stringify(fullData)).toString(hexEnc);
    const proofBlock = chain.find(
      (b: any) => b.data.recordId === q.id && b.data.commitment === commitment
    );
  
  return {
      ...q,
      commitment,
      proof: proofBlock || null,
      isOnChain: !!proofBlock,
    };
  });
  return enriched;
}

export async function getChain() {
  const res = await fetch(`${API}/chain`);
  if (!res.ok) {
    throw new Error("Network error: " + res.statusText);
  }
  const data = await res.json();
  console.log("getChain → data:", data);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.chain)) return data.chain;
  return [];
}

export async function getQuotes(
  search?: string,
  author?: string
): Promise<Quote[]> {
  const params = new URLSearchParams();
  if (search)  params.append("search", search);
  if (author)  params.append("author", author);

  const url =
    `${DATABASE_API}/api/quotes${params.toString() ? `?${params}` : ""}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Network error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected response shape");
  }
  return data;
}
