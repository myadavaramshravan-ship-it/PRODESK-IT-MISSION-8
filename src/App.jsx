import AppRoutes from "./routes/AppRoutes";
import FavoritesProvider from "./context/FavoritesContext";
import Header from "./components/Header";

export default function App() {
  return (
    <FavoritesProvider>
      <div className="app-shell">
        <Header />
        <main className="main-content">
          <AppRoutes />
        </main>
      </div>
    </FavoritesProvider>
  );
}