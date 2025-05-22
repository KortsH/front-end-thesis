import type { Quote } from '../types/quote.ts';

const API = process.env.REACT_APP_API_BASE_URL as string;
const DATABASE_API = process.env.REACT_APP_API_DATABASE_URL as string;
const HASHED_API = process.env.REACT_APP_API_HASHED_URL as string;

export async function getHashedChain() {
  const res = await fetch(`${HASHED_API}/chain`);
  if (!res.ok) {
    throw new Error("Network error: " + res.statusText);
  }
  const data = await res.json();
  console.log("getHashedChain → data:", data);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.chain)) return data.chain;
  return [];
}

export async function getHashedQuotes(
  search?: string,
  author?: string
): Promise<Quote[]> {
  const params = new URLSearchParams();
  if (search)  params.append("search", search);
  if (author)  params.append("author", author);
  const url =
    `${HASHED_API}/quotes${params.toString() ? `?${params}` : ""}`;
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
