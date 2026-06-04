export default function SearchBar({ query, setQuery, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-block" role="search">
      <input
        aria-label="Search movies"
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies, series, or genres..."
      />
      <button type="submit" className="btn-primary">Search</button>
    </form>
  );
}
