import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

export default function MovieCard({ movie }) {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  const isFavorite = Array.isArray(favorites) && favorites.some((item) => item.imdbID === movie.imdbID);

  const poster = movie?.Poster && movie.Poster !== "N/A"
    ? movie.Poster
    : "https://via.placeholder.com/220x320?text=No+Image";

  function toggleFavorite() {
    if (isFavorite) removeFavorite(movie.imdbID);
    else addFavorite(movie);
  }

  return (
    <article className="movie-card">
      <div className="movie-card-media">
        <img src={poster} alt={movie.Title} loading="lazy" />

      
        <button
          type="button"
          className={`heart-btn ${isFavorite ? "is-hearted" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M20.8 4.6c-1.8-1.6-4.6-1.6-6.4.1L12 6.9 9.6 4.8C7.8 3.2 5 3.2 3.2 4.8 1.1 6.7 1 9.8 2.9 12.1 6.2 16 12 20 12 20s5.8-4 9.1-7.9c1.9-2.3 1.8-5.4-.2-7.5z" />
            </svg>
          )}
        </button>
      </div>

      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.Title}</h3>
        <div className="movie-card-meta">
          <span>{movie.Year}</span>
          <span>{isFavorite ? "Saved" : "New"}</span>
        </div>
      </div>
    </article>
  );
}
