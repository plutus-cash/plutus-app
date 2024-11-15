import { headers } from "next/headers";

const SUBGRAPH_URL = "YOUR_SUBGRAPH_URL";

export async function querySubgraph<T>(query: string): Promise<T> {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables");
  }

  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Add cache control headers
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  const data = await res.json();
  return data.data;
}
