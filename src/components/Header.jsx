import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/">
        <span className="brand">CineStream</span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-btn" to="/favorites">Favorites</Link>
      </nav>
    </header>
  );
}
