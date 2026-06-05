import { useEffect, useState, useContext, useCallback } from "react";
import { searchMovies } from "../api/omdb";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import MoodMatcher from "../components/MoodMatcher";
import { FavoritesContext } from "../context/FavoritesContext";
import useDebounce from "../hooks/useDebounce";
const TRENDING_TERMS = [
  "matrix",
  "batman",
  "inception",
  "star wars",
  "spider-man",
  "jurassic",
  "harry potter",
  "lord of the rings",
  "avengers",
  "premalu",
];
const INITIAL_TRENDING_BATCH_SIZE = 3;
const MAX_INITIAL_TRENDING_RESULTS = 18;

function shuffleArray(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomTrendingPage() {
  return Math.floor(Math.random() * 3) + 1;
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");
  const [page, setPage] = useState(1);
  const [trendingCursor, setTrendingCursor] = useState({ termIndex: 0, page: 1 });
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [trendingSeen, setTrendingSeen] = useState(new Set());
  const [trendingTermOrder, setTrendingTermOrder] = useState(shuffleArray(TRENDING_TERMS));
  const [trendingStartPages, setTrendingStartPages] = useState(
    Array.from({ length: INITIAL_TRENDING_BATCH_SIZE }, getRandomTrendingPage)
  );
  const debouncedQuery = useDebounce(query, 500);

  const { favorites } = useContext(FavoritesContext);

  
  const fetchTrending = useCallback(async (append = false) => {
    try {
      setLoading(true);
      setError(null);

      const { termIndex, page: termPage } = trendingCursor;
      if (termIndex >= trendingTermOrder.length) return;

      const isInitialBatch = !append && termIndex === 0;
      if (isInitialBatch) {
        const batchTerms = trendingTermOrder.slice(0, INITIAL_TRENDING_BATCH_SIZE);
        const batchResults = [];
        const seen = new Set(trendingSeen);

        for (let i = 0; i < batchTerms.length; i += 1) {
          const term = batchTerms[i];
          const pageToLoad = trendingStartPages[i] || 1;
          const data = await searchMovies(term, pageToLoad);
          if (data.Response === "True") {
            const list = data.Search || [];
            for (const item of list) {
              if (!item.imdbID) continue;
              if (seen.has(item.imdbID)) continue;
              seen.add(item.imdbID);
              batchResults.push(item);
              if (batchResults.length >= MAX_INITIAL_TRENDING_RESULTS) break;
            }
          }
          if (batchResults.length >= MAX_INITIAL_TRENDING_RESULTS) break;
        }

        setTrendingSeen(seen);
        setMovies(shuffleArray(batchResults).slice(0, MAX_INITIAL_TRENDING_RESULTS));
        setTotalResults(TRENDING_TERMS.length * 10);
        setTrendingCursor({ termIndex: batchTerms.length, page: 1 });
        return;
      }

      const term = trendingTermOrder[termIndex];
      const data = await searchMovies(term, termPage);
      if (data.Response === "False") {
        if (!append) setMovies([]);
        setTotalResults(0);
        setTrendingCursor((prev) => ({ termIndex: prev.termIndex + 1, page: 1 }));
        return;
      }

      const list = data.Search || [];
      const seen = new Set(trendingSeen);
      const uniq = list.filter((item) => {
        if (!item.imdbID) return false;
        if (seen.has(item.imdbID)) return false;
        seen.add(item.imdbID);
        return true;
      });

      setTrendingSeen(seen);
      setMovies((prev) => (append ? [...prev, ...uniq] : uniq));
      setTotalResults(TRENDING_TERMS.length * 10);

      if (termPage < 10 && list.length === 10) {
        setTrendingCursor({ termIndex, page: termPage + 1 });
      } else {
        setTrendingCursor({ termIndex: termIndex + 1, page: 1 });
      }
    } catch (err) {
      setError(err.message);
      if (!append) setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [trendingCursor, trendingSeen, trendingStartPages, trendingTermOrder]);

  
  const fetchMovies = useCallback(async (q, p = 1, append = false) => {
    if (!q || !q.trim()) return fetchTrending(append);

    try {
      setLoading(true);
      setError(null);

      const data = await searchMovies(q, p);
      if (data.Response === "False") {
        if (!append) setMovies([]);
        setTotalResults(0);
        throw new Error(data.Error || "No results");
      }

      const list = data.Search || [];
      setTotalResults(Number(data.totalResults || list.length));
      setMovies((prev) => (append ? [...prev, ...list] : list));
    } catch (err) {
      setError(err.message);
      if (!append) setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [fetchTrending]);

  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    setTrendingTermOrder(shuffleArray(TRENDING_TERMS));
    setTrendingStartPages(Array.from({ length: INITIAL_TRENDING_BATCH_SIZE }, getRandomTrendingPage));
    setTrendingSeen(new Set());

    (async () => {
      setPage(1);
      setCurrentQuery("");
      setTrendingCursor({ termIndex: 0, page: 1 });
      try {
        await fetchMovies("", 1, false);
      } finally {
        setInitialLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!initialLoaded) return;
    setPage(1);
    if (debouncedQuery && debouncedQuery.trim()) {
      const searchTerm = debouncedQuery.trim();
      setCurrentQuery(searchTerm);
      setTrendingCursor({ termIndex: 0, page: 1 });
      setTrendingSeen(new Set());
      fetchMovies(searchTerm, 1, false);
    } else {
      setCurrentQuery("");
      setTrendingCursor({ termIndex: 0, page: 1 });
      setTrendingSeen(new Set());
      fetchMovies("", 1, false);
    }
  }, [debouncedQuery, initialLoaded]);

  const hasMore = currentQuery.trim() ? movies.length < totalResults : trendingCursor.termIndex < TRENDING_TERMS.length;
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    if (currentQuery.trim()) {
      const next = page + 1;
      setPage(next);
      fetchMovies(currentQuery, next, true);
    } else {
      fetchMovies("", 1, true);
    }
  }, [currentQuery, fetchMovies, hasMore, loading, page]);

  useEffect(() => {
    const onScroll = () => {
      if (loading || !hasMore) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loadMore, loading]);

  return (
    <div className="page-container">
      <section className="hero">
        <div>
          <p className="hero-eyebrow">Stream what you Love</p>
          <h1 className="hero-heading">It's our cinestream...!</h1>
          <p className="hero-copy">Search top movies, discover new titles, and save favorites</p>
        </div>

        <div className="controls">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={(q) => {
              const searchTerm = q && q.trim() ? q.trim() : "";
              setCurrentQuery(searchTerm);
              setPage(1);
              setTrendingCursor({ termIndex: 0, page: 1 });
              setTrendingSeen(new Set());
              fetchMovies(searchTerm, 1, false);
            }}
          />
          <MoodMatcher setQuery={setQuery} fetchMovies={(q) => fetchMovies(q, 1, false)} />
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Trending Now</h2>
          <span className="badge">{favorites.length} Favorites</span>
        </div>

        {loading && <p>Loading top picks...</p>}
        {error && <p className="empty-state">{error}</p>}

        {movies.length > 0 ? (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
            <div className="sentinel">
              {loading && <div className="loader" aria-hidden />}
            </div>
          </>
        ) : (
          !loading && (
            <div className="empty-state">Search for a movie title or try a mood match prompt.</div>
          )
        )}
      </section>
    </div>
  );
}
