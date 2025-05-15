const API = process.env.REACT_APP_API_BASE_URL as string;

export async function getChain() {
  const res = await fetch(`${API}/chain`);
  if (!res.ok) throw new Error('Network error');
  return res.json() as Promise<any[]>;
}
