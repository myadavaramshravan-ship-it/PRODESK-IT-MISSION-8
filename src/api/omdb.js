const BASE_URL = "https://www.omdbapi.com/";

function getApiKey() {
  const key = import.meta.env.VITE_OMDB_API_KEY;
  if (!key) {
    throw new Error("Missing OMDB API key. Set VITE_OMDB_API_KEY in your .env file.");
  }
  return key;
}

export async function searchMovies(query, page = 1) {
  const apiKey = getApiKey();
  const url = new URL(BASE_URL);
  url.searchParams.set("s", query);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OMDB request failed: ${res.status}`);
  return res.json();
}

export async function getMovieDetails(id) {
  const apiKey = getApiKey();
  const url = new URL(BASE_URL);
  url.searchParams.set("i", id);
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OMDB request failed: ${res.status}`);
  return res.json();
}