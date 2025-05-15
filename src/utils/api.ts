const API = process.env.REACT_APP_API_BASE_URL as string;

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
