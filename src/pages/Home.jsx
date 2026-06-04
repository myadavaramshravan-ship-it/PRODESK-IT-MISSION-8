import { useEffect, useState, useContext, useCallback, useRef } from "react";
import { searchMovies } from "../api/omdb";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import MoodMatcher from "../components/MoodMatcher";
import { FavoritesContext } from "../context/FavoritesContext";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
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

  const trendingSeen = useRef(new Set());
  const trendingTermOrder = useRef(shuffleArray(TRENDING_TERMS));
  const trendingStartPages = useRef(Array.from({ length: INITIAL_TRENDING_BATCH_SIZE }, getRandomTrendingPage));
  const debouncedQuery = useDebounce(query, 500);

  const { favorites } = useContext(FavoritesContext);

  
  const fetchTrending = useCallback(async (append = false) => {
    try {
      setLoading(true);
      setError(null);

      const { termIndex, page: termPage } = trendingCursor;
      if (termIndex >= trendingTermOrder.current.length) return;

      const isInitialBatch = !append && termIndex === 0;
      if (isInitialBatch) {
        const batchTerms = trendingTermOrder.current.slice(0, INITIAL_TRENDING_BATCH_SIZE);
        const batchResults = [];

        for (let i = 0; i < batchTerms.length; i += 1) {
          const term = batchTerms[i];
          const pageToLoad = trendingStartPages.current[i] || 1;
          const data = await searchMovies(term, pageToLoad);
          if (data.Response === "True") {
            const list = data.Search || [];
            for (const item of list) {
              if (!item.imdbID) continue;
              if (trendingSeen.current.has(item.imdbID)) continue;
              trendingSeen.current.add(item.imdbID);
              batchResults.push(item);
              if (batchResults.length >= MAX_INITIAL_TRENDING_RESULTS) break;
            }
          }
          if (batchResults.length >= MAX_INITIAL_TRENDING_RESULTS) break;
        }

        setMovies(shuffleArray(batchResults).slice(0, MAX_INITIAL_TRENDING_RESULTS));
        setTotalResults(TRENDING_TERMS.length * 10);
        setTrendingCursor({ termIndex: batchTerms.length, page: 1 });
        return;
      }

      const term = trendingTermOrder.current[termIndex];
      const data = await searchMovies(term, termPage);
      if (data.Response === "False") {
        if (!append) setMovies([]);
        setTotalResults(0);
        setTrendingCursor((prev) => ({ termIndex: prev.termIndex + 1, page: 1 }));
        return;
      }

      const list = data.Search || [];
      const uniq = list.filter((item) => {
        if (!item.imdbID) return false;
        if (trendingSeen.current.has(item.imdbID)) return false;
        trendingSeen.current.add(item.imdbID);
        return true;
      });

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
  }, [trendingCursor]);

  
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

  const initialLoaded = useRef(false);

  
  useEffect(() => {
    trendingTermOrder.current = shuffleArray(TRENDING_TERMS);
    trendingStartPages.current = Array.from({ length: INITIAL_TRENDING_BATCH_SIZE }, getRandomTrendingPage);
    trendingSeen.current.clear();

    (async () => {
      setPage(1);
      setCurrentQuery("");
      setTrendingCursor({ termIndex: 0, page: 1 });
      try {
        await fetchMovies("", 1, false);
      } finally {
        initialLoaded.current = true;
      }
    })();
  }, []);

  
  useEffect(() => {
    if (!initialLoaded.current) return;
    setPage(1);
    if (debouncedQuery && debouncedQuery.trim()) {
      const searchTerm = debouncedQuery.trim();
      setCurrentQuery(searchTerm);
      setTrendingCursor({ termIndex: 0, page: 1 });
      trendingSeen.current.clear();
      fetchMovies(searchTerm, 1, false);
    } else {
      setCurrentQuery("");
      setTrendingCursor({ termIndex: 0, page: 1 });
      trendingSeen.current.clear();
      fetchMovies("", 1, false);
    }
  }, [debouncedQuery]);

  const hasMore = currentQuery.trim() ? movies.length < totalResults : trendingCursor.termIndex < TRENDING_TERMS.length;
  const loadMore = () => {
    if (loading || !hasMore) return;
    if (currentQuery.trim()) {
      const next = page + 1;
      setPage(next);
      fetchMovies(currentQuery, next, true);
    } else {
      fetchMovies("", 1, true);
    }
  };

  const sentinelRef = useInfiniteScroll({ onLoadMore: loadMore, loading, hasMore });

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
              trendingSeen.current.clear();
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
            <div ref={sentinelRef} className="sentinel">
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
