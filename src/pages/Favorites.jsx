import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="page-container">
      <header className="section-heading">
        <div>
          <h1>My Favorites</h1>
          <p className="badge">{favorites.length} movies saved</p>
        </div>
      </header>

      {favorites.length > 0 ? (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Your favorites list is empty. Search for a movie and add it to your watchlist.
        </div>
      )}
    </div>
  );
}
